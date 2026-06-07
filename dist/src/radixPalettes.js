"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashDirectoryName = hashDirectoryName;
exports.selectPalette = selectPalette;
const colors_1 = require("@radix-ui/colors");
const PALETTES = [
    { name: "tomato", scale: colors_1.tomatoDark },
    { name: "red", scale: colors_1.redDark },
    { name: "ruby", scale: colors_1.rubyDark },
    { name: "crimson", scale: colors_1.crimsonDark },
    { name: "pink", scale: colors_1.pinkDark },
    { name: "plum", scale: colors_1.plumDark },
    { name: "purple", scale: colors_1.purpleDark },
    { name: "violet", scale: colors_1.violetDark },
    { name: "iris", scale: colors_1.irisDark },
    { name: "indigo", scale: colors_1.indigoDark },
    { name: "blue", scale: colors_1.blueDark },
    { name: "cyan", scale: colors_1.cyanDark },
    { name: "teal", scale: colors_1.tealDark },
    { name: "jade", scale: colors_1.jadeDark },
    { name: "green", scale: colors_1.greenDark },
    { name: "grass", scale: colors_1.grassDark },
    { name: "bronze", scale: colors_1.bronzeDark },
    { name: "gold", scale: colors_1.goldDark },
    { name: "brown", scale: colors_1.brownDark },
    { name: "orange", scale: colors_1.orangeDark },
    { name: "amber", scale: colors_1.amberDark },
    { name: "yellow", scale: colors_1.yellowDark },
    { name: "lime", scale: colors_1.limeDark },
    { name: "mint", scale: colors_1.mintDark },
    { name: "sky", scale: colors_1.skyDark },
];
function hashDirectoryName(directoryName) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < directoryName.length; index += 1) {
        hash ^= directoryName.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
}
function selectPalette(directoryName) {
    const palette = PALETTES[hashDirectoryName(directoryName) % PALETTES.length];
    return {
        name: palette.name,
        colors: {
            "activityBar.background": palette.scale[`${palette.name}3`],
            "activityBar.activeBackground": palette.scale[`${palette.name}5`],
            "titleBar.activeBackground": palette.scale[`${palette.name}4`],
            "titleBar.activeForeground": palette.scale[`${palette.name}12`],
            "titleBar.inactiveBackground": palette.scale[`${palette.name}2`],
            "titleBar.inactiveForeground": palette.scale[`${palette.name}11`],
        },
    };
}
