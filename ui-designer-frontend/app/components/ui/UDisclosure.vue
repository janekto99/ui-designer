<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Rozbalovací oblast.
 *
 * Obsah zůstává v DOM i zavřený — nemusí se při otevření znovu vykreslovat
 * a nepřeskočí to. Výška se animuje přes `grid-template-rows`, protože
 * `height: auto` se animovat nedá a pevná výška by musela vědět, jak je
 * obsah vysoký.
 */
const props = withDefaults(
  defineProps<{
    /** Popisek spouštěče. Bez něj se použije slot `summary`. */
    label?: string
    icon?: string
    /** Text nebo počet vpravo od popisku. */
    hint?: string | number
    /** Bez rámu a odsazení — hodí se do seznamu, kde rám nese už rodič. */
    plain?: boolean
    disabled?: boolean
    class?: ClassValue
  }>(),
  {
    label: undefined,
    icon: undefined,
    hint: undefined,
    plain: false,
    disabled: false,
    class: undefined,
  },
)

const open = defineModel<boolean>({ default: false })
const id = useId()

function toggle() {
  if (!props.disabled) open.value = !open.value
}
</script>

<template>
  <div :class="cn(!plain && 'vos-view-thin overflow-hidden rounded-2xl', props.class)">
    <button
      type="button"
      :aria-expanded="open"
      :aria-controls="id"
      :disabled="disabled"
      :class="cn(
        'vos-surface vos-plain flex w-full cursor-pointer items-center gap-2.5 text-left outline-none',
        'focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:-outline-offset-2',
        plain ? 'rounded-xl px-2 py-1.5' : 'px-4 py-3',
        disabled && 'pointer-events-none opacity-40',
      )"
      @click="toggle"
    >
      <Icon
        name="lucide:chevron-down"
        class="size-4 shrink-0 text-(--fg-secondary) transition-transform duration-200"
        :class="!open && '-rotate-90'"
      />
      <Icon v-if="icon" :name="icon" class="size-4 shrink-0" />

      <span class="min-w-0 flex-1 truncate text-callout font-medium">
        <slot name="summary">{{ label }}</slot>
      </span>

      <span v-if="hint !== undefined" class="shrink-0 text-footnote text-(--fg-tertiary)">
        {{ hint }}
      </span>
    </button>

    <div
      :id="id"
      class="grid transition-[grid-template-rows] duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]"
      :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      :aria-hidden="!open"
    >
      <div class="overflow-hidden">
        <div :class="plain ? 'pt-1' : 'px-4 pb-4'">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
