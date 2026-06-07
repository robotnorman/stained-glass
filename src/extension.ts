import * as path from "path";
import * as vscode from "vscode";
import { selectPalette } from "./radixPalettes";
import { mergeMissingColorCustomizations, SettingsJsonError } from "./settings";

const SETTINGS_DIRECTORY = ".vscode";
const SETTINGS_FILE = "settings.json";

export async function activate(): Promise<void> {
  const rootFolder = vscode.workspace.workspaceFolders?.[0];

  if (!rootFolder) {
    return;
  }

  const directoryName = path.basename(rootFolder.uri.fsPath);
  const selectedPalette = selectPalette(directoryName);
  const settingsDirectoryUri = vscode.Uri.joinPath(rootFolder.uri, SETTINGS_DIRECTORY);
  const settingsUri = vscode.Uri.joinPath(settingsDirectoryUri, SETTINGS_FILE);

  try {
    const currentSettings = await readSettings(settingsUri);
    const mergedSettings = mergeMissingColorCustomizations(currentSettings, selectedPalette.colors);

    if (!mergedSettings.changed) {
      return;
    }

    await vscode.workspace.fs.createDirectory(settingsDirectoryUri);
    await vscode.workspace.fs.writeFile(settingsUri, Buffer.from(mergedSettings.text, "utf8"));
  } catch (error) {
    if (error instanceof SettingsJsonError) {
      vscode.window.showWarningMessage(`Stained Glass skipped workspace colors. ${error.message}`);
      return;
    }

    throw error;
  }
}

export function deactivate(): void {
  return undefined;
}

async function readSettings(settingsUri: vscode.Uri): Promise<string> {
  try {
    const file = await vscode.workspace.fs.readFile(settingsUri);
    return Buffer.from(file).toString("utf8");
  } catch (error) {
    if (isFileNotFound(error)) {
      return "{}";
    }

    throw error;
  }
}

function isFileNotFound(error: unknown): boolean {
  return (
    error instanceof vscode.FileSystemError &&
    (error.code === "FileNotFound" || error.name === "EntryNotFound")
  );
}
