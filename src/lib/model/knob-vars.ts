import type { Knobs, ShowHide, System } from "./model"

type Vars = Record<string, string>
type Size2 = Knobs["button"]["size"]

const fieldSize: Record<Size2, Vars> = {
  sm: {
    "--raya-input-height": "2rem",
    "--raya-input-font-size": "0.8125rem",
    "--raya-input-padding-x": "0.75rem",
  },
  md: {
    "--raya-input-height": "2.25rem",
    "--raya-input-font-size": "0.875rem",
    "--raya-input-padding-x": "0.875rem",
  },
  lg: {
    "--raya-input-height": "2.75rem",
    "--raya-input-font-size": "1rem",
    "--raya-input-padding-x": "1rem",
  },
}

const buttonSizeVars: Record<Size2, Vars> = {
  sm: { "--raya-button-height": "2rem", "--raya-button-px": "0.75rem", "--raya-button-font-size": "0.8125rem" },
  md: { "--raya-button-height": "2.25rem", "--raya-button-px": "1rem", "--raya-button-font-size": "0.875rem" },
  lg: { "--raya-button-height": "2.75rem", "--raya-button-px": "1.5rem", "--raya-button-font-size": "1rem" },
}

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
}

const selectVariantVars: Record<Knobs["select"]["variant"], Vars> = {
  outline: {
    "--raya-select-bg": "var(--background)",
    "--raya-select-border": "var(--border)",
  },
  ghost: {
    "--raya-select-bg": "transparent",
    "--raya-select-border": "transparent",
  },
}

const cardVariantVars: Record<Knobs["card"]["variant"], Vars> = {
  plain: { "--raya-card-border-color": "transparent", "--raya-card-shadow": "none" },
  outline: { "--raya-card-border-color": "var(--border)", "--raya-card-shadow": "none" },
  elevated: { "--raya-card-border-color": "transparent", "--raya-card-shadow": "var(--raya-shadow-md)" },
}

const densityVars = (padding: string, gap: string): Vars => ({
  "--raya-card-padding": padding,
  "--raya-card-gap": gap,
})

const cardDensityVars: Record<Knobs["card"]["density"], Vars> = {
  comfortable: densityVars("1.5rem", "1rem"),
  compact: densityVars("0.875rem", "0.5rem"),
}

const badgeSizeVars: Record<Knobs["badge"]["size"], Vars> = {
  sm: { "--raya-badge-px": "0.5rem", "--raya-badge-py": "0.125rem", "--raya-badge-font-size": "0.6875rem" },
  md: { "--raya-badge-px": "0.625rem", "--raya-badge-py": "0.25rem", "--raya-badge-font-size": "0.75rem" },
}

const badgeVariantVars: Record<Knobs["badge"]["variant"], Vars> = {
  default: { "--raya-badge-bg": "var(--primary)", "--raya-badge-fg": "var(--primary-foreground)", "--raya-badge-border": "transparent" },
  secondary: { "--raya-badge-bg": "var(--secondary)", "--raya-badge-fg": "var(--secondary-foreground)", "--raya-badge-border": "transparent" },
  outline: { "--raya-badge-bg": "transparent", "--raya-badge-fg": "var(--foreground)", "--raya-badge-border": "var(--border)" },
  destructive: { "--raya-badge-bg": "var(--destructive)", "--raya-badge-fg": "#ffffff", "--raya-badge-border": "transparent" },
}

const avatarSizeVars: Record<Knobs["avatar"]["size"], Vars> = {
  sm: { "--raya-avatar-size": "1.5rem" },
  md: { "--raya-avatar-size": "2rem" },
  lg: { "--raya-avatar-size": "2.5rem" },
}

const avatarShapeVars: Record<Knobs["avatar"]["shape"], Vars> = {
  circle: { "--raya-avatar-radius": "9999px" },
  rounded: { "--raya-avatar-radius": "25%" },
  square: { "--raya-avatar-radius": "0px" },
}

const tabsSizeVars: Record<Knobs["tabs"]["size"], Vars> = {
  sm: { "--raya-tabs-font-size": "0.8125rem", "--raya-tabs-item-padding-x": "0.75rem", "--raya-tabs-item-padding-y": "0.375rem" },
  md: { "--raya-tabs-font-size": "0.875rem", "--raya-tabs-item-padding-x": "1rem", "--raya-tabs-item-padding-y": "0.5rem" },
}

const tabsVariantVars: Record<Knobs["tabs"]["variant"], Vars> = {
  underline: {
    "--raya-tabs-list-bg": "transparent",
    "--raya-tabs-list-padding": "0",
    "--raya-tabs-list-radius": "0",
    "--raya-tabs-active-bg": "transparent",
    "--raya-tabs-active-fg": "var(--foreground)",
    "--raya-tabs-active-radius": "0",
    "--raya-tabs-active-underline": "0 0 0 1px var(--border), 0 2px 0 0 var(--primary)",
  },
  pills: {
    "--raya-tabs-list-bg": "transparent",
    "--raya-tabs-list-padding": "0",
    "--raya-tabs-list-radius": "0",
    "--raya-tabs-active-bg": "var(--primary)",
    "--raya-tabs-active-fg": "var(--primary-foreground)",
    "--raya-tabs-active-radius": "9999px",
    "--raya-tabs-active-underline": "0 0 #0000",
  },
  enclosed: {
    "--raya-tabs-list-bg": "var(--muted)",
    "--raya-tabs-list-padding": "0.25rem",
    "--raya-tabs-list-radius": "calc(var(--radius-md))",
    "--raya-tabs-active-bg": "var(--background)",
    "--raya-tabs-active-fg": "var(--foreground)",
    "--raya-tabs-active-radius": "calc(var(--radius-sm))",
    "--raya-tabs-active-underline": "0 0 0 1px var(--border)",
  },
}

const dialogSizeVars: Record<Knobs["dialog"]["size"], Vars> = {
  sm: { "--raya-dialog-max-width": "24rem" },
  md: { "--raya-dialog-max-width": "32rem" },
  lg: { "--raya-dialog-max-width": "40rem" },
}

const menuDensityVars: Record<Knobs["dropdown-menu"]["density"], Vars> = {
  comfortable: { "--raya-menu-padding-y": "0.375rem", "--raya-menu-gap": "0.125rem" },
  compact: { "--raya-menu-padding-y": "0.1875rem", "--raya-menu-gap": "0" },
}

const tooltipVariantVars: Record<Knobs["tooltip"]["variant"], Vars> = {
  dark: { "--raya-tooltip-bg": "var(--foreground)", "--raya-tooltip-fg": "var(--background)" },
  inverted: { "--raya-tooltip-bg": "var(--primary)", "--raya-tooltip-fg": "var(--primary-foreground)" },
}

const tableDensityVars: Record<Knobs["data-table"]["density"], Vars> = {
  comfortable: { "--raya-table-cell-py": "0.625rem", "--raya-table-font-size": "0.875rem" },
  compact: { "--raya-table-cell-py": "0.3125rem", "--raya-table-font-size": "0.8125rem" },
}

const tableZebraVars: Record<Knobs["data-table"]["zebra"], Vars> = {
  off: { "--raya-table-stripe-bg": "transparent" },
  on: { "--raya-table-stripe-bg": "color-mix(in oklab, var(--muted) 55%, transparent)" },
}

const kpiVariantVars: Record<Knobs["kpi-card"]["variant"], Vars> = {
  plain: { "--raya-kpi-border-color": "transparent", "--raya-kpi-shadow": "none" },
  outline: { "--raya-kpi-border-color": "var(--border)", "--raya-kpi-shadow": "none" },
  elevated: { "--raya-kpi-border-color": "transparent", "--raya-kpi-shadow": "var(--raya-shadow-md)" },
}

const kpiDensityVars: Record<Knobs["kpi-card"]["density"], Vars> = {
  comfortable: { "--raya-kpi-padding": "1.25rem", "--raya-kpi-gap": "0.75rem" },
  compact: { "--raya-kpi-padding": "0.875rem", "--raya-kpi-gap": "0.375rem" },
}

const legendDisplayVar = (name: string): Record<ShowHide, Vars> => ({
  show: { [name]: "flex" },
  hide: { [name]: "none" },
})

const gridVisibilityVar = (name: string): Record<ShowHide, Vars> => ({
  show: { [name]: "visible" },
  hide: { [name]: "hidden" },
})

const chartLineLegend = legendDisplayVar("--raya-chart-line-legend-display")
const chartLineGrid = gridVisibilityVar("--raya-chart-line-grid-visibility")
const chartAreaLegend = legendDisplayVar("--raya-chart-area-legend-display")
const chartAreaGrid = gridVisibilityVar("--raya-chart-area-grid-visibility")
const chartBarLegend = legendDisplayVar("--raya-chart-bar-legend-display")
const chartBarGrid = gridVisibilityVar("--raya-chart-bar-grid-visibility")

const pieVariantVars: Record<Knobs["chart-pie"]["variant"], Vars> = {
  pie: { "--raya-pie-inner-radius": "0%" },
  donut: { "--raya-pie-inner-radius": "60%" },
}

const filterBarDensityVars: Record<Knobs["filter-bar"]["density"], Vars> = {
  comfortable: { "--raya-filterbar-padding": "0.75rem", "--raya-filterbar-gap": "0.75rem" },
  compact: { "--raya-filterbar-padding": "0.5rem", "--raya-filterbar-gap": "0.5rem" },
}

export function knobVars(knobs: Knobs): Vars {
  return {
    ...buttonVariantVars[knobs.button.variant],
    ...buttonSizeVars[knobs.button.size],
    ...fieldSize[knobs.input.size],
    ...renameAll(fieldSize[knobs.textarea.size], "input", "textarea"),
    ...selectVariantVars[knobs.select.variant],
    ...renameAll(fieldSize[knobs.select.size], "input", "select"),
    ...controlSizeVars(knobs.checkbox.size, "checkbox"),
    ...switchSizeVars(knobs.switch.size),
    ...controlSizeVars(knobs["radio-group"].size, "radio"),
    ...sliderSizeVars(knobs.slider.size),
    ...labelSizeVars(knobs.field.size),
    ...cardVariantVars[knobs.card.variant],
    ...cardDensityVars[knobs.card.density],
    ...badgeVariantVars[knobs.badge.variant],
    ...badgeSizeVars[knobs.badge.size],
    ...avatarSizeVars[knobs.avatar.size],
    ...avatarShapeVars[knobs.avatar.shape],
    ...tabsVariantVars[knobs.tabs.variant],
    ...tabsSizeVars[knobs.tabs.size],
    ...dialogSizeVars[knobs.dialog.size],
    ...menuDensityVars[knobs["dropdown-menu"].density],
    ...tooltipVariantVars[knobs.tooltip.variant],
    ...tableDensityVars[knobs["data-table"].density],
    ...tableZebraVars[knobs["data-table"].zebra],
    ...kpiVariantVars[knobs["kpi-card"].variant],
    ...kpiDensityVars[knobs["kpi-card"].density],
    ...chartLineLegend[knobs["chart-line"].legend],
    ...chartLineGrid[knobs["chart-line"].grid],
    ...chartAreaLegend[knobs["chart-area"].legend],
    ...chartAreaGrid[knobs["chart-area"].grid],
    ...chartBarLegend[knobs["chart-bar"].legend],
    ...chartBarGrid[knobs["chart-bar"].grid],
    ...pieVariantVars[knobs["chart-pie"].variant],
    ...filterBarDensityVars[knobs["filter-bar"].density],
  }
}

function renameAll(vars: Vars, from: string, to: string): Vars {
  return Object.fromEntries(
    Object.entries(vars).map(([k, v]) => [k.replace(`--raya-${from}`, `--raya-${to}`), v]),
  )
}

function controlSizeVars(size: Size2, name: string): Vars {
  const map: Record<Size2, string> = { sm: "1rem", md: "1.125rem", lg: "1.375rem" }
  return { [`--raya-${name}-size`]: map[size] }
}

function switchSizeVars(size: Size2): Vars {
  const w: Record<Size2, string> = { sm: "2rem", md: "2.375rem", lg: "2.75rem" }
  const h: Record<Size2, string> = { sm: "1.125rem", md: "1.375rem", lg: "1.625rem" }
  return { "--raya-switch-width": w[size], "--raya-switch-height": h[size] }
}

function sliderSizeVars(size: Size2): Vars {
  const t: Record<Size2, string> = { sm: "0.875rem", md: "1.125rem", lg: "1.375rem" }
  return { "--raya-slider-thumb-size": t[size] }
}

function labelSizeVars(size: Size2): Vars {
  const fs: Record<Size2, string> = { sm: "0.75rem", md: "0.8125rem", lg: "0.875rem" }
  return { "--raya-field-label-size": fs[size] }
}

export function shadowVars(shadows: System["shadows"]): Vars {
  return {
    "--raya-shadow-sm": shadows.sm,
    "--raya-shadow-md": shadows.md,
    "--raya-shadow-lg": shadows.lg,
  }
}

export function ramp(seed: { hue: number; chroma: number }, dark: boolean, steps = 12): Vars {
  const vars: Vars = {}
  const lo = dark ? 0.18 : 0.96
  const hi = dark ? 0.93 : 0.24
  for (let i = 1; i <= steps; i++) {
    const t = (i - 1) / (steps - 1)
    const l = +(lo + (hi - lo) * t).toFixed(3)
    const chroma = +(seed.chroma * (1 - Math.abs(t - 0.45) * 0.9)).toFixed(4)
    vars[`--raya-accent-${i}`] = `oklch(${l} ${chroma} ${seed.hue})`
  }
  return vars
}
