import {
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})

export function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
  pageSize = 15,
  className,
}: {
  columns: ColumnDef<typeof features, TData, unknown>[]
  data: TData[]
  pageSize?: number
  className?: string
}) {
  const table = useTable({
    features,
    columns: columns as never,
    data,
    initialState: { pagination: { pageIndex: 0, pageSize } },
  })

  const pageIndex = table.state.pagination?.pageIndex ?? 0
  const pageCount = table.getPageCount()

  return (
    <div data-slot="data-table" className={cx("w-full", className)}>
      <table className="raya-table">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className={header.column.getCanSort() ? "raya-table-sort" : undefined}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  {{ asc: " ↑", desc: " ↓" }[header.column.getIsSorted() as string] ?? ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id}>
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pageCount > 1 && (
        <div className="mt-3 flex items-center justify-between font-[family-name:var(--font-sans)] text-xs text-muted-foreground">
          <span>
            Page {pageIndex + 1} of {pageCount}
          </span>
          <span className="flex gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer underline-offset-2 hover:underline disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer underline-offset-2 hover:underline disabled:opacity-50"
            >
              Next
            </button>
          </span>
        </div>
      )}
    </div>
  )
}

export type { ColumnDef }
