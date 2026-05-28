# AI Basics for Developers Presentations

Presentation library for practical developer workshops on AI coding agents, VS Code, and GitHub Copilot.

## Decks

### 101 AI Basics for Developers

Practical fundamentals for engineers learning how to use IDE agents without losing engineering judgment.

- Editable PowerPoint: [`presentations/101/deck/101-ai-basics-for-developers.pptx`](presentations/101/deck/101-ai-basics-for-developers.pptx)
- PDF export: [`presentations/101/deck/101-ai-basics-for-developers.pdf`](presentations/101/deck/101-ai-basics-for-developers.pdf)
- Speaker notes: [`presentations/101/deck/101-ai-basics-speaker-notes.md`](presentations/101/deck/101-ai-basics-speaker-notes.md)
- Narration/player data: [`presentations/101/narration/`](presentations/101/narration/)

### 102 Agent Harnesses

Sequel deck on keeping Copilot useful, bounded, and reviewable with repo/team harnesses: rules, moves, tools, and checks.

- Editable PowerPoint: [`presentations/102/deck/102-agent-harnesses.pptx`](presentations/102/deck/102-agent-harnesses.pptx)
- PDF export: [`presentations/102/deck/102-agent-harnesses.pdf`](presentations/102/deck/102-agent-harnesses.pdf)
- Speaker notes: [`presentations/102/deck/102-agent-harnesses-speaker-notes.md`](presentations/102/deck/102-agent-harnesses-speaker-notes.md)
- Narration/player data: [`presentations/102/narration/`](presentations/102/narration/)

## Run Locally

Start the presentation chooser:

```bash
npm run player:serve -- --port 4173
```

Open:

```text
http://127.0.0.1:4173/
```

The chooser links to:

- `http://127.0.0.1:4173/presentations/101/player/`
- `http://127.0.0.1:4173/presentations/102/player/`

Each deck stores its current slide separately, so refreshing keeps you on the same presentation and slide.

## Useful Commands

```bash
npm run build:101
npm run build:102
npm run narration:dry-run
npm run narration:generate
npm run feedback:sync
```

The default narration and feedback commands target 102. Use the `:101` variants for the 101 deck.

## Source

Both decks were authored with the Codex Presentations skill using artifact-tool presentation JSX.

- 101 source: [`presentations/101/source/`](presentations/101/source/)
- 102 source: [`presentations/102/source/`](presentations/102/source/)
- Shared player: [`player/`](player/)
- Shared scripts: [`scripts/`](scripts/)

Generated images use the same Grok Imagine asset-generation pattern as the 101 deck. Local `.env` files and API keys are not committed.
