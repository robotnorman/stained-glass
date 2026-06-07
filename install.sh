#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

print_intro() {
  local reset=""
  local rose=""
  local gold=""
  local teal=""
  local iris=""

  if [[ -t 1 && -z "${NO_COLOR:-}" ]]; then
    reset=$'\033[0m'
    rose=$'\033[45m  \033[0m'
    gold=$'\033[43m  \033[0m'
    teal=$'\033[46m  \033[0m'
    iris=$'\033[44m  \033[0m'
  else
    rose="[]"
    gold="[]"
    teal="[]"
    iris="[]"
  fi

  printf '\n'
  printf '             +\n'
  printf '             |\n'
  printf '            / \\\n'
  printf '           /___\\\n'
  printf '             |\n'
  printf '        _____|_____\n'
  printf '       /     |     \\\n'
  printf '      /_____/ \\_____\\\n'
  printf '      |   .-"""-.   |\n'
  printf '      |  / %s%s \\  |\n' "$rose" "$gold"
  printf '      |  | %s%s |  |\n' "$teal" "$iris"
  printf '      |  \\_____/  |\n'
  printf '      |     _      |\n'
  printf '      |    | |     |\n'
  printf '      |____|_|_____|\n'
  printf '\n'
  printf '      Stained Glass installer%s\n' "$reset"
  printf '      Building your local VSIX.\n'
  printf '\n'
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

confirm_install() {
  local answer=""

  read -r -p "Build and install Stained Glass into VS Code? [y/N] " answer

  case "$answer" in
    y|Y|yes|YES)
      return 0
      ;;
    *)
      echo "Cancelled."
      exit 0
      ;;
  esac
}

print_intro
confirm_install

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
