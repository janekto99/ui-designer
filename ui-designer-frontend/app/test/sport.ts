/**
 * Definice sportu.
 *
 * Seznam zápasů o tenisu nic neví — vykresluje sloupce, které mu nadiktuje
 * tahle definice. Kdyby přibyl fotbal, přibude druhý soubor a nic jiného.
 * Proto tu stojí i řazení a insighty: tenisový žebříček u fotbalu nedává
 * smysl a naopak.
 */

export type Surface = 'hard' | 'clay' | 'grass'

export interface ColumnDef {
  key: string
  /** Zkratka do hlavičky. */
  label: string
  /** Celý název pro čtečku a pro dialog zobrazení. */
  description: string
  /** Menší hodnota je lepší (žebříček), nebo větší (procenta)? */
  lowerIsBetter: boolean
  format: (value: number) => string
  /** Nečíselné sloupce se vykreslují vlastní buňkou. */
  kind?: 'flag' | 'entry' | 'insights'
}

export interface InsightDef {
  key: string
  label: string
  description: string
  /** Do které skupiny patří v dialogu. */
  group: string
}

export interface EntryDef {
  key: string
  short: string
  label: string
}

export const SURFACES: Record<Surface, { label: string, tone: 'info' | 'warning' | 'success' }> = {
  hard: { label: 'Hard', tone: 'info' },
  clay: { label: 'Antuka', tone: 'warning' },
  grass: { label: 'Tráva', tone: 'success' },
}

/** Způsob účasti. Chybí u přímých účastníků — proto je `entry` nepovinné. */
export const ENTRY_TYPES: EntryDef[] = [
  { key: 'wc', short: 'WC', label: 'Divoká karta' },
  { key: 'q', short: 'Q', label: 'Kvalifikant' },
  { key: 'll', short: 'LL', label: 'Lucky loser' },
  { key: 'pr', short: 'PR', label: 'Chráněný žebříček' },
]

export const INSIGHTS: InsightDef[] = [
  { key: 'streak', label: 'Série výher', description: 'Vyhrál poslední tři a víc zápasů.', group: 'Forma' },
  { key: 'slump', label: 'Série proher', description: 'Prohrál poslední tři a víc zápasů.', group: 'Forma' },
  { key: 'homeCrowd', label: 'Domácí prostředí', description: 'Hraje ve své zemi.', group: 'Kontext' },
  { key: 'retired', label: 'Po skreči', description: 'Poslední zápas nedohrál.', group: 'Kondice' },
  { key: 'longMatch', label: 'Dlouhý zápas', description: 'Předchozí zápas trval přes tři hodiny.', group: 'Kondice' },
  { key: 'surfaceSwitch', label: 'Změna povrchu', description: 'Přijel z turnaje na jiném povrchu.', group: 'Kontext' },
  { key: 'firstMeeting', label: 'První vzájemný', description: 'Se soupeřem se ještě nepotkal.', group: 'Soupeř' },
  { key: 'favourite', label: 'Favorit trhu', description: 'Kurz pod 1,50.', group: 'Trh' },
]

/**
 * Sloupce. Čtrnáct jich je definovaných, šest se ukazuje — zbytek si
 * uživatel zapne v dialogu zobrazení.
 */
export const COLUMNS: ColumnDef[] = [
  { key: 'nationality', label: 'Země', description: 'Národnost', lowerIsBetter: false, kind: 'flag', format: String },
  { key: 'entry', label: 'Účast', description: 'Způsob účasti v soutěži', lowerIsBetter: false, kind: 'entry', format: String },
  { key: 'insights', label: 'Insighty', description: 'Zjištění k tomuto hráči', lowerIsBetter: false, kind: 'insights', format: String },
  { key: 'seed', label: 'Nas.', description: 'Nasazení v pavouku', lowerIsBetter: true, format: (v) => `[${v}]` },
  { key: 'rank', label: 'Rank', description: 'Aktuální žebříček', lowerIsBetter: true, format: (v) => `#${v}` },
  { key: 'careerHigh', label: 'CH', description: 'Kariérní maximum', lowerIsBetter: true, format: (v) => `#${v}` },
  { key: 'age', label: 'Věk', description: 'Věk hráče', lowerIsBetter: false, format: (v) => String(v) },
  { key: 'odds', label: 'Kurz', description: 'Kurz na vítězství', lowerIsBetter: true, format: (v) => v.toFixed(2).replace('.', ',') },
  { key: 'oppRank', label: 'Soupeři 10', description: 'Průměrná síla soupeřů za deset zápasů', lowerIsBetter: true, format: (v) => `#${v}` },
  { key: 'gameLevel', label: 'Úroveň 10', description: 'Herní úroveň za deset zápasů', lowerIsBetter: true, format: (v) => `#${v}` },
  { key: 'form', label: 'Forma 10', description: 'Forma za deset zápasů', lowerIsBetter: true, format: (v) => `#${v}` },
  { key: 'gamesWonPct', label: 'Gamy %', description: 'Podíl vyhraných gamů', lowerIsBetter: false, format: (v) => `${v} %` },
  { key: 'common', label: 'Spol. soupeři', description: 'Rozdíl proti společným soupeřům', lowerIsBetter: false, format: (v) => `${v > 0 ? '+' : ''}${v}` },
  { key: 'surfaceWinPct', label: 'Povrch %', description: 'Úspěšnost na tomto povrchu', lowerIsBetter: false, format: (v) => `${v} %` },
]

export const DEFAULT_COLUMNS = ['nationality', 'entry', 'insights', 'rank', 'careerHigh', 'odds']

/** Sloupce, podle kterých jde řadit. Vlajku ani insighty nemá smysl nabízet. */
export const SORT_FIELDS = [
  { key: 'time', label: 'Čas výkopu' },
  { key: 'rank', label: 'Žebříček' },
  { key: 'odds', label: 'Kurz' },
  { key: 'form', label: 'Forma' },
  { key: 'seed', label: 'Nasazení' },
]

/** Sloupce, na které jde nasadit číselný rozsah. */
export const NUMERIC_KEYS = ['rank', 'careerHigh', 'age', 'odds', 'oppRank', 'gameLevel', 'form', 'gamesWonPct', 'surfaceWinPct']

export const columnByKey = (key: string) => COLUMNS.find((c) => c.key === key)
export const insightByKey = (key: string) => INSIGHTS.find((i) => i.key === key)
export const entryByKey = (key: string) => ENTRY_TYPES.find((e) => e.key === key)
