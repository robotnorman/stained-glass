#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

print_intro() {
  cat <<'EOF'

   .---------------------------------------------.
   |  []    []    []    []    []    []    []    |
   |     ____  _        _                _       |
   |    / ___|| |_ __ _(_)_ __   ___  __| |      |
   |    \___ \| __/ _` | | '_ \ / _ \/ _` |      |
   |     ___) | || (_| | | | | |  __/ (_| |      |
   |    |____/ \__\__,_|_|_| |_|\___|\__,_|      |
   |                                             |
   |        ____ _                               |
   |       / ___| | __ _ ___ ___                 |
   |      | |  _| |/ _` / __/ __|                |
   |      | |_| | | (_| \__ \__ \                |
   |       \____|_|\__,_|___/___/                |
   |                                             |
   |  Building and installing your local VSIX.   |
   '---------------------------------------------'

EOF
}

require_command() {
  local command_name="$1"
  local install_hint="$2"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Missing required command: $command_name" >&2
    echo "$install_hint" >&2
    exit 1
  fi
}

print_intro

require_command "node" "Install Node.js before running this script."
require_command "npm" "Install npm before running this script."
require_command "code" "In VS Code, run: Shell Command: Install 'code' command in PATH"

EXTENSION_NAME="$(node -p "require('./package.json').name")"
EXTENSION_VERSION="$(node -p "require('./package.json').version")"
VSIX_PATH="$ROOT_DIR/${EXTENSION_NAME}-${EXTENSION_VERSION}.vsix"

echo "Installing dependencies..."
npm install

echo "Compiling extension..."
npm run compile

echo "Packaging extension..."
npx --yes @vscode/vsce package --out "$VSIX_PATH"

echo "Installing $VSIX_PATH into VS Code..."
code --install-extension "$VSIX_PATH" --force

echo "Installed $EXTENSION_NAME $EXTENSION_VERSION."
