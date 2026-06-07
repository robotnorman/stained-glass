import assert from "node:assert/strict";
import test from "node:test";
import { mergeMissingColorCustomizations, SettingsJsonError } from "../src/settings";
import type { StainedGlassColors } from "../src/radixPalettes";

const colors: StainedGlassColors = {
  "activityBar.background": "#111111",
  "titleBar.activeBackground": "#222222",
  "titleBar.activeForeground": "#ffffff",
};

test("mergeMissingColorCustomizations writes all missing color keys", () => {
  const result = mergeMissingColorCustomizations("{}", colors);
  const parsed = JSON.parse(result.text);

  assert.equal(result.changed, true);
  assert.deepEqual(result.insertedKeys, Object.keys(colors));
  assert.deepEqual(parsed["workbench.colorCustomizations"], colors);
});

test("mergeMissingColorCustomizations preserves manually configured keys", () => {
  const result = mergeMissingColorCustomizations(
    `{
  // user settings are valid JSONC
  "workbench.colorCustomizations": {
    "activityBar.background": "#abcdef"
  }
}`,
    colors,
  );
  const parsed = JSON.parse(stripLineComments(result.text));

  assert.equal(parsed["workbench.colorCustomizations"]["activityBar.background"], "#abcdef");
  assert.equal(parsed["workbench.colorCustomizations"]["titleBar.activeBackground"], "#222222");
  assert.equal(parsed["workbench.colorCustomizations"]["titleBar.activeForeground"], "#ffffff");
});

test("mergeMissingColorCustomizations does not change fully configured settings", () => {
  const input = JSON.stringify(
    {
      "workbench.colorCustomizations": colors,
    },
    null,
    2,
  );
  const result = mergeMissingColorCustomizations(input, colors);

  assert.equal(result.changed, false);
  assert.equal(result.text, input);
  assert.deepEqual(result.insertedKeys, []);
});

test("mergeMissingColorCustomizations rejects invalid settings JSONC", () => {
  assert.throws(
    () => mergeMissingColorCustomizations("{", colors),
    SettingsJsonError,
  );
});

function stripLineComments(text: string): string {
  return text.replace(/^\s*\/\/.*$/gm, "");
}
