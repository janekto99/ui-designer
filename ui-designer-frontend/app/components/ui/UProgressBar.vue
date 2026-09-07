<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Ukazatel průběhu. Sdílí dráhu i výplň s posuvníkem — ve Figmě je to
 * vizuálně tentýž prvek bez knoflíku.
 */
const props = withDefaults(
  defineProps<{
    /** 0–100. `undefined` znamená neurčitý průběh. */
    value?: number
    size?: 'sm' | 'md' | 'lg'
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { value: undefined, size: 'md', ariaLabel: undefined, class: undefined },
)

const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2.5' } as const

const clamped = computed(() =>
  props.value === undefined ? undefined : Math.min(100, Math.max(0, props.value)),
)
</script>

<template>
  <div
    role="progressbar"
    :aria-valuenow="clamped"
    :aria-valuemin="clamped === undefined ? undefined : 0"
    :aria-valuemax="clamped === undefined ? undefined : 100"
    :aria-label="ariaLabel"
    :class="cn('relative w-full overflow-hidden rounded-full bg-(--slider-track)', heights[props.size], props.class)"
  >
    <span
      v-if="clamped !== undefined"
      class="absolute inset-y-0 left-0 rounded-full bg-(--slider-fill) transition-[width] duration-300 ease-out"
      :style="{ width: `${clamped}%` }"
    />
    <!-- Neurčitý průběh: proužek putuje tam a zpět, protože délka není známá. -->
    <span
      v-else
      class="absolute inset-y-0 w-1/3 animate-[vos-indeterminate_1.4s_ease-in-out_infinite] rounded-full bg-(--slider-fill)"
    />
  </div>
</template>
