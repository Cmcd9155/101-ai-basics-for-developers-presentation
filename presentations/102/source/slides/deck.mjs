import fs from "node:fs";
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
  teal: "#0E9F9A",
  blue: "#2563EB",
  amber: "#F59E0B",
  red: "#DC2626",
  green: "#16A34A",
  code: "#0B1220",
};

const sourceLabels = {
  vscodeInstructions: "VS Code Docs: Copilot custom instructions",
  ghCustomization: "GitHub Docs: customizing Copilot responses",
  ghCheatSheet: "GitHub Docs: Copilot customization cheat sheet",
  pocockSkills: "Matt Pocock skills repo: diagnose skill",
};

const FONT_SCALE = 1.12;

function fontSize(size) {
  return Math.round(size * FONT_SCALE * 10) / 10;
}

const slides = [
  {
    type: "cover",
    kicker: "AI BASICS 102",
    title: "Agent Harnesses",
    subtitle: "How teams keep Copilot useful, bounded, and reviewable.",
    image: "hero-agent-harnesses.png",
    footer: "20 minutes | VS Code + GitHub Copilot framing",
  },
  {
    type: "splitClaim",
    kicker: "Prompting is not enough",
    title: "A good prompt helps once. A harness helps every session.",
    image: "prompt-to-harness.png",
    callout: "The repo should carry the rules, checks, and habits the agent should not rediscover.",
    left: ["One session", "Prompt, context, and steering."],
    right: ["Every session", "Instructions, skills, scripts, checks, and review habits."],
    rule: "The goal is not more trust. The goal is more inspectable work.",
  },
  {
    type: "model",
    kicker: "The harness model",
    title: "Use four pieces: rules, moves, tools, checks.",
    image: "rules-moves-tools-checks.png",
    parts: [
      ["Rules", "Standing instructions and boundaries.", C.teal],
      ["Moves", "Skills, playbooks, and team procedures.", C.blue],
      ["Tools", "Scripts, commands, and controlled capabilities.", C.amber],
      ["Checks", "Tests, lint reports, diagnostics, and review.", C.green],
    ],
    callout: "A harness is the system around Copilot, not one magic prompt.",
  },
  {
    type: "instruction",
    kicker: "Rules: Copilot instructions",
    title: "Repo instructions are standing orders.",
    image: "copilot-instructions-operating-manual.png",
    source: "vscodeInstructions, ghCustomization",
    fileLabel: ".github/copilot-instructions.md",
    callout: "Write the rules the agent should not guess every time.",
    rows: [
      ["Commands", "Install, build, lint, test, and local checks."],
      ["Conventions", "Patterns, helpers, naming, errors, and logging."],
      ["Boundaries", "Risky paths, APIs, secrets, migrations, and deploys."],
      ["Done", "Required checks before Copilot says complete."],
    ],
  },
  {
    type: "boundary",
    kicker: "Rules: boundaries and blast radius",
    title: "Different actions deserve different permission.",
    image: "blast-radius-boundaries.png",
    levels: [
      ["Read", "Files, docs, logs, issues.", C.teal],
      ["Edit", "Local code, tests, docs.", C.blue],
      ["Run", "Allowlisted commands.", C.amber],
      ["Ship", "Deploys, data, merges.", C.red],
    ],
    buckets: [
      ["Allowed", "Read code, inspect tests, update focused local files."],
      ["Ask first", "Install packages, delete files, migrations, or public API changes."],
      ["Never alone", "Secrets, production data, releases, or protected branches."],
    ],
    rule: "Boundaries make Copilot safer and make the search space smaller.",
  },
  {
    type: "skills",
    kicker: "Moves: skills and playbooks",
    title: "Skills teach repeatable moves.",
    image: "skills-playbooks.png",
    source: "ghCheatSheet, pocockSkills",
    callout: "Instructions define the rules. Skills define the moves.",
    examples: [
      ["Before coding", "Stress-test the plan, scope, and missing evidence."],
      ["After coding", "Diagnose the generated feature and hunt for bugs."],
      ["During review", "Check auth, UI, migrations, or release notes with the team recipe."],
    ],
    names: ["grill-me", "diagnose", "review-auth", "ui-smoke"],
  },
  {
    type: "teamHabits",
    kicker: "Moves: team habits",
    title: "A harness captures how your team works.",
    image: "team-habits.png",
    habits: [
      ["Bug triage", "Start with evidence, owner, repro, and one likely surface."],
      ["Migration safety", "Dry-run first. Human approval before data-changing commands."],
      ["UI testing", "Run the app, inspect the screen, capture the visual result."],
      ["PR review", "Summarize evidence, behavior changes, checks, and risk."],
    ],
    rule: "If the team repeats a move, make it part of the harness.",
  },
  {
    type: "scripts",
    kicker: "Tools: scripts agents can run",
    title: "Give Copilot safe paths through verification.",
    image: "runnable-scripts.png",
    callout: "A named script is better than asking the agent to invent the right command.",
    commands: [
      ["test:changed", "Run only tests related to changed files."],
      ["agent:verify", "Bundle typecheck, lint report, tests, and smoke checks."],
      ["smoke:local", "Open the app path and confirm the main behavior still works."],
      ["check:pr", "Collect review evidence before merging."],
    ],
  },
  {
    type: "softChecks",
    kicker: "Soft checks",
    title: "Warnings can be a useful middle ground.",
    image: "soft-checks.png",
    callout: "Not every repo has hard lint gates. Agents still need feedback.",
    contrast: [
      ["Hard gate", "Blocks merge when the repo already enforces the rule."],
      ["Soft report", "Returns warnings so Copilot can fix obvious issues without stopping."],
    ],
    examples: ["unused code", "unsafe any", "a11y hints", "slow tests", "wide diff"],
    rule: "A soft check is not permission to ignore quality. It is a way to surface quality earlier.",
  },
  {
    type: "postReview",
    kicker: "Checks: after generation",
    title: "Inspect before review.",
    image: "post-generation-review.png",
    steps: [
      ["Generate", "Copilot edits code inside the task boundary."],
      ["Run checks", "Changed tests, soft lint, typecheck, and smoke commands."],
      ["Diagnose", "Use a review or debug skill to look for likely bugs."],
      ["Report", "Evidence, changes, checks, gaps, and risk."],
    ],
    rule: "Human review starts from evidence, not from a confident summary.",
  },
  {
    type: "learning",
    kicker: "The harness learning loop",
    title: "When Copilot fails, improve the harness.",
    image: "harness-learning-loop.png",
    loop: ["Failure", "Cause", "Harness fix", "Next session"],
    fixes: [
      ["Missing context", "Add an instruction or path rule."],
      ["Wrong command", "Add or document a script."],
      ["Weak proof", "Add a focused test or smoke check."],
      ["Bad review", "Add checklist or diagnostic skill."],
    ],
    rule: "Do not only fix the prompt. Fix the system that shaped the prompt.",
  },
  {
    type: "conclusion",
    kicker: "Conclusion",
    title: "Make AI work inspectable.",
    image: "inspectable-work.png",
    points: [
      ["Bounded", "Instructions and permissions define the work area."],
      ["Visible", "Skills and scripts expose the path the agent followed."],
      ["Checkable", "Tests, soft reports, diagnostics, and review prove the work."],
    ],
    quote: "The goal is not to trust Copilot more. The goal is to make the work easier to inspect.",
  },
  {
    type: "appendix",
    kicker: "Presenter appendix",
    title: "Fidelity Tasks VS Code demo cue",
    callout: "Open the Fidelity Tasks repo and show the harness parts in this order.",
    steps: [
      ["Rules", "Copilot instructions and path-specific boundaries."],
      ["Moves", "Skills/playbooks such as planning, grilling, diagnosis, and review."],
      ["Tools", "Changed-test script, heavy soft-lint/report script, and smoke command."],
      ["Checks", "Post-generation diagnostic pass and human review checklist."],
    ],
    footer: "Presenter-only slide. Not included in Ara narration.",
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
    fontSize: fontSize(opts.size ?? 22),
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

async function maybeImage(slide, ctx, file, x, y, w, h, fit = "cover") {
  const imagePath = path.join(ASSET_DIR, file);
  if (file && fs.existsSync(imagePath)) {
    await ctx.addImage(slide, {
      path: imagePath,
      x,
      y,
      w,
      h,
      fit,
      alt: file.replace(/\.[^.]+$/, ""),
    });
    rect(slide, ctx, x, y, w, h, "#F6F8FB4A", "none");
    rect(slide, ctx, x, y, w, h, "#00000000", C.line);
    return;
  }
  rect(slide, ctx, x, y, w, h, "#EEF3F8", C.line);
  rect(slide, ctx, x + 24, y + 24, w - 48, h - 48, "#FFFFFF70", C.line);
  text(slide, ctx, "Image planned", x + 42, y + h / 2 - 32, w - 84, 24, { size: 18, bold: true, color: C.teal, align: "center" });
  text(slide, ctx, file || "concept visual", x + 42, y + h / 2, w - 84, 20, { size: 12, color: C.muted, align: "center" });
}

function bg(slide, ctx) {
  rect(slide, ctx, 0, 0, 1280, 720, C.bg, "none");
  rect(slide, ctx, 0, 0, 1280, 6, C.teal, "none");
  rect(slide, ctx, 1128, 6, 152, 714, "#EFF7F6", "none");
  rect(slide, ctx, 1128, 6, 1, 714, "#D8EDEA", "none");
}

function sourceText(source) {
  return source
    ? source
        .split(",")
        .map((key) => sourceLabels[key.trim()] || key.trim())
        .join(" | ")
    : "102 Agent Harnesses";
}

function footer(slide, ctx, s, n) {
  text(slide, ctx, sourceText(s.source), 54, 684, 960, 16, { size: 8.5, color: C.soft });
  text(slide, ctx, String(n).padStart(2, "0"), 1180, 680, 46, 20, { size: 10, color: C.soft, align: "right", bold: true });
}

function heading(slide, ctx, s, n, width = 820) {
  text(slide, ctx, s.kicker.toUpperCase(), 54, 42, 540, 20, { size: 10.5, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 76, width, 100, { size: 34, bold: true, face: ctx.fonts.title });
  footer(slide, ctx, s, n);
}

function pill(slide, ctx, value, x, y, w, color = C.teal) {
  rect(slide, ctx, x, y, w, 30, "#FFFFFF", color);
  text(slide, ctx, value, x + 12, y + 7, w - 24, 14, { size: 9.5, color, bold: true, align: "center" });
}

function svgDataUrl(svg) {
  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;
}

async function arrow(slide, ctx, x1, y1, x2, y2, color = C.teal) {
  const width = Math.max(18, x2 - x1);
  const height = 18;
  const head = Math.min(10, Math.max(7, width * 0.42));
  const stroke = Math.min(4, Math.max(2.6, width * 0.08));
  const mid = height / 2;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <line x1="1" y1="${mid}" x2="${width - head + 1}" y2="${mid}" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round"/>
  <path d="M ${width - 1} ${mid} L ${width - head} ${mid - head * 0.55} L ${width - head} ${mid + head * 0.55} Z" fill="${color}"/>
</svg>`;
  await ctx.addImage(slide, {
    dataUrl: svgDataUrl(svg),
    x: x1,
    y: y1 - height / 2,
    w: width,
    h: height,
    fit: "fill",
    alt: "direction arrow",
  });
}

function darkCallout(slide, ctx, value, x, y, w, h, accent = C.teal) {
  rect(slide, ctx, x, y, w, h, C.dark, "none");
  rect(slide, ctx, x, y, 5, h, accent, "none");
  text(slide, ctx, value, x + 28, y + Math.max(18, h / 2 - 17), w - 56, 34, { size: 16, bold: true, color: "#E5EEF7", valign: "mid" });
}

function stepBox(slide, ctx, x, y, w, h, label, body, color, index = null) {
  rect(slide, ctx, x, y, w, h, C.panel, C.line);
  rect(slide, ctx, x, y, 5, h, color, "none");
  if (index) text(slide, ctx, String(index).padStart(2, "0"), x + 18, y + 20, 34, 24, { size: 17, bold: true, color });
  const textX = index ? x + 64 : x + 24;
  text(slide, ctx, label, textX, y + 16, w - (textX - x) - 24, 22, { size: 16, bold: true, color });
  text(slide, ctx, body, textX, y + 40, w - (textX - x) - 24, h - 48, { size: 11.2, color: C.muted });
}

function card(slide, ctx, x, y, w, h, headingValue, body, accent = C.teal, opts = {}) {
  rect(slide, ctx, x, y, w, h, C.panel, C.line);
  rect(slide, ctx, x, y, 5, h, accent, "none");
  const padX = opts.padX ?? 22;
  const padTop = opts.padTop ?? 16;
  const gap = opts.gap ?? 8;
  const padBottom = opts.padBottom ?? 26;
  const headingSize = opts.headingSize ?? 17;
  const bodySize = opts.bodySize ?? (h < 86 ? 11 : h < 104 ? 11.4 : 12.2);
  const headingH = opts.headingH ?? Math.max(24, headingSize * 1.45);
  const contentX = x + padX;
  const contentW = w - padX * 2;
  const headingY = y + padTop;
  const bodyY = headingY + headingH + gap;
  const bodyH = Math.max(28, y + h - padBottom - bodyY);
  text(slide, ctx, headingValue, contentX, headingY, contentW, headingH, { size: headingSize, bold: true, color: accent });
  text(slide, ctx, body, contentX, bodyY, contentW, bodyH, { size: bodySize, color: C.muted });
}

function codePanel(slide, ctx, value, x, y, w, h) {
  rect(slide, ctx, x, y, w, h, C.code, "none");
  text(slide, ctx, value, x + 22, y + 20, w - 44, h - 40, { size: 15, color: "#D8E6F3", mono: true });
}

async function cover(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  await maybeImage(slide, ctx, s.image, 0, 0, 1280, 720);
  rect(slide, ctx, 0, 0, 640, 720, "#FFFFFF", "none");
  rect(slide, ctx, 640, 0, 640, 720, "#FFFFFF22", "none");
  rect(slide, ctx, 54, 58, 6, 64, C.teal, "none");
  text(slide, ctx, s.kicker, 78, 60, 420, 18, { size: 10, color: C.teal, bold: true });
  text(slide, ctx, s.title, 54, 176, 620, 120, { size: 58, bold: true, face: ctx.fonts.title });
  text(slide, ctx, s.subtitle, 58, 334, 500, 76, { size: 20, color: C.muted });
  pill(slide, ctx, "Rules", 58, 486, 96, C.teal);
  pill(slide, ctx, "Moves", 168, 486, 96, C.blue);
  pill(slide, ctx, "Tools", 278, 486, 96, C.amber);
  pill(slide, ctx, "Checks", 388, 486, 106, C.green);
  text(slide, ctx, s.footer, 58, 654, 480, 20, { size: 11, color: C.soft });
  text(slide, ctx, String(n).padStart(2, "0"), 1180, 680, 46, 20, { size: 10, color: C.soft, align: "right", bold: true });
  return slide;
}

async function splitClaim(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 650);
  await maybeImage(slide, ctx, s.image, 728, 104, 460, 238);
  rect(slide, ctx, 74, 210, 244, 230, "#FFFFFF", C.line);
  rect(slide, ctx, 74, 210, 5, 230, C.amber, "none");
  text(slide, ctx, "ONE-OFF PROMPT", 104, 236, 160, 18, { size: 10, bold: true, color: C.amber });
  codePanel(slide, ctx, s.left[1], 104, 276, 184, 74);
  text(slide, ctx, "Useful once, then forgotten unless the human repeats it.", 104, 372, 170, 38, { size: 12, color: C.muted });
  await arrow(slide, ctx, 332, 326, 430, 326, C.teal);
  rect(slide, ctx, 444, 188, 218, 292, C.dark, "none");
  rect(slide, ctx, 444, 188, 5, 292, C.teal, "none");
  text(slide, ctx, "REPO HARNESS", 478, 218, 150, 18, { size: 10, bold: true, color: "#8FE7DD" });
  ["Instructions", "Skills", "Scripts", "Checks"].forEach((item, i) => {
    rect(slide, ctx, 478, 260 + i * 44, 142, 24, "#243044", "none");
    text(slide, ctx, item, 494, 266 + i * 44, 110, 12, { size: 9.5, bold: true, color: "#DCE8F2", align: "center" });
  });
  darkCallout(slide, ctx, s.callout, 728, 382, 460, 76, C.teal);
  rect(slide, ctx, 188, 592, 904, 52, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 230, 608, 820, 20, { size: 15.5, bold: true, align: "center" });
  return slide;
}

async function model(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 620);
  await maybeImage(slide, ctx, s.image, 760, 88, 428, 250);
  rect(slide, ctx, 130, 232, 430, 220, "#FFFFFF", C.line);
  rect(slide, ctx, 290, 294, 110, 86, C.dark, "none");
  text(slide, ctx, "HARNESS", 308, 325, 74, 16, { size: 12, bold: true, color: "#DCE8F2", align: "center" });
  const partPositions = [
    [64, 196],
    [438, 196],
    [64, 402],
    [438, 402],
  ];
  for (let i = 0; i < s.parts.length; i += 1) {
    const [head, body, color] = s.parts[i];
    const [x, y] = partPositions[i];
    stepBox(slide, ctx, x, y, 210, 92, head, body, color);
    if (x < 300) await arrow(slide, ctx, x + 210, y + 46, 300, y + 46, color);
    else await arrow(slide, ctx, 402, y + 46, x, y + 46, color);
  }
  darkCallout(slide, ctx, s.callout, 760, 392, 428, 88, C.teal);
  return slide;
}

async function instruction(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 540);
  await maybeImage(slide, ctx, s.image, 620, 84, 610, 330);
  codePanel(slide, ctx, s.fileLabel, 74, 198, 430, 62);
  darkCallout(slide, ctx, s.callout, 74, 286, 430, 76, C.teal);
  s.rows.forEach(([head, body], i) => {
    stepBox(slide, ctx, 74 + (i % 2) * 276, 404 + Math.floor(i / 2) * 104, 254, 90, head, body, [C.teal, C.blue, C.amber, C.green][i], i + 1);
  });
  return slide;
}

async function boundary(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 560);
  await maybeImage(slide, ctx, s.image, 700, 82, 488, 286);
  for (let i = 0; i < s.levels.length; i += 1) {
    const [head, body, color] = s.levels[i];
    const x = 74 + i * 148;
    rect(slide, ctx, x, 232, 126, 74, "#FFFFFF", color);
    text(slide, ctx, head, x + 16, 250, 94, 20, { size: 16, bold: true, color, align: "center" });
    text(slide, ctx, body, x + 14, 276, 98, 18, { size: 8.4, color: C.muted, align: "center" });
    if (i < s.levels.length - 1) await arrow(slide, ctx, x + 126, 269, x + 148, 269, color);
  }
  s.buckets.forEach(([head, body], i) => card(slide, ctx, 74 + i * 376, 426, 320, 104, head, body, [C.green, C.amber, C.red][i]));
  rect(slide, ctx, 188, 606, 904, 44, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 250, 619, 780, 18, { size: 14.5, bold: true, align: "center" });
  return slide;
}

async function skills(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 540);
  await maybeImage(slide, ctx, s.image, 692, 86, 496, 286);
  darkCallout(slide, ctx, s.callout, 74, 206, 460, 78, C.blue);
  s.examples.forEach(([head, body], i) => {
    const y = 330 + i * 80;
    stepBox(slide, ctx, 74, y, 460, 64, head, body, [C.teal, C.blue, C.green][i]);
  });
  s.names.forEach((item, i) => pill(slide, ctx, item, 688 + i * 120, 438, 102, [C.teal, C.blue, C.amber, C.green][i]));
  rect(slide, ctx, 690, 492, 498, 58, "#FFFFFF", C.line);
  text(slide, ctx, "Skills should be named, repeatable, and narrow enough to review.", 724, 509, 430, 28, { size: 14, bold: true, color: C.ink, align: "center" });
  return slide;
}

async function teamHabits(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 560);
  await maybeImage(slide, ctx, s.image, 626, 82, 604, 318);
  s.habits.forEach(([head, body], i) => card(slide, ctx, 74 + (i % 2) * 280, 210 + Math.floor(i / 2) * 124, 246, 96, head, body, [C.teal, C.blue, C.amber, C.green][i]));
  rect(slide, ctx, 188, 604, 904, 44, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 280, 617, 720, 18, { size: 14.5, bold: true, align: "center" });
  return slide;
}

async function scripts(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 540);
  await maybeImage(slide, ctx, s.image, 660, 96, 528, 246);
  darkCallout(slide, ctx, s.callout, 74, 204, 468, 78, C.amber);
  s.commands.forEach(([command, body], i) => {
    const y = 320 + i * 66;
    rect(slide, ctx, 74, y, 760, 54, i % 2 ? "#F8FAFC" : C.panel, C.line);
    rect(slide, ctx, 74, y, 5, 54, [C.teal, C.blue, C.amber, C.green][i], "none");
    text(slide, ctx, `npm run ${command}`, 104, y + 19, 178, 16, { size: 11.2, color: [C.teal, C.blue, C.amber, C.green][i], bold: true, mono: true });
    text(slide, ctx, body, 318, y + 13, 440, 24, { size: 11.2, color: C.muted });
  });
  return slide;
}

async function softChecks(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 560);
  await maybeImage(slide, ctx, s.image, 684, 86, 504, 280);
  darkCallout(slide, ctx, s.callout, 74, 210, 460, 76, C.amber);
  s.contrast.forEach(([head, body], i) => card(slide, ctx, 74 + i * 252, 326, 222, 112, head, body, [C.red, C.green][i]));
  text(slide, ctx, "Typical soft reports", 74, 484, 220, 18, { size: 12, bold: true, color: C.muted });
  s.examples.forEach((item, i) => pill(slide, ctx, item, 74 + i * 142, 514, 112, [C.teal, C.blue, C.amber, C.blue, C.green][i]));
  rect(slide, ctx, 188, 606, 904, 44, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 236, 619, 808, 18, { size: 13.5, bold: true, align: "center" });
  return slide;
}

async function postReview(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 650);
  await maybeImage(slide, ctx, s.image, 648, 84, 540, 286);
  for (let i = 0; i < s.steps.length; i += 1) {
    const [head, body] = s.steps[i];
    const x = 74 + i * 276;
    const y = 470;
    stepBox(slide, ctx, x, y, 232, 92, head, body, [C.teal, C.blue, C.amber, C.green][i], i + 1);
    if (i < s.steps.length - 1) await arrow(slide, ctx, x + 232, y + 46, x + 276, y + 46, C.teal);
  }
  darkCallout(slide, ctx, s.rule, 74, 214, 480, 90, C.green);
  return slide;
}

async function learning(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 540);
  await maybeImage(slide, ctx, s.image, 690, 86, 498, 280);
  for (let i = 0; i < s.loop.length; i += 1) {
    const item = s.loop[i];
    const x = 74 + i * 138;
    rect(slide, ctx, x, 224, 108, 58, "#FFFFFF", [C.red, C.amber, C.teal, C.green][i]);
    text(slide, ctx, item, x + 10, 245, 88, 16, { size: 12.5, bold: true, color: [C.red, C.amber, C.teal, C.green][i], align: "center" });
    if (i < s.loop.length - 1) await arrow(slide, ctx, x + 108, 253, x + 138, 253, C.teal);
  }
  s.fixes.forEach(([head, body], i) => stepBox(slide, ctx, 74 + (i % 2) * 268, 318 + Math.floor(i / 2) * 104, 230, 86, head, body, [C.teal, C.blue, C.amber, C.green][i]));
  rect(slide, ctx, 188, 606, 904, 44, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 260, 619, 760, 18, { size: 14.5, bold: true, align: "center" });
  return slide;
}

async function conclusion(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 520);
  await maybeImage(slide, ctx, s.image, 610, 86, 620, 332);
  s.points.forEach(([head, body], i) => card(slide, ctx, 74, 218 + i * 106, 430, 82, head, body, [C.teal, C.blue, C.green][i]));
  rect(slide, ctx, 188, 584, 904, 64, C.dark, "none");
  rect(slide, ctx, 188, 584, 5, 64, C.teal, "none");
  text(slide, ctx, s.quote, 232, 604, 816, 24, { size: 17, bold: true, color: "#E5EEF7", align: "center" });
  return slide;
}

async function appendix(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 780);
  rect(slide, ctx, 74, 184, 1132, 72, C.dark, "none");
  rect(slide, ctx, 74, 184, 5, 72, C.teal, "none");
  text(slide, ctx, s.callout, 104, 206, 930, 24, { size: 18, bold: true, color: "#E5EEF7" });
  s.steps.forEach(([head, body], i) => card(slide, ctx, 96 + (i % 2) * 554, 296 + Math.floor(i / 2) * 124, 488, 96, head, body, [C.teal, C.blue, C.amber, C.green][i]));
  text(slide, ctx, s.footer, 96, 648, 900, 18, { size: 12, color: C.muted });
  return slide;
}

const renderers = {
  cover,
  splitClaim,
  model,
  instruction,
  boundary,
  skills,
  teamHabits,
  scripts,
  softChecks,
  postReview,
  learning,
  conclusion,
  appendix,
};

export async function renderSlide(presentation, ctx, number) {
  const s = slides[number - 1];
  if (!s) throw new Error(`No slide configured for ${number}`);
  const renderer = renderers[s.type];
  if (!renderer) throw new Error(`No renderer for ${s.type}`);
  return renderer(presentation, ctx, s, number);
}

export { slides };
