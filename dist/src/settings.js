"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsJsonError = void 0;
exports.mergeMissingColorCustomizations = mergeMissingColorCustomizations;
const jsonc_parser_1 = require("jsonc-parser");
const COLOR_CUSTOMIZATIONS_KEY = "workbench.colorCustomizations";
class SettingsJsonError extends Error {
    constructor(message) {
        super(message);
        this.name = "SettingsJsonError";
    }
}
exports.SettingsJsonError = SettingsJsonError;
function mergeMissingColorCustomizations(settingsText, colors) {
    const sourceText = settingsText.trim().length === 0 ? "{}" : settingsText;
    const settings = parseSettings(sourceText);
    const colorCustomizations = getColorCustomizations(settings);
    const insertedKeys = [];
    let nextText = sourceText;
    for (const [key, value] of Object.entries(colors)) {
        if (Object.prototype.hasOwnProperty.call(colorCustomizations, key)) {
            continue;
        }
        nextText = (0, jsonc_parser_1.applyEdits)(nextText, (0, jsonc_parser_1.modify)(nextText, [COLOR_CUSTOMIZATIONS_KEY, key], value, {
            formattingOptions: {
                insertSpaces: true,
                tabSize: 2,
            },
        }));
        insertedKeys.push(key);
    }
    return {
        changed: insertedKeys.length > 0,
        text: nextText,
        insertedKeys,
    };
}
function parseSettings(settingsText) {
    const errors = [];
    const parsed = (0, jsonc_parser_1.parse)(settingsText, errors, {
        allowTrailingComma: true,
        disallowComments: false,
    });
    if (errors.length > 0) {
        const details = errors
            .map((error) => (0, jsonc_parser_1.printParseErrorCode)(error.error))
            .join(", ");
        throw new SettingsJsonError(`Could not parse .vscode/settings.json: ${details}`);
    }
    if (!isRecord(parsed)) {
        throw new SettingsJsonError(".vscode/settings.json must contain a JSON object.");
    }
    return parsed;
}
function getColorCustomizations(settings) {
    const value = settings[COLOR_CUSTOMIZATIONS_KEY];
    if (value === undefined) {
        return {};
    }
    if (!isRecord(value)) {
        throw new SettingsJsonError(`${COLOR_CUSTOMIZATIONS_KEY} must be a JSON object.`);
    }
    return value;
}
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
