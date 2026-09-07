<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Řádek seznamu. Ve Figmě má vlevo buď nic, ikonu, obrázek nebo zaškrtávátko
 * a vpravo šipku, fajfku, text, přepínač nebo úchyt pro přesun — proto tolik
 * props: je to jeden řádek, ne pět komponent.
 */
const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    icon?: string
    /** Šipka doprava — řádek někam vede. */
    chevron?: boolean
    /** Fajfka vpravo — řádek je volba, ne odkaz. */
    checked?: boolean
    /** Text vpravo, např. aktuální hodnota nastavení. */
    value?: string
    /** Úchyt pro přesun — ve Figmě „Grabber". */
    reorderable?: boolean
    selected?: boolean
    disabled?: boolean
    /**
     * Vynutí, že celý řádek je tlačítko. Použij, jen když víš, že v slotech
     * není nic klikacího — vnořené tlačítko je neplatné HTML.
     */
    interactive?: boolean
    /** `inset` dostane vlastní zaoblení; v `plain` seznamu je řádek hranatý. */
    variant?: 'plain' | 'inset'
    class?: ClassValue
  }>(),
  {
    subtitle: undefined,
    icon: undefined,
    chevron: false,
    checked: undefined,
    value: undefined,
    reorderable: false,
    selected: false,
    disabled: false,
    interactive: undefined,
    variant: 'plain',
    class: undefined,
  },
)

defineEmits<{ select: [] }>()

const slots = useSlots()

/**
 * Řádek je tlačítko jen tehdy, když si do slotů nic vlastního nenese.
 * Jakmile do nich přijde přepínač, zaškrtávátko nebo jiné tlačítko, musí být
 * řádek `div` — tlačítko uvnitř tlačítka je neplatné HTML, prohlížeč ho
 * vytáhne ven a Vue pak hlásí neshodu při hydrataci. Ovládacím prvkem je
 * v takovém řádku ten vnořený prvek, ne celý řádek.
 *
 * Když víš, že sloty nesou jen ikonu nebo obrázek, přebij to `interactive`.
 */
const isButton = computed(() => {
  if (props.disabled) return false
  if (props.interactive !== undefined) return props.interactive
  return !slots.leading && !slots.trailing
})
</script>

<template>
  <component
    :is="isButton ? 'button' : 'div'"
    role="listitem"
    :type="isButton ? 'button' : undefined"
    :aria-current="selected ? 'true' : undefined"
    :aria-disabled="disabled || undefined"
    :class="cn(
      'vos-surface flex w-full items-center gap-3 px-4 py-3 text-left outline-none',
      'focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:-outline-offset-2',
      props.variant === 'inset' ? 'rounded-2xl' : '',
      selected ? 'vos-selected' : 'vos-plain',
      disabled && 'pointer-events-none opacity-40',
      props.class,
    )"
    @click="!disabled && $emit('select')"
  >
    <slot name="leading">
      <Icon v-if="icon" :name="icon" class="size-5 shrink-0" />
    </slot>

    <span class="min-w-0 flex-1">
      <span class="block truncate text-body">{{ title }}</span>
      <span
        v-if="subtitle"
        class="block truncate text-footnote"
        :class="selected ? 'opacity-60' : 'text-(--fg-secondary)'"
      >{{ subtitle }}</span>
    </span>

    <slot name="trailing">
      <span v-if="value" class="shrink-0 text-callout text-(--fg-secondary)">{{ value }}</span>
      <Icon v-if="checked" name="lucide:check" class="size-5 shrink-0" />
      <Icon
        v-if="reorderable"
        name="lucide:menu"
        class="size-5 shrink-0 text-(--fg-tertiary)"
      />
      <Icon
        v-if="chevron"
        name="lucide:chevron-right"
        class="size-5 shrink-0"
        :class="selected ? 'opacity-60' : 'text-(--fg-tertiary)'"
      />
    </slot>
  </component>
</template>
