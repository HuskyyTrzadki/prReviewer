1. Think Before Writing Code
   Don’t guess. Don’t gloss over uncertainty. Make tradeoffs visible.

Before coding:

List your assumptions clearly. If unsure, ask.
If there are multiple valid interpretations, show them — don’t pick one silently.
If there’s a simpler path, call it out. Push back if needed.
If something doesn’t make sense, stop. Say what’s unclear and ask.

2. Default to Simplicity
   Solve the problem with the least code possible. No speculation.

Don’t add features that weren’t requested.
Avoid abstractions for one-off usage.
Skip unnecessary flexibility or configurability.
Don’t handle impossible edge cases.
If 200 lines can be 50, rewrite it.
Ask: “Is this overengineered for a senior?” If yes, simplify.

3. Make Surgical Changes
   Only touch what’s required. Only clean up what you break.

When editing:

Don’t “fix” nearby code, comments, or formatting.
Don’t refactor unrelated parts.
Follow the existing style, even if it’s not your preference.
If you see unrelated dead code, mention it — don’t remove it.
Do not reintroduce internal Next imports, `React.` namespace usage, deprecated `FormEvent`/`FormEventHandler` types, or function-declared components when an arrow component is already the local pattern, try to use patterns existing in repo, if u change pattern somewhere and its better, ask user for changing this everywhere.
Avoid nested ternary expressions. Prefer explicit conditionals or a typed mapping object for readability.
Prefer precise types over `unknown` when the value shape can be expressed clearly, and prefer `const` over `let` unless mutation is genuinely needed.
no file can be larger than 200 lines, if u find file like this refactor.

If your changes create leftovers:

Remove anything you made unused (imports, vars, functions).
Don’t delete pre-existing dead code unless asked.

Rule: every changed line must tie directly to the task.

4. Execute Against Clear Goals
   Define success upfront. Iterate until proven.

Turn tasks into measurable outcomes:

“Add validation” → write failing tests, then pass them
“Fix bug” → reproduce with a test, fix, verify
“Refactor X” → confirm tests pass before and after

For multi-step work:

Step → verify: Check
Step → verify: Check.

Weak goals (“make it work”) force constant clarification. Strong ones let you move independently.

5. MCP and Browser Verification Workflow
   Use MCP runtime diagnostics first, then verify rendering with one browser path only.

When checking Next.js runtime:

Use `nextjs_index` and `nextjs_call` first (`get_errors`, `get_routes`) before browser checks.
If MCP browser session reports lock/stale context issues (for example “browser already in use”), do not loop retries.
Switch immediately to one direct Playwright smoke check path.
Do not mix two browser automation paths in the same verification pass; pick one and finish.
Keep a reusable smoke check for desktop + mobile + console errors.


There is file called @BigPicturePlan.md where you can see what we are going to build, and what the plan. this file needs to be updated by you whenever we hit a milestone, a milestone can be new feature/mechanic that is meaningful for you to remember for later.
After each item is marked done, you need to provide description with tech context, so other llm's understand codebase easier. 
--
Whenever you feel ready for commit,  you  suggest commit name, example of standard we use feat(landing page): added new hero section.
use english only.
Whenever user asks to understand something, explain it using examples.

one thing i d like ai to do is to have in /analyze endpoint  a 'forced json structure' enforced on llm directly, i now that llms sometimes likes to ignore simple 'output json' and they will do 'of course i will do that here it is {} ' which breaks endpoint.

also on vercel i need to provide env key.

i get an error from github 'resource exhausted' its only 60 /hour ..  i need to provide token. i ll make sure to handle this error.