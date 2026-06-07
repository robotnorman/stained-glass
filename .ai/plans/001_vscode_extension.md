# Build VS Code extension

## Goal

Create a VS Code extension named Stained Glass that gives each opened workspace window deterministic Radix-based workbench colors by writing missing color customization keys into the workspace settings file.

## Steps

1. Scaffold a TypeScript VS Code extension at the repository root with package metadata, TypeScript configuration, source, and tests.
2. Activate the extension when VS Code starts so it can color the window immediately after a workspace opens.
3. Hash the root workspace directory name and map it to a Radix color scale.
4. Generate these workspace settings from the selected palette:
   - `workbench.colorCustomizations.activityBar.background`
   - `workbench.colorCustomizations.titleBar.activeBackground`
   - `workbench.colorCustomizations.titleBar.activeForeground`
5. Preserve manual configuration by only filling keys that are currently missing.
6. Write changes to `<workspace>/.vscode/settings.json` while preserving valid JSONC settings.
7. Add focused tests for palette selection and settings merge behavior.
8. Run build and tests, then commit and open the PR.
