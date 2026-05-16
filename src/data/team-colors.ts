/** Team color palette. 14 swatches inspired by the design reference.
 *  Each value is a CSS color string used directly as a background for the team's
 *  letter avatar. The `contrast` field is what the letter ought to be rendered in. */
export type TeamColor = {
  id: string;
  /** Display label, used in aria-labels */
  label: string;
  /** Background color */
  bg: string;
  /** Foreground letter color */
  fg: string;
};

export const teamColors: TeamColor[] = [
  // Row 1
  { id: "black", label: "Black", bg: "#1a1a1a", fg: "#ffffff" },
  { id: "blue", label: "Blue", bg: "#2563eb", fg: "#ffffff" },
  { id: "pink", label: "Pink", bg: "#ec4899", fg: "#ffffff" },
  { id: "orange", label: "Orange", bg: "#f97316", fg: "#ffffff" },
  { id: "yellow", label: "Yellow", bg: "#eab308", fg: "#1a1a1a" },
  { id: "brown", label: "Brown", bg: "#92400e", fg: "#ffffff" },
  { id: "neutral", label: "Neutral", bg: "#e5e5e5", fg: "#1a1a1a" },
  // Row 2
  { id: "green", label: "Green", bg: "#16a34a", fg: "#ffffff" },
  { id: "sky", label: "Sky", bg: "#0ea5e9", fg: "#ffffff" },
  { id: "red", label: "Red", bg: "#dc2626", fg: "#ffffff" },
  { id: "magenta", label: "Magenta", bg: "#d946ef", fg: "#ffffff" },
  { id: "teal", label: "Teal", bg: "#0d9488", fg: "#ffffff" },
  { id: "purple", label: "Purple", bg: "#9333ea", fg: "#ffffff" },
  { id: "gray", label: "Gray", bg: "#6b7280", fg: "#ffffff" },
];

/** Given a color value stored on a team (the `bg` string), find the matching foreground. */
export function getContrast(bg?: string): string | undefined {
  if (!bg) return undefined;
  const found = teamColors.find((c) => c.bg.toLowerCase() === bg.toLowerCase());
  return found?.fg;
}
