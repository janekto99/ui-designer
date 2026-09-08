import { FINISHED, TOURNAMENTS, UPCOMING, type Match } from '~/test/generate'
import { columnByKey } from '~/test/sport'

export type ListingSource = 'upcoming' | 'results'
export type Grouping = 'tournament' | 'all'

export interface Group {
  slug: string
  name: string
  matches: Match[]
}

/**
 * Seznam zápasů: zdroj → filtry → řazení → seskupení.
 *
 * Pořadí je závazné. Kdyby se řadilo až po seskupení, každá skupina by se
 * seřadila zvlášť a „nejnižší kurz nahoře" by přestalo platit napříč
 * seznamem. Filtrovat až po seskupení by zase nechalo prázdné skupiny.
 */
export function useTestListing(source: ListingSource = 'upcoming') {
  const grouping = useState<Grouping>('test-grouping', () => 'tournament')
  const collapsed = useState<string[]>('test-collapsed', () => [])
  const selected = useState<string | undefined>('test-selected', () => undefined)
  const query = useState<string>('test-query', () => '')
  const onlyFavourites = useState<boolean>('test-only-fav', () => false)

  const { countries, numeric, insights, isRangeActive } = useTestFilters()
  const { sortField, sortDirection } = useTestSettings()
  const { has: isFavourite } = useTestFavourites()

  const all = computed(() => (source === 'results' ? FINISHED : UPCOMING))

  const filtered = computed(() => {
    let list = all.value

    if (selected.value) list = list.filter((m) => m.tournament === selected.value)

    const q = query.value.trim().toLowerCase()
    if (q) {
      list = list.filter((m) =>
        m.players.some((p) => p.name.toLowerCase().includes(q))
        || (TOURNAMENTS.find((t) => t.slug === m.tournament)?.name.toLowerCase().includes(q) ?? false),
      )
    }

    if (onlyFavourites.value) list = list.filter((m) => isFavourite(m.id))

    // Země se skládají přes OR — odpovídá to čtení „zápasy Čechů a Slováků“.
    if (countries.value.length) {
      list = list.filter((m) => m.players.some((p) => countries.value.includes(p.country)))
    }

    // Rozsah platí, když ho splní ALESPOŇ JEDEN hráč. Vyžadovat obojí by
    // u „žebříček do 200“ vyhodilo zrovna ty zápasy, kde favorit hraje
    // s outsiderem — a to je to, co uživatele zajímá.
    for (const [key, range] of Object.entries(numeric.value)) {
      if (!isRangeActive(range)) continue
      list = list.filter((m) =>
        m.players.some((p) => {
          const value = p.stats[key]
          if (value === null || value === undefined) return false
          if (range.min !== null && value < range.min) return false
          if (range.max !== null && value > range.max) return false
          return true
        }),
      )
    }

    for (const [key, mode] of Object.entries(insights.value)) {
      list = list.filter((m) => {
        const present = m.players.some((p) => p.insights.includes(key))
        return mode === 'require' ? present : !present
      })
    }

    return list
  })

  /** Hodnota, podle které se řadí — bere se lepší z dvojice hráčů. */
  function sortValue(match: Match): number {
    if (sortField.value === 'time') return Number(match.time.replace(':', ''))

    const column = columnByKey(sortField.value)
    const values = match.players
      .map((p) => (sortField.value === 'seed' ? p.seed : p.stats[sortField.value]))
      .filter((v): v is number => v !== null && v !== undefined)

    // Zápas bez hodnoty jde vždy na konec, ať se řadí kterýmkoli směrem.
    if (!values.length) return sortDirection.value === 'asc' ? Infinity : -Infinity
    return column?.lowerIsBetter === false ? Math.max(...values) : Math.min(...values)
  }

  const sorted = computed(() => {
    const list = [...filtered.value]
    const dir = sortDirection.value === 'asc' ? 1 : -1
    return list.sort((a, b) => {
      const va = sortValue(a)
      const vb = sortValue(b)
      if (va === vb) return a.id.localeCompare(b.id)
      if (!Number.isFinite(va)) return 1
      if (!Number.isFinite(vb)) return -1
      return (va - vb) * dir
    })
  })

  const groups = computed<Group[]>(() => {
    if (grouping.value === 'all') {
      return [{ slug: 'all', name: source === 'results' ? 'Výsledky' : 'Všechny zápasy', matches: sorted.value }]
    }
    const map = new Map<string, Group>()
    for (const match of sorted.value) {
      const t = TOURNAMENTS.find((x) => x.slug === match.tournament)!
      if (!map.has(t.slug)) map.set(t.slug, { slug: t.slug, name: t.name, matches: [] })
      map.get(t.slug)!.matches.push(match)
    }
    return [...map.values()]
  })

  const isCollapsed = (slug: string) => collapsed.value.includes(slug)

  function toggleGroup(slug: string) {
    collapsed.value = isCollapsed(slug) ? collapsed.value.filter((s) => s !== slug) : [...collapsed.value, slug]
  }

  const allCollapsed = computed(() => groups.value.length > 0 && groups.value.every((g) => isCollapsed(g.slug)))

  function toggleAll() {
    collapsed.value = allCollapsed.value ? [] : groups.value.map((g) => g.slug)
  }

  /** Strom soutěží. Počty se počítají z toho, co projde ostatními filtry —
   *  jinak by v sidebaru svítilo číslo, které v seznamu není vidět. */
  const tree = computed(() => {
    const counts = new Map<string, number>()
    for (const match of filtered.value) {
      counts.set(match.tournament, (counts.get(match.tournament) ?? 0) + 1)
    }

    const byCategory = new Map<string, { label: string, value: string, count: number, children: unknown[] }>()
    for (const t of TOURNAMENTS) {
      if (!byCategory.has(t.category)) {
        byCategory.set(t.category, { label: t.category, value: `cat-${t.category}`, count: 0, children: [] })
      }
      const bucket = byCategory.get(t.category)!
      const count = counts.get(t.slug) ?? 0
      bucket.count += count
      bucket.children.push({ label: t.name.replace(/^(ATP|Challenger|ITF) /, ''), value: t.slug, count })
    }

    return [{
      label: 'Tenis',
      value: 'tenis',
      icon: 'lucide:circle-dot',
      count: filtered.value.length,
      children: [...byCategory.values()],
    }]
  })

  return {
    source, grouping, collapsed, selected, query, onlyFavourites,
    all, filtered, sorted, groups, tree,
    isCollapsed, toggleGroup, allCollapsed, toggleAll,
  }
}

/** Který nástrojový dialog je otevřený. V layoutu jsou jednou, otevírají se odkudkoli. */
export function useTestDialogs() {
  const active = useState<'filters' | 'sort' | 'display' | null>('test-dialog', () => null)
  const detail = useState<string | null>('test-detail', () => null)

  return {
    active,
    detail,
    open: (name: 'filters' | 'sort' | 'display') => { active.value = name },
    close: () => { active.value = null },
    openDetail: (id: string) => { detail.value = id },
    closeDetail: () => { detail.value = null },
  }
}
