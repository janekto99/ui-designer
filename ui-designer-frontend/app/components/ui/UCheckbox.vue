<script setup lang="ts">
import { checkbox, type CheckboxSize } from './checkbox.variants'
import type { ClassValue } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    /** Popisek vedle kolečka. Bez něj je potřeba `ariaLabel`. */
    label?: string
    size?: CheckboxSize
    disabled?: boolean
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { label: undefined, size: 'md', disabled: false, ariaLabel: undefined, class: undefined },
)

const model = defineModel<boolean>({ default: false })

const ui = computed(() => checkbox({ size: props.size, checked: model.value }))

function toggleValue() {
  if (!props.disabled) model.value = !model.value
}
</script>

<template>
  <label
    class="inline-flex items-center gap-2.5"
    :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
  >
    <button
      type="button"
      role="checkbox"
      :aria-checked="model"
      :aria-label="label ? undefined : ariaLabel"
      :disabled="disabled"
      :class="cn(ui.box(), props.class)"
      @click="toggleValue"
    >
      <Icon v-show="model" name="lucide:check" :class="ui.mark()" />
    </button>
    <span v-if="label" class="text-callout" :class="disabled && 'text-(--fg-disabled)'">
      {{ label }}
    </span>
  </label>
</template>
