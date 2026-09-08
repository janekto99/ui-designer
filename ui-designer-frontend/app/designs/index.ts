export interface Design {
  /** Identifikátor v cookie a v URL. */
  id: string
  /** Název v selectu. */
  name: string
  /** Třída, která se pověsí na <html> a nese tokeny. */
  className: string
  /** Jednou větou, čím se design pozná. */
  tagline: string
  /** Návrh k rozhodnutí, ne hotový design — ukazuje se v playgroundu. */
  proposal?: boolean
  /** Co ten návrh řeší. Delší než tagline, do playgroundu. */
  premise?: string
}

export const designs: Design[] = [
  {
    id: 'visionos',
    name: 'visionOS',
    className: 'design-visionos',
    tagline: 'Sklo nad scénou, kulaté pilulky, specular obrys.',
  },
  {
    id: 'pastel',
    name: 'Pastel',
    className: 'design-pastel',
    tagline: 'Inkoustová tlačítka, pilulky, chladně šedé pozadí.',
  },
  {
    id: 'linka',
    name: 'Linka',
    className: 'design-linka',
    proposal: true,
    tagline: 'Hustota z typografie, ne z rámečků.',
    premise:
      'Osm bílých karet na skoro bílém pozadí se slije do jedné šedé plochy. '
      + 'Tenhle návrh karty ruší — řádky drží vlasová čára a rytmus. Barva má '
      + 'jediný úkol: říct, která hodnota je lepší.',
  },
  {
    id: 'mrizka',
    name: 'Mřížka',
    className: 'design-mrizka',
    proposal: true,
    tagline: 'Jeden panel, hlavička jednou, sloupce drží.',
    premise:
      'Původní obrazovka opakuje hlavičku sloupců u každého zápasu — osmkrát '
      + 'pod sebou totéž. Oko nemá svislou linku, které by se drželo. Tenhle '
      + 'návrh dá turnaji jeden panel a hlavičku nahoru, přilepenou.',
  },
  {
    id: 'karta',
    name: 'Karta',
    className: 'design-karta',
    proposal: true,
    tagline: 'Míň jednotek, víc hierarchie.',
    premise:
      'Sedm čísel u osmi zápasů je 112 hodnot stejné velikosti. Slitost tady '
      + 'nedělá barva, ale to, že nic není důležitější než nic jiného. Karty '
      + 'zůstávají, ale větší a s většinou čísel schovanou.',
  },
]

export const defaultDesignId = 'visionos'

export const proposals = designs.filter((d) => d.proposal)
