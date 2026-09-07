<script setup lang="ts">
import type { TableColumn } from '~/components/ui/UTable.vue'

interface PlayerRow extends Record<string, unknown> {
  id: string
  name: string
  rank: number | null
  odds: number | null
  form: number | null
  h2h: number | null
}

const density = ref<'compact' | 'comfortable'>('comfortable')
const sticky = ref(false)
const empty = ref(false)

const densityOptions = [
  { label: 'compact', value: 'compact' as const },
  { label: 'comfortable', value: 'comfortable' as const },
]
const stickyOptions = [
  { label: 'Volný', value: false },
  { label: 'První sloupec drží', value: true },
]
const dataOptions = [
  { label: 'S daty', value: false },
  { label: 'Prázdná', value: true },
]

const all: PlayerRow[] = [
  { id: 'a', name: 'Takuya Kumasaka', rank: 548, odds: 1.98, form: 646, h2h: -11 },
  { id: 'b', name: 'Martin Borisiouk', rank: 1003, odds: 2.02, form: 629, h2h: 81 },
  { id: 'c', name: 'Ethan Cook', rank: 1311, odds: 2.10, form: 1042, h2h: 44 },
  { id: 'd', name: 'Jesse Flores', rank: 857, odds: 1.67, form: 922, h2h: -34 },
  { id: 'e', name: 'Minh Thien Nguyen', rank: null, odds: 11.00, form: null, h2h: null },
]

const sort = ref<{ key: string, direction: 'asc' | 'desc' }>()

const rows = computed(() => {
  if (empty.value) return []
  if (!sort.value) return all
  const { key, direction } = sort.value
  return [...all].sort((x, y) => {
    const a = x[key] as number | string | null
    const b = y[key] as number | string | null
    // Chybějící hodnota jde vždy na konec, ať se řadí kterýmkoli směrem.
    if (a === null) return 1
    if (b === null) return -1
    const cmp = typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))
    return direction === 'asc' ? cmp : -cmp
  })
})

const columns: TableColumn<PlayerRow>[] = [
  { key: 'name', label: 'Hráč', sortable: true, width: '12rem' },
  {
    key: 'rank',
    label: 'Rank',
    sortable: true,
    description: 'Postavení na žebříčku',
    format: (row) => (row.rank === null ? '—' : `#${row.rank}`),
  },
  {
    key: 'odds',
    label: 'Kurz',
    sortable: true,
    format: (row) => (row.odds === null ? '—' : row.odds.toFixed(2).replace('.', ',')),
    tone: (row) => (row.odds !== null && row.odds < 2 ? 'success' : undefined),
  },
  {
    key: 'form',
    label: 'Forma 10',
    sortable: true,
    description: 'Forma za posledních deset zápasů',
    format: (row) => (row.form === null ? '—' : `#${row.form}`),
  },
  {
    key: 'h2h',
    label: 'Spol. soupeři',
    sortable: true,
    format: (row) => (row.h2h === null ? '—' : `${row.h2h > 0 ? '+' : ''}${row.h2h}`),
    tone: (row) => (row.h2h === null ? undefined : row.h2h > 0 ? 'success' : 'danger'),
  },
]

const clicked = ref<string>()
</script>

<template>
  <DocPage
    title="Table"
    description="Je to <table>, ne mřížka z divů: sloupců bývá proměnlivý počet, tabulka si šířky srovná sama a čtečka dostane vazbu buňky na hlavičku zadarmo."
  >
    <DocSection
      title="Náhled"
      description="Klikni na hlavičku sloupce — řadí vzestupně, sestupně, pak řazení zruší. Chybějící hodnota jde vždy na konec."
    >
      <template #controls>
        <VariantPicker v-model="density" label="Hustota" :options="densityOptions" />
        <VariantPicker v-model="sticky" label="První sloupec" :options="stickyOptions" />
        <VariantPicker v-model="empty" label="Data" :options="dataOptions" />
      </template>

      <PreviewStage min-height="22rem">
        <UCard material="thick" class="w-full max-w-3xl">
          <UTable
            v-model:sort="sort"
            :columns="columns"
            :rows="rows"
            row-key="id"
            :density="density"
            :sticky-first="sticky"
            caption="Zápasy Challenger Phan Thiet"
            empty-title="Žádný hráč nevyhovuje filtru"
            @row-click="(row) => (clicked = row.name)"
          />
        </UCard>
      </PreviewStage>

      <p v-if="clicked" class="mt-3 text-center text-footnote text-(--fg-secondary)">
        Naposledy kliknuto: {{ clicked }}
      </p>
    </DocSection>

    <DocSection
      title="Vlastní buňka"
      description="Slot podle klíče sloupce přebere vykreslení. Tady vlajka a jméno v jedné buňce."
    >
      <PreviewStage min-height="20rem">
        <UCard material="thick" class="w-full max-w-3xl">
          <UTable :columns="columns.slice(0, 3)" :rows="all" row-key="id" density="compact">
            <template #cell-name="{ row }">
              <span class="flex min-w-0 items-center gap-2">
                <Icon name="circle-flags:jp" class="size-4 shrink-0" />
                <span class="truncate">{{ row.name }}</span>
              </span>
            </template>
          </UTable>
        </UCard>
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Chybějící hodnota není nula"
      description="Prázdné pole se vykreslí jako — v tlumené barvě. Jsou to dvě různá tvrzení a tabulka je nesmí slučovat."
    >
      <PreviewStage min-height="14rem">
        <UCard material="thick" class="w-full max-w-md">
          <UTable
            :columns="columns.slice(1, 4)"
            :rows="[all[4]!, { ...all[0]!, h2h: 0, form: 0 }]"
            row-key="id"
            density="compact"
          />
        </UCard>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
