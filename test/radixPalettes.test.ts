import assert from "node:assert/strict";
import test from "node:test";
import { hashDirectoryName, selectPalette } from "../src/radixPalettes";

test("hashDirectoryName returns a stable unsigned hash", () => {
  assert.equal(hashDirectoryName("stained-glass"), hashDirectoryName("stained-glass"));
  assert.equal(Number.isInteger(hashDirectoryName("stained-glass")), true);
  assert.equal(hashDirectoryName("stained-glass") >= 0, true);
});

test("selectPalette returns deterministic Radix dark scale window colors", () => {
  const first = selectPalette("stained-glass");
  const second = selectPalette("stained-glass");

  assert.deepEqual(first, second);
  assert.match(first.colors["activityBar.background"], /^#/);
  assert.match(first.colors["activityBar.activeBackground"], /^#/);
  assert.match(first.colors["titleBar.activeBackground"], /^#/);
  assert.match(first.colors["titleBar.activeForeground"], /^#/);
  assert.match(first.colors["titleBar.inactiveBackground"], /^#/);
  assert.match(first.colors["titleBar.inactiveForeground"], /^#/);
});
