#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

function parseArgs(argv) {
  const args = { deck: "101" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--deck") {
      const next = argv[index + 1];
      if (!next) throw new Error("--deck requires a presentation id, such as 101 or 102.");
      args.deck = normalizeDeckId(next);
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function normalizeDeckId(value) {
  const deckId = String(value || "101").trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(deckId)) {
    throw new Error(`Invalid deck id: ${deckId}`);
  }
  return deckId;
}

function deckPaths(deckId) {
  const root = path.join(REPO_ROOT, "presentations", normalizeDeckId(deckId));
  return {
    feedbackPath: path.join(root, "narration", "feedback.json"),
    feedbackEventsPath: path.join(root, "narration", "feedback-events.jsonl"),
    regenerationBriefPath: path.join(root, "narration", "regeneration-brief.md"),
  };
}

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
  const args = parseArgs(process.argv.slice(2));
  const paths = deckPaths(args.deck);
  const feedback = JSON.parse(await fs.readFile(paths.feedbackPath, "utf8"));
  await fs.writeFile(paths.regenerationBriefPath, buildRegenerationBrief(feedback), "utf8");
  await fs.appendFile(
    paths.feedbackEventsPath,
    `${JSON.stringify({
      event: "feedback_artifacts_synced",
      updatedAt: new Date().toISOString(),
      feedbackUpdatedAt: feedback.updatedAt,
      slideIds: Object.keys(feedback.slides || {}).sort(),
      slides: feedback.slides || {},
    })}\n`,
    "utf8",
  );
  console.log(`Wrote ${path.relative(REPO_ROOT, paths.regenerationBriefPath)}`);
  console.log(`Appended ${path.relative(REPO_ROOT, paths.feedbackEventsPath)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
