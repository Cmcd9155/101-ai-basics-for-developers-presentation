# 101 AI Basics for Developers - Speaker Notes

## Timing
This deck is designed for roughly 30 minutes: about 90 seconds per slide, with slightly more time on slides 4, 6, 7, 10, and 12.

## Slide 01 - 101 AI Basics for Developers
Open by framing this as an operating workshop, not an AI theory lecture. The goal is to help developers use IDE agents with better judgment: what to ask, what context to provide, how to inspect work, and when to stop.

## Slide 02 - LLM basics
Explain that LLMs operate over tokens and bounded context. The model can be impressive and still be wrong because it predicts plausible continuations from available context. Engineers should treat output like a fast draft that needs grounding.

## Slide 03 - Prompting as specification
Use the weak prompt vs agent-ready prompt contrast. The improved prompt gives a goal, starting points, constraints, and a definition of done. This is not about fancy wording; it is about reducing the search space.

## Slide 04 - How Copilot traverses a repo
Be careful here: this is a documented mental model, not a private implementation claim. Copilot does not load the whole repo into the model. It combines indexed retrieval, explicit context, tool calls, and session state to assemble the working context.

## Slide 05 - Context engineering
Walk through the four kinds of context. The practical habit is to put the highest-signal context in front of the model early: exact files, failing logs, issue text, repo rules, and acceptance criteria.

## Slide 06 - Tool calling
Describe the loop: model requests a tool, the host application executes it, the result comes back into context, then the model continues. The engineering implication is that tools have permissions, latency, side effects, and failure modes.

## Slide 07 - RAG and semantic search
Retrieval makes external facts available inside a limited context window. It is useful for codebases and docs, but retrieval can still pick the wrong chunks. For important changes, inspect the referenced files.

## Slide 08 - MCP
MCP is an adapter layer: servers expose named tools with schemas so agents can discover and invoke them. The protocol helps integrations scale, but security decisions still belong to the tool host and organization.

## Slide 09 - Workflow vs agent
Use the distinction from Anthropic: workflows follow predefined paths; agents dynamically choose their path and tool use. Prefer workflows for repeatable tasks and agents for ambiguous work that requires exploration.

## Slide 10 - IDE agent modes
Tie autonomy to blast radius. Ask mode is for understanding. Edit mode is for known files. Agent mode is for multi-step work. Plan/autopilot should depend on confidence in scope, tests, and permissions.

## Slide 11 - Task selection
Agents are strongest on bounded, inspectable work. They struggle when the prompt hides multiple projects inside one vague ask. Break large work into independently reviewable tasks.

## Slide 12 - Steering loop
The user is still the engineer. Frame the problem, observe the plan and tool calls, interrupt drift early, and verify with tests and diff review. This is where agent sessions become reliable.

## Slide 13 - Failure modes
Most failures come from bad or stale context, weak constraints, or insufficient verification. Encourage developers to ask agents to cite local symbols, limit file scope, and state residual risks.

## Slide 14 - Team setup
Repo instructions are operational documentation. Keep them short and broadly applicable. Path-specific instructions are good for test frameworks, API conventions, frontend patterns, and security rules.

## Slide 15 - Practical checklist
Turn the talk into a habit. Before: define done and scope. During: review plan and tool calls. After: inspect diff, run tests, and capture any durable repo learning.

## Slide 16 - Closing exercise
Invite the audience to rewrite a vague request into an agent-ready task. The key move is making the request testable and bounded: scope, starting point, constraints, and acceptance criteria.

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
