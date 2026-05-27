#!/usr/bin/env node
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { URL } from "node:url";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const DEFAULT_PORT = 4173;
const execFileAsync = promisify(execFile);

const MIME_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".mp3", "audio/mpeg"],
  [".pdf", "application/pdf"],
]);

function parsePort(argv) {
  const portArgIndex = argv.findIndex((arg) => arg === "--port" || arg === "-p");
  if (portArgIndex === -1) return DEFAULT_PORT;
  const value = Number(argv[portArgIndex + 1]);
  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error("Port must be an integer between 1 and 65535.");
  }
  return value;
}

function safeResolve(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const resolved = path.join(REPO_ROOT, normalized);
  if (!resolved.startsWith(REPO_ROOT)) return null;
  return resolved;
}

function normalizeDeckId(value) {
  const deckId = String(value || "101").trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(deckId)) {
    throw new Error(`Invalid deck id: ${deckId}`);
  }
  return deckId;
}

function deckRoot(deckId) {
  return path.join(REPO_ROOT, "presentations", normalizeDeckId(deckId));
}

function noteArtifactPaths(deckId) {
  const root = deckRoot(deckId);
  const feedbackPath = path.join(root, "narration", "feedback.json");
  const feedbackEventsPath = path.join(root, "narration", "feedback-events.jsonl");
  const regenerationBriefPath = path.join(root, "narration", "regeneration-brief.md");
  return {
    feedbackPath,
    feedbackEventsPath,
    regenerationBriefPath,
    all: [feedbackPath, feedbackEventsPath, regenerationBriefPath],
  };
}

async function respondFile(response, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES.get(extension) || "application/octet-stream";
  const data = await fs.readFile(filePath);
  response.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  response.end(data);
}

function respondJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(`${JSON.stringify(payload, null, 2)}\n`);
}

async function readRequestJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

async function readFeedback(deckId) {
  const { feedbackPath } = noteArtifactPaths(deckId);
  try {
    return JSON.parse(await fs.readFile(feedbackPath, "utf8"));
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return {
        version: 1,
        updatedAt: null,
        slides: {},
      };
    }
    throw error;
  }
}

function normalizeFeedbackPayload(payload) {
  const slides = payload && typeof payload.slides === "object" && payload.slides !== null ? payload.slides : {};
  const normalizedSlides = {};
  for (const [slideId, value] of Object.entries(slides)) {
    if (!/^slide-\d{2}$/.test(slideId)) continue;
    const comment = String(value ?? "").slice(0, 8000);
    if (comment.trim()) {
      normalizedSlides[slideId] = comment;
    }
  }
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    slides: normalizedSlides,
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

async function writeFeedbackArtifacts(deckId, feedback) {
  const { feedbackPath, feedbackEventsPath, regenerationBriefPath } = noteArtifactPaths(deckId);
  await fs.mkdir(path.dirname(feedbackPath), { recursive: true });
  await fs.writeFile(feedbackPath, `${JSON.stringify(feedback, null, 2)}\n`, "utf8");
  await fs.appendFile(
    feedbackEventsPath,
    `${JSON.stringify({
      event: "feedback_saved",
      updatedAt: feedback.updatedAt,
      slideIds: Object.keys(feedback.slides || {}).sort(),
      slides: feedback.slides || {},
    })}\n`,
    "utf8",
  );
  await fs.writeFile(regenerationBriefPath, buildRegenerationBrief(feedback), "utf8");
}

function relativeToRepo(filePath) {
  return path.relative(REPO_ROOT, filePath);
}

async function git(args, options = {}) {
  const result = await execFileAsync("git", args, {
    cwd: REPO_ROOT,
    maxBuffer: 1024 * 1024,
    ...options,
  });
  return result.stdout.trim();
}

async function pushFeedbackArtifacts(deckId, feedback) {
  const relativePaths = noteArtifactPaths(deckId).all.map(relativeToRepo);
  try {
    await git(["add", "--", ...relativePaths]);

    try {
      await git(["diff", "--cached", "--quiet", "--", ...relativePaths]);
      return {
        status: "skipped",
        reason: "No additional notes changes to push.",
      };
    } catch {
      // git diff --quiet exits non-zero when there are staged changes.
    }

    const branch = await git(["branch", "--show-current"]);
    if (!branch) {
      return {
        status: "failed",
        reason: "Could not determine current Git branch.",
      };
    }

    const timestamp = feedback.updatedAt ? feedback.updatedAt.replace(/[:.]/g, "-") : new Date().toISOString().replace(/[:.]/g, "-");
    await git(["commit", "-m", `Update additional notes ${timestamp}`, "--", ...relativePaths]);
    await git(["push", "origin", branch], { timeout: 60_000 });
    return {
      status: "pushed",
      branch,
    };
  } catch (error) {
    return {
      status: "failed",
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

async function handleFeedback(request, response, deckId) {
  if (request.method === "GET") {
    respondJson(response, 200, await readFeedback(deckId));
    return;
  }

  if (request.method === "POST") {
    const feedback = normalizeFeedbackPayload(await readRequestJson(request));
    await writeFeedbackArtifacts(deckId, feedback);
    const githubPush = await pushFeedbackArtifacts(deckId, feedback);
    respondJson(response, 200, {
      ...feedback,
      githubPush,
    });
    return;
  }

  response.writeHead(405, { Allow: "GET, POST" });
  response.end("Method not allowed");
}

async function handler(request, response) {
  try {
    const url = new URL(request.url ?? "/", "http://localhost");
    if (url.pathname === "/api/feedback") {
      await handleFeedback(request, response, url.searchParams.get("deck") || "101");
      return;
    }

    if (url.pathname === "/player" || url.pathname === "/player/") {
      response.writeHead(302, { Location: "/" });
      response.end();
      return;
    }

    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = safeResolve(pathname);

    if (!filePath) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const stat = await fs.stat(filePath).catch(() => null);
    if (!stat) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    if (stat.isDirectory()) {
      await respondFile(response, path.join(filePath, "index.html"));
      return;
    }

    await respondFile(response, filePath);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : "Internal server error");
  }
}

const port = parsePort(process.argv.slice(2));
const server = http.createServer((request, response) => {
  void handler(request, response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`AI basics presentation chooser: http://127.0.0.1:${port}/`);
});
