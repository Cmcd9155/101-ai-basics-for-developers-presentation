# 101 AI Basics for Developers - Speaker Notes

## Timing
This deck is designed for roughly 30 minutes: about 90 seconds per slide, with slightly more time on slides 4, 6, 7, 10, and 12.

## Slide 01 - 101 AI Basics for Developers
Open by framing this as an operating workshop, not an AI theory lecture. The goal is to help developers use IDE agents with better judgment: what to ask, what context to provide, how to inspect work, and when to stop.

## Slide 02 - LLM basics
Make the mental model simple and slow: LLMs read tokens, use only the context currently available, and draft the most likely answer from that evidence. Emphasize that useful output can still be wrong, so engineers should treat it like a fast draft from someone who has not seen the whole repo yet, then verify important parts against code, tests, docs, and judgment.

## Slide 03 - Prompting as specification
Use the weak prompt vs agent-ready prompt contrast, but keep it plain and live: prompting is not magic wording, it is a clearer work ticket. The improved prompt should answer five simple questions: what to fix, where to look, what to avoid changing, how to check it, and what counts as done.

## Slide 04 - How Copilot traverses a repo
Be careful here: this is a practical mental model, not a private implementation claim. Copilot does not carry the whole repo into the model; it packs a smaller working context from opened/selected files, search results, tool output, instructions, and chat history. The teaching point is that a missing file can lead to a plausible but wrong answer, so ask for the map before edits.

## Slide 05 - Context engineering
Keep this practical: context engineering is making a small starter packet, not dumping the whole repo into the chat. Give the agent the ask, the evidence, the repo rules, and the check. The teaching point is that better context means fewer guesses, but too much unrelated context can bury the signal.

## Slide 06 - Tool calling
Make the separation very clear: the model asks for a tool call, but the host app or IDE does the real work. It runs the search, test, command, browser check, or database query, then returns output into context. Tools ground the agent in reality, but they also have blast radius, so permissions and side effects matter.

## Slide 07 - RAG and semantic search
Keep this simple: retrieval is search that brings candidate evidence into the model's context. It is useful when developers do not know the exact file, symbol, or doc name, but retrieved chunks are leads, not proof. Teach the habit: retrieve, read, reason, verify, and ask the agent to separate found evidence from inferred conclusions.

## Slide 08 - MCP
Make MCP concrete: it is a standard plug for agent tools. Servers describe tools, schemas, resources, and results so hosts can connect agents to external systems in a reusable way. Stress the security boundary: MCP standardizes the shape of access, but the host and organization still decide permissions, approvals, logs, and what actions are too risky.

## Slide 09 - Workflow vs agent
Use the distinction from Anthropic, but make it practical: workflows are for known paths and agents are for discovered paths. If the steps are repeatable, prefer a workflow because it is cheaper, easier to test, and easier to audit. Use an agent when exploration, tool choice, and judgment are actually part of the task.

## Slide 10 - IDE agent modes
Tie autonomy to reviewability and blast radius. Ask mode is for understanding, edit mode is for known files and small changes, agent mode is for exploration plus execution, and plan mode is for foggy or high-risk scope before code changes. The practical rule: increase autonomy only when scope, tests, permissions, and reversibility make review possible.

## Slide 11 - Task selection
Make task selection feel like a reviewability question, not an AI capability question. A good agent task has a small surface, a clear check, and a readable diff. Broad goals may be real goals, but they need to be split into one behavior, one area, and one verification before an agent session.

## Slide 12 - Steering loop
Make steering concrete: the user is still the engineer, so the loop is frame, watch, interrupt, verify. Watch the files read, tool calls, assumptions, tests, and scope. Interrupt drift when it is cheap, then verify with diff review, behavior checks, tests, and residual risk.

## Slide 13 - Failure modes
Make failure modes actionable instead of scary. Confidence is not verification; evidence is. Teach developers to check five things: invented APIs, wide diffs, stale context, weak checks, and risky actions. The response habit is to ask what evidence it used, what changed, what was verified, and what risk remains.

## Slide 14 - Team setup
Frame repo instructions as a small operating manual that prevents repeated guessing. Capture durable repo rules, path-specific conventions, workflow recipes, and explicit keep-out areas. Keep the writing short enough to stay true next month and useful enough to change agent behavior every session.

## Slide 15 - Practical checklist
Turn the talk into one repeatable runbook. Before: shape the task by defining done, bounding scope, and naming checks. During: watch direction by reading the plan, observing files/tools, and interrupting drift. After: prove it worked by inspecting the diff, running tests or QA, and capturing durable learning.

## Slide 16 - Closing exercise
Close with the repeatable habit: rewrite vague work into a bounded, testable task. Use five blanks: goal, scope, starting point, limits, and check. The payoff is not better wording for its own sake; it is smaller diffs, clearer verification, and calmer human review.

## Source Links
- GitHub repo indexing and semantic code search: https://docs.github.com/en/copilot/using-github-copilot/indexing-repositories-for-copilot-chat
- Copilot context management: https://docs.github.com/copilot/concepts/agents/copilot-cli/context-management
- Copilot agent sessions and modes: https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions
- Copilot custom instructions: https://docs.github.com/en/copilot/concepts/prompting/response-customization
- OpenAI function calling: https://developers.openai.com/api/docs/guides/function-calling
- OpenAI retrieval and vector stores: https://developers.openai.com/api/docs/guides/retrieval
- MCP tools specification: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
- Anthropic Building Effective Agents: https://www.anthropic.com/engineering/building-effective-agents
- xAI Grok Imagine image generation: https://docs.x.ai/developers/model-capabilities/images/generation
