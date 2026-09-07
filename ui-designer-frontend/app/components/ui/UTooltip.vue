<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Bublina s popiskem. Ve visionOS se objeví, když se na prvek podíváš nebo
 * nad ním podržíš ukazatel — na webu je nejblíž `:hover` a `:focus-within`.
 *
 * Zobrazení řídí CSS, ne JavaScript: bublina je v DOMu pořád, jen průhledná.
 * Kvůli tomu ji čtečka najde přes `aria-describedby` i bez najetí.
 */
const props = withDefaults(
  defineProps<{
    label: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
    class?: ClassValue
  }>(),
  { placement: 'top', class: undefined },
)

const id = useId()

const positions = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
} as const
</script>

<template>
  <span class="group relative inline-flex" :aria-describedby="id">
    <slot />

    <span
      :id="id"
      role="tooltip"
      :class="cn(
        'vos-surface vos-glass pointer-events-none absolute z-50 rounded-full px-3 py-1',
        'text-caption-1 whitespace-nowrap opacity-0 transition-opacity duration-150',
        'group-hover:opacity-100 group-focus-within:opacity-100',
        positions[props.placement],
        props.class,
      )"
    >
      {{ label }}
    </span>
  </span>
</template>
