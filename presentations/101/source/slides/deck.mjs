import path from "node:path";

const ASSET_DIR = path.resolve(import.meta.dirname, "../../assets");

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
    title: "LLMs do three things: read pieces, use context, make a best guess.",
    image: "llm-context-draft.png",
    points: [
      ["Pieces", "The model reads tokens: little chunks of words, code, punctuation, and symbols."],
      ["Context", "It only knows what is in front of it right now: your prompt, selected code, tool results, and prior messages."],
      ["Best guess", "It predicts a likely answer. Useful can still be wrong."],
      ["Your job", "Let it draft, then ground the answer in code, tests, docs, and judgment."],
    ],
    callout: "Fast draft. Incomplete context. Always verify the important parts.",
  },
  {
    type: "promptSpec",
    kicker: "Prompting as specification",
    title: "A good prompt tells the agent five simple things.",
    image: "prompt-to-spec.png",
    leftTitle: "Weak prompt",
    leftBody: "Fix auth bug.",
    rightTitle: "Agent-ready prompt",
    rightBody:
      "Find why expired sessions still pass /api/me. Start in auth middleware and session tests. Make the smallest fix. Update tests. Summarize what changed.",
    rubric: ["What to fix", "Where to look", "What to avoid", "How to check", "Done"],
    callout: "A prompt is just a clearer ticket: what to do, where to start, and how we know it worked.",
  },
  {
    type: "repoTraversal",
    kicker: "How Copilot traverses a repo",
    title: "Copilot does not carry the whole repo. It packs a working context.",
    image: "repo-context-assembly.png",
    contextItems: [
      ["What you point at", "Opened files, selected code, issue text, logs, and instructions."],
      ["What it searches for", "Related files, symbols, tests, docs, and matching patterns."],
      ["What tools return", "Search results, test output, diffs, errors, and prior steps."],
    ],
    callout: "If the right file never gets packed, the answer can sound right and still miss your repo.",
    rule: "Ask for the map before edits: files inspected, tests found, assumptions, and risk.",
    source: "ghIndex, ghContext",
  },
  {
    type: "contextEngineering",
    kicker: "Context engineering",
    title: "Do not give it everything. Give it the right starter packet.",
    image: "context-starter-packet.png",
    packet: [
      ["The ask", "What should change, and what should stay alone."],
      ["The evidence", "Exact files, failing logs, screenshots, errors, or issue text."],
      ["The rules", "Repo conventions, risky areas, generated files, API boundaries."],
      ["The check", "Tests to run, behavior to prove, and what counts as done."],
    ],
    callout: "Better context is not more stuff. It is the few facts that change the next decision.",
    rule: "Start narrow. Add context when the agent proves it needs more.",
    source: "ghInstructions, ghContext",
  },
  {
    type: "toolLoop",
    kicker: "Tool calling",
    title: "Tool calling means: the model asks, the app runs, results come back.",
    image: "tool-call-reality-loop.png",
    steps: [
      ["Ask", "The model requests a named tool with arguments."],
      ["Run", "The host app or IDE executes the tool outside the model."],
      ["Return", "Output comes back into the conversation as context."],
      ["Decide", "The model uses the result to answer or ask for the next tool."],
    ],
    callout: "The model is not running tests in its imagination. The host runs the command and feeds back the output.",
    riskTitle: "Tools have blast radius",
    risks: ["Read", "Edit", "Run", "Ship"],
    rule: "Trust tool results more than vibes. Still check permissions, side effects, and weird failures.",
    source: "openaiTools",
  },
  {
    type: "retrieval",
    kicker: "RAG and semantic search",
    title: "Retrieval finds candidates. You still decide what is true.",
    image: "retrieval-candidate-map.png",
    points: [
      ["Search by meaning", "Good when you do not know the exact file, symbol, or doc name."],
      ["Treat results as leads", "A close match can still be stale, nearby, or from the wrong path."],
      ["Read the source", "Open cited files, callers, tests, configs, and docs before trusting it."],
    ],
    loop: ["Retrieve", "Read", "Reason", "Verify"],
    callout: "Retrieval is orientation, not proof.",
    rule: "Ask the agent to separate found evidence from inferred conclusions.",
    source: "openaiRetrieval",
  },
  {
    type: "mcp",
    kicker: "MCP",
    title: "MCP is a standard plug for agent tools. It is not automatic trust.",
    image: "mcp-tool-adapters.png",
    pieces: [
      ["Client", "The agent app needs a capability."],
      ["Server", "A tool server describes names, schemas, resources, and results."],
      ["Host", "The host decides what is allowed and what needs approval."],
      ["Systems", "Git, docs, data, tickets, deploys, calendars, and more."],
    ],
    callout: "MCP standardizes the shape of tool access. Your security model still decides who gets the keys.",
    rule: "Good MCP setup means clear tools, narrow permissions, logs, and review for risky actions.",
    source: "mcpTools",
  },
  {
    type: "workflowAgent",
    kicker: "Workflow vs agent",
    title: "Use a workflow when the path is known. Use an agent when the path must be found.",
    image: "workflow-vs-agent-paths.png",
    choices: [
      ["Workflow", "Known path", "Same steps each time. Easier to test, audit, and run cheaply."],
      ["Agent", "Discovered path", "Explores files, tools, logs, and hypotheses as the work unfolds."],
    ],
    questions: ["Is the path repeatable?", "Does discovery matter?", "What needs review?"],
    callout: "Do not call it an agent just because it sounds cooler.",
    rule: "Repeatability favors workflows. Ambiguity favors agents. Both still need verification.",
    source: "anthropicAgents",
  },
  {
    type: "modes",
    kicker: "IDE agent modes",
    title: "Choose the mode that keeps review possible.",
    image: "ide-agent-mode-dial.png",
    modes: [
      ["Ask", "Understand", "Explain, compare, locate, summarize. No edits."],
      ["Edit", "Targeted change", "Known files, small surface, focused review."],
      ["Agent", "Explore + execute", "Search, edit, run commands, test, and iterate."],
      ["Plan", "Map before code", "Use when scope is foggy or blast radius is high."],
    ],
    callout: "More autonomy is not better. It is just more blast radius.",
    checks: ["Scope clear?", "Tests clear?", "Easy to revert?"],
    rule: "Increase autonomy only when the verification story improves with it.",
    source: "ghModes",
  },
  {
    type: "taskFit",
    kicker: "Task selection",
    title: "Give agents work you can review in one sitting.",
    image: "task-fit-review-packets.png",
    callout: "If you cannot review the diff, you did not delegate a task.",
    fitTitle: "Good fit test",
    fit: [
      ["Small surface", "One feature, bug, route, component, or test area."],
      ["Clear check", "A test, log, screenshot, or manual behavior to verify."],
      ["Readable diff", "A human can inspect the change without a scavenger hunt."],
    ],
    badTitle: "Split these first",
    bad: [
      "Make it production ready",
      "Fix all flaky tests",
      "Rewrite the architecture",
    ],
    split: ["One behavior", "One area", "One verification"],
    rule: "Big goal -> small inspectable task -> agent session -> human review.",
  },
  {
    type: "steering",
    kicker: "Steering loop",
    title: "Stay in the loop: frame, watch, interrupt, verify.",
    image: "agent-steering-loop.png",
    callout: "You are still the engineer. The agent is the worker, not the reviewer.",
    steps: [
      ["Frame", "Goal, scope, starting files, constraints."],
      ["Watch", "Plan, files read, tool calls, assumptions."],
      ["Interrupt", "Stop drift while it is still cheap."],
      ["Verify", "Diff, tests, behavior, residual risk."],
    ],
    signals: ["Wrong files", "No tests", "Surprise scope", "Uncited claims"],
    rule: "Steering early keeps reviews small and sessions trustworthy.",
  },
  {
    type: "failures",
    kicker: "Failure modes",
    title: "Confidence is not a check. Evidence is.",
    image: "agent-failure-debugger.png",
    callout: "Most failures come from missing context, loose scope, or weak verification.",
    failures: [
      ["Invented API", "Ask for the local symbol or docs."],
      ["Wide diff", "Constrain files and public APIs."],
      ["Stale context", "Restart, summarize, or checkpoint."],
      ["Weak check", "Run focused tests or manual QA."],
      ["Risky action", "Gate commands, secrets, and deploys."],
    ],
    questions: ["What evidence?", "What changed?", "What was verified?", "What risk remains?"],
    rule: "Make the agent show evidence, limits, checks, and leftover risk.",
  },
  {
    type: "teamSetup",
    kicker: "Team setup",
    title: "Write down the rules the agent should not guess.",
    image: "repo-operating-manual.png",
    callout: "Repo instructions are an operating manual, not a policy novel.",
    items: [
      ["Repo rules", "Package manager, generated files, safe commands, style decisions."],
      ["Path rules", "Tests, APIs, frontend patterns, infra, migrations, security."],
      ["Workflow recipes", "Bug triage, review prep, release notes, incident checks."],
      ["Keep out", "Secrets, risky commands, deploys, policy guesses, stale preferences."],
    ],
    homes: ["Copilot instructions", "AGENTS.md", "Skills / prompts"],
    rule: "Short, durable instructions make every future session less guessy.",
    source: "ghInstructions",
  },
  {
    type: "checklist",
    kicker: "Practical checklist",
    title: "Use one checklist: before, during, after.",
    image: "agent-session-runbook.png",
    callout: "Do not wait until the end to become the engineer.",
    phases: [
      ["Before", "Shape the task", ["Define done", "Bound the scope", "Name the checks"]],
      ["During", "Watch direction", ["Read the plan", "Watch files and tools", "Interrupt drift"]],
      ["After", "Prove it worked", ["Inspect the diff", "Run tests or QA", "Capture learning"]],
    ],
    rule: "Before gives direction. During catches drift. After proves the work.",
  },
  {
    type: "exercise",
    kicker: "Closing exercise",
    title: "Rewrite vague work into a task you can verify.",
    image: "agent-ready-task-worksheet.png",
    callout: "The prompt is the work ticket. Make it bounded and checkable.",
    vague: "Make the settings page better.",
    improved:
      "Improve settings-page accessibility and spacing only. Start in SettingsPage. Do not change routes or API behavior. Add focused tests. Summarize before/after and remaining risk.",
    blanks: ["Goal", "Scope", "Start", "Limits", "Check"],
    rule: "Good agent work is bounded, testable, and reviewed.",
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
  if (s.image) {
    await image(slide, ctx, s.image, 690, 88, 540, 304);
    rect(slide, ctx, 690, 88, 540, 304, "#F6F8FB8C", "none");
    rect(slide, ctx, 690, 88, 540, 304, "#00000000", C.line);
  }
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 76, 610, 110, { size: 34, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  s.points.slice(0, 3).forEach(([head, body], i) => {
    const y = 236 + i * 96;
    rect(slide, ctx, 74, y, 515, 70, C.panel, C.line);
    rect(slide, ctx, 74, y, 5, 70, [C.teal, C.blue, C.amber][i], "none");
    text(slide, ctx, String(i + 1), 96, y + 19, 34, 26, { size: 22, bold: true, color: [C.teal, C.blue, C.amber][i] });
    text(slide, ctx, head, 148, y + 15, 128, 20, { size: 15.5, bold: true });
    text(slide, ctx, body, 284, y + 13, 270, 34, { size: 11.2, color: C.muted });
    if (i < 2) connector(slide, ctx, 330, y + 72, 330, y + 94, [C.teal, C.blue][i]);
  });

  const job = s.points[3];
  rect(slide, ctx, 690, 430, 540, 98, C.dark, "none");
  rect(slide, ctx, 690, 430, 5, 98, C.violet, "none");
  text(slide, ctx, job[0], 718, 456, 120, 22, { size: 18, bold: true, color: "#FFFFFF" });
  text(slide, ctx, job[1], 860, 454, 300, 40, { size: 13, color: "#CBD5E1" });

  rect(slide, ctx, 188, 588, 904, 54, "#EEF9F8", C.teal);
  text(slide, ctx, s.callout, 220, 604, 840, 24, { size: 17, bold: true, color: C.ink, align: "center" });
  return slide;
}

async function promptSpec(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  if (s.image) {
    await image(slide, ctx, s.image, 690, 104, 540, 304);
    rect(slide, ctx, 690, 104, 540, 304, "#F6F8FB80", "none");
    rect(slide, ctx, 690, 104, 540, 304, "#00000000", C.line);
  }
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 76, 590, 92, { size: 36, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  text(slide, ctx, s.leftTitle, 96, 205, 200, 22, { size: 16, bold: true, color: C.red });
  codePanel(slide, ctx, 74, 236, 245, 96, s.leftBody);
  connector(slide, ctx, 342, 284, 400, 284, C.teal);
  text(slide, ctx, "Too much room to guess", 410, 272, 160, 22, { size: 12.5, bold: true, color: C.muted });

  text(slide, ctx, s.rightTitle, 96, 378, 260, 22, { size: 16, bold: true, color: C.green });
  codePanel(slide, ctx, 74, 410, 565, 116, s.rightBody);

  rect(slide, ctx, 690, 448, 540, 80, C.dark, "none");
  rect(slide, ctx, 690, 448, 5, 80, C.green, "none");
  text(slide, ctx, s.callout, 720, 470, 460, 32, { size: 15, color: "#E5EEF7", bold: true });

  s.rubric.forEach((item, i) => pill(slide, ctx, item, 154 + i * 196, 584, 142, [C.teal, C.blue, C.amber, C.violet, C.green][i]));
  return slide;
}

async function repoTraversal(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 642, 92, 588, 320);
  rect(slide, ctx, 642, 92, 588, 320, "#F6F8FB7A", "none");
  rect(slide, ctx, 642, 92, 588, 320, "#00000000", C.line);
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 76, 610, 100, { size: 34, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  s.contextItems.forEach(([head, body], i) => {
    const y = 222 + i * 94;
    rect(slide, ctx, 74, y, 520, 68, C.panel, C.line);
    rect(slide, ctx, 74, y, 5, 68, [C.teal, C.blue, C.amber][i], "none");
    text(slide, ctx, String(i + 1), 96, y + 18, 34, 26, { size: 22, bold: true, color: [C.teal, C.blue, C.amber][i] });
    text(slide, ctx, head, 150, y + 13, 155, 20, { size: 15, bold: true });
    text(slide, ctx, body, 322, y + 12, 228, 34, { size: 11.2, color: C.muted });
  });

  rect(slide, ctx, 690, 450, 540, 92, C.dark, "none");
  rect(slide, ctx, 690, 450, 5, 92, C.amber, "none");
  text(slide, ctx, s.callout, 720, 473, 448, 38, { size: 15, color: "#E5EEF7", bold: true });

  rect(slide, ctx, 188, 594, 904, 52, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 230, 609, 820, 22, { size: 15.5, bold: true, color: C.ink, align: "center" });
  return slide;
}

async function contextEngineering(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 540, 70, 690, 390);
  rect(slide, ctx, 540, 70, 690, 390, "#F6F8FB30", "none");
  rect(slide, ctx, 540, 70, 690, 390, "#00000000", C.line);
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 80, 540, 112, { size: 34, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  rect(slide, ctx, 74, 214, 390, 96, C.dark, "none");
  rect(slide, ctx, 74, 214, 5, 96, C.teal, "none");
  text(slide, ctx, s.callout, 104, 237, 310, 42, { size: 16, bold: true, color: "#E5EEF7" });

  s.packet.forEach(([head, body], i) => {
    const x = 74;
    const y = 344 + i * 60;
    const color = [C.teal, C.blue, C.amber, C.green][i];
    rect(slide, ctx, x, y, 410, 50, C.panel, C.line);
    rect(slide, ctx, x, y, 5, 50, color, "none");
    text(slide, ctx, head, x + 22, y + 14, 112, 17, { size: 14.5, bold: true, color });
    text(slide, ctx, body, x + 150, y + 9, 224, 28, { size: 10.7, color: C.muted });
  });

  rect(slide, ctx, 188, 596, 904, 52, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 260, 612, 760, 20, { size: 15.5, bold: true, color: C.ink, align: "center" });
  return slide;
}

async function toolLoop(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 560, 90, 670, 366);
  rect(slide, ctx, 560, 90, 670, 366, "#F6F8FB45", "none");
  rect(slide, ctx, 560, 90, 670, 366, "#00000000", C.line);
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 78, 586, 100, { size: 32, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  rect(slide, ctx, 74, 206, 404, 104, C.dark, "none");
  rect(slide, ctx, 74, 206, 5, 104, C.amber, "none");
  text(slide, ctx, s.callout, 104, 230, 312, 46, { size: 15.2, bold: true, color: "#E5EEF7" });

  s.steps.forEach(([head, body], i) => {
    const x = 74 + i * 286;
    const y = 494;
    const color = [C.teal, C.blue, C.amber, C.green][i];
    rect(slide, ctx, x, y, 244, 78, C.panel, C.line);
    rect(slide, ctx, x, y, 5, 78, color, "none");
    text(slide, ctx, String(i + 1), x + 20, y + 18, 26, 24, { size: 20, bold: true, color });
    text(slide, ctx, head, x + 58, y + 14, 68, 20, { size: 15.5, bold: true, color });
    text(slide, ctx, body, x + 58, y + 38, 156, 28, { size: 10.3, color: C.muted });
    if (i < s.steps.length - 1) connector(slide, ctx, x + 244, y + 39, x + 286, y + 39, color);
  });

  rect(slide, ctx, 74, 352, 404, 92, "#FFFFFF", C.line);
  text(slide, ctx, s.riskTitle, 104, 374, 180, 22, { size: 16, bold: true });
  s.risks.forEach((label, i) => {
    const x = 284 + i * 46;
    const color = [C.teal, C.blue, C.amber, C.red][i];
    rect(slide, ctx, x, 370, 36, 28, color, "none");
    text(slide, ctx, label, x - 7, 410, 50, 14, { size: 9.5, bold: true, color, align: "center" });
  });

  rect(slide, ctx, 188, 604, 904, 44, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 244, 617, 792, 18, { size: 14.2, bold: true, align: "center" });
  return slide;
}

async function retrieval(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 548, 104, 682, 356);
  rect(slide, ctx, 548, 104, 682, 356, "#F6F8FB3A", "none");
  rect(slide, ctx, 548, 104, 682, 356, "#00000000", C.line);
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 78, 470, 112, { size: 32, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  rect(slide, ctx, 74, 216, 392, 86, C.dark, "none");
  rect(slide, ctx, 74, 216, 5, 86, C.violet, "none");
  text(slide, ctx, s.callout, 104, 245, 300, 24, { size: 18, bold: true, color: "#E5EEF7" });

  s.points.forEach(([head, body], i) => {
    const y = 338 + i * 74;
    const color = [C.teal, C.amber, C.green][i];
    rect(slide, ctx, 74, y, 426, 54, C.panel, C.line);
    rect(slide, ctx, 74, y, 5, 54, color, "none");
    text(slide, ctx, head, 98, y + 13, 142, 18, { size: 14.5, bold: true, color });
    text(slide, ctx, body, 250, y + 10, 210, 28, { size: 10.5, color: C.muted });
  });

  s.loop.forEach((label, i) => {
    const x = 214 + i * 214;
    const color = [C.teal, C.blue, C.amber, C.green][i];
    rect(slide, ctx, x, 574, 136, 38, "#FFFFFF", color);
    text(slide, ctx, label, x + 18, 586, 100, 16, { size: 12.5, bold: true, color, align: "center" });
    if (i < s.loop.length - 1) connector(slide, ctx, x + 136, 593, x + 214, 593, C.teal);
  });

  rect(slide, ctx, 188, 632, 904, 36, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 250, 642, 780, 16, { size: 13.2, bold: true, align: "center" });
  return slide;
}

async function mcp(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 510, 88, 720, 372);
  rect(slide, ctx, 510, 88, 720, 372, "#F6F8FB3A", "none");
  rect(slide, ctx, 510, 88, 720, 372, "#00000000", C.line);
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 78, 530, 112, { size: 32, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  rect(slide, ctx, 74, 218, 390, 100, C.dark, "none");
  rect(slide, ctx, 74, 218, 5, 100, C.amber, "none");
  text(slide, ctx, s.callout, 104, 241, 300, 44, { size: 15.3, bold: true, color: "#E5EEF7" });

  s.pieces.forEach(([head, body], i) => {
    const x = 74 + (i % 2) * 250;
    const y = 356 + Math.floor(i / 2) * 82;
    const color = [C.teal, C.blue, C.amber, C.green][i];
    rect(slide, ctx, x, y, 222, 62, C.panel, C.line);
    rect(slide, ctx, x, y, 5, 62, color, "none");
    text(slide, ctx, head, x + 20, y + 12, 76, 18, { size: 14.5, bold: true, color });
    text(slide, ctx, body, x + 20, y + 34, 172, 18, { size: 9.3, color: C.muted });
  });

  const flow = ["Describe", "Approve", "Invoke", "Return"];
  flow.forEach((label, i) => {
    const x = 188 + i * 226;
    const color = [C.teal, C.amber, C.blue, C.green][i];
    rect(slide, ctx, x, 580, 136, 38, "#FFFFFF", color);
    text(slide, ctx, label, x + 18, 592, 100, 16, { size: 12.5, bold: true, color, align: "center" });
    if (i < flow.length - 1) connector(slide, ctx, x + 136, 599, x + 226, 599, C.teal);
  });

  rect(slide, ctx, 188, 638, 904, 36, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 246, 648, 786, 16, { size: 13.2, bold: true, align: "center" });
  return slide;
}

async function workflowAgent(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 540, 94, 690, 358);
  rect(slide, ctx, 540, 94, 690, 358, "#F6F8FB36", "none");
  rect(slide, ctx, 540, 94, 690, 358, "#00000000", C.line);
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 78, 536, 120, { size: 31, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  rect(slide, ctx, 74, 224, 390, 92, C.dark, "none");
  rect(slide, ctx, 74, 224, 5, 92, C.amber, "none");
  text(slide, ctx, s.callout, 104, 252, 300, 30, { size: 17, bold: true, color: "#E5EEF7" });

  s.choices.forEach(([head, tag, body], i) => {
    const y = 354 + i * 104;
    const color = [C.blue, C.teal][i];
    rect(slide, ctx, 74, y, 430, 76, C.panel, C.line);
    rect(slide, ctx, 74, y, 5, 76, color, "none");
    text(slide, ctx, head, 100, y + 15, 132, 20, { size: 17, bold: true, color });
    text(slide, ctx, tag, 245, y + 17, 110, 16, { size: 11, bold: true, color });
    text(slide, ctx, body, 100, y + 43, 340, 20, { size: 10.8, color: C.muted });
  });

  s.questions.forEach((question, i) => {
    const x = 196 + i * 296;
    const color = [C.blue, C.teal, C.amber][i];
    rect(slide, ctx, x, 574, 196, 42, "#FFFFFF", color);
    text(slide, ctx, question, x + 14, 587, 168, 16, { size: 11.3, bold: true, color, align: "center" });
  });

  rect(slide, ctx, 188, 638, 904, 36, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 246, 648, 786, 16, { size: 13.2, bold: true, align: "center" });
  return slide;
}

async function modes(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 520, 90, 710, 360);
  rect(slide, ctx, 520, 90, 710, 360, "#F6F8FB32", "none");
  rect(slide, ctx, 520, 90, 710, 360, "#00000000", C.line);
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 78, 520, 92, { size: 34, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  rect(slide, ctx, 74, 210, 390, 88, C.dark, "none");
  rect(slide, ctx, 74, 210, 5, 88, C.amber, "none");
  text(slide, ctx, s.callout, 104, 236, 300, 30, { size: 17, bold: true, color: "#E5EEF7" });

  s.modes.forEach(([head, tag, body], i) => {
    const y = 332 + i * 62;
    const color = [C.blue, C.teal, C.amber, C.violet][i];
    rect(slide, ctx, 74, y, 436, 48, C.panel, C.line);
    rect(slide, ctx, 74, y, 5, 48, color, "none");
    text(slide, ctx, head, 98, y + 12, 64, 17, { size: 14.5, bold: true, color });
    text(slide, ctx, tag, 172, y + 13, 108, 14, { size: 10.2, bold: true, color });
    text(slide, ctx, body, 292, y + 9, 178, 24, { size: 9.6, color: C.muted });
  });

  s.checks.forEach((check, i) => {
    const x = 214 + i * 284;
    const color = [C.blue, C.teal, C.amber][i];
    rect(slide, ctx, x, 586, 172, 38, "#FFFFFF", color);
    text(slide, ctx, check, x + 16, 598, 140, 16, { size: 11.8, bold: true, color, align: "center" });
  });

  rect(slide, ctx, 188, 642, 904, 32, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 260, 650, 760, 14, { size: 13.2, bold: true, align: "center" });
  return slide;
}

async function taskFit(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 562, 88, 650, 330);
  rect(slide, ctx, 562, 88, 650, 330, "#00000000", C.line);
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 78, 515, 92, { size: 33, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  rect(slide, ctx, 74, 212, 420, 88, C.dark, "none");
  rect(slide, ctx, 74, 212, 5, 88, C.amber, "none");
  text(slide, ctx, s.callout, 104, 236, 322, 34, { size: 17, bold: true, color: "#E5EEF7" });

  text(slide, ctx, s.fitTitle, 84, 332, 300, 22, { size: 18, bold: true, color: C.green });
  s.fit.forEach(([head, body], i) => {
    const y = 370 + i * 58;
    rect(slide, ctx, 74, y, 458, 46, C.panel, C.line);
    rect(slide, ctx, 74, y, 5, 46, [C.green, C.teal, C.blue][i], "none");
    text(slide, ctx, head, 98, y + 10, 118, 16, { size: 13, bold: true, color: [C.green, C.teal, C.blue][i] });
    text(slide, ctx, body, 228, y + 8, 260, 24, { size: 10.2, color: C.muted });
  });

  rect(slide, ctx, 590, 456, 254, 118, "#FFF7ED", C.amber);
  text(slide, ctx, s.badTitle, 614, 478, 196, 20, { size: 16, bold: true, color: C.amber });
  s.bad.forEach((item, i) => {
    text(slide, ctx, item, 614, 512 + i * 22, 196, 16, { size: 10.8, color: C.ink, bold: i === 0 });
  });

  s.split.forEach((item, i) => {
    const x = 872 + i * 105;
    const color = [C.green, C.teal, C.blue][i];
    rect(slide, ctx, x, 462, 92, 88, "#FFFFFF", color);
    text(slide, ctx, String(i + 1).padStart(2, "0"), x + 14, 478, 64, 16, { size: 11, bold: true, color });
    text(slide, ctx, item, x + 14, 508, 64, 24, { size: 12, bold: true, color: C.ink, align: "center" });
  });

  rect(slide, ctx, 188, 642, 904, 32, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 262, 650, 756, 14, { size: 13.2, bold: true, align: "center" });
  return slide;
}

async function steering(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 548, 84, 664, 314);
  rect(slide, ctx, 548, 84, 664, 314, "#00000000", C.line);
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 78, 520, 96, { size: 33, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  rect(slide, ctx, 74, 216, 420, 90, C.dark, "none");
  rect(slide, ctx, 74, 216, 5, 90, C.amber, "none");
  text(slide, ctx, s.callout, 104, 239, 320, 36, { size: 17, bold: true, color: "#E5EEF7" });

  s.steps.forEach(([head, body], i) => {
    const x = 76 + i * 287;
    const color = [C.blue, C.teal, C.amber, C.green][i];
    rect(slide, ctx, x, 442, 218, 84, C.panel, C.line);
    rect(slide, ctx, x, 442, 5, 84, color, "none");
    text(slide, ctx, String(i + 1).padStart(2, "0"), x + 22, 456, 42, 16, { size: 10.5, bold: true, color });
    text(slide, ctx, head, x + 22, 478, 92, 22, { size: 18, bold: true, color });
    text(slide, ctx, body, x + 116, 464, 78, 44, { size: 9.8, color: C.muted });
    if (i < s.steps.length - 1) connector(slide, ctx, x + 218, 484, x + 287, 484, C.teal);
  });

  text(slide, ctx, "Interrupt when you see:", 90, 346, 200, 20, { size: 15.5, bold: true, color: C.ink });
  s.signals.forEach((signal, i) => {
    const x = 90 + i * 108;
    rect(slide, ctx, x, 374, 92, 30, "#FFFFFF", [C.blue, C.teal, C.amber, C.red][i]);
    text(slide, ctx, signal, x + 8, 384, 76, 10, { size: 8.8, bold: true, color: [C.blue, C.teal, C.amber, C.red][i], align: "center" });
  });

  rect(slide, ctx, 188, 642, 904, 32, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 300, 650, 680, 14, { size: 13.2, bold: true, align: "center" });
  return slide;
}

async function failures(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 542, 86, 674, 318);
  rect(slide, ctx, 542, 86, 674, 318, "#00000000", C.line);
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 80, 500, 82, { size: 34, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  rect(slide, ctx, 74, 208, 420, 88, C.dark, "none");
  rect(slide, ctx, 74, 208, 5, 88, C.amber, "none");
  text(slide, ctx, s.callout, 104, 232, 322, 36, { size: 16.5, bold: true, color: "#E5EEF7" });

  s.failures.forEach(([head, body], i) => {
    const x = 74 + i * 222;
    const y = 440;
    const color = [C.red, C.amber, C.violet, C.blue, C.green][i];
    rect(slide, ctx, x, y, 184, 78, C.panel, C.line);
    rect(slide, ctx, x, y, 5, 78, color, "none");
    text(slide, ctx, head, x + 20, y + 14, 142, 18, { size: 15, bold: true, color });
    text(slide, ctx, body, x + 20, y + 42, 136, 22, { size: 9.8, color: C.muted });
  });

  text(slide, ctx, "Ask before you trust it:", 88, 332, 230, 20, { size: 15.5, bold: true, color: C.ink });
  s.questions.forEach((question, i) => {
    const x = 88 + i * 112;
    const color = [C.blue, C.teal, C.amber, C.red][i];
    rect(slide, ctx, x, 362, 96, 34, "#FFFFFF", color);
    text(slide, ctx, question, x + 8, 374, 80, 10, { size: 8.8, bold: true, color, align: "center" });
  });

  rect(slide, ctx, 188, 642, 904, 32, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 300, 650, 680, 14, { size: 13.2, bold: true, align: "center" });
  return slide;
}

async function teamSetup(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 550, 86, 662, 318);
  rect(slide, ctx, 550, 86, 662, 318, "#00000000", C.line);
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 80, 520, 88, { size: 34, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  rect(slide, ctx, 74, 210, 420, 88, C.dark, "none");
  rect(slide, ctx, 74, 210, 5, 88, C.amber, "none");
  text(slide, ctx, s.callout, 104, 234, 320, 34, { size: 17, bold: true, color: "#E5EEF7" });

  s.items.forEach(([head, body], i) => {
    const y = 342 + i * 56;
    const color = [C.blue, C.teal, C.green, C.amber][i];
    rect(slide, ctx, 74, y, 482, 44, C.panel, C.line);
    rect(slide, ctx, 74, y, 5, 44, color, "none");
    text(slide, ctx, head, 98, y + 10, 112, 16, { size: 13.2, bold: true, color });
    text(slide, ctx, body, 226, y + 8, 290, 22, { size: 9.7, color: C.muted });
  });

  text(slide, ctx, "Good places for durable rules:", 618, 440, 320, 20, { size: 15.5, bold: true, color: C.ink });
  s.homes.forEach((home, i) => {
    const x = 618 + i * 184;
    const color = [C.blue, C.teal, C.violet][i];
    rect(slide, ctx, x, 474, 154, 44, "#FFFFFF", color);
    text(slide, ctx, home, x + 12, 490, 130, 12, { size: 9.8, bold: true, color, align: "center" });
  });

  rect(slide, ctx, 188, 642, 904, 32, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 300, 650, 680, 14, { size: 13.2, bold: true, align: "center" });
  return slide;
}

async function checklist(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 548, 86, 664, 318);
  rect(slide, ctx, 548, 86, 664, 318, "#00000000", C.line);
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 80, 520, 88, { size: 34, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  rect(slide, ctx, 74, 210, 420, 88, C.dark, "none");
  rect(slide, ctx, 74, 210, 5, 88, C.amber, "none");
  text(slide, ctx, s.callout, 104, 237, 320, 32, { size: 17, bold: true, color: "#E5EEF7" });

  s.phases.forEach(([head, tag, items], i) => {
    const x = 74 + i * 385;
    const color = [C.blue, C.teal, C.green][i];
    rect(slide, ctx, x, 436, 306, 142, C.panel, C.line);
    rect(slide, ctx, x, 436, 5, 142, color, "none");
    text(slide, ctx, head, x + 24, 456, 120, 24, { size: 21, bold: true, color });
    text(slide, ctx, tag, x + 160, 461, 110, 14, { size: 10.5, bold: true, color });
    items.forEach((item, j) => {
      text(slide, ctx, "[ ]", x + 26, 502 + j * 25, 28, 14, { size: 10.5, mono: true, color: C.soft });
      text(slide, ctx, item, x + 62, 500 + j * 25, 178, 16, { size: 11.8, bold: true, color: C.ink });
    });
  });

  rect(slide, ctx, 188, 642, 904, 32, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 316, 650, 648, 14, { size: 13.2, bold: true, align: "center" });
  return slide;
}

async function exercise(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  await image(slide, ctx, s.image, 548, 86, 664, 318);
  rect(slide, ctx, 548, 86, 664, 318, "#00000000", C.line);
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 80, 520, 88, { size: 34, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s.source, n);

  rect(slide, ctx, 74, 210, 420, 88, C.dark, "none");
  rect(slide, ctx, 74, 210, 5, 88, C.amber, "none");
  text(slide, ctx, s.callout, 104, 234, 320, 34, { size: 17, bold: true, color: "#E5EEF7" });

  text(slide, ctx, "Vague ask", 74, 428, 160, 22, { size: 17, bold: true, color: C.red });
  codePanel(slide, ctx, 74, 462, 300, 74, s.vague);

  s.blanks.forEach((item, i) => {
    const x = 410 + (i % 3) * 94;
    const y = i < 3 ? 454 : 516;
    const color = [C.blue, C.teal, C.green, C.amber, C.violet][i];
    rect(slide, ctx, x, y, 78, 38, "#FFFFFF", color);
    text(slide, ctx, item, x + 8, y + 13, 62, 10, { size: 9.4, bold: true, color, align: "center" });
  });
  connector(slide, ctx, 380, 499, 404, 499, C.teal);
  connector(slide, ctx, 686, 499, 716, 499, C.teal);

  text(slide, ctx, "Agent-ready task", 724, 428, 220, 22, { size: 17, bold: true, color: C.green });
  codePanel(slide, ctx, 724, 462, 430, 112, s.improved);

  rect(slide, ctx, 188, 642, 904, 32, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 330, 650, 620, 14, { size: 13.2, bold: true, align: "center" });
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
