#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const SKILL_BUILD_SCRIPT =
  "/Users/chrisdonahue/.codex/plugins/cache/openai-primary-runtime/presentations/26.521.10419/skills/presentations/scripts/build_artifact_deck.mjs";
const BUNDLED_PYTHON =
  "/Users/chrisdonahue/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";

const deckConfig = {
  101: {
    slideCount: 16,
    slug: "101-ai-basics-for-developers",
  },
  102: {
    slideCount: 13,
    slug: "102-agent-harnesses",
  },
};

function parseArgs(argv) {
  const args = { deck: "102" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--deck") {
      const next = argv[index + 1];
      if (!next) throw new Error("--deck requires a presentation id.");
      args.deck = next;
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function requireDeckConfig(deckId) {
  const config = deckConfig[deckId];
  if (!config) throw new Error(`No build config for deck ${deckId}.`);
  return config;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    stdio: "inherit",
    ...options,
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with status ${result.status}`);
  }
}

async function exportPreviewPdf(previewDir, pdfPath, slideCount) {
  const script = `
import sys
from pathlib import Path
from PIL import Image
Image.init()

preview_dir = Path(sys.argv[1])
pdf_path = Path(sys.argv[2])
slide_count = int(sys.argv[3])
images = []
for index in range(1, slide_count + 1):
    path = preview_dir / f"slide-{index:02d}.png"
    image = Image.open(path).convert("RGB")
    images.append(image)
pdf_path.parent.mkdir(parents=True, exist_ok=True)
images[0].save(pdf_path, save_all=True, append_images=images[1:])
`;
  const result = spawnSync(BUNDLED_PYTHON, ["-c", script, previewDir, pdfPath, String(slideCount)], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    stdio: "inherit",
  });
  if (result.status !== 0) throw new Error(`PDF export failed with status ${result.status}`);
}

async function main() {
  const { deck } = parseArgs(process.argv.slice(2));
  const config = requireDeckConfig(deck);
  const root = path.join(REPO_ROOT, "presentations", deck);
  const slidesDir = path.join(root, "source", "slides");
  const deckDir = path.join(root, "deck");
  const previewDir = path.join(root, "previews");
  const qaDir = path.join(root, "qa");
  const layoutDir = path.join(root, "layout");
  const pptxPath = path.join(deckDir, `${config.slug}.pptx`);
  const pdfPath = path.join(deckDir, `${config.slug}.pdf`);
  const contactSheetPath = path.join(qaDir, "contact-sheet.png");

  await fs.mkdir(deckDir, { recursive: true });
  await fs.mkdir(qaDir, { recursive: true });

  run(process.execPath, [
    SKILL_BUILD_SCRIPT,
    "--slides-dir",
    slidesDir,
    "--workspace",
    root,
    "--out",
    pptxPath,
    "--preview-dir",
    previewDir,
    "--layout-dir",
    layoutDir,
    "--contact-sheet",
    contactSheetPath,
    "--slide-count",
    String(config.slideCount),
  ], {
    env: {
      ...process.env,
      PYTHON: BUNDLED_PYTHON,
    },
  });

  await exportPreviewPdf(previewDir, pdfPath, config.slideCount);
  console.log(`Wrote ${path.relative(REPO_ROOT, pptxPath)}`);
  console.log(`Wrote ${path.relative(REPO_ROOT, pdfPath)}`);
  console.log(`Wrote ${path.relative(REPO_ROOT, contactSheetPath)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
