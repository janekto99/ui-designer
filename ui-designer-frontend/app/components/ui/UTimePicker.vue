<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Kolečka hodin, minut a dopoledne/odpoledne. Vybraná hodnota je uprostřed,
 * sousedé blednou — to blednutí je ve Figmě to hlavní, co dělá z rolovacího
 * seznamu kolečko.
 */
const props = withDefaults(
  defineProps<{
    expanded?: boolean
    /** Dvanáctihodinový formát s AM/PM. Bez něj jsou hodiny 0–23. */
    ampm?: boolean
    disabled?: boolean
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { expanded: false, ampm: false, disabled: false, ariaLabel: 'Čas', class: undefined },
)

/** Minuty od půlnoci — jedno číslo se snáz porovnává než dvojice. */
const model = defineModel<number>({ default: 9 * 60 + 41 })

const open = ref(false)

const hour = computed(() => Math.floor(model.value / 60))
const minute = computed(() => model.value % 60)

const label = computed(() => {
  const h = props.ampm ? (hour.value % 12 || 12) : hour.value
  const suffix = props.ampm ? (hour.value < 12 ? ' AM' : ' PM') : ''
  return `${h}:${String(minute.value).padStart(2, '0')}${suffix}`
})

const hours = computed(() =>
  props.ampm
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 24 }, (_, i) => i),
)
const minutes = Array.from({ length: 60 }, (_, i) => i)

const displayHour = computed(() => (props.ampm ? hour.value % 12 || 12 : hour.value))
const isPm = computed(() => hour.value >= 12)

function setHour(value: number) {
  const h = props.ampm ? (value % 12) + (isPm.value ? 12 : 0) : value
  model.value = h * 60 + minute.value
}

function setMinute(value: number) {
  model.value = hour.value * 60 + value
}

function setMeridiem(pm: boolean) {
  const h = (hour.value % 12) + (pm ? 12 : 0)
  model.value = h * 60 + minute.value
}

/** Čím dál od vybrané hodnoty, tím bledší — proto ta tabulka místo binárního stavu. */
function fade(distance: number) {
  if (distance === 0) return 'text-title-2 font-semibold text-(--fg-primary)'
  if (distance === 1) return 'text-body text-(--fg-secondary)'
  return 'text-body text-(--fg-tertiary)'
}
</script>

<template>
  <div :class="cn('relative inline-block', props.class)">
    <UButton
      v-if="!expanded"
      :label="label"
      :disabled="disabled"
      :aria-expanded="open"
      aria-haspopup="dialog"
      @click="open = !open"
    />

    <div
      v-if="expanded || open"
      role="group"
      :aria-label="ariaLabel"
      :class="cn(
        'vos-view-regular flex gap-2 rounded-3xl p-3 shadow-(--panel-shadow)',
        !expanded && 'absolute top-full left-0 z-50 mt-2',
      )"
    >
      <div
        class="vos-view-recessed h-44 w-20 snap-y snap-mandatory overflow-y-auto rounded-2xl py-16"
        role="listbox"
        aria-label="Hodiny"
      >
        <button
          v-for="h in hours"
          :key="h"
          type="button"
          role="option"
          :aria-selected="h === displayHour"
          class="block w-full cursor-pointer snap-center py-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
          :class="fade(Math.abs(h - displayHour))"
          @click="setHour(h)"
        >{{ h }}</button>
      </div>

      <div
        class="vos-view-recessed h-44 w-20 snap-y snap-mandatory overflow-y-auto rounded-2xl py-16"
        role="listbox"
        aria-label="Minuty"
      >
        <button
          v-for="m in minutes"
          :key="m"
          type="button"
          role="option"
          :aria-selected="m === minute"
          class="block w-full cursor-pointer snap-center py-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
          :class="fade(Math.abs(m - minute))"
          @click="setMinute(m)"
        >{{ String(m).padStart(2, '0') }}</button>
      </div>

      <div
        v-if="ampm"
        class="vos-view-recessed flex h-44 w-20 flex-col items-center justify-center gap-2 rounded-2xl"
        role="listbox"
        aria-label="Dopoledne nebo odpoledne"
      >
        <button
          v-for="option in [false, true]"
          :key="String(option)"
          type="button"
          role="option"
          :aria-selected="option === isPm"
          class="w-full cursor-pointer py-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
          :class="fade(option === isPm ? 0 : 1)"
          @click="setMeridiem(option)"
        >{{ option ? 'PM' : 'AM' }}</button>
      </div>
    </div>
  </div>
</template>
