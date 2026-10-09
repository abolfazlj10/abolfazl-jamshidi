# Account Usage Preference

The 10% reserve for the 300-minute Codex usage window applies only to prompts
using the personal Codex account `abolfazl.j.dev@gmail.com`
(account ID `e4b7337a-ce2f-4474-b14b-f49c82995514`).
Check usage before work on that account and stop when `usedPercent > 90`.

When the user explicitly identifies CodexAra as the provider for the current
prompt, ignore the native Codex quota reserve for that request. Do not infer
the active provider or account from the account used by a connected plugin.
If the prompt's account is uncertain and no explicit override was given, ask
the user to clarify before substantive work.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
