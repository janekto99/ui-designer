<script setup lang="ts">
import type { FieldSize } from './field.variants'
import type { ClassValue } from '~/utils/cn'

/**
 * Hledací pole. Proti `UTextField` jen předvyplněná ikona mikrofonu, křížek
 * napevno a stav diktování — ve Figmě je to samostatná komponenta právě kvůli
 * těmhle třem věcem.
 */
withDefaults(
  defineProps<{
    placeholder?: string
    size?: FieldSize
    disabled?: boolean
    dictating?: boolean
    class?: ClassValue
  }>(),
  {
    placeholder: 'Hledat',
    size: 'md',
    disabled: false,
    dictating: false,
    class: undefined,
  },
)

const model = defineModel<string>({ default: '' })
</script>

<template>
  <UTextField
    v-model="model"
    type="search"
    icon="lucide:mic"
    clearable
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    :dictating="dictating"
    :aria-label="placeholder"
    :class="$props.class"
  />
</template>
