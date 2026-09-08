import { NUMERIC_KEYS } from '~/test/sport'

/**
 * Filtry seznamu — drží se ZVLÁŠŤ PRO KAŽDÝ SPORT.
 *
 * Stav je jeden záznam klíčovaný sportem, ne `useState('filters-' + sport)`.
 * Klíč u `useState` se vyhodnotí jen při prvním volání, takže by se při
 * přepnutí sportu nezměnil a druhý sport by přepisoval prvnímu filtry.
 * Zatím je sport jen jeden, ale ta past je levnější obejít teď než potom.
 *
 * Insighty drží MAPA klíč → `require` | `exclude`, ne pole zapnutých. Pole by
 * neumělo „tenhle jev nechci“ — a právě vyloučení (hráč po skreči, hráč
 * v sérii proher) je u předpovědí to zajímavější.
 */
export type InsightMode = 'require' | 'exclude'

export interface NumericRange {
  min: number | null
  max: number | null
}

export interface SportFilters {
  countries: string[]
  numeric: Record<string, NumericRange>
  insights: Record<string, InsightMode>
}

function emptyFilters(): SportFilters {
  return {
    countries: [],
    numeric: Object.fromEntries(NUMERIC_KEYS.map((k) => [k, { min: null, max: null }])),
    insights: {},
  }
}

const isRangeActive = (r: NumericRange) => r.min !== null || r.max !== null

export function useTestFilters(sport = 'tennis') {
  const bySport = useState<Record<string, SportFilters>>('test-filters', () => ({}))

  const state = computed(() => bySport.value[sport] ?? emptyFilters())

  function patch(partial: Partial<SportFilters>) {
    bySport.value = { ...bySport.value, [sport]: { ...state.value, ...partial } }
  }

  const countries = computed({
    get: () => state.value.countries,
    set: (value: string[]) => patch({ countries: value }),
  })

  const numeric = computed(() => state.value.numeric)
  const insights = computed(() => state.value.insights)

  function setRange(key: string, range: NumericRange) {
    patch({ numeric: { ...state.value.numeric, [key]: range } })
  }

  /** Tři stavy dokola: bez omezení → vyžadovat → vyloučit. */
  function cycleInsight(key: string) {
    const current = state.value.insights[key]
    if (current === undefined) patch({ insights: { ...state.value.insights, [key]: 'require' } })
    else if (current === 'require') patch({ insights: { ...state.value.insights, [key]: 'exclude' } })
    else {
      patch({
        insights: Object.fromEntries(Object.entries(state.value.insights).filter(([k]) => k !== key)),
      })
    }
  }

  function reset() {
    bySport.value = { ...bySport.value, [sport]: emptyFilters() }
  }

  const activeCount = computed(() =>
    (countries.value.length ? 1 : 0)
    + Object.values(numeric.value).filter(isRangeActive).length
    + Object.keys(insights.value).length,
  )

  return { countries, numeric, insights, setRange, cycleInsight, reset, activeCount, isRangeActive }
}
