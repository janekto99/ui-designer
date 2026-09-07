<script setup lang="ts">
import { button, type ButtonSize, type ButtonVariant, type Tone } from './button.variants'
import type { ClassValue } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    /** Text tlačítka. Bez něj a s ikonou vznikne kruhové ikonové tlačítko. */
    label?: string
    /** Název ikony pro @nuxt/icon, např. `lucide:plus`. */
    icon?: string
    variant?: ButtonVariant
    /** Význam, ne vzhled. Kombinuje se s `variant`. */
    tone?: Tone
    size?: ButtonSize
    /** Roztáhne tlačítko na plnou šířku rodiče. */
    block?: boolean
    disabled?: boolean
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
    /** Povinné u ikonového tlačítka — jinak nemá čtečka co přečíst. */
    ariaLabel?: string
    class?: ClassValue
  }>(),
  {
    label: undefined,
    icon: undefined,
    variant: 'glass',
    tone: 'neutral',
    size: 'md',
    block: false,
    disabled: false,
    loading: false,
    type: 'button',
    ariaLabel: undefined,
    class: undefined,
  },
)

const slots = useSlots()

const hasLabel = computed(() => Boolean(props.label) || Boolean(slots.default))
const iconOnly = computed(() => !hasLabel.value && Boolean(props.icon))

const ui = computed(() =>
  button({
    variant: props.variant,
    tone: props.tone,
    size: props.size,
    iconOnly: iconOnly.value,
    block: props.block,
  }),
)
</script>

<template>
  <button
    :type="type"
    :class="cn(ui.base(), props.class)"
    :disabled="disabled || loading"
    :aria-label="ariaLabel ?? (iconOnly ? label : undefined)"
    :aria-busy="loading || undefined"
  >
    <Icon v-if="loading" name="lucide:loader-circle" :class="cn(ui.icon(), 'animate-spin')" />
    <Icon v-else-if="icon" :name="icon" :class="ui.icon()" />
    <span v-if="hasLabel" :class="ui.label()">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>
