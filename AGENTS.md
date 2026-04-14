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


There is file called @BigPicturePlan.md where you can see what we are going to build, and what the plan. this file needs to be updated by you whenever we hit a milestone, a milestone can be new feature/mechanic that is meaningful for you to remember for later.
After each item is marked done, you need to provide description with tech context, so other llm's understand codebase easier. 
--
Whenever you feel ready for commit,  you  suggest commit name, example of standard we use feat(landing page): added new hero section.
use english only.