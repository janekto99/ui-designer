<script setup lang="ts">
import type { FieldSize } from './field.variants'
import type { ClassValue } from '~/utils/cn'

/** Pole pro heslo. Stejná kostra jako `UTextField`, jen zamaskovaný obsah. */
withDefaults(
  defineProps<{
    placeholder?: string
    size?: FieldSize
    disabled?: boolean
    clearable?: boolean
    ariaLabel?: string
    class?: ClassValue
  }>(),
  {
    placeholder: undefined,
    size: 'md',
    disabled: false,
    clearable: true,
    ariaLabel: 'Heslo',
    class: undefined,
  },
)

const model = defineModel<string>({ default: '' })
</script>

<template>
  <UTextField
    v-model="model"
    type="password"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    :aria-label="ariaLabel"
    :class="$props.class"
  />
</template>
