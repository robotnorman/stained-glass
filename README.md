# Stained Glass

Stained Glass is a VS Code extension that gives each workspace window a deterministic color treatment based on the root directory name.

The color palettes are selected from [Radix Colors](https://www.radix-ui.com/colors).

When a workspace opens, the extension selects a Radix Colors dark palette from a hash of the root folder name and fills missing workspace color customizations in `.vscode/settings.json`:

```json
{
  "workbench.colorCustomizations": {
    "activityBar.background": "#13332E",
    "titleBar.activeBackground": "#19423B",
    "titleBar.activeForeground": "#F6FBFB"
  }
}
```

Existing values for those keys are left unchanged.
