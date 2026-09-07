<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Odznáček. Buď číslo, nebo jen tečka — obojí vždy systémová červená,
 * v obou režimech stejná.
 */
const props = withDefaults(
  defineProps<{
    /** Číslo v odznáčku. Bez něj vznikne tečka. */
    value?: number
    /** Nad čím se hodnota už neukazuje přesně, ale jako „9+". */
    max?: number
    size?: 'sm' | 'md'
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { value: undefined, max: 99, size: 'md', ariaLabel: undefined, class: undefined },
)

const isDot = computed(() => props.value === undefined)

const text = computed(() => {
  if (props.value === undefined) return ''
  return props.value > props.max ? `${props.max}+` : String(props.value)
})

const sizes = {
  sm: { dot: 'size-2', pill: 'h-4 min-w-4 px-1 text-caption-2' },
  md: { dot: 'size-2.5', pill: 'h-5 min-w-5 px-1.5 text-caption-1' },
} as const
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center justify-center rounded-full bg-(--badge-fill) font-semibold text-(--badge-fg)',
      isDot ? sizes[props.size].dot : sizes[props.size].pill,
      props.class,
    )"
    :aria-label="ariaLabel ?? (isDot ? 'Novinka' : `${value} nepřečtených`)"
    :role="ariaLabel || !isDot ? 'status' : undefined"
  >{{ text }}</span>
</template>
