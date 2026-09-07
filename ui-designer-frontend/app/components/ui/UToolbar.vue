<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

export interface ToolbarItem {
  label?: string
  icon?: string
  disabled?: boolean
  /** Aktivní nástroj — plná bílá, jako `selected` u tlačítka. */
  active?: boolean
}

/**
 * Plovoucí pilulka s nástroji. Ve Figmě roste po 60 px na položku a drží
 * výšku 44 — proto tu není `size`: toolbar má ve visionOS jednu velikost.
 */
const props = withDefaults(
  defineProps<{
    items: ToolbarItem[]
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { ariaLabel: undefined, class: undefined },
)

defineEmits<{ select: [item: ToolbarItem, index: number] }>()
</script>

<template>
  <div
    role="toolbar"
    :aria-label="ariaLabel"
    :class="cn('vos-surface vos-glass inline-flex items-center gap-1 rounded-full p-1.5', props.class)"
  >
    <UButton
      v-for="(item, index) in items"
      :key="index"
      :label="item.label"
      :icon="item.icon"
      :variant="item.active ? 'selected' : 'plain'"
      :disabled="item.disabled"
      :aria-label="!item.label ? item.icon : undefined"
      @click="$emit('select', item, index)"
    />
  </div>
</template>
