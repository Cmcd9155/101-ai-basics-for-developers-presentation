#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const FEEDBACK_PATH = path.join(REPO_ROOT, "narration", "feedback.json");
const FEEDBACK_EVENTS_PATH = path.join(REPO_ROOT, "narration", "feedback-events.jsonl");
const REGENERATION_BRIEF_PATH = path.join(REPO_ROOT, "narration", "regeneration-brief.md");

function formatSlideLabel(slideId) {
  const number = Number(slideId.replace("slide-", ""));
  return `Slide ${number}`;
}

function buildRegenerationBrief(feedback) {
  const entries = Object.entries(feedback.slides || {}).sort(([left], [right]) => left.localeCompare(right));
  const lines = [
    "# Ara Narration Regeneration Brief",
    "",
    `Updated: ${feedback.updatedAt || "not yet"}`,
    "",
    "Use this file as the durable additional-notes source when regenerating slide scripts or audio.",
    "Preserve already-approved conversational presenter style unless a slide note says otherwise.",
    "",
    "## Active Additional Notes",
    "",
  ];

  if (!entries.length) {
    lines.push("_No active additional notes yet._", "");
  } else {
    for (const [slideId, comment] of entries) {
      lines.push(`### ${formatSlideLabel(slideId)} (${slideId})`, "");
      lines.push(comment.trim(), "");
    }
  }

  lines.push("## Current Global Preferences", "");
  lines.push("- Prefer a real-person presenter feel over polished voiceover.");
  lines.push("- Keep GitHub Copilot as the main AI coding tool framing.");
  lines.push("- Use simple words unless introducing a new concept.");
  lines.push("- Explain fundamentals clearly so AI coding feels immersive, understandable, and fun.");
  lines.push("- Keep each regeneration scoped to the slide being reviewed unless asked otherwise.");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

async function main() {
  const feedback = JSON.parse(await fs.readFile(FEEDBACK_PATH, "utf8"));
  await fs.writeFile(REGENERATION_BRIEF_PATH, buildRegenerationBrief(feedback), "utf8");
  await fs.appendFile(
    FEEDBACK_EVENTS_PATH,
    `${JSON.stringify({
      event: "feedback_artifacts_synced",
      updatedAt: new Date().toISOString(),
      feedbackUpdatedAt: feedback.updatedAt,
      slideIds: Object.keys(feedback.slides || {}).sort(),
      slides: feedback.slides || {},
    })}\n`,
    "utf8",
  );
  console.log(`Wrote ${path.relative(REPO_ROOT, REGENERATION_BRIEF_PATH)}`);
  console.log(`Appended ${path.relative(REPO_ROOT, FEEDBACK_EVENTS_PATH)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
