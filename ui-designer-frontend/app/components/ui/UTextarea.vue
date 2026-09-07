<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Víceřádkový vstup. Stejné vyhloubení jako `UTextField`, jen hranatější —
 * pilulka o čtyřech řádcích už není pilulka.
 *
 * `autoGrow` roste s obsahem místo posuvníku. Posuvník uvnitř pole je horší
 * než delší pole: skryje text, který uživatel právě napsal.
 */
const props = withDefaults(
  defineProps<{
    placeholder?: string
    rows?: number
    /** Roste s obsahem až do `maxRows`. */
    autoGrow?: boolean
    maxRows?: number
    /** Ukazuje počet znaků; s `maxlength` i zbývající. */
    counter?: boolean
    maxlength?: number
    disabled?: boolean
    ariaLabel?: string
    class?: ClassValue
  }>(),
  {
    placeholder: undefined,
    rows: 3,
    autoGrow: false,
    maxRows: 10,
    counter: false,
    maxlength: undefined,
    disabled: false,
    ariaLabel: undefined,
    class: undefined,
  },
)

const model = defineModel<string>({ default: '' })

const area = useTemplateRef<HTMLTextAreaElement>('area')

/** Výška se počítá z `scrollHeight`, takže se musí nejdřív pustit na nulu. */
function resize() {
  const el = area.value
  if (!el || !props.autoGrow) return
  el.style.height = 'auto'
  const line = parseFloat(getComputedStyle(el).lineHeight) || 22
  const max = line * props.maxRows
  el.style.height = `${Math.min(el.scrollHeight, max)}px`
  el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden'
}

onMounted(resize)
watch(model, () => nextTick(resize))
</script>

<template>
  <div :class="cn('flex flex-col gap-1.5', props.class)">
    <div
      :class="cn(
        'flex rounded-2xl bg-(--field-fill) shadow-(--recessed-shadow) transition-colors duration-150',
        'hover:bg-(--field-fill-hover)',
        'focus-within:bg-(--field-fill-focus) focus-within:ring-2 focus-within:ring-(--focus-ring)',
        disabled && 'pointer-events-none opacity-40',
      )"
    >
      <textarea
        ref="area"
        v-model="model"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :aria-label="ariaLabel"
        class="w-full resize-none bg-transparent px-4 py-3 text-body text-(--fg-primary) outline-none placeholder:text-(--field-placeholder)"
        :class="autoGrow && 'overflow-hidden'"
      />
    </div>

    <p v-if="counter" class="text-right text-caption-1 text-(--fg-tertiary)">
      {{ maxlength ? `${model.length} / ${maxlength}` : `${model.length} znaků` }}
    </p>
  </div>
</template>
