import { ENTRY_TYPES, INSIGHTS, NUMERIC_KEYS, type Surface } from './sport'

/**
 * Seedovaný generátor zápasů.
 *
 * `Math.random()` se použít nedá: server a prohlížeč by dostaly jiná čísla
 * a hydratace by se rozpadla. Neprojeví se to srozumitelnou chybou, ale
 * blikáním a přeházenými řádky — a hledá se to dlouho.
 *
 * Mulberry32 stačí. Nejde o kvalitu náhody, jde o to, aby dvakrát po sobě
 * vypadla tatáž.
 */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface Player {
  name: string
  country: string
  seed: number | null
  entry: string | null
  insights: string[]
  stats: Record<string, number | null>
}

export interface SetScore {
  home: number
  away: number
  tiebreak: number | null
}

export interface Match {
  id: string
  tournament: string
  time: string
  round: string
  live: boolean
  /** Zjištění je připravené — v seznamu se pozná žárovkou. */
  insight: boolean
  players: [Player, Player]
  /** Jen u dohraných. */
  result: { sets: SetScore[], home: number, away: number, winner: 0 | 1 } | null
}

export interface Tournament {
  slug: string
  name: string
  category: 'ATP' | 'Challenger' | 'ITF'
  country: string
  surface: Surface
}

export const TOURNAMENTS: Tournament[] = [
  { slug: 'us-open', name: 'US Open', category: 'ATP', country: 'us', surface: 'hard' },
  { slug: 'genoa', name: 'Challenger Genoa', category: 'Challenger', country: 'it', surface: 'clay' },
  { slug: 'seville', name: 'Challenger Seville', category: 'Challenger', country: 'es', surface: 'clay' },
  { slug: 'phan-thiet', name: 'Challenger Phan Thiet', category: 'Challenger', country: 'vn', surface: 'hard' },
  { slug: 'tulln', name: 'Challenger Tulln', category: 'Challenger', country: 'at', surface: 'clay' },
  { slug: 'cairo', name: 'ITF Cairo', category: 'ITF', country: 'eg', surface: 'hard' },
]

const FIRST = ['Takuya', 'Martin', 'Ethan', 'Jesse', 'Noritaka', 'Taisei', 'Christopher', 'Sam', 'Yuta',
  'Dong Ju', 'Kristjan', 'Thiago', 'Gianmarco', 'Massimo', 'Tom', 'Franco', 'Matej', 'Pedro', 'Francesco',
  'Hugo', 'Felipe', 'Juan Pablo', 'Valerio', 'Alvaro', 'Maximo', 'Nam', 'Hunter', 'Abhishek']

const LAST = ['Kumasaka', 'Borisiouk', 'Cook', 'Flores', 'Koizumi', 'Ichikawa', 'Papa', 'Ziegann',
  'Kawahashi', 'Kim', 'Tamm', 'Seyboth Wild', 'Ferrari', 'Giunta', 'Gentzsch', 'Agamenone', 'Dodig',
  'Martinez', 'Forti', 'Dellien', 'Meligeni', 'Varillas', 'Aboian', 'Guillen Meza', 'Zeitune',
  'Nguyen', 'Heck', 'Bastola']

const COUNTRIES = ['jp', 'by', 'au', 'cr', 'us', 'kr', 'ee', 'br', 'it', 'de', 'hr', 'es', 'bo', 'pe', 'vn', 'np', 'ar', 'cz']

const ROUNDS = ['R32', 'R16', 'QF', 'SF']

/** Rozsahy metrik. Drží čísla v rozumných mezích, ať filtry mají co filtrovat. */
const RANGES: Record<string, [number, number]> = {
  rank: [40, 1400],
  careerHigh: [20, 900],
  age: [18, 36],
  odds: [102, 1100],
  oppRank: [80, 2200],
  gameLevel: [60, 3400],
  form: [90, 2400],
  gamesWonPct: [38, 62],
  surfaceWinPct: [30, 78],
}

function makePlayer(rand: () => number, tournamentCountry: string): Player {
  const stats: Record<string, number | null> = {}
  for (const key of NUMERIC_KEYS) {
    const [min, max] = RANGES[key]!
    // Desetina hráčů nemá odehráno dost na to, aby se metrika spočítala.
    // Chybějící hodnota není nula a seznam ji musí umět ukázat jako „—“.
    if (key !== 'odds' && rand() < 0.08) {
      stats[key] = null
      continue
    }
    stats[key] = Math.round(min + rand() * (max - min))
  }
  stats.odds = Number(((stats.odds as number) / 100).toFixed(2))

  const country = COUNTRIES[Math.floor(rand() * COUNTRIES.length)]!
  const insights: string[] = []
  for (const insight of INSIGHTS) {
    if (insight.key === 'homeCrowd') {
      if (country === tournamentCountry) insights.push(insight.key)
      continue
    }
    if (insight.key === 'favourite') continue
    if (rand() < 0.18) insights.push(insight.key)
  }

  return {
    // Obě části jména z náhodného proudu, ne z indexu. Odvozování z indexu
    // dávalo dvojicím sousední příjmení a v seznamu se pak čtyřikrát po sobě
    // objevil tentýž „Martinez" — vypadá to jako chyba dat, ne jako los.
    name: `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)]}`,
    country,
    seed: rand() < 0.25 ? Math.ceil(rand() * 8) : null,
    entry: rand() < 0.22 ? ENTRY_TYPES[Math.floor(rand() * ENTRY_TYPES.length)]!.key : null,
    insights,
    stats,
  }
}

function makeSets(rand: () => number): { sets: SetScore[], home: number, away: number, winner: 0 | 1 } {
  const sets: SetScore[] = []
  let home = 0
  let away = 0
  while (home < 2 && away < 2) {
    const homeWins = rand() < 0.5
    const loser = Math.floor(rand() * 6)
    const tie = loser === 5 && rand() < 0.5
    const winnerGames = tie ? 7 : 6
    const loserGames = tie ? 6 : loser
    sets.push({
      home: homeWins ? winnerGames : loserGames,
      away: homeWins ? loserGames : winnerGames,
      tiebreak: tie ? Math.floor(rand() * 6) : null,
    })
    if (homeWins) home++
    else away++
  }
  return { sets, home, away, winner: home > away ? 0 : 1 }
}

function build(seed: number, count: number, finished: boolean): Match[] {
  const rand = mulberry32(seed)
  const matches: Match[] = []

  for (let i = 0; i < count; i++) {
    const tournament = TOURNAMENTS[Math.floor(rand() * TOURNAMENTS.length)]!
    const hour = 9 + Math.floor(rand() * 10)
    const minute = rand() < 0.5 ? '00' : '30'
    const players: [Player, Player] = [
      makePlayer(rand, tournament.country),
      makePlayer(rand, tournament.country),
    ]

    // Favorita určuje kurz, ne žebříček — a je to insight, ne prop.
    const favourite = (players[0].stats.odds ?? 99) <= (players[1].stats.odds ?? 99) ? 0 : 1
    if ((players[favourite]!.stats.odds ?? 99) < 1.5) players[favourite]!.insights.push('favourite')

    matches.push({
      id: `${finished ? 'r' : 'm'}${i}`,
      tournament: tournament.slug,
      time: `${String(hour).padStart(2, '0')}:${minute}`,
      round: ROUNDS[Math.floor(rand() * ROUNDS.length)]!,
      live: !finished && rand() < 0.12,
      insight: rand() < 0.55,
      players,
      result: finished ? makeSets(rand) : null,
    })
  }

  return matches.sort((a, b) => a.time.localeCompare(b.time))
}

/* Dvě různá semínka, aby zápasy a výsledky nebyly tytéž dvojice. */
export const UPCOMING = build(20260908, 42, false)
export const FINISHED = build(19910704, 24, true)

export const tournamentBySlug = (slug: string) => TOURNAMENTS.find((t) => t.slug === slug)
