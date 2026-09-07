<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Osm paprsků, které skáčou po krocích — ne plynule točící se kolečko.
 * Plynulá rotace vypadá jako web, skoková jako systém. Proto `steps(8)`.
 */
const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { size: 'md', ariaLabel: 'Načítá se', class: undefined },
)

const boxes = { sm: 'size-4', md: 'size-6', lg: 'size-9' } as const

/**
 * Střed rámečku je v 50 %, paprsek začíná ve 4 % a je vysoký 28 %.
 * Vzdálenost od jeho vršku ke středu je 46 % rámečku, což je 164 % jeho
 * vlastní výšky — odtud počátek otáčení.
 */
const spokes = Array.from({ length: 8 }, (_, i) => ({
  transform: `rotate(${i * 45}deg)`,
  opacity: 1 - i / 8,
}))
</script>

<template>
  <span
    role="status"
    :aria-label="ariaLabel"
    :class="cn('vos-spinner relative inline-block text-(--fg-primary)', boxes[props.size], props.class)"
  >
    <span
      v-for="(spoke, i) in spokes"
      :key="i"
      class="absolute top-[4%] left-[44%] h-[28%] w-[12%] origin-[50%_164%] rounded-full bg-current"
      :style="spoke"
    />
  </span>
</template>
