I carefully analyzed the task.

I reviewed the existing PhotoAiD website.

I looked for similar tools that already exist and found Qodo AI and Rabbit AI PR Reviewer.

I tested Qodo AI and liked it.

Since it is open source, I also went through the codebase.

I’m also thinking about what to do if there are more than 10 PRs, for example. I’m considering whether to handle it asynchronously with cron jobs or simply limit the number. I’m weighing cron jobs, event-driven listening through a controller, and Inngest.

I also set up the Gemini API key, i use free trial 1200pln in credits. very cool.

I’m currently learning how to record with OBS.

Learned how to record on OBS with camera in corner.

Technology selection, decided to go with vercel, next.js, tailwind. (easiest for this kind of website)

Preparing enviroment "npx create-next-app@latest"

Note for reviewer, my plan is to use ai to generate around 95+ % of code, for more complex projects i usually try to write 10/15% by hand just to make me understand codebase better.

I research skills i am about to use in this project using https://skills.sh/. few of them i already used before. you can see them in /skills. I decide to skip design skills for now,
and manage that later.

I check needed mcp servers, the one i used are "react-grab-mcp", "shadcn", "playwright" , "next-devtools" its in .codex folder.

I create a agents.md file with instructions, and BigPicturePlan.md

gpt 5.4 prompt. 
tresc zadania jako projekt w gpt +
--------
create a BigPicturePland.md that have 2 things 
a) tech description of the task, (fit to our tech stack), dont miss crucial notes, change language dont copy text 1:1. no need for AI instructions usage, focus on what needs to be deliver(product) 
b) "High level" plan (step by step) for whole implemntation for agent, (not for operator),
just to give agents context/todo list. I d like you to output, a plan that is brief, max 15 points for this task. Lets start with architecture, i d like to use 'features' driven standard. 
Then storybook creation via copying design system (user role) Then lets build simple landing page following design system... and lets leave landing page improvement for latter steps. the last points should tackle performance, test coverage, caching, code quality, wow effect on landing page. and they should start with 'ensure X is done" not "Do X" . after you give me "BigPicturePland.md" output all thoughts, facts, and suggestions to think about.
-------
'ensure' instead of 'do' just so model won't think not to care about code quality/performance now.. because we have tasks for that in future :) 
'change language' because the project is open source. 

i revise output and put it in BigPicturePlan.md  i m aware this plan might change in future, but for now i d like to have big picture plan for llm to catch context and have a to do list.


now i d like to do  a) vercel deploy, i like having it done first. b) lighthouse connection to github so i can see results on each pr.

done, vercel deployed, lighthouse https://github.com/GoogleChrome/lighthouse-ci/ is showing in ci/cd. 100 on everything obiously. i put a warning if its below 80.

first goal done. now "Define the design tokens", the trick i m going to use is that website https://designmd.me/ it extracts design to md file so ai can recreate it. its in design-inspiration.md

one thought i have now that i think i m just going to so super simple storybook. 

i apply tailwind-design-system skill and create a design config.

Storybook created, its not perfect.. however it achieves a goal, which is to see a color patterns, font sizes, gaps.. looks correct, later on can be polished

I notice that actually i d like to start implementing logic soon, so i simplify plan a bit, to just put a searchbar as a starting point.

no need for hook form as its just one input.

seems like mcp from next causes troubles, i keep on editing agents.md

i like landing page already, i didnt think its going to look so good on mock try.

i wonder whether we should have separate /analyze page, talking to gpt.

small fail, i noticed i have different account thats commiting and different owner. The issue is that on vercel you cant 
add another account to project as it requires pro plan.

