import { defaultDesignId, designs, type Design } from '~/designs'

/**
 * Výběr designu. Třídu na <html> pověsí `applyDesign()`, která se volá jednou
 * v `app.vue` — kdyby ji volala každá komponenta, useHead by ji přidal vícekrát.
 */
export function useDesign() {
  const id = useCookie<string>('ui-designer-design', {
    default: () => defaultDesignId,
    sameSite: 'lax',
  })

  const design = computed<Design>(() => designs.find((d) => d.id === id.value) ?? designs[0]!)

  return { designs, id, design }
}

export function applyDesign() {
  const { design } = useDesign()

  useHead({
    htmlAttrs: { class: computed(() => design.value.className) },
  })
}
