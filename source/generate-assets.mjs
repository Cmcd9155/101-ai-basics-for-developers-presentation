import fs from "node:fs/promises";
import path from "node:path";

const workspace = "/Users/chrisdonahue/Documents/Codex/2026-05-21/i-want-to-create-a-presentation/outputs/019e4a38-4026-71e0-9b50-0443ceaa8f49/presentations/101-ai-basics";
const assetDir = path.join(workspace, "assets");

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
    name: "tool-loop.png",
    prompt:
      "An abstract engineering workflow loop: language model core connected to tools, shell, tests, files, and diff review, elegant technical schematic rendered as modern editorial art, no text, no logos, 16:9.",
  },
  {
    name: "agent-workshop.png",
    prompt:
      "A practical developer workshop scene: engineers collaborating around a projected code architecture diagram and AI agent workflow, refined editorial illustration, realistic but stylized, bright room, no text, no logos, 16:9.",
  },
];

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

async function generateOne(item, index) {
  const out = path.join(assetDir, item.name);
  if (!process.env.XAI_API_KEY) {
    await fs.writeFile(out, fallbackSvg(item.name.replace(".png", ""), index % 2 ? "#f59e0b" : "#0891b2"));
    return { name: item.name, status: "fallback-no-key" };
  }
  const response = await fetch("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.XAI_API_KEY}`,
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

await fs.mkdir(assetDir, { recursive: true });
const results = [];
for (let index = 0; index < prompts.length; index += 1) {
  results.push(await generateOne(prompts[index], index));
}
await fs.writeFile(path.join(assetDir, "asset-manifest.json"), `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
