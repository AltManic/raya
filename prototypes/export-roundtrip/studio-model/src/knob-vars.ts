import type { Knobs, System } from "./model.js";

type Vars = Record<string, string>;

const buttonSizeVars: Record<Knobs["button"]["size"], Vars> = {
  sm: { "--raya-button-height": "2rem", "--raya-button-px": "0.75rem", "--raya-button-font-size": "0.8125rem" },
  md: { "--raya-button-height": "2.25rem", "--raya-button-px": "1rem", "--raya-button-font-size": "0.875rem" },
  lg: { "--raya-button-height": "2.75rem", "--raya-button-px": "1.5rem", "--raya-button-font-size": "1rem" },
};

const buttonVariantVars: Record<Knobs["button"]["variant"], Vars> = {
  default: {
    "--raya-button-bg": "var(--primary)",
    "--raya-button-fg": "var(--primary-foreground)",
    "--raya-button-border": "transparent",
  },
  outline: {
    "--raya-button-bg": "var(--background)",
    "--raya-button-fg": "var(--foreground)",
    "--raya-button-border": "var(--border)",
  },
  ghost: {
    "--raya-button-bg": "transparent",
    "--raya-button-fg": "var(--foreground)",
    "--raya-button-border": "transparent",
  },
  destructive: {
    "--raya-button-bg": "var(--destructive)",
    "--raya-button-fg": "#ffffff",
    "--raya-button-border": "transparent",
  },
  link: {
    "--raya-button-bg": "transparent",
    "--raya-button-fg": "var(--primary)",
    "--raya-button-border": "transparent",
  },
};

const cardDensityVars: Record<Knobs["card"]["density"], Vars> = {
  comfortable: { "--raya-card-padding": "1.5rem", "--raya-card-gap": "1rem" },
  compact: { "--raya-card-padding": "0.875rem", "--raya-card-gap": "0.5rem" },
};

const badgeSizeVars: Record<Knobs["badge"]["size"], Vars> = {
  sm: { "--raya-badge-px": "0.5rem", "--raya-badge-py": "0.125rem", "--raya-badge-font-size": "0.6875rem" },
  md: { "--raya-badge-px": "0.625rem", "--raya-badge-py": "0.25rem", "--raya-badge-font-size": "0.75rem" },
};

const avatarSizeVars: Record<Knobs["avatar"]["size"], Vars> = {
  sm: { "--raya-avatar-size": "1.5rem" },
  md: { "--raya-avatar-size": "2rem" },
  lg: { "--raya-avatar-size": "2.5rem" },
};

const avatarShapeVars: Record<Knobs["avatar"]["shape"], Vars> = {
  circle: { "--raya-avatar-radius": "9999px" },
  rounded: { "--raya-avatar-radius": "25%" },
  square: { "--raya-avatar-radius": "0px" },
};

export function knobVars(knobs: Knobs): Vars {
  return {
    ...buttonVariantVars[knobs.button.variant],
    ...buttonSizeVars[knobs.button.size],
    ...cardDensityVars[knobs.card.density],
    ...badgeSizeVars[knobs.badge.size],
    ...avatarSizeVars[knobs.avatar.size],
    ...avatarShapeVars[knobs.avatar.shape],
  };
}

export function ramp(seed: { hue: number; chroma: number }, dark: boolean, steps = 12): Vars {
  const vars: Vars = {};
  const lo = dark ? 0.18 : 0.96;
  const hi = dark ? 0.93 : 0.24;
  for (let i = 1; i <= steps; i++) {
    const t = (i - 1) / (steps - 1);
    const l = +(lo + (hi - lo) * t).toFixed(3);
    const chroma = +(seed.chroma * (1 - Math.abs(t - 0.45) * 0.9)).toFixed(4);
    vars[`--raya-accent-${i}`] = `oklch(${l} ${chroma} ${seed.hue})`;
  }
  return vars;
}
