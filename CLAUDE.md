# Text to PECS — Project Context for Claude Code

Read this file at the start of every session. It tells you what
this project is, how it is structured, and the rules you must follow.

---

## What This Project Is

Text to PECS is a Flutter app that helps people with complex
communication needs make choices in the real world.

The core problem: someone like Axel (who communicates through
PECS — Picture Exchange Communication System) goes to a café and
is handed a menu. The menu is a wall of text. He cannot use it.

This app solves that. Point the camera at any menu (or shelf,
or activity board, or any printed text). The app extracts the
text, understands it, and converts it into a PECS-style choice
grid — big tiles, simple labels, one tap to choose. The app
reads the choice aloud when tapped.

This is an autonomy tool. It extends self-determination into
environments that were never designed with Axel in mind.

---

## Architecture

```
Camera / Image Picker
        ↓
OcrService (abstract interface)
        ├── MlKitOcrService     ← Android/iOS (real device)
        └── MockOcrService      ← Web/testing (returns fake data)
        ↓
SemanticService
        ├── Extracts text blocks
        ├── Runs MiniLM embeddings (on-device)
        ├── Compares against PECS category seed vectors
        └── Groups items by category with confidence score
        ↓
        If confidence < 0.65 → ApiOcrService fallback (Gemini)
        ↓
PecsGridScreen
        ├── Category tiles (Drinks / Mains / Desserts etc.)
        └── Item tiles within each category
        ↓
ChoiceConfirmationScreen
        ├── "You chose Lemonade" — large text
        ├── TTS reads it aloud
        └── Optional: notify carer via local notification
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Flutter 3.x (stable channel) |
| Language | Dart |
| OCR (device) | google_mlkit_text_recognition |
| OCR (web/fallback) | Gemini API via http |
| Embeddings | tflite_flutter + MiniLM model |
| TTS | flutter_tts |
| State | Riverpod |
| Storage | sqflite (favourites) |
| Camera | image_picker |
| Testing | flutter_test + mockito |

---

## Module Ownership

The project is built by a community. Each module is owned by
one contributor. Do not modify modules you don't own without
raising it in the GitHub discussion first.

| Module | Directory | Owner |
|---|---|---|
| OCR service layer | lib/services/ocr/ | — |
| Semantic/embedding layer | lib/services/semantic/ | — |
| PECS grid UI | lib/screens/pecs_grid/ | — |
| Camera/scan screen | lib/screens/scan/ | — |
| Choice confirmation | lib/screens/confirmation/ | — |
| TTS service | lib/services/tts/ | — |
| Favourites storage | lib/services/storage/ | — |
| Shared models | lib/models/ | Core team only |

Owners are claimed in GitHub Discussions before work starts.

---

## Shared Models — Handle With Care

Files in `lib/models/` are shared across all modules.
Never modify them without:
1. Opening a GitHub Discussion first
2. Getting agreement from at least one other contributor
3. Updating all affected services in the same PR

---

## Testing Approach

This project runs in a GitHub Codespace — no physical device
is available by default.

**For web testing (all UI work):**
```bash
flutter run -d web-server --web-port 8080 --web-hostname 0.0.0.0
```
VS Code will show a popup: "Open in Browser" — click it.
The app runs in your browser tab.

**For unit tests (no device needed):**
```bash
flutter test
```

**For device testing (ML Kit OCR):**
Plug in an Android device, enable USB debugging, then:
```bash
flutter run -d <device-id>
```

**MockOcrService is always available for UI testing.**
Never block UI work on real OCR. Use the mock.

---

## Non-Negotiable Rules

1. **MockOcrService must always return valid data** — never
   break the mock; it is what everyone uses for UI work
2. **lib/models/ is sacred** — read the module ownership rules
3. **Every PR needs a test** — even a simple widget test
4. **No API keys in code** — ever, under any circumstances
5. **Accessibility first** — minimum 48x48px touch targets,
   high contrast, TTS on every interactive element
6. **flutter test must pass** before any PR is raised
7. **flutter build web must pass** before any PR is raised

---

## PECS Design Principles

These are not suggestions. They come from how Axel actually uses
his PECS system.

- **Maximum 6 tiles per screen** — never more, no exceptions
- **One tap per choice** — no double-tap, no long-press
- **Label under every tile** — never icon-only
- **High contrast** — dark text on light background minimum
- **TTS on tap** — every tile reads its label aloud on tap
- **Back is always visible** — never trap the user on a screen
- **No timers that dismiss** — Axel sets the pace, not the app
- **No error dialogs** — show a friendly retry option instead
- **Large touch targets** — minimum 80x80px for PECS tiles

---

## Regression Anchors

These must never break. The reviewer agent checks them
after every implementation phase.

- `flutter test` passes with 0 failures
- `flutter build web` completes with 0 errors
- MockOcrService returns valid PecsCategory list
- PecsGridScreen renders with mock data in web
- TTS speaks on tile tap (web Speech API)
- All tiles meet 80x80px minimum touch target
- Back navigation works from every screen

---

## Session Start Checklist

At the start of every Claude Code session:
1. Run: `flutter pub get`
2. Run: `flutter test`
3. Check which module you are working on
4. Check GitHub Discussions — has anyone claimed this module?
5. Read the relevant service interface before implementing

---

## The Human in the Loop

Claude Code builds. The circler reviews.

Specifically — the circler looks at the running web app and
gives feedback on:
- Does the layout feel right?
- Are the tiles big enough?
- Is the flow clear for someone who doesn't read well?
- Does the TTS sound right?

This is not a small thing. The circler's judgment on these
questions is the quality gate. Claude Code cannot see the screen.

---

*Project: text-to-pecs*
*Repo: github.com/annette-a/text-to-pecs*
*Community: Coding Circle — fortnightly Wednesdays 7pm AEDT*
*Maintained by: Annette Andersen — aXai*
