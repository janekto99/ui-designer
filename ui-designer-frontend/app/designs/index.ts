export interface Design {
  /** Identifikátor v cookie a v URL. */
  id: string
  /** Název v selectu. */
  name: string
  /** Třída, která se pověsí na <html> a nese tokeny. */
  className: string
  /** Jednou větou, čím se design pozná. */
  tagline: string
}

export const designs: Design[] = [
  {
    id: 'visionos',
    name: 'visionOS',
    className: 'design-visionos',
    tagline: 'Sklo nad scénou, kulaté pilulky, specular obrys.',
  },
]

export const defaultDesignId = 'visionos'
