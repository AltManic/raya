export type SemanticToken =
  | "background"
  | "foreground"
  | "card"
  | "card-foreground"
  | "popover"
  | "popover-foreground"
  | "primary"
  | "primary-foreground"
  | "secondary"
  | "secondary-foreground"
  | "muted"
  | "muted-foreground"
  | "accent"
  | "accent-foreground"
  | "destructive"
  | "border"
  | "input"
  | "ring"
  | "chart-1"
  | "chart-2"
  | "chart-3"
  | "chart-4"
  | "chart-5"
  | "sidebar"
  | "sidebar-foreground"
  | "sidebar-primary"
  | "sidebar-primary-foreground"
  | "sidebar-accent"
  | "sidebar-accent-foreground"
  | "sidebar-border"
  | "sidebar-ring";

export type TokenValue = string;

export interface ModeValues {
  semantic: Partial<Record<SemanticToken, TokenValue>>;
}

export type ButtonVariant = "default" | "outline" | "ghost" | "destructive" | "link";
export type Size = "sm" | "md" | "lg";
export type Density = "comfortable" | "compact";
export type AvatarShape = "circle" | "rounded" | "square";
export type BadgeSize = "sm" | "md";

export interface Knobs {
  button: { variant: ButtonVariant; size: Size };
  card: { density: Density };
  badge: { size: BadgeSize };
  avatar: { shape: AvatarShape; size: Size };
}

export const defaultKnobs: Knobs = {
  button: { variant: "default", size: "md" },
  card: { density: "comfortable" },
  badge: { size: "md" },
  avatar: { shape: "circle", size: "md" },
};

export interface FontSlots {
  sans: string[];
  serif?: string[];
  mono: string[];
}

export interface RampSeed {
  hue: number;
  chroma: number;
}

export interface System {
  slug: string;
  name: string;
  description: string;
  isDefault?: boolean;
  fonts: FontSlots;
  radius: string;
  ramp: RampSeed;
  light: ModeValues;
  dark: ModeValues;
  knobs: Knobs;
}
