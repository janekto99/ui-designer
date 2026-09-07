<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Dvě podoby: sbalené tlačítko s datem a rozbalený kalendář. Ve Figmě jsou
 * to dvě komponenty, tady jeden prvek s `expanded` — obsah je totožný.
 *
 * Týden začíná pondělím, protože je to česká lokalizace; `Intl` to samo
 * neřeší, tak se posun počítá ručně.
 */
const props = withDefaults(
  defineProps<{
    /** Rozbalený kalendář místo tlačítka. */
    expanded?: boolean
    disabled?: boolean
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { expanded: false, disabled: false, ariaLabel: 'Datum', class: undefined },
)

const model = defineModel<Date>({ default: () => new Date() })

const open = ref(false)
const cursor = ref(new Date(model.value.getFullYear(), model.value.getMonth(), 1))

watch(model, (value) => {
  cursor.value = new Date(value.getFullYear(), value.getMonth(), 1)
})

const dateFormat = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })
const monthFormat = new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' })

const label = computed(() => dateFormat.format(model.value))
const monthLabel = computed(() => monthFormat.format(cursor.value))

const weekdays = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

/** Mřížka začíná pondělím před prvním dnem měsíce a má vždy celé týdny. */
const days = computed(() => {
  const first = new Date(cursor.value.getFullYear(), cursor.value.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const total = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + 1, 0).getDate()

  const cells: { date: Date, inMonth: boolean }[] = []
  for (let i = 0; i < offset; i++) {
    cells.push({ date: new Date(first.getFullYear(), first.getMonth(), i - offset + 1), inMonth: false })
  }
  for (let d = 1; d <= total; d++) {
    cells.push({ date: new Date(first.getFullYear(), first.getMonth(), d), inMonth: true })
  }
  while (cells.length % 7 !== 0) {
    const last = cells.at(-1)!.date
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false })
  }
  return cells
})

const today = new Date()

function shiftMonth(step: number) {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + step, 1)
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
      role="application"
      :aria-label="ariaLabel"
      :class="cn(
        'vos-view-regular w-80 rounded-3xl p-4 shadow-(--panel-shadow)',
        !expanded && 'absolute top-full left-0 z-50 mt-2',
      )"
    >
      <div class="mb-3 flex items-center justify-between gap-2">
        <span class="text-headline font-semibold first-letter:uppercase">{{ monthLabel }}</span>
        <span class="flex gap-1">
          <UButton
            icon="lucide:chevron-left"
            size="sm"
            aria-label="Předchozí měsíc"
            @click="shiftMonth(-1)"
          />
          <UButton
            icon="lucide:chevron-right"
            size="sm"
            aria-label="Následující měsíc"
            @click="shiftMonth(1)"
          />
        </span>
      </div>

      <div class="mb-1 grid grid-cols-7 gap-1">
        <span
          v-for="day in weekdays"
          :key="day"
          class="text-center text-caption-2 tracking-wide text-(--fg-tertiary) uppercase"
        >{{ day }}</span>
      </div>

      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="cell in days"
          :key="cell.date.toISOString()"
          type="button"
          :aria-current="sameDay(cell.date, today) ? 'date' : undefined"
          :aria-pressed="sameDay(cell.date, model)"
          :class="cn(
            'vos-surface flex size-9 cursor-pointer items-center justify-center rounded-full text-callout',
            'outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)',
            sameDay(cell.date, model) ? 'vos-selected' : 'vos-plain',
            !cell.inMonth && 'text-(--fg-tertiary)',
            sameDay(cell.date, today) && !sameDay(cell.date, model) && 'vos-glass font-semibold',
          )"
          @click="model = cell.date"
        >
          {{ cell.date.getDate() }}
        </button>
      </div>
    </div>
  </div>
</template>
