/**
 * Ukázková data obrazovky zápasů.
 *
 * Tvarem odpovídají tomu, co má `sport-project/frontend` ve svých mockách,
 * ale jsou vyrobená tady — do cizího repa se nesahá.
 *
 * Hodnoty jsou opsané ze snímku obrazovky, aby šlo porovnat staré s novým
 * na stejných číslech. Nic se nedopočítává ani nevymýšlí.
 */

export interface Metric {
  key: string
  /** Zkratka do hlavičky tabulky. */
  label: string
  /** Celý název pro čtečku a pro popisek v rozbaleném detailu. */
  description: string
  /** U žebříčků je menší lepší, u rozdílu spolčených soupeřů větší. */
  lowerIsBetter: boolean
  format: (value: number) => string
}

export interface Player {
  name: string
  /** Dvoupísmenný kód pro vlajku. Chybí u neutrálních hráčů. */
  country?: string
  /** Nasazení v pavouku. */
  seed?: number
  /** Kvalifikant, náhradník apod. */
  entry?: 'Q' | 'LL' | 'WC'
  stats: Record<string, number | null>
}

export interface Match {
  id: string
  time: string
  surface: 'Hard' | 'Clay' | 'Grass'
  live?: boolean
  /** Zápas má připravený rozbor. */
  insight?: boolean
  players: [Player, Player]
}

export interface Tournament {
  id: string
  name: string
  category: string
  surface: 'Hard' | 'Clay' | 'Grass'
  country: string
  matches: Match[]
}

export const metrics: Metric[] = [
  { key: 'rank', label: 'Rank', description: 'Postavení na žebříčku', lowerIsBetter: true, format: (v) => `#${v}` },
  { key: 'ch', label: 'CH', description: 'Postavení na žebříčku Challengeru', lowerIsBetter: true, format: (v) => `#${v}` },
  { key: 'odds', label: 'Kurz', description: 'Kurz na vítězství', lowerIsBetter: true, format: (v) => v.toFixed(2).replace('.', ',') },
  { key: 'opponents', label: 'Soupeři 10', description: 'Průměrná síla soupeřů za posledních deset zápasů', lowerIsBetter: true, format: (v) => `#${v}` },
  { key: 'level', label: 'Úroveň 10', description: 'Úroveň výkonu za posledních deset zápasů', lowerIsBetter: true, format: (v) => `#${v}` },
  { key: 'form', label: 'Forma 10', description: 'Forma za posledních deset zápasů', lowerIsBetter: true, format: (v) => `#${v}` },
  { key: 'common', label: 'Spol. soupeři', description: 'Rozdíl proti společným soupeřům', lowerIsBetter: false, format: (v) => `${v > 0 ? '+' : ''}${v}` },
]

const p = (
  name: string,
  country: string | undefined,
  [rank, ch, odds, opponents, level, form, common]: (number | null)[],
  extra: Partial<Player> = {},
): Player => ({
  name,
  country,
  stats: { rank: rank!, ch: ch!, odds: odds!, opponents: opponents!, level: level!, form: form!, common: common! },
  ...extra,
})

export const tournaments: Tournament[] = [
  {
    id: 'phan-thiet',
    name: 'Challenger Phan Thiet',
    category: 'Challenger',
    surface: 'Hard',
    country: 'vn',
    matches: [
      {
        id: 'm1',
        time: '05:00',
        surface: 'Hard',
        insight: true,
        players: [
          p('Ethan Cook', 'au', [1311, 1080, 2.10, 559, 812, 1042, 44]),
          p('Jesse Flores', 'cr', [857, 759, 1.67, 910, 885, 922, -34], { entry: 'Q' }),
        ],
      },
      {
        id: 'm2',
        time: '05:00',
        surface: 'Hard',
        players: [
          p('Noritaka Koizumi', 'jp', [939, 939, 2.00, 1042, 935, 1092, -37]),
          p('Taisei Ichikawa', 'jp', [768, 636, 1.73, 669, 584, 713, -27]),
        ],
      },
      {
        id: 'm3',
        time: '05:00',
        surface: 'Hard',
        insight: true,
        players: [
          p('Timofei Derepasko', undefined, [680, 518, 1.02, 1440, 988, 1060, null]),
          p('Minh Thien Nguyen', undefined, [null, null, 11.00, null, null, null, null], { entry: 'WC' }),
        ],
      },
      {
        id: 'm4',
        time: '06:10',
        surface: 'Hard',
        live: true,
        players: [
          p('Takuya Kumasaka', 'jp', [548, 449, 1.98, 525, 594, 646, -11]),
          p('Martin Borisiouk', undefined, [1003, 736, 2.02, 942, 640, 629, 81]),
        ],
      },
      {
        id: 'm5',
        time: '06:10',
        surface: 'Hard',
        insight: true,
        players: [
          p('Christopher Papa', 'us', [1054, 927, 1.40, 776, 750, 817, 77], { entry: 'Q' }),
          p('Sam Ryan Ziegann', 'au', [820, 818, 2.75, 1722, 1362, 1616, -70]),
        ],
      },
      {
        id: 'm6',
        time: '06:30',
        surface: 'Hard',
        insight: true,
        players: [
          p('Nam Nguyen', 'vn', [null, null, 11.00, null, null, null, null], { entry: 'WC' }),
          p('Hunter Heck', 'us', [717, 417, 1.02, 699, 1051, 872, null]),
        ],
      },
      {
        id: 'm7',
        time: '07:20',
        surface: 'Hard',
        insight: true,
        players: [
          p('Yuta Kawahashi', 'jp', [663, 519, 1.05, 989, 1567, 1473, 87], { seed: 4 }),
          p('Abhishek Bastola', 'np', [null, null, 8.50, 2118, 3467, 2309, -71]),
        ],
      },
      {
        id: 'm8',
        time: '07:20',
        surface: 'Hard',
        insight: true,
        players: [
          p('Dong Ju Kim', 'kr', [689, 565, 2.25, 1846, 1242, 1474, -15]),
          p('Kristjan Tamm', 'ee', [1162, 625, 1.57, 978, 869, 909, -13]),
        ],
      },
    ],
  },
]

/** Strom filtrů. Počty odpovídají tomu, co je na snímku. */
export const sportTree = [
  {
    label: 'Tenis',
    value: 'tenis',
    icon: 'lucide:circle-dot',
    count: 131,
    children: [
      {
        label: 'Muži',
        value: 'tenis-muzi',
        count: 72,
        children: [
          { label: 'ATP', value: 'atp', count: 6 },
          { label: 'Challenger', value: 'challenger', count: 26 },
          { label: 'ITF', value: 'itf-m', count: 27 },
          { label: 'UTR', value: 'utr-m', count: 13 },
        ],
      },
      {
        label: 'Ženy',
        value: 'tenis-zeny',
        count: 59,
        children: [
          { label: 'WTA', value: 'wta', count: 20 },
          { label: 'ITF', value: 'itf-z', count: 25 },
          { label: 'UTR', value: 'utr-z', count: 14 },
        ],
      },
    ],
  },
  {
    label: 'Fotbal',
    value: 'fotbal',
    icon: 'lucide:volleyball',
    count: 0,
    children: [{ label: 'Muži', value: 'fotbal-muzi', count: 0, disabled: true }],
  },
]

/**
 * Kdo je na dané metrice lepší a o kolik.
 *
 * Vrací `null`, když jednomu z hráčů hodnota chybí — chybějící údaj není
 * nula a nedá se z něj počítat převaha.
 */
export function advantage(match: Match, metric: Metric) {
  const a = match.players[0].stats[metric.key]
  const b = match.players[1].stats[metric.key]
  if (a === null || a === undefined || b === null || b === undefined) return null

  const diff = a - b
  if (diff === 0) return { side: null, size: 0 }

  const topIsBetter = metric.lowerIsBetter ? diff < 0 : diff > 0
  return { side: topIsBetter ? (0 as const) : (1 as const), size: Math.abs(diff) }
}
