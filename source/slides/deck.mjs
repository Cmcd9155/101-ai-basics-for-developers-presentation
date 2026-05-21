import path from "node:path";

const ASSET_DIR = "/Users/chrisdonahue/Documents/Codex/2026-05-21/i-want-to-create-a-presentation/outputs/019e4a38-4026-71e0-9b50-0443ceaa8f49/presentations/101-ai-basics/assets";

const C = {
  ink: "#172033",
  muted: "#526179",
  soft: "#7B8798",
  line: "#D8E0EA",
  bg: "#F6F8FB",
  panel: "#FFFFFF",
  dark: "#111827",
  dark2: "#1F2937",
  teal: "#0E9F9A",
  blue: "#2563EB",
  amber: "#F59E0B",
  red: "#DC2626",
  green: "#16A34A",
  violet: "#7C3AED",
  code: "#0B1220",
};

const sourceLabels = {
  ghIndex: "GitHub Docs: repo indexing + semantic code search",
  ghContext: "GitHub Docs: Copilot CLI context management",
  ghModes: "GitHub Docs: Copilot agent sessions",
  ghInstructions: "GitHub Docs: custom instructions",
  openaiTools: "OpenAI Docs: function/tool calling",
  openaiRetrieval: "OpenAI Docs: retrieval + vector stores",
  mcpTools: "MCP spec: server tools",
  anthropicAgents: "Anthropic: Building effective agents",
  xaiImages: "xAI Docs: Grok Imagine image generation",
};

const slides = [
  {
    type: "cover",
    title: "101 AI Basics for Developers",
    subtitle: "A practical workshop for using IDE agents without losing engineering judgment.",
    image: "hero-agent-workbench.png",
    footer: "30 minutes | VS Code + GitHub Copilot mental model",
  },
  {
    type: "basics",
    kicker: "LLM basics",
    title: "An LLM is a probabilistic text engine wrapped in product constraints.",
    points: [
      ["Tokens", "The model sees chunks of text, code, and symbols, not files the way your editor does."],
      ["Context", "Only the current assembled context is available at generation time."],
      ["Uncertainty", "Plausible output is not the same as true output, especially for APIs and repo-specific behavior."],
      ["Reasoning", "Modern models can plan and inspect, but they still need grounding and verification."],
    ],
    callout: "Treat model output as a draft from a very fast engineer with incomplete local state.",
  },
  {
    type: "promptSpec",
    kicker: "Prompting as specification",
    title: "Good agent prompts look like small implementation briefs.",
    leftTitle: "Weak prompt",
    leftBody: "Fix auth bug.",
    rightTitle: "Agent-ready prompt",
    rightBody:
      "Investigate why expired sessions still pass /api/me. Start by reading auth middleware and session tests. Propose the smallest fix, update tests, and summarize the diff.",
    rubric: ["Goal", "Scope", "Starting points", "Constraints", "Definition of done"],
  },
  {
    type: "repoTraversal",
    kicker: "How Copilot traverses a repo",
    title: "It does not load the whole repo. It assembles working context.",
    image: "repo-map.png",
    source: "ghIndex, ghContext",
  },
  {
    type: "contextEngineering",
    kicker: "Context engineering",
    title: "The most useful skill is choosing what the agent should see first.",
    lanes: [
      ["Explicit", "Selected files, issue text, pasted logs, failing stack traces."],
      ["Persistent", ".github/copilot-instructions.md, path instructions, AGENTS.md-style guidance."],
      ["Retrieved", "Semantic code search, repo index, file search, related symbols."],
      ["Generated", "Tool results, test output, diffs, plans, summaries, checkpoints."],
    ],
    source: "ghInstructions, ghContext",
  },
  {
    type: "toolLoop",
    kicker: "Tool calling",
    title: "Agents become useful when the model can ask the environment for facts.",
    image: "tool-loop.png",
    steps: [
      "Model receives prompt + tool definitions",
      "Model requests a tool call",
      "App executes the tool outside the model",
      "Tool result returns into context",
      "Model responds or calls another tool",
    ],
    source: "openaiTools",
  },
  {
    type: "retrieval",
    kicker: "RAG and semantic search",
    title: "Retrieval is how fresh repo facts get into a bounded context window.",
    source: "openaiRetrieval",
  },
  {
    type: "mcp",
    kicker: "MCP",
    title: "MCP is the adapter layer that lets agents discover and invoke external tools.",
    source: "mcpTools",
  },
  {
    type: "workflowAgent",
    kicker: "Workflow vs agent",
    title: "The more dynamic the path, the more you need steering and verification.",
    source: "anthropicAgents",
  },
  {
    type: "modes",
    kicker: "IDE agent modes",
    title: "Choose autonomy based on blast radius, not ambition.",
    modes: [
      ["Ask", "Explain, compare, locate, summarize. No edits."],
      ["Edit", "Targeted changes in known files. You control the surface."],
      ["Agent", "Multi-file work with search, commands, tests, and iteration."],
      ["Plan / Autopilot", "Plan when scope is uncertain. Autopilot only when the task is bounded and tests are clear."],
    ],
    source: "ghModes",
  },
  {
    type: "taskFit",
    kicker: "Task selection",
    title: "Agents shine on bounded, inspectable work.",
    good: [
      "Add a small feature with clear acceptance tests",
      "Trace a bug from log to codepath",
      "Refactor a repeated pattern with test coverage",
      "Generate first-pass tests for existing behavior",
    ],
    bad: [
      "Rewrite the architecture",
      "Make it production ready",
      "Fix all flaky tests",
      "Change auth and billing in one pass",
    ],
  },
  {
    type: "steering",
    kicker: "Steering loop",
    title: "The best users manage agents like junior teammates with good tools.",
    steps: [
      ["Frame", "Give goal, scope, starting files, and constraints."],
      ["Observe", "Read plan, tool calls, tests, and assumptions."],
      ["Interrupt", "Correct direction early when it broadens or guesses."],
      ["Verify", "Run tests, inspect diffs, check behavior, ask for residual risk."],
    ],
  },
  {
    type: "failures",
    kicker: "Failure modes",
    title: "Most agent failures are context failures wearing a confidence costume.",
    failures: [
      ["Hallucinated APIs", "Counter: ask it to cite the local symbol or docs before coding."],
      ["Overbroad edits", "Counter: constrain files, public APIs, and migration scope."],
      ["Stale context", "Counter: restart, summarize, or checkpoint after major pivots."],
      ["Weak tests", "Counter: require failing test first or explicit manual QA steps."],
      ["Permission risk", "Counter: keep dangerous commands and secret access gated."],
    ],
  },
  {
    type: "teamSetup",
    kicker: "Team setup",
    title: "Make the repo easier for humans and agents to understand.",
    items: [
      [".github/copilot-instructions.md", "Broad repo conventions and engineering preferences."],
      [".github/instructions/*.instructions.md", "Path-specific rules for tests, APIs, frontend, infra."],
      ["AGENTS.md / CLAUDE.md / GEMINI.md", "Agent-facing project workflow notes when supported."],
      ["Skills / prompt files", "Repeatable workflows such as bug triage, code review, release notes."],
    ],
    source: "ghInstructions",
  },
  {
    type: "checklist",
    kicker: "Practical checklist",
    title: "A reliable agent session has three checkpoints.",
    image: "agent-workshop.png",
  },
  {
    type: "exercise",
    kicker: "Closing exercise",
    title: "Turn a vague request into an agent-ready task.",
    vague: "Make the settings page better.",
    improved:
      "Review the current settings page UX. Identify the smallest accessibility and layout improvements that do not change routes or API behavior. Implement them in the settings component only, add or update focused tests, and summarize before/after behavior.",
  },
];

function rect(slide, ctx, x, y, w, h, fill = C.panel, line = C.line) {
  return ctx.addShape(slide, {
    x,
    y,
    w,
    h,
    fill,
    line: { fill: line, width: line === "none" ? 0 : 1 },
  });
}

function text(slide, ctx, value, x, y, w, h, opts = {}) {
  return ctx.addText(slide, {
    text: value,
    x,
    y,
    w,
    h,
    fontSize: opts.size ?? 22,
    color: opts.color ?? C.ink,
    bold: opts.bold ?? false,
    typeface: opts.face ?? (opts.mono ? ctx.fonts.mono : ctx.fonts.body),
    align: opts.align ?? "left",
    valign: opts.valign ?? "top",
    fill: opts.fill ?? "#00000000",
    line: { fill: "none", width: 0 },
    insets: opts.insets ?? { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

async function image(slide, ctx, file, x, y, w, h, fit = "cover") {
  return ctx.addImage(slide, {
    path: path.join(ASSET_DIR, file),
    x,
    y,
    w,
    h,
    fit,
    alt: file.replace(/\.[^.]+$/, ""),
  });
}

function bg(slide, ctx) {
  rect(slide, ctx, 0, 0, 1280, 720, C.bg, "none");
  rect(slide, ctx, 0, 0, 1280, 6, C.teal, "none");
}

function title(slide, ctx, kicker, heading, source, n) {
  text(slide, ctx, kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, heading, 54, 72, 880, 92, { size: 34, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, source, n);
}

function footer(slide, ctx, source, n) {
  const sourceText = source
    ? source
        .split(",")
        .map((key) => sourceLabels[key.trim()] || key.trim())
        .join(" | ")
    : "101 AI Basics for Developers";
  text(slide, ctx, sourceText, 54, 684, 930, 16, { size: 8.5, color: C.soft });
  text(slide, ctx, String(n).padStart(2, "0"), 1180, 680, 46, 20, { size: 10, color: C.soft, align: "right", bold: true });
}

function pill(slide, ctx, value, x, y, w, color = C.teal) {
  rect(slide, ctx, x, y, w, 30, "#FFFFFF", color);
  text(slide, ctx, value, x + 12, y + 7, w - 24, 14, { size: 9.5, color, bold: true, align: "center" });
}

function card(slide, ctx, x, y, w, h, heading, body, accent = C.teal) {
  rect(slide, ctx, x, y, w, h, C.panel, C.line);
  rect(slide, ctx, x, y, 5, h, accent, "none");
  text(slide, ctx, heading, x + 22, y + 22, w - 44, 26, { size: 17, bold: true });
  text(slide, ctx, body, x + 22, y + 58, w - 44, h - 78, { size: 12.5, color: C.muted });
}

function codePanel(slide, ctx, x, y, w, h, body) {
  rect(slide, ctx, x, y, w, h, C.code, "none");
  text(slide, ctx, body, x + 22, y + 22, w - 44, h - 44, { size: 13, color: "#D8E6F3", mono: true });
}

function compactRow(slide, ctx, x, y, w, index, body, accent) {
  rect(slide, ctx, x, y, w, 58, C.panel, C.line);
  rect(slide, ctx, x, y, 5, 58, accent, "none");
  text(slide, ctx, String(index).padStart(2, "0"), x + 24, y + 17, 46, 20, { size: 15, bold: true });
  text(slide, ctx, body, x + 82, y + 15, w - 110, 24, { size: 12.5, color: C.muted });
}

function connector(slide, ctx, x1, y1, x2, y2, color = C.teal) {
  if (Math.abs(x2 - x1) >= Math.abs(y2 - y1)) {
    const x = Math.min(x1, x2);
    rect(slide, ctx, x, y1 - 2, Math.abs(x2 - x1), 4, color, "none");
    text(slide, ctx, ">", x2 - 7, y1 - 12, 20, 24, { size: 18, color, bold: true });
  } else {
    const y = Math.min(y1, y2);
    rect(slide, ctx, x1 - 2, y, 4, Math.abs(y2 - y1), color, "none");
    text(slide, ctx, "v", x1 - 7, y2 - 8, 20, 20, { size: 16, color, bold: true });
  }
}

async function cover(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  await image(slide, ctx, s.image, 0, 0, 1280, 720);
  rect(slide, ctx, 0, 0, 640, 720, "#FFFFFF", "none");
  rect(slide, ctx, 640, 0, 640, 720, "#FFFFFF33", "none");
  rect(slide, ctx, 54, 58, 6, 64, C.teal, "none");
  text(slide, ctx, "PRACTICAL IDE AGENT WORKSHOP", 78, 60, 420, 18, { size: 10, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 176, 620, 150, { size: 54, bold: true, face: ctx.fonts.title });
  text(slide, ctx, s.subtitle, 58, 356, 500, 76, { size: 20, color: C.muted });
  pill(slide, ctx, "VS Code + GitHub Copilot framing", 58, 486, 260, C.blue);
  pill(slide, ctx, "30 minutes", 336, 486, 120, C.amber);
  text(slide, ctx, s.footer, 58, 654, 480, 20, { size: 11, color: C.soft });
  text(slide, ctx, String(n).padStart(2, "0"), 1180, 680, 46, 20, { size: 10, color: C.soft, align: "right", bold: true });
  return slide;
}

async function agenda(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, s.kicker, s.title, s.source, n);
  s.blocks.forEach(([num, head, body], i) => {
    const x = 74 + i * 382;
    rect(slide, ctx, x, 238, 318, 318, C.panel, C.line);
    text(slide, ctx, num, x + 26, 260, 90, 58, { size: 42, bold: true, color: [C.teal, C.blue, C.amber][i] });
    text(slide, ctx, head, x + 28, 348, 260, 36, { size: 24, bold: true });
    text(slide, ctx, body, x + 28, 408, 248, 82, { size: 14.5, color: C.muted });
  });
  text(slide, ctx, "You should leave knowing when to trust, when to steer, and when to stop the agent.", 188, 600, 900, 34, {
    size: 20,
    bold: true,
    align: "center",
  });
  return slide;
}

async function basics(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, s.kicker, s.title, s.source, n);
  s.points.forEach(([head, body], i) => {
    const x = 74 + (i % 2) * 566;
    const y = 220 + Math.floor(i / 2) * 156;
    card(slide, ctx, x, y, 500, 112, head, body, [C.teal, C.blue, C.amber, C.violet][i]);
  });
  rect(slide, ctx, 188, 570, 904, 62, "#EEF9F8", C.teal);
  text(slide, ctx, s.callout, 220, 589, 840, 26, { size: 18, bold: true, color: C.ink, align: "center" });
  return slide;
}

async function promptSpec(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, s.kicker, s.title, s.source, n);
  codePanel(slide, ctx, 74, 225, 470, 180, s.leftBody);
  text(slide, ctx, s.leftTitle, 96, 190, 260, 22, { size: 16, bold: true, color: C.red });
  codePanel(slide, ctx, 660, 225, 500, 180, s.rightBody);
  text(slide, ctx, s.rightTitle, 682, 190, 300, 22, { size: 16, bold: true, color: C.green });
  connector(slide, ctx, 560, 315, 642, 315, C.teal);
  s.rubric.forEach((item, i) => pill(slide, ctx, item, 170 + i * 184, 500, 140, [C.teal, C.blue, C.amber, C.violet, C.green][i]));
  text(slide, ctx, "Prompt quality is context selection plus acceptance criteria. The words matter less than the boundaries.", 180, 585, 920, 34, {
    size: 19,
    bold: true,
    align: "center",
  });
  return slide;
}

async function repoTraversal(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 714, 80, 500, 300);
  rect(slide, ctx, 690, 80, 540, 300, "#FFFFFFD9", C.line);
  title(slide, ctx, s.kicker, s.title, s.source, n);
  const left = [
    ["Repo surface", "Files, folders, symbols, tests, docs, issues"],
    ["Repo index", "Semantic code search finds relevant code by meaning"],
    ["Explicit context", "Selected files, prompt text, logs, instructions"],
    ["Agent tools", "Search, read, run commands, edit, inspect diffs"],
    ["Context window", "Only assembled state fits; long sessions compact"],
  ];
  left.forEach(([head, body], i) => {
    const y = 200 + i * 82;
    rect(slide, ctx, 74, y, 420, 52, C.panel, C.line);
    rect(slide, ctx, 74, y, 4, 52, [C.teal, C.blue, C.amber, C.violet, C.green][i], "none");
    text(slide, ctx, head, 94, y + 9, 145, 16, { size: 12.5, bold: true });
    text(slide, ctx, body, 250, y + 9, 210, 30, { size: 10.5, color: C.muted });
    if (i < left.length - 1) connector(slide, ctx, 284, y + 55, 284, y + 78, [C.teal, C.blue, C.amber, C.violet][i]);
  });
  rect(slide, ctx, 560, 225, 214, 238, "#F8FAFC", C.line);
  text(slide, ctx, "Working context", 586, 246, 160, 22, { size: 17, bold: true, align: "center" });
  text(slide, ctx, "A temporary bundle of retrieved code, explicit prompt material, tool results, and session memory.", 594, 300, 142, 92, {
    size: 12,
    color: C.muted,
    align: "center",
  });
  connector(slide, ctx, 498, 405, 558, 346, C.teal);
  connector(slide, ctx, 774, 346, 846, 346, C.teal);
  card(slide, ctx, 850, 425, 300, 102, "Careful mental model", "Copilot assembles context. It does not simply paste the whole repository into the model.", C.amber);
  return slide;
}

async function contextEngineering(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, s.kicker, s.title, s.source, n);
  s.lanes.forEach(([head, body], i) => {
    const x = 92 + i * 284;
    rect(slide, ctx, x, 222, 226, 270, C.panel, C.line);
    text(slide, ctx, head, x + 20, 248, 180, 30, { size: 22, bold: true, color: [C.teal, C.blue, C.amber, C.violet][i] });
    text(slide, ctx, body, x + 20, 322, 180, 96, { size: 14, color: C.muted });
  });
  connector(slide, ctx, 204, 520, 1048, 520, C.teal);
  text(slide, ctx, "Better inputs reduce guessing. Better checkpoints reduce drift.", 260, 566, 760, 34, { size: 21, bold: true, align: "center" });
  return slide;
}

async function toolLoop(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 0, 0, 1280, 720);
  rect(slide, ctx, 0, 0, 1280, 720, "#F6F8FBEF", "none");
  title(slide, ctx, s.kicker, s.title, s.source, n);
  const positions = [
    [120, 250],
    [390, 188],
    [680, 250],
    [680, 448],
    [390, 510],
  ];
  s.steps.forEach((step, i) => {
    const [x, y] = positions[i];
    rect(slide, ctx, x, y, 210, 76, C.panel, C.line);
    text(slide, ctx, String(i + 1), x + 16, y + 18, 28, 28, { size: 21, bold: true, color: [C.teal, C.blue, C.amber, C.violet, C.green][i] });
    text(slide, ctx, step, x + 54, y + 18, 132, 36, { size: 12.5, bold: true });
  });
  connector(slide, ctx, 330, 288, 390, 232, C.teal);
  connector(slide, ctx, 600, 232, 680, 288, C.teal);
  connector(slide, ctx, 785, 326, 785, 448, C.teal);
  connector(slide, ctx, 680, 486, 600, 548, C.teal);
  connector(slide, ctx, 390, 548, 225, 326, C.teal);
  card(slide, ctx, 970, 265, 210, 170, "Engineering rule", "A tool call is not magic. Your app or IDE executes it, with permissions and consequences.", C.amber);
  return slide;
}

async function retrieval(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, s.kicker, s.title, s.source, n);
  const nodes = [
    ["Question", 90, 286, C.blue],
    ["Search query", 300, 286, C.teal],
    ["Chunks + embeddings", 520, 212, C.violet],
    ["Relevant snippets", 750, 286, C.amber],
    ["Grounded answer", 980, 286, C.green],
  ];
  nodes.forEach(([label, x, y, color]) => {
    rect(slide, ctx, x, y, 160, 84, C.panel, color);
    text(slide, ctx, label, x + 18, y + 30, 124, 24, { size: 15, bold: true, color, align: "center" });
  });
  connector(slide, ctx, 250, 328, 300, 328, C.teal);
  connector(slide, ctx, 460, 328, 520, 254, C.teal);
  connector(slide, ctx, 680, 254, 750, 328, C.teal);
  connector(slide, ctx, 910, 328, 980, 328, C.teal);
  rect(slide, ctx, 520, 430, 160, 84, "#EEF2FF", C.violet);
  text(slide, ctx, "Vector store", 542, 462, 116, 20, { size: 15, bold: true, color: C.violet, align: "center" });
  connector(slide, ctx, 600, 296, 600, 430, C.violet);
  text(slide, ctx, "Retrieval helps with facts, but it can still retrieve the wrong fact. Always inspect citations or files for important changes.", 188, 584, 904, 40, {
    size: 18,
    bold: true,
    align: "center",
  });
  return slide;
}

async function mcp(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, s.kicker, s.title, s.source, n);
  rect(slide, ctx, 92, 274, 260, 150, C.dark, "none");
  text(slide, ctx, "Agent client", 132, 310, 180, 24, { size: 22, bold: true, color: "#FFFFFF", align: "center" });
  text(slide, ctx, "Model + session + tool choice", 132, 354, 180, 38, { size: 12.5, color: "#CBD5E1", align: "center" });
  rect(slide, ctx, 510, 248, 250, 202, "#EEF9F8", C.teal);
  text(slide, ctx, "MCP server", 552, 286, 160, 24, { size: 24, bold: true, color: C.teal, align: "center" });
  text(slide, ctx, "Named tools\nSchemas\nResource links\nTool results", 552, 332, 160, 80, { size: 13, color: C.muted, align: "center" });
  const targets = [
    ["Database", 925, 200, C.blue],
    ["GitHub", 925, 310, C.dark2],
    ["Calendar", 925, 420, C.amber],
  ];
  targets.forEach(([label, x, y, color]) => {
    rect(slide, ctx, x, y, 210, 86, C.panel, C.line);
    rect(slide, ctx, x, y, 5, 86, color, "none");
    text(slide, ctx, label, x + 22, y + 24, 150, 22, { size: 17, bold: true });
    text(slide, ctx, "External system", x + 22, y + 56, 150, 18, { size: 11, color: C.muted });
  });
  connector(slide, ctx, 352, 350, 510, 350, C.teal);
  rect(slide, ctx, 760, 348, 92, 4, C.teal, "none");
  rect(slide, ctx, 850, 240, 4, 224, C.teal, "none");
  connector(slide, ctx, 852, 240, 925, 240, C.teal);
  connector(slide, ctx, 852, 350, 925, 350, C.teal);
  connector(slide, ctx, 852, 460, 925, 460, C.teal);
  text(slide, ctx, "The protocol standardizes discovery and invocation. Your security model still has to decide what tools are allowed.", 188, 584, 904, 40, {
    size: 18,
    bold: true,
    align: "center",
  });
  return slide;
}

async function workflowAgent(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, s.kicker, s.title, s.source, n);
  card(slide, ctx, 110, 230, 470, 250, "Workflow", "Predefined code path orchestrates model and tools. Great for repeatable, auditable processes.", C.blue);
  card(slide, ctx, 700, 230, 470, 250, "Agent", "Model dynamically chooses process and tool use. Great for ambiguous tasks that need exploration.", C.teal);
  text(slide, ctx, "Use workflows when the path is known. Use agents when discovery is part of the job.", 180, 570, 920, 34, {
    size: 21,
    bold: true,
    align: "center",
  });
  return slide;
}

async function modes(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, s.kicker, s.title, s.source, n);
  s.modes.forEach(([head, body], i) => {
    const x = 88 + (i % 2) * 560;
    const y = 220 + Math.floor(i / 2) * 154;
    card(slide, ctx, x, y, 480, 112, head, body, [C.blue, C.teal, C.amber, C.violet][i]);
  });
  text(slide, ctx, "More autonomy means more need for tests, permissions, and review.", 256, 585, 760, 34, { size: 21, bold: true, align: "center" });
  return slide;
}

async function taskFit(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, s.kicker, s.title, s.source, n);
  text(slide, ctx, "Good fit", 132, 205, 300, 28, { size: 24, bold: true, color: C.green });
  text(slide, ctx, "Bad fit", 720, 205, 300, 28, { size: 24, bold: true, color: C.red });
  s.good.forEach((item, i) => compactRow(slide, ctx, 110, 252 + i * 78, 445, i + 1, item, C.green));
  s.bad.forEach((item, i) => compactRow(slide, ctx, 700, 252 + i * 78, 445, i + 1, item, C.red));
  return slide;
}

async function steering(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, s.kicker, s.title, s.source, n);
  s.steps.forEach(([head, body], i) => {
    const x = 116 + i * 278;
    rect(slide, ctx, x, 278, 210, 132, C.panel, C.line);
    text(slide, ctx, head, x + 22, 304, 166, 28, { size: 22, bold: true, color: [C.blue, C.teal, C.amber, C.green][i], align: "center" });
    text(slide, ctx, body, x + 24, 352, 162, 42, { size: 12, color: C.muted, align: "center" });
    if (i < s.steps.length - 1) connector(slide, ctx, x + 210, 344, x + 278, 344, C.teal);
  });
  text(slide, ctx, "Interrupting early is cheaper than reviewing a confident wrong diff.", 236, 540, 800, 34, { size: 22, bold: true, align: "center" });
  return slide;
}

async function failures(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, s.kicker, s.title, s.source, n);
  s.failures.forEach(([head, body], i) => {
    const x = i < 3 ? 90 + i * 365 : 270 + (i - 3) * 365;
    const y = i < 3 ? 216 : 418;
    card(slide, ctx, x, y, 300, 128, head, body, [C.red, C.amber, C.violet, C.blue, C.green][i]);
  });
  return slide;
}

async function teamSetup(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, s.kicker, s.title, s.source, n);
  s.items.forEach(([head, body], i) => {
    const y = 220 + i * 86;
    rect(slide, ctx, 110, y, 1060, 58, C.panel, C.line);
    text(slide, ctx, head, 136, y + 17, 310, 20, { size: 14, mono: true, bold: true, color: [C.blue, C.teal, C.amber, C.violet][i] });
    text(slide, ctx, body, 500, y + 15, 550, 24, { size: 14, color: C.muted });
  });
  text(slide, ctx, "This is documentation with operational leverage: humans read it occasionally; agents read it every session.", 196, 592, 880, 34, {
    size: 20,
    bold: true,
    align: "center",
  });
  return slide;
}

async function checklist(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  await image(slide, ctx, s.image, 0, 0, 1280, 720);
  rect(slide, ctx, 0, 0, 1280, 720, "#FFFFFFE8", "none");
  title(slide, ctx, s.kicker, s.title, s.source, n);
  const columns = [
    ["Before", ["Define done", "Name files or areas", "State constraints", "Pick mode"]],
    ["During", ["Review plan", "Watch tool calls", "Interrupt drift", "Ask for assumptions"]],
    ["After", ["Inspect diff", "Run tests", "Check edge cases", "Capture learnings"]],
  ];
  columns.forEach(([head, items], i) => {
    const x = 124 + i * 350;
    rect(slide, ctx, x, 232, 280, 310, C.panel, C.line);
    text(slide, ctx, head, x + 26, 260, 220, 30, { size: 25, bold: true, color: [C.blue, C.teal, C.green][i], align: "center" });
    items.forEach((item, j) => {
      text(slide, ctx, "[ ]", x + 42, 332 + j * 42, 34, 18, { size: 13, mono: true, color: C.soft });
      text(slide, ctx, item, x + 82, 330 + j * 42, 150, 20, { size: 14, bold: true });
    });
  });
  return slide;
}

async function exercise(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, s.kicker, s.title, s.source, n);
  text(slide, ctx, "Vague", 110, 204, 160, 26, { size: 20, bold: true, color: C.red });
  codePanel(slide, ctx, 110, 244, 430, 120, s.vague);
  text(slide, ctx, "Agent-ready", 700, 204, 220, 26, { size: 20, bold: true, color: C.green });
  codePanel(slide, ctx, 700, 244, 430, 194, s.improved);
  connector(slide, ctx, 555, 304, 680, 304, C.teal);
  const prompts = ["What is the smallest useful scope?", "What should the agent inspect first?", "How will we know it worked?"];
  prompts.forEach((p, i) => pill(slide, ctx, p, 180 + i * 300, 535, 250, [C.blue, C.teal, C.amber][i]));
  text(slide, ctx, "Your job is to keep the agent inside a useful problem shape.", 270, 604, 740, 34, { size: 22, bold: true, align: "center" });
  return slide;
}

const renderers = {
  cover,
  agenda,
  basics,
  promptSpec,
  repoTraversal,
  contextEngineering,
  toolLoop,
  retrieval,
  mcp,
  workflowAgent,
  modes,
  taskFit,
  steering,
  failures,
  teamSetup,
  checklist,
  exercise,
};

export async function renderSlide(presentation, ctx, number) {
  const s = slides[number - 1];
  if (!s) throw new Error(`Unknown slide ${number}`);
  return renderers[s.type](presentation, ctx, s, number);
}

export { slides, sourceLabels };
