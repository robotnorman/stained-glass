import { applyEdits, modify, parse, ParseError, printParseErrorCode } from "jsonc-parser";
import type { StainedGlassColors } from "./radixPalettes";

const COLOR_CUSTOMIZATIONS_KEY = "workbench.colorCustomizations";

export type SettingsMergeResult = {
  changed: boolean;
  text: string;
  insertedKeys: string[];
};

export class SettingsJsonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SettingsJsonError";
  }
}

export function mergeMissingColorCustomizations(
  settingsText: string,
  colors: StainedGlassColors,
): SettingsMergeResult {
  const sourceText = settingsText.trim().length === 0 ? "{}" : settingsText;
  const settings = parseSettings(sourceText);
  const colorCustomizations = getColorCustomizations(settings);
  const insertedKeys: string[] = [];
  let nextText = sourceText;

  for (const [key, value] of Object.entries(colors)) {
    if (Object.prototype.hasOwnProperty.call(colorCustomizations, key)) {
      continue;
    }

    nextText = applyEdits(
      nextText,
      modify(nextText, [COLOR_CUSTOMIZATIONS_KEY, key], value, {
        formattingOptions: {
          insertSpaces: true,
          tabSize: 2,
        },
      }),
    );
    insertedKeys.push(key);
  }

  return {
    changed: insertedKeys.length > 0,
    text: nextText,
    insertedKeys,
  };
}

function parseSettings(settingsText: string): Record<string, unknown> {
  const errors: ParseError[] = [];
  const parsed = parse(settingsText, errors, {
    allowTrailingComma: true,
    disallowComments: false,
  });

  if (errors.length > 0) {
    const details = errors
      .map((error) => printParseErrorCode(error.error))
      .join(", ");
    throw new SettingsJsonError(`Could not parse .vscode/settings.json: ${details}`);
  }

  if (!isRecord(parsed)) {
    throw new SettingsJsonError(".vscode/settings.json must contain a JSON object.");
  }

  return parsed;
}

function getColorCustomizations(settings: Record<string, unknown>): Record<string, unknown> {
  const value = settings[COLOR_CUSTOMIZATIONS_KEY];

  if (value === undefined) {
    return {};
  }

  if (!isRecord(value)) {
    throw new SettingsJsonError(`${COLOR_CUSTOMIZATIONS_KEY} must be a JSON object.`);
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
