import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const assetDir = path.join(repoRoot, "assets");
const repoEnvPath = path.join(repoRoot, ".env");
const companionEnvPath = "/Users/chrisdonahue/Code/companion/.env.local";

const prompts = [
  {
    name: "hero-agent-workbench.png",
    prompt:
      "A premium editorial 16:9 illustration for software engineers: a modern IDE workspace seen from above, code panes, terminal traces, connected nodes, subtle AI assistant presence as abstract light paths, crisp technical diagram aesthetic, white and charcoal palette with teal and amber accents, no text, no logos.",
  },
  {
    name: "repo-map.png",
    prompt:
      "A high-level technical map of a software repository as layered folders, symbols, semantic search index, and context window funnel, clean isometric engineering illustration, crisp lines, no readable text, no brand logos, 16:9 presentation background.",
  },
  {
    name: "llm-context-draft.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop slide about LLM basics. Show many small code and language fragments as abstract blocks flowing into a luminous model core, then a draft answer emerging on the other side. Represent bounded context, tokens, probability, and verification as visual metaphors, not words. Clean professional presentation style, light background, charcoal ink, teal accents, subtle amber highlight, spacious composition, crisp vector-like details, no readable text, no logos, no brand marks.",
  },
  {
    name: "prompt-to-spec.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop slide about turning a vague AI prompt into a precise implementation specification. Left side: chaotic abstract scribbles, loose arrows, question marks as abstract marks only. Center: a clean teal transformation arrow with small gears and nodes. Right side: structured checklist-like cards and file-folder icons representing goal, scope, constraints, starting files, and definition of done. Absolutely no readable text, no letters, no words, no numbers, no percentages, no UI labels, no logos, no brand marks. Modern software engineering aesthetic, light background, charcoal ink, teal and green accents, small amber highlights, crisp vector-like detail, spacious professional presentation composition.",
  },
  {
    name: "repo-context-assembly.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop slide about how an AI coding assistant assembles working context from a software repository. Show a large repository as layered folders, tests, logs, symbols, and code fragments on the left, with only selected high-signal pieces flowing into a compact working-context bundle on the right. Visual metaphor: not the whole repo copied, only a focused backpack or bundle of relevant files and tool results. Represent retrieval, opened files, tool output, prior messages, and context limits visually, not with text. Clean professional software engineering aesthetic, light background, charcoal ink, teal and blue accents, small amber highlights, crisp vector-like details, spacious composition, absolutely no readable text, no letters, no words, no numbers, no logos, no brand marks.",
  },
  {
    name: "context-starter-packet.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop slide about context engineering for AI coding agents. Show a developer assembling a compact starter packet for an AI agent: a small bundle containing a bug ticket, selected code file, failing log, repo rule card, and test checkmark, with a messy repository and loose files in the background deliberately left out. The idea is better context, not more context. Represent the concept visually, not with readable text. Clean professional software engineering aesthetic, light background, charcoal ink, teal and green accents, small amber highlights, crisp vector-like details, spacious composition with room for slide UI on the left, absolutely no readable text, no letters, no words, no numbers, no logos, no brand marks.",
  },
  {
    name: "tool-loop.png",
    prompt:
      "An abstract engineering workflow loop: language model core connected to tools, shell, tests, files, and diff review, elegant technical schematic rendered as modern editorial art, no text, no logos, 16:9.",
  },
  {
    name: "tool-call-reality-loop.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop slide about AI tool calling. Show an AI model request flowing to a host application control center, then out to real developer tools: file search, terminal test run, browser check, and database query, with results flowing back into the model context. Make the host application visibly the thing that executes the tools, not the model. Include a subtle permissions boundary and risk levels as visual metaphors only. Clean professional software engineering aesthetic, light background, charcoal ink, teal and blue accents, small amber highlights, crisp vector-like details, spacious composition with room for slide UI, absolutely no readable text, no letters, no words, no numbers, no logos, no brand marks.",
  },
  {
    name: "retrieval-candidate-map.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop slide about retrieval augmented generation and semantic search in codebases. Show a search beam from a developer question scanning a messy repository map and pulling out a few highlighted candidate files/snippets into a small evidence tray, while many nearby but wrong files remain dim in the background. The concept is retrieval finds candidates, not guaranteed truth. Include visual hints of citations, code files, docs, tests, and version/date ambiguity as abstract icons only. Clean professional software engineering aesthetic, light background, charcoal ink, teal and violet accents, small amber highlights, crisp vector-like details, spacious composition with room for slide UI on the left, absolutely no readable text, no letters, no words, no numbers, no logos, no brand marks.",
  },
  {
    name: "mcp-tool-adapters.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop slide about Model Context Protocol as a standard adapter layer for AI agent tools. Show an agent client on the left connecting through a clean protocol gateway or adapter hub in the center to several external tool servers on the right, such as code hosting, database, calendar, docs, and deployment represented only with abstract icons. The central host should include a visible permission boundary, keys, locks, and audit trail metaphors to show the host controls trust and access. Represent named tools, schemas, resource links, and tool results visually without readable text. Clean professional software-engineering aesthetic, light background, charcoal ink, teal and blue accents, small amber highlights, crisp vector-like details, spacious composition with room for slide UI on the left, absolutely no readable text, no letters, no words, no numbers, no logos, no brand marks.",
  },
  {
    name: "workflow-vs-agent-paths.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop slide comparing workflows and agents. Show two contrasting paths: on the left, a predictable linear assembly-line checklist with fixed steps and repeatable output; on the right, an AI agent exploring a branching investigation map with tools, hypotheses, code files, logs, tests, and decision points. The visual should communicate: use workflows when the path is known, use agents when discovery is part of the job. Clean professional software-engineering aesthetic, light background, charcoal ink, teal and blue accents, small amber highlights, crisp vector-like details, spacious composition with room for slide UI, absolutely no readable text, no letters, no words, no numbers, no logos, no brand marks.",
  },
  {
    name: "ide-agent-mode-dial.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop slide about choosing IDE AI agent modes by blast radius and autonomy. Show a polished software control panel with an autonomy dial moving from low-risk explanation to targeted edit to multi-step agent work to broad planning, represented visually with abstract icons: magnifying glass, pencil over code file, connected tool nodes, map/blueprint, tests, permissions, and review shield. Include a clear risk gradient as shapes and color intensity, but no readable text. Clean professional software-engineering aesthetic, light background, charcoal ink, teal and blue accents, amber warning highlights, crisp vector-like details, spacious composition with room for slide UI on the left, absolutely no readable text, no letters, no words, no numbers, no logos, no brand marks.",
  },
  {
    name: "task-fit-review-packets.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop slide about selecting good tasks for AI coding agents. Show a large vague messy work cloud being broken into several small inspectable task packets on a clean review table. Each packet should visually contain a tiny code file icon, a test/check icon, and a diff/review shield icon, but no readable text. Show the idea that agents do best with bounded work a human can review in one sitting. Clean professional software-engineering aesthetic, light background, charcoal ink, teal and green accents, small amber warning highlights, crisp vector-like details, spacious composition with room for slide UI on the left, absolutely no readable text, no letters, no words, no numbers, no logos, no brand marks.",
  },
  {
    name: "agent-steering-loop.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop slide about steering an AI coding agent session. Show a human engineer at a clean control console watching an AI coding agent work through abstract file panels, terminal blocks, test checks, and diff panels. Include a visible steering loop metaphor represented only with icons, arrows, gauges, approval buttons, caution symbols, and review shields. Make the human clearly in control of approvals and verification. All UI panels must be blank or use tiny abstract lines only. Absolutely no readable text, no alphabet letters, no words, no labels, no numbers, no UI text, no code text, no logos, no brand marks. Clean professional software-engineering aesthetic, light background, charcoal ink, teal and blue accents, amber caution highlights, crisp vector-like details, spacious composition with room for slide UI on the left.",
  },
  {
    name: "agent-failure-debugger.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop slide about debugging AI coding agent failures. Show a confident AI-generated answer or diff passing through a developer review scanner with five visual checks represented only as icons: evidence/source citation, scope boundary, context freshness, tests, and permissions. Include warning markers, review shields, magnifying glass over abstract code panels, and a human engineer inspecting the result. Make the concept clear: confidence is not verification, evidence is. All panels must be blank or use tiny abstract lines only. Absolutely no readable text, no alphabet letters, no words, no labels, no numbers, no UI text, no code text, no logos, no brand marks. Clean professional software-engineering aesthetic, light background, charcoal ink, teal and blue accents, amber and red caution highlights, crisp vector-like details, spacious composition with room for slide UI on the left.",
  },
  {
    name: "repo-operating-manual.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop slide about repo instructions as an operating manual for humans and AI coding agents. Show a clean software repository represented as layered folders, test panels, command console, API boundary, generated-file lock, and small instruction cards being placed into the repo so an agent does not have to guess. Include both a human engineer and an abstract AI assistant following the same guide. Represent durable team conventions, path-specific rules, safe commands, and workflow recipes only with icons and abstract shapes. All panels and cards must be blank or use tiny abstract lines only. Absolutely no readable text, no alphabet letters, no words, no labels, no numbers, no UI text, no code text, no logos, no brand marks. Clean professional software-engineering aesthetic, light background, charcoal ink, teal and blue accents, green check highlights, small amber caution highlights, crisp vector-like details, spacious composition with room for slide UI on the left.",
  },
  {
    name: "agent-session-runbook.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop slide about a practical three-stage checklist for AI coding agent sessions. Show a clean engineering runbook dashboard divided into three visual zones without labels: first zone has a scoped task packet and target, second zone has monitored tool calls and a large pause/interrupt control icon, third zone has diff review, tests, and captured learning. Include a human engineer checking the runbook while an abstract AI agent works in a software workspace. Use icons, arrows, checkboxes, review shields, test tubes, terminal blocks, and diff panels only. All UI panels, headers, buttons, and cards must be blank or use tiny abstract lines only. Do not write stage names. Do not write button labels. Absolutely no readable text, no alphabet letters, no words, no labels, no numbers, no UI text, no code text, no logos, no brand marks. Clean professional software-engineering aesthetic, light background, charcoal ink, teal and blue accents, green check highlights, small amber caution highlights, crisp vector-like details, spacious composition with room for slide UI on the left.",
  },
  {
    name: "agent-ready-task-worksheet.png",
    prompt:
      "Premium editorial 16:9 technical illustration for a developer workshop closing slide about rewriting a vague request into a bounded, testable AI agent task. Show a messy vague request card on the left being transformed through five blank worksheet slots into a crisp task packet with scope boundary, starting file, constraints, tests, and review shield. Include a human engineer and abstract AI assistant collaborating at a clean software workspace. Use icons, arrows, checkboxes, file panels, target, lock, test tube, and diff/review shield only. The five worksheet slots must use only icons, never digits. All UI panels, worksheet slots, cards, and code panes must be blank or use tiny abstract lines only. Absolutely no readable text, no alphabet letters, no words, no labels, no digits, no numerals, no numbers, no UI text, no code text, no logos, no brand marks. Clean professional software-engineering aesthetic, light background, charcoal ink, teal and blue accents, green check highlights, small amber caution highlights, crisp vector-like details, spacious composition with room for slide UI on the left.",
  },
  {
    name: "agent-workshop.png",
    prompt:
      "A practical developer workshop scene: engineers collaborating around a projected code architecture diagram and AI agent workflow, refined editorial illustration, realistic but stylized, bright room, no text, no logos, 16:9.",
  },
];

function parseArgs(argv) {
  const args = {
    only: null,
  };
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
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8fafc"/>
      <stop offset="0.55" stop-color="#eef2f7"/>
      <stop offset="1" stop-color="#dfe7ef"/>
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <g opacity="0.95">
    <rect x="180" y="150" width="1240" height="600" rx="32" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
    <rect x="230" y="205" width="420" height="490" rx="18" fill="#111827"/>
    <rect x="705" y="205" width="630" height="96" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
    <rect x="705" y="335" width="630" height="96" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
    <rect x="705" y="465" width="630" height="96" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
    <rect x="705" y="595" width="630" height="96" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
    <path d="M650 450 C710 450 700 253 705 253" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>
    <path d="M650 450 C720 450 690 383 705 383" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" opacity="0.78"/>
    <path d="M650 450 C720 450 690 513 705 513" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" opacity="0.62"/>
    <path d="M650 450 C710 450 700 643 705 643" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" opacity="0.48"/>
    ${Array.from({ length: 14 }, (_, i) => `<rect x="280" y="${250 + i * 28}" width="${220 + (i % 4) * 34}" height="9" rx="4" fill="${i % 3 === 0 ? accent : "#64748b"}" opacity="${i % 3 === 0 ? "0.9" : "0.58"}"/>`).join("")}
    ${Array.from({ length: 4 }, (_, i) => `<circle cx="${780 + i * 145}" cy="${253 + i * 130}" r="20" fill="${accent}" opacity="${0.88 - i * 0.12}"/>`).join("")}
  </g>
  <text x="800" y="820" text-anchor="middle" font-family="Aptos, Arial" font-size="34" fill="#334155">${title}</text>
</svg>`);
}

async function generateOne(item, index, apiKey) {
  const out = path.join(assetDir, item.name);
  if (!apiKey) {
    await fs.writeFile(out, fallbackSvg(item.name.replace(".png", ""), index % 2 ? "#f59e0b" : "#0891b2"));
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
    await fs.writeFile(out, fallbackSvg(item.name.replace(".png", ""), index % 2 ? "#f59e0b" : "#0891b2"));
    return { name: item.name, status: "fallback-http", detail: response.status };
  }
  const data = JSON.parse(text);
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) {
    await fs.writeFile(out, fallbackSvg(item.name.replace(".png", ""), index % 2 ? "#f59e0b" : "#0891b2"));
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
if (args.only && selectedPrompts.length === 0) {
  throw new Error(`No prompt configured for ${args.only}.`);
}
const apiKey = await readXaiApiKey();
const results = [];
for (let index = 0; index < selectedPrompts.length; index += 1) {
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
