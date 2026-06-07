"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const radixPalettes_1 = require("../src/radixPalettes");
(0, node_test_1.default)("hashDirectoryName returns a stable unsigned hash", () => {
    strict_1.default.equal((0, radixPalettes_1.hashDirectoryName)("stained-glass"), (0, radixPalettes_1.hashDirectoryName)("stained-glass"));
    strict_1.default.equal(Number.isInteger((0, radixPalettes_1.hashDirectoryName)("stained-glass")), true);
    strict_1.default.equal((0, radixPalettes_1.hashDirectoryName)("stained-glass") >= 0, true);
});
(0, node_test_1.default)("selectPalette returns deterministic Radix dark scale window colors", () => {
    const first = (0, radixPalettes_1.selectPalette)("stained-glass");
    const second = (0, radixPalettes_1.selectPalette)("stained-glass");
    strict_1.default.deepEqual(first, second);
    strict_1.default.match(first.colors["activityBar.background"], /^#/);
    strict_1.default.match(first.colors["activityBar.activeBackground"], /^#/);
    strict_1.default.match(first.colors["titleBar.activeBackground"], /^#/);
    strict_1.default.match(first.colors["titleBar.activeForeground"], /^#/);
    strict_1.default.match(first.colors["titleBar.inactiveBackground"], /^#/);
    strict_1.default.match(first.colors["titleBar.inactiveForeground"], /^#/);
});
