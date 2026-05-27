#!/usr/bin/env node
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const REPO_ENV_PATH = path.join(REPO_ROOT, ".env");
const COMPANION_ENV_PATH = "/Users/chrisdonahue/Code/companion/.env.local";
const TTS_URL = "https://api.x.ai/v1/tts";
const DEFAULT_WORDS_PER_MINUTE = 145;

function parseArgs(argv) {
  const args = {
    all: false,
    dryRun: false,
    force: false,
    slide: null,
    deck: "101",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--all") args.all = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--force") args.force = true;
    else if (arg === "--slide") {
      const next = argv[index + 1];
      if (!next) throw new Error("--slide requires a slide number or id.");
      args.slide = normalizeSlideSelector(next);
      index += 1;
    } else if (arg === "--deck") {
      const next = argv[index + 1];
      if (!next) throw new Error("--deck requires a presentation id, such as 101 or 102.");
      args.deck = normalizeDeckId(next);
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!args.all && !args.slide && !args.dryRun) {
    args.all = true;
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

function deckRoot(deckId) {
  return path.join(REPO_ROOT, "presentations", normalizeDeckId(deckId));
}

function deckPaths(deckId) {
  const root = deckRoot(deckId);
  return {
    root,
    scriptPath: path.join(root, "narration", "script.json"),
    audioDir: path.join(root, "narration", "audio"),
    manifestPath: path.join(root, "narration", "manifest.json"),
  };
}

function printHelp() {
  console.log(`Generate Ara narration audio.

Usage:
  node scripts/generate-ara-narration.mjs --deck 102 --dry-run
  node scripts/generate-ara-narration.mjs --deck 102 --slide 1
  node scripts/generate-ara-narration.mjs --deck 102 --all
  node scripts/generate-ara-narration.mjs --deck 102 --all --force

The script reads XAI_API_KEY from the environment, then falls back to
${REPO_ENV_PATH}, then ${COMPANION_ENV_PATH}. It never prints the key.`);
}

function normalizeSlideSelector(value) {
  const raw = String(value).trim().toLowerCase();
  const numberMatch = raw.match(/^(?:slide-?)?0?(\d{1,2})$/);
  if (!numberMatch) throw new Error(`Invalid slide selector: ${value}`);
  const slideNumber = Number(numberMatch[1]);
  if (slideNumber < 1 || slideNumber > 99) throw new Error(`Invalid slide number: ${value}`);
  return `slide-${String(slideNumber).padStart(2, "0")}`;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function stripSpeechTags(text) {
  return text
    .replace(/\[(?:pause|long-pause|hum-tune|laugh|chuckle|giggle|cry|tsk|tongue-click|lip-smack|breath|inhale|exhale|sigh)\]/gi, " ")
    .replace(/<\/?(?:soft|whisper|loud|build-intensity|decrease-intensity|higher-pitch|lower-pitch|slow|fast|sing-song|singing|laugh-speak|emphasis)>/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text) {
  const stripped = stripSpeechTags(text);
  if (!stripped) return 0;
  return stripped.split(/\s+/).length;
}

function estimateSeconds(text) {
  return Math.round((wordCount(text) / DEFAULT_WORDS_PER_MINUTE) * 60);
}

function audioPathFor(audioDir, slide) {
  return path.join(audioDir, `${slide.slideId}.mp3`);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readEnvApiKey(filePath) {
  let envText = "";
  try {
    envText = await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }

  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^\s*XAI_API_KEY\s*=\s*(.*)\s*$/);
    if (!match) continue;
    let value = match[1].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    return value.trim();
  }

  return "";
}

async function readApiKey() {
  const envKey = process.env.XAI_API_KEY?.trim();
  if (envKey) return envKey;
  return (await readEnvApiKey(REPO_ENV_PATH)) || (await readEnvApiKey(COMPANION_ENV_PATH));
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestTts({ apiKey, slide, attempt = 1 }) {
  const response = await fetch(TTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: slide.ttsText,
      voice_id: "ara",
      language: "en",
      text_normalization: true,
      output_format: {
        codec: "mp3",
        sample_rate: 44100,
        bit_rate: 192000,
      },
    }),
  });

  if (response.ok) {
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 1024) {
      throw new Error(`TTS response for ${slide.slideId} was unexpectedly small (${bytes.length} bytes).`);
    }
    return bytes;
  }

  const retryable = response.status === 429 || response.status === 500 || response.status === 503;
  const body = await response.text();
  const message = `TTS failed for ${slide.slideId}: HTTP ${response.status}${body ? ` - ${body.slice(0, 500)}` : ""}`;

  if (retryable && attempt < 5) {
    const delayMs = 750 * 2 ** (attempt - 1);
    console.warn(`${message}\nRetrying in ${delayMs} ms...`);
    await sleep(delayMs);
    return requestTts({ apiKey, slide, attempt: attempt + 1 });
  }

  throw new Error(message);
}

async function ffprobeDuration(filePath) {
  try {
    const { stdout } = await execFileAsync("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      filePath,
    ]);
    const seconds = Number.parseFloat(stdout.trim());
    return Number.isFinite(seconds) ? seconds : null;
  } catch {
    return null;
  }
}

async function buildManifest(script, paths) {
  const slides = [];
  for (const slide of script.slides) {
    const filePath = audioPathFor(paths.audioDir, slide);
    const hasAudio = await fileExists(filePath);
    const actualDurationSeconds = hasAudio ? await ffprobeDuration(filePath) : null;
    slides.push({
      slideId: slide.slideId,
      slideNumber: slide.slideNumber,
      title: slide.title,
      targetSeconds: slide.targetSeconds,
      estimatedSeconds: estimateSeconds(slide.ttsText),
      actualDurationSeconds: actualDurationSeconds === null ? null : Number(actualDurationSeconds.toFixed(3)),
        imagePath: `previews/${slide.slideId}.png`,
        audioPath: `narration/audio/${slide.slideId}.mp3`,
      captionText: slide.captionText,
      ttsText: slide.ttsText,
    });
  }

  const actualTotalSeconds = slides.reduce((total, slide) => total + (slide.actualDurationSeconds ?? 0), 0);
  return {
    version: script.version,
    title: script.title,
    generatedAt: new Date().toISOString(),
    voice: script.voice,
    timing: {
      ...script.timing,
      targetSlidesSeconds: script.slides.reduce((total, slide) => total + slide.targetSeconds, 0),
      estimatedTotalSeconds: slides.reduce((total, slide) => total + slide.estimatedSeconds, 0),
      actualTotalSeconds: Number(actualTotalSeconds.toFixed(3)),
    },
    slides,
  };
}

function validateScript(script) {
  const errors = [];
  if (!Array.isArray(script.slides) || script.slides.length < 1) {
    errors.push(`Expected at least 1 slide, found ${script.slides?.length ?? 0}.`);
  }

  const seen = new Set();
  for (const slide of script.slides ?? []) {
    if (!slide.slideId || seen.has(slide.slideId)) errors.push(`Duplicate or missing slide id: ${slide.slideId}`);
    seen.add(slide.slideId);
    if (!slide.ttsText || wordCount(slide.ttsText) < 60) errors.push(`${slide.slideId} narration is too short.`);
    if (slide.ttsText.length > 15000) errors.push(`${slide.slideId} exceeds xAI TTS 15,000 character limit.`);
    if (!slide.captionText) errors.push(`${slide.slideId} is missing caption text.`);
  }

  if (errors.length) throw new Error(errors.join("\n"));
}

function printTiming(script, manifest = null) {
  const rows = script.slides.map((slide) => {
    const actual = manifest?.slides.find((item) => item.slideId === slide.slideId)?.actualDurationSeconds;
    return {
      slide: slide.slideId,
      target: slide.targetSeconds,
      estimate: estimateSeconds(slide.ttsText),
      actual: actual ?? "",
      words: wordCount(slide.ttsText),
      chars: slide.ttsText.length,
    };
  });

  console.table(rows);
  const targetTotal = rows.reduce((total, row) => total + row.target, 0);
  const estimateTotal = rows.reduce((total, row) => total + row.estimate, 0);
  const actualTotal = manifest?.timing.actualTotalSeconds ?? null;
  console.log(`Target total: ${formatSeconds(targetTotal)} (${targetTotal}s)`);
  console.log(`Estimated spoken total: ${formatSeconds(estimateTotal)} (${estimateTotal}s at ${DEFAULT_WORDS_PER_MINUTE} wpm)`);
  if (actualTotal !== null) {
    console.log(`Actual audio total: ${formatSeconds(actualTotal)} (${actualTotal.toFixed(3)}s)`);
  }
}

function formatSeconds(value) {
  const total = Math.round(value);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const paths = deckPaths(args.deck);
  const script = await readJson(paths.scriptPath);
  validateScript(script);

  if (args.dryRun) {
    const manifest = await buildManifest(script, paths);
    printTiming(script, manifest);
    return;
  }

  const selectedSlides = args.slide
    ? script.slides.filter((slide) => slide.slideId === args.slide)
    : script.slides;
  if (!selectedSlides.length) throw new Error(`No slide matched ${args.slide}.`);

  const apiKey = await readApiKey();
  if (!apiKey) {
    throw new Error(`XAI_API_KEY is not configured in the environment, ${REPO_ENV_PATH}, or ${COMPANION_ENV_PATH}.`);
  }

  await fs.mkdir(paths.audioDir, { recursive: true });

  for (const slide of selectedSlides) {
    const filePath = audioPathFor(paths.audioDir, slide);
    if (!args.force && (await fileExists(filePath))) {
      console.log(`Skipping ${slide.slideId}; audio already exists. Use --force to regenerate.`);
      continue;
    }

    console.log(`Generating ${slide.slideId}: ${slide.title}`);
    const bytes = await requestTts({ apiKey, slide });
    await fs.writeFile(filePath, bytes);
    const duration = await ffprobeDuration(filePath);
    const durationText = duration === null ? "duration unavailable" : `${duration.toFixed(2)}s`;
    console.log(`Saved ${path.relative(REPO_ROOT, filePath)} (${bytes.length.toLocaleString()} bytes, ${durationText})`);
  }

  const manifest = await buildManifest(script, paths);
  await fs.writeFile(paths.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  printTiming(script, manifest);
  console.log(`Wrote ${path.relative(REPO_ROOT, paths.manifestPath)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
