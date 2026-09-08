<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Štítek ve vyhledávacím poli. Ve Figmě má tři stavy a jediný rozdíl proti
 * tlačítku je tvar — zaoblený obdélník, ne pilulka.
 */
const props = withDefaults(
  defineProps<{
    label: string
    /** `selected` je plná bílá s černým textem, jako u tlačítka. */
    selected?: boolean
    /** Křížek pro odebrání štítku. */
    removable?: boolean
    size?: 'sm' | 'md'
    disabled?: boolean
    class?: ClassValue
  }>(),
  { selected: false, removable: false, size: 'md', disabled: false, class: undefined },
)

defineEmits<{ remove: [] }>()

const sizes = {
  sm: 'h-8 gap-1.5 rounded-chip px-3 text-footnote',
  md: 'h-11 gap-2 rounded-chip px-4 text-body',
} as const
</script>

<template>
  <span
    :class="cn(
      'vos-surface inline-flex items-center font-medium select-none',
      sizes[props.size],
      selected ? 'vos-selected' : 'vos-glass',
      disabled && 'pointer-events-none opacity-40',
      props.class,
    )"
  >
    {{ label }}
    <button
      v-if="removable"
      type="button"
      class="-mr-1 shrink-0 cursor-pointer rounded-full opacity-60 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:outline-none"
      :aria-label="`Odebrat ${label}`"
      @click="$emit('remove')"
    >
      <Icon name="lucide:x" :class="props.size === 'sm' ? 'size-3.5' : 'size-4'" />
    </button>
  </span>
</template>
