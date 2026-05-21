# 101 AI Basics for Developers

Practical 30-minute workshop deck for engineers learning how to use AI agents in IDE workflows, especially VS Code and GitHub Copilot.

## Deliverables

- Editable PowerPoint: [`deck/101-ai-basics-for-developers.pptx`](deck/101-ai-basics-for-developers.pptx)
- PDF export: [`deck/101-ai-basics-for-developers.pdf`](deck/101-ai-basics-for-developers.pdf)
- Speaker notes: [`deck/101-ai-basics-speaker-notes.md`](deck/101-ai-basics-speaker-notes.md)
- Slide previews: [`previews/`](previews/)
- Contact sheet: [`qa/contact-sheet.png`](qa/contact-sheet.png)
- Generated supporting visuals: [`assets/`](assets/)
- Narration script, audio, and player manifest: [`narration/`](narration/)
- Local narrated player: [`player/`](player/)
- Presentation source modules: [`source/slides/`](source/slides/)

## Run Locally

This repo includes the rendered deck artifacts and the generated Ara narration
audio, so you can run the presentation player without regenerating anything.

Requirements:

- Node.js 22 or newer
- GitHub push access if you want Additional notes to sync back to the repo

Start the player:

```bash
npm run player:serve -- --port 4173
```

Open:

```text
http://127.0.0.1:4173/player/
```

The player reads slide previews from `previews/`, audio from
`narration/audio/`, and timing from `narration/manifest.json`.

Additional notes typed in the player are saved to:

- `narration/feedback.json`
- `narration/feedback-events.jsonl`
- `narration/regeneration-brief.md`

When the player is served from this repo, saving Additional notes also commits
and pushes just those notes artifacts to the current Git branch.

Useful checks:

```bash
npm run narration:dry-run
npm run feedback:sync
```

## Workshop Arc

1. Why IDE agents matter now
2. LLM basics: tokens, context, and uncertainty
3. Prompting as specification
4. How Copilot traverses a repo
5. Context engineering
6. Tool calling
7. Retrieval and RAG
8. MCP
9. Workflows vs agents
10. IDE agent modes
11. Good tasks vs bad tasks
12. Steering agents
13. Failure modes
14. Team setup
15. Practical checklist
16. Closing exercise

## Notes

The deck is designed for professional developers with mixed AI familiarity. It frames GitHub Copilot as the primary mental model while keeping the patterns transferable to Codex, Cursor, Claude Code, and other agentic IDE tools.

Generated images were created with xAI Grok Imagine using the Companion repo's configured API access. No API keys or local environment files are included in this repository.

## Primary Sources

- GitHub Docs: repository indexing for Copilot Chat
- GitHub Docs: Copilot context management
- GitHub Docs: Copilot agent sessions
- GitHub Docs: Copilot response customization
- OpenAI Docs: function calling
- OpenAI Docs: retrieval and vector stores
- Model Context Protocol specification: tools
- Anthropic: Building Effective Agents
- xAI Docs: image generation
