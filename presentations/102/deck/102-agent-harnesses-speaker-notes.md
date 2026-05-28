# 102 Agent Harnesses - Speaker Notes

## Timing

The audience-facing section is designed for roughly 20 minutes: 12 narrated slides at about 90-110 seconds each. Slide 13 is a presenter-only appendix cue for the Fidelity Tasks VS Code demo and is not narrated.

## Slide 01 - Agent Harnesses

Open this as the sequel to the loop workshop. The audience already knows how to run a Copilot session; now the question is how a team designs the repo and workflow so every session starts with better rails.

## Slide 02 - Prompting Is Not Enough

Make the contrast plain: prompts are per-session, while harnesses are durable. A harness is where repo knowledge, team habits, and verification live.

## Slide 03 - The Harness Model

Introduce the simple spine: Rules, Moves, Tools, Checks. Keep returning to it throughout the talk.

## Slide 04 - Rules: Copilot Instructions

Explain instructions as standing orders. Mention `.github/copilot-instructions.md`, `AGENTS.md`, and path-specific instruction files without getting lost in setup details.

## Slide 05 - Rules: Boundaries and Blast Radius

Make boundaries feel enabling, not restrictive. The smaller the allowed surface, the easier the work is to verify.

## Slide 06 - Moves: Skills and Playbooks

Define skills as reusable procedures. Briefly mention examples like `grill-me` for plan stress-testing and `diagnose` for post-generation debugging.

## Slide 07 - Moves: Team Habits

Tie skills and instructions to real team habits: bug triage, migrations, UI checks, PR summaries, and review expectations.

## Slide 08 - Tools: Scripts Agents Can Run

Emphasize that scripts are the most practical tool layer for many teams. A good script gives Copilot a known command instead of making it infer the right verification path.

## Slide 09 - Soft Checks

Use this to explain the middle ground for repos without hard linting. Soft reports return warnings so Copilot can clean up obvious issues before a human reviewer gets the diff.

## Slide 10 - Checks: After Generation

Show the post-generation harness: changed tests, soft lint, diagnostic skill, and evidence summary.

## Slide 11 - The Harness Learning Loop

When Copilot fails, convert the failure into a harness improvement instead of only blaming the prompt.

## Slide 12 - Conclusion

End with the core line: the goal is not to trust Copilot more; the goal is to make AI work easier to inspect.

## Slide 13 - Fidelity Tasks VS Code Demo Cue

Presenter-only. Open the Fidelity Tasks repo and show rules, moves, tools, and checks in that order.

## Source Links

- VS Code custom instructions: https://code.visualstudio.com/docs/copilot/customization/custom-instructions
- GitHub Copilot response customization: https://docs.github.com/copilot/concepts/response-customization?tool=vscode
- GitHub Copilot customization cheat sheet: https://docs.github.com/en/copilot/reference/customization-cheat-sheet
- Matt Pocock skills repository: https://github.com/mattpocock/skills
