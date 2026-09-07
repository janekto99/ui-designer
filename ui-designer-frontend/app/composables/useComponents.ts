export interface ComponentEntry {
  slug: string
  name: string
  icon: string
  /** Hotové komponenty mají stránku, ostatní jsou v sidebaru jen zašedlé. */
  ready: boolean
}

const entries: ComponentEntry[] = [{ slug: 'button', name: 'Button', icon: 'lucide:square-mouse-pointer', ready: true }]

export function useComponents() {
  return {
    entries,
    find: (slug: string) => entries.find((e) => e.slug === slug),
  }
}
