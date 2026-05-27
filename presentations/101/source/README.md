# Source Notes

The slide source was authored with the Codex Presentations skill using artifact-tool presentation JSX.

The source files are included for reference and future editing:

- `slides/deck.mjs` contains the shared visual system and slide composition helpers.
- `slides/slide-01.mjs` through `slides/slide-16.mjs` define individual slides.
- `generate-assets.mjs` records the Grok Imagine prompts used for the supporting images.

To regenerate images, set `XAI_API_KEY` in your own environment before running `generate-assets.mjs`. Do not commit local `.env` files or API keys.
