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
  | "destructive-foreground"
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
  | "sidebar-ring"

export type TokenValue = string

export interface ModeValues {
  semantic: Partial<Record<SemanticToken, TokenValue>>
}

export type Size = "sm" | "md" | "lg"
export type Density = "comfortable" | "compact"
export type ShowHide = "show" | "hide"
export type OffOn = "off" | "on"

export type ButtonVariant = "default" | "outline" | "ghost" | "destructive" | "link"
export type SelectVariant = "outline" | "ghost"
export type CardVariant = "plain" | "outline" | "elevated"
export type BadgeVariant = "default" | "secondary" | "outline" | "destructive"
export type AvatarShape = "circle" | "rounded" | "square"
export type TabsVariant = "underline" | "pills" | "enclosed"
export type DialogSize = "sm" | "md" | "lg"
export type TooltipVariant = "dark" | "inverted"
export type PieVariant = "pie" | "donut"
export type BadgeSize = "sm" | "md"
export type TabsSize = "sm" | "md"

export interface Knobs {
  button: { variant: ButtonVariant; size: Size }
  input: { size: Size }
  textarea: { size: Size }
  select: { variant: SelectVariant; size: Size }
  checkbox: { size: Size }
  switch: { size: Size }
  "radio-group": { size: Size }
  slider: { size: Size }
  field: { size: Size }
  card: { variant: CardVariant; density: Density }
  badge: { variant: BadgeVariant; size: BadgeSize }
  avatar: { shape: AvatarShape; size: Size }
  tabs: { variant: TabsVariant; size: TabsSize }
  dialog: { size: DialogSize }
  "dropdown-menu": { density: Density }
  tooltip: { variant: TooltipVariant }
  "data-table": { density: Density; zebra: OffOn }
  "kpi-card": { variant: CardVariant; density: Density }
  "chart-line": { legend: ShowHide; grid: ShowHide }
  "chart-area": { legend: ShowHide; grid: ShowHide }
  "chart-bar": { legend: ShowHide; grid: ShowHide }
  "chart-pie": { variant: PieVariant }
  "filter-bar": { density: Density }
}

export const defaultKnobs: Knobs = {
  button: { variant: "default", size: "md" },
  input: { size: "md" },
  textarea: { size: "md" },
  select: { variant: "outline", size: "md" },
  checkbox: { size: "md" },
  switch: { size: "md" },
  "radio-group": { size: "md" },
  slider: { size: "md" },
  field: { size: "md" },
  card: { variant: "outline", density: "comfortable" },
  badge: { variant: "default", size: "md" },
  avatar: { shape: "circle", size: "md" },
  tabs: { variant: "underline", size: "md" },
  dialog: { size: "md" },
  "dropdown-menu": { density: "comfortable" },
  tooltip: { variant: "dark" },
  "data-table": { density: "comfortable", zebra: "off" },
  "kpi-card": { variant: "outline", density: "comfortable" },
  "chart-line": { legend: "hide", grid: "show" },
  "chart-area": { legend: "hide", grid: "show" },
  "chart-bar": { legend: "hide", grid: "show" },
  "chart-pie": { variant: "donut" },
  "filter-bar": { density: "comfortable" },
}

export const KNOBBED_COMPONENTS = Object.keys(defaultKnobs) as Array<keyof Knobs>

export interface FontSlots {
  sans: string[]
  serif?: string[]
  mono: string[]
}

export interface RampSeed {
  hue: number
  chroma: number
}

export interface Shadows {
  sm: string
  md: string
  lg: string
}

export interface System {
  slug: string
  name: string
  description: string
  isDefault?: boolean
  fonts: FontSlots
  radius: string
  ramp: RampSeed
  shadows: Shadows
  light: ModeValues
  dark: ModeValues
  knobs: Knobs
}
