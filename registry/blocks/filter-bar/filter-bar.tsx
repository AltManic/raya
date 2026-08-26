import { useState } from "react"
import { Input } from "@/registry/default/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/default/ui/select"
import { Button } from "@/registry/default/ui/button"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export interface FilterBarProps {
  search?: string
  onSearchChange?: (value: string) => void
  filters?: Array<{
    key: string
    placeholder: string
    options: string[]
    value?: string
    onChange?: (value: string | undefined) => void
  }>
  onReset?: () => void
  className?: string
}

export function FilterBar({ search, onSearchChange, filters = [], onReset, className }: FilterBarProps) {
  const [localSearch, setLocalSearch] = useState("")

  const searchValue = search ?? localSearch
  const handleSearch = (v: string) => {
    setLocalSearch(v)
    onSearchChange?.(v)
  }

  return (
    <div data-slot="filter-bar" className={cx("raya-filter-bar", className)} role="search">
      <Input
        type="search"
        placeholder="Search…"
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ maxWidth: "14rem" }}
      />
      {filters.map((f) => (
        <Select
          key={f.key}
          value={f.value ?? null}
          onValueChange={(v) => f.onChange?.((v as string | null) ?? undefined)}
          items={f.options.map((o) => ({ label: o, value: o }))}
        >
          <SelectTrigger style={{ width: "9.5rem" }}>
            <SelectValue placeholder={f.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {f.options.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {onReset && (
        <Button onClick={onReset} className="ml-auto">
          Reset
        </Button>
      )}
    </div>
  )
}
