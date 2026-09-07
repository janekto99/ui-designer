<script setup lang="ts">
import { toggle, type ToggleSize } from './toggle.variants'
import type { ClassValue } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    size?: ToggleSize
    disabled?: boolean
    /** Bez viditelného popisku je povinný — jinak nemá čtečka co přečíst. */
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { size: 'md', disabled: false, ariaLabel: undefined, class: undefined },
)

const model = defineModel<boolean>({ default: false })

const ui = computed(() => toggle({ size: props.size, on: model.value }))

function toggleValue() {
  if (!props.disabled) model.value = !model.value
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    :aria-label="ariaLabel"
    :disabled="disabled"
    :class="cn(ui.track(), props.class)"
    @click="toggleValue"
    @keydown.enter.prevent="toggleValue"
  >
    <span :class="ui.knob()" />
  </button>
</template>
