<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Tečky. Aktivní je plná, ostatní tlumené — a čím dál od aktivní, tím menší.
 * To zmenšování je ve Figmě vidět až u vyšších počtů; bez něj vypadá řada
 * osmi teček jako mřížka, ne jako stránkování.
 */
const props = withDefaults(
  defineProps<{
    count: number
    size?: 'sm' | 'md'
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { size: 'md', ariaLabel: 'Stránky', class: undefined },
)

const model = defineModel<number>({ default: 0 })

const dots = { sm: 'size-1.5', md: 'size-2' } as const

/** Vzdálenost od aktivní tečky se promítne do velikosti i průhlednosti. */
function scaleFor(index: number) {
  const distance = Math.abs(index - model.value)
  if (distance === 0) return 1
  if (distance === 1) return 0.85
  if (distance === 2) return 0.7
  return 0.55
}

function move(step: number) {
  model.value = Math.min(props.count - 1, Math.max(0, model.value + step))
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
  else if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
  else if (event.key === 'Home') { event.preventDefault(); model.value = 0 }
  else if (event.key === 'End') { event.preventDefault(); model.value = props.count - 1 }
}
</script>

<template>
  <div
    role="tablist"
    :aria-label="ariaLabel"
    :class="cn('inline-flex items-center gap-2', props.class)"
    @keydown="onKeydown"
  >
    <button
      v-for="index in count"
      :key="index"
      type="button"
      role="tab"
      :aria-selected="index - 1 === model"
      :aria-label="`Stránka ${index}`"
      :tabindex="index - 1 === model ? 0 : -1"
      class="cursor-pointer rounded-full bg-(--fg-primary) transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:ring-offset-2"
      :class="dots[props.size]"
      :style="{
        opacity: index - 1 === model ? 1 : 0.35,
        scale: String(scaleFor(index - 1)),
      }"
      @click="model = index - 1"
    />
  </div>
</template>
