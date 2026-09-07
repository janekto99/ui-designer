<script setup lang="ts" generic="T extends string | number">
import type { ClassValue } from '~/utils/cn'

export interface TabDef<V> {
  label: string
  value: V
  icon?: string
  /** Počet vpravo od popisku. */
  count?: number
  disabled?: boolean
}

/**
 * Vodorovné záložky s podtržítkem.
 *
 * Proti `USegmentedControl` nesou mnohem méně vizuální váhy a hlavně škálují:
 * položky si berou jen svou šířku a při přetečení se dají odrolovat.
 * Segmentovaný ovladač je na dvě až tři vzájemně výlučné **volby**, záložky
 * na **navigaci** mezi sekcemi obsahu.
 *
 * V kitu tahle komponenta není — visionOS má jen svislou lištu vedle okna.
 * Je to odvození, ne přepis.
 */
const props = withDefaults(
  defineProps<{
    items: TabDef<T>[]
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { ariaLabel: undefined, class: undefined },
)

const model = defineModel<T>({ required: true })

const enabled = computed(() => props.items.filter((i) => !i.disabled))

function move(step: number) {
  if (!enabled.value.length) return
  const current = enabled.value.findIndex((i) => i.value === model.value)
  const next = (current + step + enabled.value.length) % enabled.value.length
  model.value = enabled.value[next]!.value
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
  else if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
  else if (event.key === 'Home') { event.preventDefault(); model.value = enabled.value[0]!.value }
  else if (event.key === 'End') { event.preventDefault(); model.value = enabled.value.at(-1)!.value }
}
</script>

<template>
  <div
    role="tablist"
    :aria-label="ariaLabel"
    :class="cn('flex gap-1 overflow-x-auto border-b border-(--separator)', props.class)"
    @keydown="onKeydown"
  >
    <button
      v-for="item in items"
      :key="String(item.value)"
      type="button"
      role="tab"
      :aria-selected="item.value === model"
      :disabled="item.disabled"
      :tabindex="item.value === model ? 0 : -1"
      class="relative inline-flex shrink-0 cursor-pointer items-center gap-2 px-3 pb-2.5 text-callout font-medium transition-colors duration-200 outline-none focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-(--focus-ring)"
      :class="[
        item.value === model ? 'text-(--fg-primary)' : 'text-(--fg-secondary) hover:text-(--fg-primary)',
        item.disabled && 'pointer-events-none opacity-40',
      ]"
      @click="model = item.value"
    >
      <Icon v-if="item.icon" :name="item.icon" class="size-4" />
      {{ item.label }}
      <span v-if="item.count !== undefined" class="text-caption-1 text-(--fg-tertiary)">
        {{ item.count }}
      </span>

      <!--
        `bottom-0`, ne `-bottom-px`. Cokoli, co přečnívá dolů, vyvolá svislý
        posuvník — `overflow-x-auto` totiž dopočítá i svislou osu na `auto`.
        Ze stejného důvodu je odsazení focus rámečku záporné.
      -->
      <span
        v-if="item.value === model"
        class="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-(--fg-primary)"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
