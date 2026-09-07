<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Plocha, na které něco leží. Materiál se volí podle toho, **co je pod ní** —
 * ne podle důležitosti obsahu:
 *
 * | materiál | kdy |
 * | --- | --- |
 * | `thin` | plocha pod obsahem — seznam, filtry |
 * | `regular` | vrstva nad obsahem — menu, panel |
 * | `thick` | musí se číst i nad rušným pozadím — data, alert |
 * | `glass` | ovládací prvek, ne plocha |
 * | `recessed` | vyhloubené místo, do kterého se něco sází |
 *
 * Číselná data patří na `thick`. Sklo je na tom, co se překrývá, ne na tom,
 * co se čte.
 */
const props = withDefaults(
  defineProps<{
    material?: 'thin' | 'regular' | 'thick' | 'glass' | 'recessed'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    /** Reaguje na kurzor a jde na ni zaostřit — použij, když celá vede někam. */
    interactive?: boolean
    /** `article` pro samostatný obsah, `li` v seznamu. */
    as?: string
    class?: ClassValue
  }>(),
  { material: 'thin', padding: 'md', interactive: false, as: 'div', class: undefined },
)

const materials = {
  thin: 'vos-view-thin',
  regular: 'vos-view-regular',
  thick: 'vos-view-thick',
  glass: 'vos-surface vos-glass',
  recessed: 'vos-view-recessed',
} as const

const paddings = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-6' } as const
</script>

<template>
  <component
    :is="as"
    :tabindex="interactive ? 0 : undefined"
    :class="cn(
      'rounded-3xl',
      materials[props.material],
      paddings[props.padding],
      interactive && [
        'cursor-pointer transition-shadow outline-none',
        'hover:ring-1 hover:ring-(--separator)',
        'focus-visible:ring-2 focus-visible:ring-(--focus-ring)',
      ],
      props.class,
    )"
  >
    <slot />
  </component>
</template>
