# TEXT_TO_PECS_CLAUDE_CODE_INSTRUCTIONS.md
# Text to PECS — Claude Code Master Instructions
# Hand this document to Claude Code to begin building.

---

## 0. CONTEXT FOR CLAUDE CODE

You are helping a Coding Circle community build a real Flutter app
that solves a real problem for people with complex communication needs.

This is a community project. Multiple people will contribute
different modules. Your job in each session is to build ONE module
cleanly, test it thoroughly, and raise a PR.

**Always:**
- Read CLAUDE.md at session start — it has the full architecture
- Make a plan before writing any code — show it and get agreement
- Test in Flutter web before claiming anything is done
- Write comments explaining what code does — contributors are learning
- Keep files under 150 lines — split early
- Never modify lib/models/ without explicit instruction
- Explain what you built in plain English after each phase

**Working in:**
GitHub Codespace — Flutter web for testing, Claude Code CLI in terminal.

**Repo:** github.com/annette-a/text-to-pecs

---

## 1. THE PROJECT — Text to PECS

### What it is
A Flutter app that photographs real-world printed text — menus,
activity boards, shelf labels — and converts it into a PECS-style
visual choice grid. The person taps their choice. The app reads
it aloud. Their carer is optionally notified.

### Who uses it
People with complex communication needs who rely on PECS (Picture
Exchange Communication System) — and the support workers and
carers who work alongside them.

### The problem it solves
PECS works brilliantly in configured environments. But the real
world is not configured. A café menu is a wall of text. A bus
timetable is incomprehensible. An activity board has no pictures.

This app brings PECS capability to any printed text, anywhere,
on demand. It extends autonomy into environments that were never
designed with these users in mind.

---

## 2. TECH STACK

| Layer | Technology |
|---|---|
| Framework | Flutter 3.x stable |
| Language | Dart |
| State management | Riverpod |
| OCR — device | google_mlkit_text_recognition |
| OCR — web/fallback | http + Gemini API |
| Semantic layer | tflite_flutter + MiniLM embeddings |
| TTS | flutter_tts |
| Storage | sqflite |
| Camera/image | image_picker |
| Testing | flutter_test + mockito |
| Notifications | flutter_local_notifications |

### Design language
- Vibe: High contrast, calm, uncluttered — nothing competes
  with the content
- Tiles: Rounded rectangles, minimum 80×80px, bold label below
- Colours: White background, deep blue (#1A237E) accent,
  high contrast text (#212121 on white)
- Font: System default — never override with decorative fonts
- Animation: None — no transitions, no bounces, nothing that
  could be distressing or confusing
- Errors: Never show error dialogs — show a friendly retry tile

---

## 3. FEATURES — V1 SCOPE

### Must have

1. **Scan screen**
   - Full-screen camera view
   - Single large "Scan" button — no countdown, no timer
   - Image picker fallback (choose from photo library)
   - Processing indicator: animated dots, text "Finding your choices..."
   - If processing fails: large retry tile, no error dialog

2. **PECS grid — category screen**
   - Maximum 6 category tiles per screen
   - Each tile: category name + representative emoji
   - "More" tile if >6 categories
   - Back tile always visible

3. **PECS grid — item screen**
   - Maximum 6 item tiles per screen
   - Each tile: item name + detail (e.g. price) below name
   - TTS reads label aloud on tap
   - Back tile always visible
   - Pagination if >6 items

4. **Choice confirmation screen**
   - Large text: "You chose [item]"
   - TTS reads it aloud automatically
   - "Change my mind" button — returns to item screen
   - Confirms after 5 seconds or explicit confirm tap

5. **Favourites**
   - Items chosen 3+ times are offered as quick-access tiles
   - Guardian/carer can clear favourites
   - Stored locally via sqflite

6. **Mock mode**
   - MockOcrService always available
   - Returns a realistic café menu dataset
   - Activated automatically on web builds
   - Allows full UI testing without camera or ML Kit

### Out of scope for v1
- User accounts or profiles
- Multiple person support (single user only)
- Carer notification (architecture ready, implementation v2)
- Custom PECS images (text labels only for v1)
- Handwriting recognition
- Languages other than English (architecture ready, v2)

### Seed data for MockOcrService
```dart
// Always return this dataset from MockOcrService
const mockMenuData = [
  PecsCategory(
    label: 'Drinks',
    emoji: '🥤',
    items: [
      PecsItem(label: 'Lemonade', detail: r'$4.50'),
      PecsItem(label: 'Orange Juice', detail: r'$5.00'),
      PecsItem(label: 'Water', detail: r'$2.00'),
      PecsItem(label: 'Flat White', detail: r'$4.50'),
      PecsItem(label: 'Hot Chocolate', detail: r'$5.50'),
    ],
  ),
  PecsCategory(
    label: 'Mains',
    emoji: '🍔',
    items: [
      PecsItem(label: 'Chicken Burger', detail: r'$16.00'),
      PecsItem(label: 'Fish and Chips', detail: r'$18.00'),
      PecsItem(label: 'Cheese Pizza', detail: r'$15.00'),
      PecsItem(label: 'Pasta', detail: r'$14.00'),
    ],
  ),
  PecsCategory(
    label: 'Snacks',
    emoji: '🍟',
    items: [
      PecsItem(label: 'Chips', detail: r'$6.00'),
      PecsItem(label: 'Garlic Bread', detail: r'$5.00'),
      PecsItem(label: 'Salad', detail: r'$8.00'),
    ],
  ),
  PecsCategory(
    label: 'Dessert',
    emoji: '🍰',
    items: [
      PecsItem(label: 'Ice Cream', detail: r'$6.50'),
      PecsItem(label: 'Chocolate Cake', detail: r'$7.00'),
    ],
  ),
];
```

---

## 4. NON-NEGOTIABLE RULES

These rules must never be broken regardless of what is being built.

1. **MockOcrService must always return valid data** — if it breaks,
   all UI work across all contributors breaks. Treat it as sacred.

2. **lib/models/ requires discussion** — never modify shared models
   without opening a GitHub Discussion and getting agreement first.

3. **Every PR needs a passing test** — `flutter test` must pass
   with 0 failures before any PR is raised.

4. **`flutter build web` must pass** — before any PR is raised.

5. **No API keys in code** — ever. Not in comments. Not in tests.
   Not anywhere in the repository.

6. **PECS design principles are non-negotiable** — see CLAUDE.md.
   Maximum 6 tiles, minimum 80×80px, TTS on every tile, back always
   visible, no timers that dismiss.

7. **Accessibility first** — minimum 48×48px touch targets (80×80
   for PECS tiles), high contrast, screen reader labels on everything.

8. **No component file over 150 lines** — split into smaller widgets.

---

## 5. REGRESSION ANCHORS

These must never break. Reviewer agent checks after every phase.

- `flutter test` passes with 0 failures
- `flutter build web` completes with 0 errors
- `flutter analyze` returns 0 errors (warnings acceptable)
- MockOcrService.scan() returns a non-empty List<PecsCategory>
- PecsGridScreen renders with mock data — no exceptions
- All PECS tiles are minimum 80×80px (widget test assertion)
- TTS fires on tile tap (verified in integration test with mock TTS)
- Back navigation works from every screen (widget test)
- No hardcoded API keys anywhere in the repository

---

## 6. DATABASE SCHEMA (sqflite)

```dart
// Favourites table
// Created via migration — never edit the db file directly

CREATE TABLE favourites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_label TEXT NOT NULL,
  item_detail TEXT,
  category_label TEXT NOT NULL,
  scan_count INTEGER NOT NULL DEFAULT 1,
  last_chosen TEXT NOT NULL,  -- ISO8601 datetime
  created_at TEXT NOT NULL    -- ISO8601 datetime
);

CREATE TABLE scan_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scan_id TEXT NOT NULL UNIQUE,  -- UUID
  raw_text TEXT,                 -- for audit only
  context_detected TEXT,         -- "menu" | "shelf" | "general"
  choice_made TEXT,              -- item label chosen, if any
  created_at TEXT NOT NULL
);
```

---

## 7. FOLDER STRUCTURE (target)

```
text-to-pecs/
├── .devcontainer/
│   ├── devcontainer.json         ← Codespace config
│   └── setup.sh                  ← Auto-installs Flutter + Claude Code
├── .claude/
│   ├── skills/
│   │   ├── pecs-design-rules.md
│   │   ├── no-modify-shared-models.md
│   │   ├── api-key-safety.md
│   │   └── test-before-pr.md
│   └── agents/
│       ├── planner.md
│       ├── implementer.md
│       ├── reviewer.md
│       └── pecs-domain.md
├── CLAUDE.md                     ← Auto-read by Claude Code
├── CONTRIBUTING.md               ← For Coding Circle participants
├── WELCOME.md                    ← First file opened in Codespace
├── TEXT_TO_PECS_INSTRUCTIONS.md  ← This document
├── pubspec.yaml
├── lib/
│   ├── main.dart
│   ├── models/                   ← Shared — do not modify without discussion
│   │   ├── pecs_category.dart
│   │   ├── pecs_item.dart
│   │   └── scan_result.dart
│   ├── services/
│   │   ├── ocr/
│   │   │   ├── ocr_service.dart          ← Abstract interface
│   │   │   ├── mlkit_ocr_service.dart    ← Android/iOS
│   │   │   ├── api_ocr_service.dart      ← Gemini fallback
│   │   │   └── mock_ocr_service.dart     ← Testing + web
│   │   ├── semantic/
│   │   │   ├── semantic_service.dart     ← Abstract interface
│   │   │   ├── embedding_service.dart    ← MiniLM on-device
│   │   │   └── pecs_categories.dart      ← Seed vectors
│   │   ├── tts/
│   │   │   ├── tts_service.dart          ← Abstract interface
│   │   │   └── flutter_tts_service.dart  ← Implementation
│   │   └── storage/
│   │       ├── storage_service.dart      ← Abstract interface
│   │       └── sqflite_storage_service.dart
│   ├── screens/
│   │   ├── scan/
│   │   │   └── scan_screen.dart
│   │   ├── pecs_grid/
│   │   │   ├── pecs_grid_screen.dart
│   │   │   ├── category_grid.dart
│   │   │   └── item_grid.dart
│   │   └── confirmation/
│   │       └── confirmation_screen.dart
│   ├── widgets/
│   │   ├── pecs_tile.dart               ← The core tile widget
│   │   ├── back_tile.dart
│   │   └── retry_tile.dart
│   └── providers/                       ← Riverpod providers
│       ├── ocr_provider.dart
│       ├── pecs_provider.dart
│       └── tts_provider.dart
└── test/
    ├── models/
    ├── services/
    │   └── mock_ocr_service_test.dart
    ├── screens/
    │   └── pecs_grid_screen_test.dart
    └── widgets/
        └── pecs_tile_test.dart
```

---

## 8. SHARED MODELS (build these first — everything else depends on them)

These must be built before any other module. One person builds
them, raises a PR, it gets merged, then everyone else can start.

```dart
// lib/models/pecs_item.dart
class PecsItem {
  final String id;        // UUID
  final String label;     // Display name — "Lemonade"
  final String? detail;   // Sub-label — "$4.50" or null
  final String? emoji;    // Optional emoji icon
  final bool isFavourite; // From storage service

  const PecsItem({
    required this.id,
    required this.label,
    this.detail,
    this.emoji,
    this.isFavourite = false,
  });
}

// lib/models/pecs_category.dart
class PecsCategory {
  final String id;         // UUID
  final String label;      // "Drinks"
  final String emoji;      // "🥤"
  final List<PecsItem> items;

  const PecsCategory({
    required this.id,
    required this.label,
    required this.emoji,
    required this.items,
  });
}

// lib/models/scan_result.dart
class ScanResult {
  final String scanId;           // UUID
  final List<PecsCategory> categories;
  final String rawText;          // For audit log
  final String contextDetected;  // "menu" | "shelf" | "general"
  final double confidence;       // 0.0–1.0

  const ScanResult({
    required this.scanId,
    required this.categories,
    required this.rawText,
    required this.contextDetected,
    required this.confidence,
  });
}
```

---

## 9. SERVICE INTERFACES (build these second)

Abstract interfaces define the contract. Each module implements one.

```dart
// lib/services/ocr/ocr_service.dart
abstract class OcrService {
  /// Extract text from an image file path.
  /// Returns a ScanResult with categorised PECS items.
  /// Never throws — returns ScanResult with empty categories on failure.
  Future<ScanResult> scan(String imagePath);

  /// Whether this service works in the current environment.
  bool get isAvailable;
}

// lib/services/semantic/semantic_service.dart
abstract class SemanticService {
  /// Group extracted text blocks into PECS categories.
  /// Uses embedding similarity against seed vectors.
  Future<List<PecsCategory>> categorise(List<String> textBlocks);
}

// lib/services/tts/tts_service.dart
abstract class TtsService {
  /// Speak the given text aloud.
  Future<void> speak(String text);

  /// Stop any current speech.
  Future<void> stop();

  /// Whether TTS is available.
  bool get isAvailable;
}

// lib/services/storage/storage_service.dart
abstract class StorageService {
  /// Record a choice — increments scan count for favourites.
  Future<void> recordChoice(PecsItem item, PecsCategory category);

  /// Return items chosen 3+ times, most frequent first.
  Future<List<PecsItem>> getFavourites();

  /// Clear all favourites.
  Future<void> clearFavourites();
}
```

---

## 10. PECS TILE WIDGET (core shared widget — handle with care)

```dart
// lib/widgets/pecs_tile.dart
// This widget is used everywhere. Keep it simple and robust.
//
// Requirements:
// - Minimum 80×80px touch target
// - Label always visible below any emoji/icon
// - Calls tts.speak(label) on tap
// - Calls onTap callback after TTS starts (not after it finishes)
// - High contrast: dark text on light background
// - No animation on tap — just visual press state
// - Accessible: Semantics widget wrapping, label set

class PecsTile extends StatelessWidget {
  final PecsItem item;          // or use label/detail directly
  final VoidCallback onTap;
  final TtsService tts;
  final double size;            // default 100.0

  // Implementation note:
  // Use InkWell for tap handling — gives material ripple
  // Container minimum size: size × size
  // Column: emoji (if present, 32px) + label (16px bold) + detail (12px grey)
  // Border: 2px solid Colors.grey.shade300
  // Border radius: 12px
  // Background: Colors.white
}
```

---

## 11. SEMANTIC LAYER — PECS CATEGORY SEED VECTORS

This is the key to offline categorisation. Each PECS category
has a list of seed phrases. The MiniLM model embeds both the
extracted menu item and the seed phrases. Cosine similarity
determines category assignment.

```dart
// lib/services/semantic/pecs_categories.dart

const Map<String, List<String>> pecsCategorySeeds = {
  'Drinks': [
    'drink', 'beverage', 'juice', 'water', 'coffee', 'tea',
    'lemonade', 'cola', 'soda', 'milkshake', 'smoothie',
    'beer', 'wine', 'hot chocolate', 'chai',
  ],
  'Mains': [
    'meal', 'main', 'lunch', 'dinner', 'burger', 'sandwich',
    'pasta', 'pizza', 'curry', 'steak', 'chicken', 'fish',
    'rice', 'wrap', 'bowl', 'soup', 'salad',
  ],
  'Snacks': [
    'snack', 'side', 'chips', 'fries', 'bread', 'dip',
    'garlic bread', 'spring rolls', 'wedges', 'nachos',
  ],
  'Dessert': [
    'dessert', 'sweet', 'cake', 'ice cream', 'pudding',
    'brownie', 'cheesecake', 'tart', 'biscuit', 'cookie',
  ],
  'Breakfast': [
    'breakfast', 'eggs', 'toast', 'pancakes', 'waffles',
    'bacon', 'cereal', 'porridge', 'muesli', 'omelette',
  ],
  'Ignore': [
    'allergen', 'contains', 'disclaimer', 'address', 'phone',
    'terms', 'conditions', 'wifi', 'password', 'opening hours',
    'gst', 'surcharge', 'public holiday',
  ],
};

// Confidence threshold: if best match < 0.65, use ApiOcrService fallback
const double confidenceThreshold = 0.65;
```

---

## 12. PHASED IMPLEMENTATION PLAN

⚠️ CRITICAL RULE FOR CLAUDE CODE: Complete each phase fully.
Show the required verification output. Do not proceed to the
next phase until verification passes. Explain what you did in
plain English after each phase.

---

### PHASE 1 — Project Initialisation

**What to do:**

1. Initialise Flutter project if pubspec.yaml doesn't exist:
```bash
flutter create . --project-name text_to_pecs --org com.axai
```

2. Replace pubspec.yaml with the correct dependencies:
```yaml
name: text_to_pecs
description: Converts printed text to PECS-style visual choices
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.4.0
  go_router: ^12.0.0
  google_mlkit_text_recognition: ^0.11.0
  tflite_flutter: ^0.10.4
  flutter_tts: ^3.8.5
  image_picker: ^1.0.4
  sqflite: ^2.3.0
  path_provider: ^2.1.1
  http: ^1.1.0
  uuid: ^4.2.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  mockito: ^5.4.3
  build_runner: ^2.4.6
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
```

3. Run `flutter pub get`

4. Create the .claude/ directory structure:
```bash
mkdir -p .claude/skills .claude/agents
```

5. Create all skill files (section 14) and agent files (section 15)

6. Create WELCOME.md

**Verification required before Phase 2:**
```bash
flutter pub get   # must complete without errors
flutter analyze   # must return 0 errors
flutter build web # must complete (empty app at this stage is fine)
```

---

### PHASE 2 — Shared Models

Build lib/models/ — all three files from section 8.
These are read-only to all other modules once merged.

```bash
mkdir -p lib/models
```

Create:
- `lib/models/pecs_item.dart`
- `lib/models/pecs_category.dart`
- `lib/models/scan_result.dart`

Write unit tests for each model:
- Constructor works with required fields
- Constructor works with optional fields null
- Equality works correctly

**Verification required before Phase 3:**
```bash
flutter test test/models/  # all pass
flutter analyze            # 0 errors
```

---

### PHASE 3 — Service Interfaces + MockOcrService

Build all abstract interfaces (section 9) and the MockOcrService.

MockOcrService is the most critical file in the project.
It must:
- Implement OcrService
- Return the full mock café menu from section 3
- Never throw
- Return instantly (no artificial delay)
- Work on all platforms including web

```dart
// lib/services/ocr/mock_ocr_service.dart
class MockOcrService implements OcrService {
  @override
  bool get isAvailable => true;

  @override
  Future<ScanResult> scan(String imagePath) async {
    // Return the seed data from section 3
    // This is the dataset all UI contributors test against
    return ScanResult(
      scanId: const Uuid().v4(),
      categories: mockMenuData,
      rawText: 'MOCK DATA — not from a real scan',
      contextDetected: 'menu',
      confidence: 1.0,
    );
  }
}
```

**Verification required before Phase 4:**
```bash
flutter test test/services/mock_ocr_service_test.dart
# Test: scan() returns non-empty List<PecsCategory>
# Test: scan() returns exactly 4 categories
# Test: first category has label "Drinks"
# Test: scan() never throws
flutter analyze  # 0 errors
```

---

### PHASE 4 — PecsTile Widget

Build the core tile widget from section 10.

This widget is used on every screen. Get it right before building
any screens.

Write widget tests:
- Tile renders with label
- Tile renders with detail below label
- Tile minimum size is 80×80px
- onTap is called when tapped
- Semantics label is set correctly

**Verification required before Phase 5:**
```bash
flutter test test/widgets/pecs_tile_test.dart  # all pass
flutter run -d web-server --web-port 8080 --web-hostname 0.0.0.0
# Open in browser — tile should render, check it looks right
flutter analyze  # 0 errors
```

---

### PHASE 5 — PECS Grid Screen

Build the category screen and item screen using PecsTile.

Uses MockOcrService — no camera integration yet.
Both screens built in this phase. Category → item → back flow.

```dart
// PecsGridScreen receives a ScanResult
// Shows category tiles first
// On category tap → shows item tiles for that category
// On item tap → goes to ConfirmationScreen
// Maximum 6 tiles per screen — no exceptions
// Back tile always in bottom-left
```

Write widget tests:
- Category screen renders with mock data
- Tapping a category navigates to item screen
- Item screen shows correct items
- Back tile navigates back
- More than 6 items shows pagination

**Verification required before Phase 6:**
```bash
flutter test test/screens/pecs_grid_screen_test.dart
flutter run -d web-server --web-port 8080 --web-hostname 0.0.0.0
# Open in browser
# Verify: tiles are big enough, labels readable, back works
flutter build web  # must pass
flutter analyze    # 0 errors
```

---

### PHASE 6 — Confirmation Screen + TTS

Build the confirmation screen and TTS service.

```dart
// ConfirmationScreen receives a PecsItem
// Shows "You chose [label]" in large text
// TTS speaks it automatically on screen load
// "Change my mind" button — goes back to item screen
// Confirm button (or 5 second auto-confirm)
// Records choice via StorageService
```

TTS service: implement FlutterTtsService wrapping flutter_tts.
For web: use Web Speech API via dart:js interop.

Write tests:
- Confirmation screen renders with item
- TTS mock is called on load
- Change my mind navigates back
- Choice is recorded in storage mock

**Verification required before Phase 7:**
```bash
flutter test
flutter run -d web-server --web-port 8080 --web-hostname 0.0.0.0
# Open in browser — tap through full flow:
# Start → category → item → confirmation
# Verify TTS fires (you should hear it)
flutter build web
flutter analyze
```

---

### PHASE 7 — Scan Screen

Build the camera/image picker screen.

On web: image_picker opens file picker (no camera on web — that's OK).
On device: opens camera directly.

Routing:
- Home screen shows "Scan Menu" button
- Tap → ScanScreen opens
- Image selected → OcrService.scan() called
- Loading indicator shown during scan
- ScanResult → PecsGridScreen

Platform detection:
```dart
// Use kIsWeb to select service
final ocrService = kIsWeb
  ? MockOcrService()         // Web always uses mock
  : MlKitOcrService();       // Real device uses ML Kit
```

**Verification required before Phase 8:**
```bash
flutter test
flutter run -d web-server --web-port 8080 --web-hostname 0.0.0.0
# Open in browser — full flow from scan button to confirmation
# Check: loading indicator appears, mock data loads correctly
flutter build web
flutter analyze
```

---

### PHASE 8 — Favourites

Build StorageService + sqflite implementation.
Build favourites display on home screen.

Items chosen 3+ times appear as quick-access tiles on the home
screen. No categories — just the items directly, most frequent first.

Maximum 6 favourite tiles shown.
"Clear favourites" action (with confirmation — never silent).

**Verification required before Phase 9:**
```bash
flutter test
# Verify: choosing same item 3 times creates a favourite
# Verify: favourites appear on home screen
# Verify: clear favourites removes them (with confirmation)
flutter build web
flutter analyze
```

---

### PHASE 9 — Final Polish

1. Run `flutter analyze` — fix all warnings (not just errors)
2. Run `flutter test` — must be 0 failures
3. Run `flutter build web` — must be clean
4. Check all regression anchors from section 5
5. Review PECS design principles against every screen
6. Check all touch targets are minimum 80×80px
7. Check back navigation from every screen
8. Check TTS fires on every tile tap

**Final verification — ALL must pass:**
```bash
flutter analyze   # 0 errors, 0 warnings
flutter test      # 0 failures
flutter build web # clean build
# Manual check in browser:
# Scan → category → item → confirmation flow works
# TTS fires
# Back works everywhere
# Tiles are big enough
# High contrast maintained
```

---

## 13. WELCOME.md

```markdown
# Welcome to Text to PECS 👋

This is the Coding Circle project folder.

## What we're building
An app that photographs menus and turns them into big, simple,
tap-to-choose picture tiles — so people like Axel can make real
choices in cafés, not just at home.

## Set your API key first
In the terminal:
  echo 'export ANTHROPIC_API_KEY=sk-ant-your-key-here' >> ~/.bashrc
  source ~/.bashrc

Get a key from: https://console.anthropic.com/settings/keys

## Start Claude Code
  claude

## Read before building
- CLAUDE.md — architecture, rules, module ownership
- CONTRIBUTING.md — how to contribute step by step
- TEXT_TO_PECS_INSTRUCTIONS.md — full technical spec

## Test the app
  flutter run -d web-server --web-port 8080 --web-hostname 0.0.0.0
Then click "Open in Browser" when VS Code prompts you.

## Circle meets fortnightly
Wednesdays 7:00–8:30 PM AEDT
```

---

## 14. SKILLS (load into .claude/skills/)

**.claude/skills/pecs-design-rules.md**
```markdown
# Skill: PECS Design Rules

## These are non-negotiable

- Maximum 6 tiles per screen — never more
- Minimum tile size: 80×80px
- Label visible below every tile — never icon-only
- TTS fires on every tile tap
- Back tile always visible and always works
- No timers that auto-dismiss
- No error dialogs — use retry tiles instead
- High contrast: #212121 text on #FFFFFF background minimum
- No animations of any kind
- No double-tap or long-press interactions

## Why
These constraints come from how Axel actually uses PECS.
They are not preferences. They are requirements.
```

**.claude/skills/no-modify-shared-models.md**
```markdown
# Skill: Shared Models Are Sacred

## Rule
Never modify any file in lib/models/ without:
1. An open GitHub Discussion with agreement from the team
2. Explicit instruction in the current session

## If you think a model needs changing
Stop. Raise it in GitHub Discussions. Wait for agreement.
Do not proceed without it.
```

**.claude/skills/api-key-safety.md**
```markdown
# Skill: API Key Safety

## Rule
Never write an API key, token, or secret anywhere in the project.
Not in code. Not in comments. Not in tests. Not in .env files
that could be committed. Not anywhere.

## Where keys live
Only in each contributor's personal ~/.bashrc on their Codespace.
```

**.claude/skills/test-before-pr.md**
```markdown
# Skill: Test Before PR

## Rule
Before raising any PR, these must all pass:

  flutter test      ← 0 failures
  flutter build web ← clean build
  flutter analyze   ← 0 errors

Show the output. Do not claim they pass without showing output.
```

---

## 15. AGENTS (load into .claude/agents/)

**.claude/agents/planner.md**
```markdown
# Agent: Planner

## Role
Propose work. Never implement.

## Before any new feature
1. Read CLAUDE.md
2. Read the relevant service interface
3. Check which module is being worked on
4. Write a step-by-step plan
5. Show the plan — get agreement before proceeding

## Output format
Plan: [Feature/Module Name]
Module: [which module this is]
Owner: [claimed by whom]
Steps: [numbered list]
Tests needed: [list]
Risks: [anything tricky]
```

**.claude/agents/implementer.md**
```markdown
# Agent: Implementer

## Role
Do the work. Show evidence. Never claim done without proof.

## Definition of done
1. flutter test passes — show output
2. flutter build web passes — show output
3. Running in browser and checked visually

## Rules
- Write comments — contributors are learning by reading
- Keep files under 150 lines — split early
- Follow PECS design rules skill at all times
- Never modify lib/models/ without explicit instruction
```

**.claude/agents/reviewer.md**
```markdown
# Agent: Reviewer

## Role
Check the evidence. Protect the regression anchors.

## Checklist after every phase
- [ ] flutter test — 0 failures
- [ ] flutter build web — clean
- [ ] flutter analyze — 0 errors
- [ ] All PECS tiles minimum 80×80px
- [ ] Back navigation works from every screen
- [ ] No API keys anywhere in the repo
- [ ] No file over 150 lines
- [ ] MockOcrService still returns valid data

## On failure
List exactly what failed. Do not approve until all pass.
```

**.claude/agents/pecs-domain.md**
```markdown
# Agent: PECS Domain Expert

## Role
Guardian of the PECS design principles and user experience.
Consulted whenever a screen or interaction is being designed.

## Core principle
Axel sets the pace. The app never rushes him.
The app never confuses him. The app never traps him.

## Screen rules
- Maximum 6 tiles per screen
- Every screen has a back tile
- No timed dismissals
- No error dialogs
- TTS on every tap

## Tile rules
- Minimum 80×80px
- Label always below content
- High contrast always
- Single tap only

## Testing checklist for every screen
- Could Axel understand this without help?
- Could Axel navigate back from here?
- Is there anything on this screen that could cause anxiety?
  (flashing, unexpected sounds, sudden changes)
- Is the text readable at arm's length?
```

---

*End of TEXT_TO_PECS_CLAUDE_CODE_INSTRUCTIONS.md — version 1.0*
*Generated for Coding Circle — text-to-pecs project*
*Repo: github.com/annette-a/text-to-pecs*
