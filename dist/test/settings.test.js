"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const settings_1 = require("../src/settings");
const colors = {
    "activityBar.background": "#111111",
    "activityBar.activeBackground": "#333333",
    "titleBar.activeBackground": "#222222",
    "titleBar.activeForeground": "#ffffff",
    "titleBar.inactiveBackground": "#000000",
    "titleBar.inactiveForeground": "#cccccc",
};
(0, node_test_1.default)("mergeMissingColorCustomizations writes all missing color keys", () => {
    const result = (0, settings_1.mergeMissingColorCustomizations)("{}", colors);
    const parsed = JSON.parse(result.text);
    strict_1.default.equal(result.changed, true);
    strict_1.default.deepEqual(result.insertedKeys, Object.keys(colors));
    strict_1.default.deepEqual(parsed["workbench.colorCustomizations"], colors);
});
(0, node_test_1.default)("mergeMissingColorCustomizations preserves manually configured keys", () => {
    const result = (0, settings_1.mergeMissingColorCustomizations)(`{
  // user settings are valid JSONC
  "workbench.colorCustomizations": {
    "activityBar.background": "#abcdef"
  }
}`, colors);
    const parsed = JSON.parse(stripLineComments(result.text));
    strict_1.default.equal(parsed["workbench.colorCustomizations"]["activityBar.background"], "#abcdef");
    strict_1.default.equal(parsed["workbench.colorCustomizations"]["activityBar.activeBackground"], "#333333");
    strict_1.default.equal(parsed["workbench.colorCustomizations"]["titleBar.activeBackground"], "#222222");
    strict_1.default.equal(parsed["workbench.colorCustomizations"]["titleBar.activeForeground"], "#ffffff");
    strict_1.default.equal(parsed["workbench.colorCustomizations"]["titleBar.inactiveBackground"], "#000000");
    strict_1.default.equal(parsed["workbench.colorCustomizations"]["titleBar.inactiveForeground"], "#cccccc");
});
(0, node_test_1.default)("mergeMissingColorCustomizations does not change fully configured settings", () => {
    const input = JSON.stringify({
        "workbench.colorCustomizations": colors,
    }, null, 2);
    const result = (0, settings_1.mergeMissingColorCustomizations)(input, colors);
    strict_1.default.equal(result.changed, false);
    strict_1.default.equal(result.text, input);
    strict_1.default.deepEqual(result.insertedKeys, []);
});
(0, node_test_1.default)("mergeMissingColorCustomizations rejects invalid settings JSONC", () => {
    strict_1.default.throws(() => (0, settings_1.mergeMissingColorCustomizations)("{", colors), settings_1.SettingsJsonError);
});
function stripLineComments(text) {
    return text.replace(/^\s*\/\/.*$/gm, "");
}
