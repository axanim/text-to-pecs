#!/bin/bash
# .devcontainer/setup.sh
# Runs once when the Codespace is first created.
# Installs Flutter, Claude Code CLI, and project dependencies.

set -e

echo ""
echo "=========================================="
echo "  Text to PECS — Codespace Setup"
echo "  This runs once. Grab a coffee. ☕"
echo "=========================================="

# --- Flutter ---
echo ""
echo "📱 Installing Flutter..."

if [ ! -d "/opt/flutter" ]; then
  git clone https://github.com/flutter/flutter.git \
    -b stable --depth 1 /opt/flutter
  echo "✅ Flutter cloned"
else
  echo "ℹ️  Flutter already present — skipping"
fi

export PATH="$PATH:/opt/flutter/bin"

# Add to all future shells
echo 'export PATH="$PATH:/opt/flutter/bin"' >> /etc/profile.d/flutter.sh
chmod +x /etc/profile.d/flutter.sh

# Accept Android licenses and pre-download web SDK
flutter precache --web
echo "✅ Flutter web SDK ready"

# --- Claude Code CLI ---
echo ""
echo "🤖 Installing Claude Code CLI..."

npm install -g @anthropic-ai/claude-code
echo "✅ Claude Code installed: $(claude --version 2>/dev/null || echo 'installed')"

# --- Flutter web enable ---
flutter config --enable-web
echo "✅ Flutter web enabled"

# --- Project dependencies ---
echo ""
echo "📦 Installing project dependencies..."

if [ -f "pubspec.yaml" ]; then
  flutter pub get
  echo "✅ Dependencies installed"
else
  echo "ℹ️  No pubspec.yaml yet — run 'flutter pub get' after project init"
fi

echo ""
echo "=========================================="
echo "  ✅ Setup complete!"
echo ""
echo "  Next steps:"
echo "  1. Set your API key:"
echo "     echo 'export ANTHROPIC_API_KEY=sk-ant-...' >> ~/.bashrc"
echo "     source ~/.bashrc"
echo ""
echo "  2. Start Claude Code:"
echo "     claude"
echo ""
echo "  3. Read WELCOME.md for project context"
echo "=========================================="
