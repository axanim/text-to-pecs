# Welcome to Text to PECS 👋

This is the Coding Circle project — and you're already in the
right place. Everything you need is in this folder.

---

## What we're building

Axel walks into a café. Someone hands him a menu.
And then nothing — because the menu is a wall of text.

This app fixes that. Point the camera at any menu. Tap what
you want. The app says it out loud. Done.

It's called Text to PECS — because it converts real-world text
into PECS-style picture tiles that people like Axel can use.

---

## Before anything else — set your API key

This powers Claude Code. Without it, nothing works.

In the terminal (press Ctrl+` if you don't see it):

```bash
echo 'export ANTHROPIC_API_KEY=sk-ant-your-key-here' >> ~/.bashrc
source ~/.bashrc
```

Replace `sk-ant-your-key-here` with your real key from:
https://console.anthropic.com/settings/keys

---

## Start Claude Code

```bash
claude
```

Tell it what you want to work on. It will read the project
files and know exactly what's going on.

---

## Read these before building

| File | What it is |
|---|---|
| `CLAUDE.md` | Architecture, rules, who owns what |
| `CONTRIBUTING.md` | Step by step guide — start here if it's your first time |
| `TEXT_TO_PECS_CLAUDE_CODE_INSTRUCTIONS.md` | The full technical spec |

---

## Test the running app

```bash
flutter run -d web-server --web-port 8080 --web-hostname 0.0.0.0
```

VS Code will show a popup: **Open in Browser** — click it.
The app opens in your browser tab. This is how you test your work.

---

## Coding Circle meets fortnightly
**Wednesdays 7:00–8:30 PM AEDT**
Hosted by Annette — aXai

Cameras optional. Snacks mandatory.

---

*If you wouldn't hand it to Axel in a café — it's not done yet.*
