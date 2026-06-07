import {
  amberDark,
  blueDark,
  bronzeDark,
  brownDark,
  crimsonDark,
  cyanDark,
  goldDark,
  grassDark,
  greenDark,
  indigoDark,
  irisDark,
  jadeDark,
  limeDark,
  mintDark,
  orangeDark,
  pinkDark,
  plumDark,
  purpleDark,
  redDark,
  rubyDark,
  skyDark,
  tealDark,
  tomatoDark,
  violetDark,
  yellowDark,
} from "@radix-ui/colors";

export type StainedGlassColors = {
  "activityBar.background": string;
  "titleBar.activeBackground": string;
  "titleBar.activeForeground": string;
};

type RadixScale = Record<string, string>;

type PaletteDefinition = {
  name: string;
  scale: RadixScale;
};

const PALETTES: PaletteDefinition[] = [
  { name: "tomato", scale: tomatoDark },
  { name: "red", scale: redDark },
  { name: "ruby", scale: rubyDark },
  { name: "crimson", scale: crimsonDark },
  { name: "pink", scale: pinkDark },
  { name: "plum", scale: plumDark },
  { name: "purple", scale: purpleDark },
  { name: "violet", scale: violetDark },
  { name: "iris", scale: irisDark },
  { name: "indigo", scale: indigoDark },
  { name: "blue", scale: blueDark },
  { name: "cyan", scale: cyanDark },
  { name: "teal", scale: tealDark },
  { name: "jade", scale: jadeDark },
  { name: "green", scale: greenDark },
  { name: "grass", scale: grassDark },
  { name: "bronze", scale: bronzeDark },
  { name: "gold", scale: goldDark },
  { name: "brown", scale: brownDark },
  { name: "orange", scale: orangeDark },
  { name: "amber", scale: amberDark },
  { name: "yellow", scale: yellowDark },
  { name: "lime", scale: limeDark },
  { name: "mint", scale: mintDark },
  { name: "sky", scale: skyDark },
];

export type SelectedPalette = {
  name: string;
  colors: StainedGlassColors;
};

export function hashDirectoryName(directoryName: string): number {
  let hash = 0x811c9dc5;

  for (let index = 0; index < directoryName.length; index += 1) {
    hash ^= directoryName.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

export function selectPalette(directoryName: string): SelectedPalette {
  const palette = PALETTES[hashDirectoryName(directoryName) % PALETTES.length];

  return {
    name: palette.name,
    colors: {
      "activityBar.background": palette.scale[`${palette.name}3`],
      "titleBar.activeBackground": palette.scale[`${palette.name}4`],
      "titleBar.activeForeground": palette.scale[`${palette.name}12`],
    },
  };
}
