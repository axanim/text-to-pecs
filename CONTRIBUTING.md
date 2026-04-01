# Contributing to Text to PECS
## A guide for Coding Circle participants

You do not need to know how to code. You need:
- A GitHub account (free)
- VS Code installed (free)
- An Anthropic API key (~$5–10 per session)
- A browser

Claude Code does all the building. Your job is to direct it.

---

## What this project is

A Flutter app that converts printed menus (and other text) into
PECS-style visual choice grids — so people like Axel can make
real choices in real places like cafés, without needing someone
to interpret text for them.

Read CLAUDE.md for the full technical picture.
Read WELCOME.md if you haven't already.

---

## Part 1 — Setting up (do this once)

### Step 1 — Get a GitHub account
Go to https://github.com and sign up. Free.

### Step 2 — Install VS Code
Download from https://code.visualstudio.com
Install it like any normal app.

### Step 3 — Install the GitHub Codespaces extension
1. Open VS Code
2. Click the Extensions icon in the left sidebar (looks like four squares)
3. Search: GitHub Codespaces
4. Click Install

### Step 4 — Sign in to GitHub from VS Code
1. Click the Accounts icon (bottom left of VS Code, person shape)
2. Click "Sign in with GitHub"
3. Follow the prompts in your browser
4. Come back to VS Code — you're signed in

### Step 5 — Open the project in a Codespace
1. Go to: https://github.com/annette-a/text-to-pecs
2. Click the green "Code" button
3. Click the "Codespaces" tab
4. Click "Create codespace on main"
5. Wait about 3–5 minutes while everything installs automatically
   (Flutter, Claude Code, all the tools — the setup.sh script does this)
6. VS Code will connect to your Codespace automatically
7. You'll see the project files in the left panel

You only create the Codespace once. After that you just reconnect to it.

### Step 6 — Set your Anthropic API key
In the VS Code terminal (bottom panel — press Ctrl+` if you don't see it):

```bash
echo 'export ANTHROPIC_API_KEY=sk-ant-your-key-here' >> ~/.bashrc
source ~/.bashrc
```

Replace `sk-ant-your-key-here` with your actual key from:
https://console.anthropic.com/settings/keys

Your key stays in your Codespace only. It is never in the project files.

---

## Part 2 — Every session

### Reconnecting to your Codespace
1. Open VS Code
2. Press Ctrl+Shift+P
3. Type: Connect to Codespace
4. Select your text-to-pecs Codespace
5. You're back where you left off

Or from the browser:
1. Go to https://github.com/codespaces
2. Click your text-to-pecs Codespace
3. VS Code opens in your browser (no local install needed this way either)

### Starting Claude Code
In the terminal:
```bash
claude
```

That's it. Claude Code reads CLAUDE.md automatically and knows
the whole project.

---

## Part 3 — How to contribute

### Step 1 — Claim a module
Before starting work, go to:
https://github.com/annette-a/text-to-pecs/discussions

Find the "Module ownership" discussion.
Comment on it: "I'd like to work on [module name]"

Check CLAUDE.md for the list of modules and which are unclaimed.
Don't start building until your claim is acknowledged.

### Step 2 — Create your branch
In the terminal:
```bash
git checkout -b your-name/module-name
# Example:
git checkout -b alice/pecs-grid-ui
```

### Step 3 — Tell Claude Code what to build
Start with:
```
claude
```

Then say something like:

> "I'm working on the PECS grid screen. Read CLAUDE.md and
> MENU_PLEASE_INSTRUCTIONS.md, then build the PecsGridScreen
> component following the PECS design principles. Use MockOcrService
> for all testing. Start with a plan before writing any code."

Claude Code will:
- Read the project context
- Make a plan and show it to you
- Ask if the plan looks right
- Build it phase by phase
- Run tests after each phase
- Tell you when to open the browser and check it

### Step 4 — Review what Claude Code builds
When Claude Code tells you to check the running app:

```bash
flutter run -d web-server --web-port 8080 --web-hostname 0.0.0.0
```

VS Code shows a popup: "Open in Browser" — click it.
The app opens in your browser.

Look at it. Really look at it. Ask yourself:
- Are the tiles big enough for someone with motor difficulties?
- Is the text readable at a glance?
- Is the flow obvious — what do I tap next?
- Does it read aloud correctly when I tap a tile?

Tell Claude Code what you see. It will fix it. This is your job.

### Step 5 — Raise a Pull Request
When Claude Code says the work is complete and tests pass:

```bash
git add .
git commit -m "Add PecsGridScreen with mock data support"
git push origin your-name/module-name
```

Then go to https://github.com/annette-a/text-to-pecs
GitHub will show a yellow banner: "Compare & pull request" — click it.
Fill in what you built (Claude Code can write this for you — just ask).
Click "Create pull request".

Annette or another Circler will review and merge it.

---

## Part 4 — Things Claude Code will ask you

**"Should I proceed with this plan?"**
Read it. If it makes sense — say yes. If something seems wrong — say so.
You don't need to understand the code to judge the plan.

**"Can you open the browser and check this?"**
Yes. This is important. Look at it carefully.

**"Does this look right to you?"**
Your answer here is the quality gate. Trust your instincts.
If it feels hard to use — it is hard to use. Say so.

**"Should I raise a PR now?"**
Only say yes if flutter test passed and you've looked at it in the browser.

---

## Part 5 — Rules everyone follows

These keep the project coherent when many people are building at once:

1. **Claim your module first** — in GitHub Discussions before building
2. **One module per person** — finish it (or hand it off) before starting another
3. **Never touch lib/models/** without a discussion first
4. **Always work on your own branch** — never commit directly to main
5. **Tests must pass before a PR** — Claude Code will check this
6. **Ask in the Coding Circle chat** if you're stuck or unsure

---

## Part 6 — Codespace housekeeping

**Your Codespace auto-suspends after 30 minutes idle.**
This is intentional — it saves your free hours. It resumes in ~10 seconds
when you reconnect. Your work is always saved.

**Free tier: 60 core-hours per month.**
A 90-minute Coding Circle session uses 3 core-hours (2-core machine).
That's 20 sessions per month on the free tier. More than enough.

**If you accidentally close VS Code mid-session:**
Just reconnect. Everything is still there.

---

## Getting help

- **Stuck on setup?** Post in the Coding Circle chat before the session
- **Stuck on the code?** Ask Claude Code first — it knows the project
- **Something broken?** Raise a GitHub Issue
- **Big decision?** Start a GitHub Discussion

---

## The spirit of this project

This is a coding circle, not a sprint. There are no deadlines.
Half-finished is fine. Questions are welcome. Going down rabbit holes
together is the point.

The only thing that matters is that what gets built actually works
for people like Axel. Keep that in mind when you're looking at it
in the browser and deciding if it's good enough.

If you wouldn't hand it to Axel in a café — it's not done yet.

---

*Text to PECS — Coding Circle project*
*Hosted by Annette Andersen — aXai*
*Circle meets fortnightly — Wednesdays 7:00–8:30 PM AEDT*
