import { DEFAULT_COLUMNS, SORT_FIELDS } from '~/test/sport'

/**
 * Řazení a viditelné sloupce. Taky klíčované sportem — ze stejného důvodu
 * jako filtry.
 */
export type SortDirection = 'asc' | 'desc'

export interface ListSettings {
  sortField: string
  sortDirection: SortDirection
  visibleColumns: string[]
  /** Zvýraznit v každém sloupci lepší hodnotu z dvojice. */
  showDiffs: boolean
}

function defaults(): ListSettings {
  return {
    sortField: SORT_FIELDS[0]!.key,
    sortDirection: 'asc',
    visibleColumns: [...DEFAULT_COLUMNS],
    showDiffs: true,
  }
}

export function useTestSettings(sport = 'tennis') {
  const bySport = useState<Record<string, ListSettings>>('test-settings', () => ({}))

  const state = computed(() => bySport.value[sport] ?? defaults())

  function patch(partial: Partial<ListSettings>) {
    bySport.value = { ...bySport.value, [sport]: { ...state.value, ...partial } }
  }

  const sortField = computed({
    get: () => state.value.sortField,
    set: (value: string) => patch({ sortField: value }),
  })

  const sortDirection = computed({
    get: () => state.value.sortDirection,
    set: (value: SortDirection) => patch({ sortDirection: value }),
  })

  const visibleColumns = computed(() => state.value.visibleColumns)

  const showDiffs = computed({
    get: () => state.value.showDiffs,
    set: (value: boolean) => patch({ showDiffs: value }),
  })

  function toggleColumn(key: string) {
    const on = state.value.visibleColumns.includes(key)
    // Poslední sloupec se vypnout nedá — prázdná tabulka není nastavení,
    // ale rozbitý stav, ze kterého se uživatel sám nedostane.
    if (on && state.value.visibleColumns.length === 1) return
    patch({
      visibleColumns: on
        ? state.value.visibleColumns.filter((k) => k !== key)
        : [...state.value.visibleColumns, key],
    })
  }

  function resetColumns() {
    patch({ visibleColumns: [...DEFAULT_COLUMNS] })
  }

  return { sortField, sortDirection, visibleColumns, showDiffs, toggleColumn, resetColumns }
}

/** Oblíbené zápasy. Drží se napříč stránkami, proto `useState`. */
export function useTestFavourites() {
  const ids = useState<string[]>('test-favourites', () => [])

  const has = (id: string) => ids.value.includes(id)

  function toggle(id: string) {
    ids.value = has(id) ? ids.value.filter((x) => x !== id) : [...ids.value, id]
  }

  return { ids, has, toggle }
}
