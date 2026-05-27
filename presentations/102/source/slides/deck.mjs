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
  violet: "#7C3AED",
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
      ["Commands", "Package manager, install, build, lint, test, and safe local checks."],
      ["Conventions", "Architecture patterns, preferred helpers, naming, errors, and logging."],
      ["Boundaries", "Generated files, risky paths, public APIs, secrets, migrations, and deploys."],
      ["Done", "What must be verified before Copilot says the work is complete."],
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
      ["Ask first", "Install packages, delete files, run migrations, change public APIs."],
      ["Never alone", "Touch secrets, production data, releases, or protected branches."],
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
      ["PR review", "Summarize evidence, changed behavior, checks, and remaining risk."],
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
      ["agent:verify", "Bundle typecheck, lint report, focused tests, and smoke checks."],
      ["smoke:local", "Open the app path and confirm the main behavior still works."],
      ["check:pr", "Collect the review evidence a human needs before merging."],
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
      ["Soft report", "Returns warnings so Copilot can fix obvious issues without stopping the whole session."],
    ],
    examples: ["unused code", "unsafe any", "accessibility hints", "slow tests", "wide diff"],
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
      ["Bad review", "Add a checklist or diagnostic skill."],
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

function card(slide, ctx, x, y, w, h, headingValue, body, accent = C.teal) {
  rect(slide, ctx, x, y, w, h, C.panel, C.line);
  rect(slide, ctx, x, y, 5, h, accent, "none");
  const isCompact = h < 76;
  const headingY = isCompact ? y + 12 : y + 18;
  const bodyY = isCompact ? y + 40 : y + 48;
  const bodySize = isCompact ? 10.8 : h < 92 ? 11.7 : 12.5;
  text(slide, ctx, headingValue, x + 22, headingY, w - 44, 24, { size: 17, bold: true, color: accent });
  text(slide, ctx, body, x + 22, bodyY, w - 44, Math.max(22, h - (bodyY - y) - 10), { size: bodySize, color: C.muted });
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
  heading(slide, ctx, s, n, 620);
  await maybeImage(slide, ctx, s.image, 690, 88, 540, 308);
  codePanel(slide, ctx, s.callout, 74, 214, 520, 96);
  card(slide, ctx, 74, 356, 244, 112, s.left[0], s.left[1], C.amber);
  card(slide, ctx, 350, 356, 244, 112, s.right[0], s.right[1], C.green);
  rect(slide, ctx, 188, 592, 904, 52, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 230, 608, 820, 20, { size: 15.5, bold: true, align: "center" });
  return slide;
}

async function model(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 590);
  await maybeImage(slide, ctx, s.image, 678, 86, 552, 330);
  s.parts.forEach(([head, body, color], i) => {
    const x = 74 + (i % 2) * 268;
    const y = 220 + Math.floor(i / 2) * 132;
    card(slide, ctx, x, y, 228, 98, head, body, color);
  });
  rect(slide, ctx, 690, 470, 540, 86, C.dark, "none");
  rect(slide, ctx, 690, 470, 5, 86, C.teal, "none");
  text(slide, ctx, s.callout, 720, 495, 460, 34, { size: 17, bold: true, color: "#E5EEF7" });
  return slide;
}

async function instruction(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 540);
  await maybeImage(slide, ctx, s.image, 620, 84, 610, 330);
  codePanel(slide, ctx, s.fileLabel, 74, 204, 460, 68);
  rect(slide, ctx, 74, 302, 460, 76, C.dark, "none");
  rect(slide, ctx, 74, 302, 5, 76, C.teal, "none");
  text(slide, ctx, s.callout, 104, 323, 360, 30, { size: 16, bold: true, color: "#E5EEF7" });
  s.rows.forEach(([head, body], i) => card(slide, ctx, 74 + (i % 2) * 286, 424 + Math.floor(i / 2) * 104, 244, 88, head, body, [C.teal, C.blue, C.amber, C.green][i]));
  return slide;
}

async function boundary(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 560);
  await maybeImage(slide, ctx, s.image, 650, 82, 580, 320);
  s.levels.forEach(([head, body, color], i) => {
    const x = 74 + i * 132;
    rect(slide, ctx, x, 224, 108, 78, "#FFFFFF", color);
    text(slide, ctx, head, x + 16, 244, 76, 20, { size: 16, bold: true, color, align: "center" });
    text(slide, ctx, body, x + 12, 270, 84, 18, { size: 8.5, color: C.muted, align: "center" });
  });
  s.buckets.forEach(([head, body], i) => card(slide, ctx, 74 + i * 386, 446, 330, 92, head, body, [C.green, C.amber, C.red][i]));
  rect(slide, ctx, 188, 606, 904, 44, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 250, 619, 780, 18, { size: 14.5, bold: true, align: "center" });
  return slide;
}

async function skills(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 540);
  await maybeImage(slide, ctx, s.image, 630, 86, 600, 330);
  rect(slide, ctx, 74, 214, 460, 88, C.dark, "none");
  rect(slide, ctx, 74, 214, 5, 88, C.blue, "none");
  text(slide, ctx, s.callout, 104, 242, 360, 28, { size: 17, bold: true, color: "#E5EEF7" });
  s.examples.forEach(([head, body], i) => card(slide, ctx, 74, 328 + i * 86, 460, 70, head, body, [C.teal, C.blue, C.green][i]));
  s.names.forEach((item, i) => pill(slide, ctx, item, 690 + i * 128, 500, 106, [C.teal, C.blue, C.violet, C.green][i]));
  return slide;
}

async function teamHabits(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 560);
  await maybeImage(slide, ctx, s.image, 626, 82, 604, 318);
  s.habits.forEach(([head, body], i) => card(slide, ctx, 74 + (i % 2) * 280, 218 + Math.floor(i / 2) * 114, 246, 84, head, body, [C.teal, C.blue, C.amber, C.green][i]));
  rect(slide, ctx, 188, 604, 904, 44, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 280, 617, 720, 18, { size: 14.5, bold: true, align: "center" });
  return slide;
}

async function scripts(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 540);
  await maybeImage(slide, ctx, s.image, 626, 84, 604, 320);
  rect(slide, ctx, 74, 210, 468, 82, C.dark, "none");
  rect(slide, ctx, 74, 210, 5, 82, C.amber, "none");
  text(slide, ctx, s.callout, 104, 236, 360, 26, { size: 16, bold: true, color: "#E5EEF7" });
  s.commands.forEach(([command, body], i) => {
    const y = 324 + i * 68;
    rect(slide, ctx, 74, y, 468, 56, C.panel, C.line);
    text(slide, ctx, `npm run ${command}`, 98, y + 18, 142, 16, { size: 11.5, color: [C.teal, C.blue, C.amber, C.green][i], bold: true, mono: true });
    text(slide, ctx, body, 260, y + 12, 242, 32, { size: 10.8, color: C.muted });
  });
  return slide;
}

async function softChecks(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 560);
  await maybeImage(slide, ctx, s.image, 640, 84, 590, 320);
  rect(slide, ctx, 74, 212, 460, 80, C.dark, "none");
  rect(slide, ctx, 74, 212, 5, 80, C.amber, "none");
  text(slide, ctx, s.callout, 104, 238, 350, 24, { size: 16, bold: true, color: "#E5EEF7" });
  s.contrast.forEach(([head, body], i) => card(slide, ctx, 74 + i * 250, 334, 216, 96, head, body, [C.red, C.green][i]));
  s.examples.forEach((item, i) => pill(slide, ctx, item, 104 + i * 148, 502, 116, [C.teal, C.blue, C.amber, C.violet, C.green][i]));
  rect(slide, ctx, 188, 606, 904, 44, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 236, 619, 808, 18, { size: 13.5, bold: true, align: "center" });
  return slide;
}

async function postReview(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 650);
  await maybeImage(slide, ctx, s.image, 650, 82, 580, 320);
  s.steps.forEach(([head, body], i) => {
    const x = 74 + i * 286;
    const y = 474;
    card(slide, ctx, x, y, 244, 82, head, body, [C.teal, C.blue, C.amber, C.green][i]);
    if (i < s.steps.length - 1) text(slide, ctx, ">", x + 252, y + 28, 24, 24, { size: 18, bold: true, color: C.teal });
  });
  rect(slide, ctx, 74, 214, 480, 90, C.dark, "none");
  rect(slide, ctx, 74, 214, 5, 90, C.green, "none");
  text(slide, ctx, s.rule, 104, 240, 380, 30, { size: 17, bold: true, color: "#E5EEF7" });
  return slide;
}

async function learning(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 540);
  await maybeImage(slide, ctx, s.image, 630, 82, 600, 320);
  s.loop.forEach((item, i) => {
    const x = 74 + i * 138;
    rect(slide, ctx, x, 226, 108, 58, "#FFFFFF", [C.red, C.amber, C.teal, C.green][i]);
    text(slide, ctx, item, x + 10, 247, 88, 16, { size: 12.5, bold: true, color: [C.red, C.amber, C.teal, C.green][i], align: "center" });
    if (i < s.loop.length - 1) text(slide, ctx, ">", x + 116, 244, 16, 18, { size: 14, bold: true, color: C.teal });
  });
  s.fixes.forEach(([head, body], i) => card(slide, ctx, 74 + (i % 2) * 268, 330 + Math.floor(i / 2) * 86, 230, 64, head, body, [C.teal, C.blue, C.amber, C.green][i]));
  rect(slide, ctx, 188, 606, 904, 44, "#EEF9F8", C.teal);
  text(slide, ctx, s.rule, 260, 619, 760, 18, { size: 14.5, bold: true, align: "center" });
  return slide;
}

async function conclusion(presentation, ctx, s, n) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  heading(slide, ctx, s, n, 520);
  await maybeImage(slide, ctx, s.image, 610, 86, 620, 332);
  s.points.forEach(([head, body], i) => card(slide, ctx, 74, 226 + i * 96, 430, 70, head, body, [C.teal, C.blue, C.green][i]));
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
  rect(slide, ctx, 74, 184, 5, 72, C.violet, "none");
  text(slide, ctx, s.callout, 104, 206, 930, 24, { size: 18, bold: true, color: "#E5EEF7" });
  s.steps.forEach(([head, body], i) => card(slide, ctx, 96 + (i % 2) * 554, 306 + Math.floor(i / 2) * 112, 488, 82, head, body, [C.teal, C.blue, C.amber, C.green][i]));
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
