import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const assetDir = path.join(repoRoot, "assets");
const repoEnvPath = path.join(path.resolve(repoRoot, "../.."), ".env");
const companionEnvPath = "/Users/chrisdonahue/Code/companion/.env.local";

const baseStyle =
  "Sharp editorial 16:9 technical illustration for a live developer workshop. Build the image around one dominant proof object, not a collage: IDE workbench, repo map, command rails, review evidence, or permission boundary. Light warm-gray background, charcoal ink, teal and blue accents, small amber and green highlights, restrained developer-workshop palette, no purple or pink decorative lighting, high contrast, crisp vector-like geometry, realistic developer artifacts, generous negative space, no readable text, no letters, no words, no numbers, no logos, no brand marks, no mascot, no generic glowing robot.";

const prompts = [
  {
    name: "hero-agent-harnesses.png",
    prompt: `${baseStyle} Cover image: a modern code editor workbench sits inside a precise lightweight harness frame. The harness has permission rails, test status lights, diff panels, and review shields attached to concrete repo artifacts. A human engineer is guiding the workflow from the edge of the scene. Make it controlled, useful, and calm, not cyberpunk or scary.`,
  },
  {
    name: "prompt-to-harness.png",
    prompt: `${baseStyle} Strong contrast composition: left side has one small disposable prompt card fading after a single session; right side has a durable repo harness cabinet with four visible blank artifact types: instruction pages, playbook cards, command lanes, and check reports. Show repetition across many future sessions with subtle ghosted session paths.`,
  },
  {
    name: "rules-moves-tools-checks.png",
    prompt: `${baseStyle} Four-part operating model as a precise workshop diagram. Center is an abstract repo workbench, surrounded by four distinct blank zones: rules as instruction sheets, moves as branching playbook paths, tools as command adapters, checks as test/report shields. Use a clean loop with clear attachment points and strong separation between zones.`,
  },
  {
    name: "copilot-instructions-operating-manual.png",
    prompt: `${baseStyle} Repository operating manual image: a blank instruction file is clipped into a repo binder beside a code tree, safe command terminal, generated-file lock, risky-path boundary tape, and done checklist. Make it feel like standing engineering orders that govern every agent session.`,
  },
  {
    name: "blast-radius-boundaries.png",
    prompt: `${baseStyle} Permission model proof object: concentric blast-radius rings around a small repo core. Inner ring shows read-only file inspection, next ring local edits, next ring allowlisted command execution, outer ring ship/release actions behind a visible human approval gate. Make boundaries enabling, precise, and easy to read at thumbnail size.`,
  },
  {
    name: "skills-playbooks.png",
    prompt: `${baseStyle} Reusable skills image: a human engineer selects one procedure module from a small rack of blank playbook cards before the code-generation path begins. Show before-coding, after-coding, and review passes as three clean lanes feeding the same repo workbench. Every card, panel, button, and window must be blank or use only tiny abstract line texture; absolutely no labels, no readable text, no faux words, no UI text.`,
  },
  {
    name: "team-habits.png",
    prompt: `${baseStyle} Team habits as reusable agent procedures: four connected workshop stations around a repo table. Show evidence bundle for bug triage, dry-run sandbox for migration safety, screen-inspection monitor for UI testing, and PR review evidence board. Each station should look concrete and useful, not decorative.`,
  },
  {
    name: "runnable-scripts.png",
    prompt: `${baseStyle} Safe scripts proof object: a command terminal splits into four allowlisted lanes with blank terminal blocks, status dots, test beakers, browser smoke-check screen, and PR evidence packet. The agent follows rails instead of inventing commands. Use abstract lines only inside terminal blocks; no readable command text.`,
  },
  {
    name: "soft-checks.png",
    prompt: `${baseStyle} Soft checks image: quality scanner creates a warning report that flows back into a cleanup loop rather than blocking everything. Include issue markers, caution flags, accessibility hint symbols, type-safety signals, and a clean report stack. Show the difference between a hard gate and a soft report without any text.`,
  },
  {
    name: "post-generation-review.png",
    prompt: `${baseStyle} Post-generation review pipeline: an AI-generated diff moves through four concrete stations: changed tests, soft lint report, diagnostic scan, and evidence packet. A human reviewer waits at the end with the diff open. Make the pipeline left-to-right, crisp, and inspectable at thumbnail size.`,
  },
  {
    name: "harness-learning-loop.png",
    prompt: `${baseStyle} Harness learning loop: show one failed agent session being traced to a cause, then repaired by updating one of four blank artifacts: instruction sheet, command script, focused test, or review checklist. The loop returns into a cleaner next session. Make the feedback loop the dominant shape.`,
  },
  {
    name: "inspectable-work.png",
    prompt: `${baseStyle} Final image: AI-generated work becomes inspectable. Show a bounded work area, visible tool path, passing check reports, review shield, and human engineer calmly reviewing evidence before merge. The composition should feel like a clear engineering operating system, not abstract AI magic.`,
  },
];

function parseArgs(argv) {
  const args = { only: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--only") {
      const next = argv[index + 1];
      if (!next) throw new Error("--only requires an asset filename.");
      args.only = next;
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

async function readEnvKeyFrom(filePath) {
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

async function readXaiApiKey() {
  const envKey = process.env.XAI_API_KEY?.trim();
  if (envKey) return envKey;
  return (await readEnvKeyFrom(repoEnvPath)) || (await readEnvKeyFrom(companionEnvPath));
}

function fallbackSvg(title, accent) {
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#f6f8fb"/>
  <rect x="160" y="140" width="1280" height="620" rx="32" fill="#ffffff" stroke="#d8e0ea" stroke-width="3"/>
  <rect x="240" y="228" width="360" height="420" rx="18" fill="#111827"/>
  <rect x="690" y="228" width="670" height="84" rx="18" fill="#ffffff" stroke="#d8e0ea" stroke-width="3"/>
  <rect x="690" y="354" width="670" height="84" rx="18" fill="#ffffff" stroke="#d8e0ea" stroke-width="3"/>
  <rect x="690" y="480" width="670" height="84" rx="18" fill="#ffffff" stroke="#d8e0ea" stroke-width="3"/>
  <rect x="690" y="606" width="670" height="84" rx="18" fill="#ffffff" stroke="#d8e0ea" stroke-width="3"/>
  <path d="M600 438 C680 438 650 270 690 270" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
  <path d="M600 438 C680 438 650 396 690 396" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round" opacity=".75"/>
  <path d="M600 438 C680 438 650 522 690 522" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round" opacity=".55"/>
  <path d="M600 438 C680 438 650 648 690 648" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round" opacity=".4"/>
  ${Array.from({ length: 12 }, (_, i) => `<rect x="292" y="${280 + i * 28}" width="${180 + (i % 4) * 38}" height="9" rx="4" fill="${i % 3 === 0 ? accent : "#64748b"}" opacity="${i % 3 === 0 ? ".9" : ".55"}"/>`).join("")}
  <text x="800" y="820" text-anchor="middle" font-family="Aptos, Arial" font-size="34" fill="#334155">${title}</text>
</svg>`);
}

async function generateOne(item, index, apiKey) {
  const out = path.join(assetDir, item.name);
  if (!apiKey) {
    await fs.writeFile(out, fallbackSvg(item.name.replace(".png", ""), index % 2 ? "#f59e0b" : "#0e9f9a"));
    return { name: item.name, status: "fallback-no-key" };
  }

  const response = await fetch("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      model: "grok-imagine-image-quality",
      prompt: item.prompt,
      aspect_ratio: "16:9",
      resolution: "1k",
      response_format: "b64_json",
    }),
  });
  const text = await response.text();
  if (!response.ok) {
    await fs.writeFile(out, fallbackSvg(item.name.replace(".png", ""), index % 2 ? "#f59e0b" : "#0e9f9a"));
    return { name: item.name, status: "fallback-http", detail: response.status };
  }
  const data = JSON.parse(text);
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) {
    await fs.writeFile(out, fallbackSvg(item.name.replace(".png", ""), index % 2 ? "#f59e0b" : "#0e9f9a"));
    return { name: item.name, status: "fallback-empty" };
  }
  await fs.writeFile(out, Buffer.from(b64, "base64"));
  return { name: item.name, status: "grok" };
}

async function readExistingManifest() {
  try {
    const existing = JSON.parse(await fs.readFile(path.join(assetDir, "asset-manifest.json"), "utf8"));
    return Array.isArray(existing) ? existing : [];
  } catch {
    return [];
  }
}

await fs.mkdir(assetDir, { recursive: true });
const args = parseArgs(process.argv.slice(2));
const selectedPrompts = args.only ? prompts.filter((item) => item.name === args.only) : prompts;
if (args.only && selectedPrompts.length === 0) throw new Error(`No prompt configured for ${args.only}.`);
const apiKey = await readXaiApiKey();
const results = [];
for (let index = 0; index < selectedPrompts.length; index++) {
  const promptIndex = prompts.findIndex((item) => item.name === selectedPrompts[index].name);
  results.push(await generateOne(selectedPrompts[index], promptIndex, apiKey));
}
const manifest = args.only
  ? [
      ...((await readExistingManifest()).filter((item) => !results.some((result) => result.name === item.name))),
      ...results,
    ]
  : results;
await fs.writeFile(path.join(assetDir, "asset-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
