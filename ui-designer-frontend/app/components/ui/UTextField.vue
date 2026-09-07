<script setup lang="ts">
import { field, type FieldSize } from './field.variants'
import type { ClassValue } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    /** Ikona vlevo, např. `lucide:mic`. */
    icon?: string
    type?: 'text' | 'password' | 'search' | 'email' | 'url' | 'tel'
    size?: FieldSize
    disabled?: boolean
    /** Křížek vpravo, jakmile je co smazat. */
    clearable?: boolean
    /** Barevný nádech pole při diktování. */
    dictating?: boolean
    ariaLabel?: string
    class?: ClassValue
  }>(),
  {
    placeholder: undefined,
    icon: undefined,
    type: 'text',
    size: 'md',
    disabled: false,
    clearable: false,
    dictating: false,
    ariaLabel: undefined,
    class: undefined,
  },
)

const model = defineModel<string>({ default: '' })

const input = useTemplateRef<HTMLInputElement>('input')

const ui = computed(() => field({ size: props.size, dictating: props.dictating }))
const showClear = computed(() => props.clearable && model.value.length > 0 && !props.disabled)

function clear() {
  model.value = ''
  input.value?.focus()
}
</script>

<template>
  <div :class="cn(ui.root(), props.class)">
    <Icon v-if="icon" :name="icon" :class="ui.icon()" />

    <input
      ref="input"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-label="ariaLabel"
      :class="ui.input()"
    >

    <button
      v-if="showClear"
      type="button"
      :class="ui.clear()"
      aria-label="Vymazat"
      @click="clear"
    >
      <Icon name="lucide:circle-x" class="size-full" />
    </button>
  </div>
</template>
