"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const radixPalettes_1 = require("./radixPalettes");
const settings_1 = require("./settings");
const SETTINGS_DIRECTORY = ".vscode";
const SETTINGS_FILE = "settings.json";
async function activate() {
    const rootFolder = vscode.workspace.workspaceFolders?.[0];
    if (!rootFolder) {
        return;
    }
    const directoryName = path.basename(rootFolder.uri.fsPath);
    const selectedPalette = (0, radixPalettes_1.selectPalette)(directoryName);
    const settingsDirectoryUri = vscode.Uri.joinPath(rootFolder.uri, SETTINGS_DIRECTORY);
    const settingsUri = vscode.Uri.joinPath(settingsDirectoryUri, SETTINGS_FILE);
    try {
        const currentSettings = await readSettings(settingsUri);
        const mergedSettings = (0, settings_1.mergeMissingColorCustomizations)(currentSettings, selectedPalette.colors);
        if (!mergedSettings.changed) {
            return;
        }
        await vscode.workspace.fs.createDirectory(settingsDirectoryUri);
        await vscode.workspace.fs.writeFile(settingsUri, Buffer.from(mergedSettings.text, "utf8"));
    }
    catch (error) {
        if (error instanceof settings_1.SettingsJsonError) {
            vscode.window.showWarningMessage(`Stained Glass skipped workspace colors. ${error.message}`);
            return;
        }
        throw error;
    }
}
function deactivate() {
    return undefined;
}
async function readSettings(settingsUri) {
    try {
        const file = await vscode.workspace.fs.readFile(settingsUri);
        return Buffer.from(file).toString("utf8");
    }
    catch (error) {
        if (isFileNotFound(error)) {
            return "{}";
        }
        throw error;
    }
}
function isFileNotFound(error) {
    return (error instanceof vscode.FileSystemError &&
        (error.code === "FileNotFound" || error.name === "EntryNotFound"));
}
