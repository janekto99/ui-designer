<script setup lang="ts" generic="R extends Record<string, unknown>">
import type { ClassValue } from '~/utils/cn'
import type { Tone } from './button.variants'

export interface TableColumn<Row> {
  key: string
  label: string
  /** Číslo doprava, text doleva. Výchozí se odvodí z první hodnoty. */
  align?: 'start' | 'center' | 'end'
  /** Šířka sloupce, např. `6rem`. Bez ní si ji tabulka rozdělí sama. */
  width?: string
  /** Dá se podle něj řadit. */
  sortable?: boolean
  /** Jak se hodnota vykreslí. Bez něj se použije `String(value)`. */
  format?: (row: Row) => string
  /** Sémantický tón buňky — např. lepší/horší hodnota. */
  tone?: (row: Row) => Tone | undefined
  /** Popisek pro čtečku, když je `label` jen zkratka. */
  description?: string
}

/**
 * Sloupcová mřížka.
 *
 * Je to `<table>`, ne mřížka z divů: sloupců bývá proměnlivý počet, tabulka
 * si šířky srovná sama a čtečka dostane vazbu buňky na hlavičku zadarmo.
 * Mřížka z divů by k témuž potřebovala `role` na každém prvku.
 *
 * `table-fixed` je záměr — bez něj by dlouhá hodnota roztáhla sloupec a celá
 * tabulka by se rozjela. Přetečení se řeší zkrácením, ne posunem.
 *
 * Chybějící hodnota se vykreslí jako `—`, ne jako nula. Jsou to dvě různá
 * tvrzení a tabulka je nesmí slučovat.
 */
const props = withDefaults(
  defineProps<{
    columns: TableColumn<R>[]
    rows: R[]
    /** Čím se řádky odlišují — musí být jedinečné. */
    rowKey: keyof R | ((row: R) => string | number)
    /** První sloupec drží při vodorovném posunu na místě. */
    stickyFirst?: boolean
    density?: 'compact' | 'comfortable'
    caption?: string
    /** Text, když nejsou žádné řádky. */
    emptyTitle?: string
    class?: ClassValue
  }>(),
  {
    stickyFirst: false,
    density: 'comfortable',
    caption: undefined,
    emptyTitle: 'Žádná data',
    class: undefined,
  },
)

const emit = defineEmits<{ rowClick: [row: R] }>()

const sort = defineModel<{ key: string, direction: 'asc' | 'desc' } | undefined>('sort', {
  default: undefined,
})

const slots = useSlots()

const keyOf = (row: R) =>
  typeof props.rowKey === 'function' ? props.rowKey(row) : String(row[props.rowKey])

/** Zarovnání se hádá z prvního neprázdného řádku, ne z typu sloupce. */
function alignOf(column: TableColumn<R>) {
  if (column.align) return column.align
  const sample = props.rows.find((row) => row[column.key] !== null && row[column.key] !== undefined)
  return typeof sample?.[column.key] === 'number' ? 'end' : 'start'
}

const alignClass = { start: 'text-left', center: 'text-center', end: 'text-right' } as const

function cellText(column: TableColumn<R>, row: R) {
  if (column.format) return column.format(row)
  const value = row[column.key]
  return value === null || value === undefined || value === '' ? '—' : String(value)
}

const isMissing = (column: TableColumn<R>, row: R) => cellText(column, row) === '—'

function toggleSort(column: TableColumn<R>) {
  if (!column.sortable) return
  if (sort.value?.key !== column.key) sort.value = { key: column.key, direction: 'asc' }
  else if (sort.value.direction === 'asc') sort.value = { key: column.key, direction: 'desc' }
  else sort.value = undefined
}

function ariaSort(column: TableColumn<R>) {
  if (!column.sortable) return undefined
  if (sort.value?.key !== column.key) return 'none'
  return sort.value.direction === 'asc' ? 'ascending' : 'descending'
}

const pad = computed(() =>
  props.density === 'compact' ? 'px-2 py-1 text-footnote' : 'px-3 py-2 text-callout',
)

const toneClasses: Record<Tone, string> = {
  neutral: '',
  accent: 'text-(--tone-accent-strong)',
  success: 'text-(--tone-success-strong)',
  warning: 'text-(--tone-warning-strong)',
  danger: 'text-(--tone-danger-strong)',
  info: 'text-(--tone-info-strong)',
}
</script>

<template>
  <div :class="cn('w-full overflow-x-auto', props.class)">
    <table class="w-full table-fixed border-collapse">
      <caption v-if="caption" class="pb-2 text-left text-footnote text-(--fg-secondary)">
        {{ caption }}
      </caption>

      <colgroup>
        <col v-for="column in columns" :key="column.key" :style="{ width: column.width }">
      </colgroup>

      <thead>
        <tr class="border-b border-(--separator)">
          <th
            v-for="(column, index) in columns"
            :key="column.key"
            scope="col"
            :aria-sort="ariaSort(column)"
            :class="cn(
              // Ne `--fg-tertiary`: 30 % krytí dá na hlavičce 2,7 : 1 a to je
              // pod WCAG AA. Dvanáctibodové verzálky nejsou „velký text“,
              // takže platí 4,5 : 1, ne 3 : 1. Změřeno, ne odhadnuto.
              'pb-1.5 text-caption-2 font-semibold tracking-wide text-(--fg-secondary) uppercase',
              alignClass[alignOf(column)],
              pad,
              stickyFirst && index === 0 && 'sticky left-0 z-1',
            )"
          >
            <button
              v-if="column.sortable"
              type="button"
              class="vos-surface vos-plain inline-flex cursor-pointer items-center gap-1 rounded-md px-1 outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
              @click="toggleSort(column)"
            >
              {{ column.label }}
              <Icon
                v-if="sort?.key === column.key"
                :name="sort.direction === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'"
                class="size-3"
              />
            </button>
            <template v-else>{{ column.label }}</template>

            <span v-if="column.description" class="sr-only"> — {{ column.description }}</span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="row in rows"
          :key="keyOf(row)"
          class="border-b border-(--separator) last:border-0"
          :class="slots.row || $attrs.onRowClick ? 'cursor-pointer hover:bg-(--platter-tint)' : ''"
          @click="emit('rowClick', row)"
        >
          <td
            v-for="(column, index) in columns"
            :key="column.key"
            :class="cn(
              alignClass[alignOf(column)],
              pad,
              index === 0 ? 'text-(--fg-primary)' : 'text-(--fg-secondary)',
              stickyFirst && index === 0 && 'sticky left-0 z-1',
              isMissing(column, row)
                ? 'text-(--fg-tertiary)'
                : toneClasses[column.tone?.(row) ?? 'neutral'],
            )"
          >
            <slot :name="`cell-${column.key}`" :row="row" :column="column">
              <span class="block truncate tabular-nums">{{ cellText(column, row) }}</span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <UEmpty v-if="!rows.length" size="sm" icon="lucide:table" :title="emptyTitle" />
  </div>
</template>
