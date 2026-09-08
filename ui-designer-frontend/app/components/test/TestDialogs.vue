<script setup lang="ts">
import { COLUMNS, INSIGHTS, NUMERIC_KEYS, SORT_FIELDS, columnByKey, insightByKey } from '~/test/sport'
import { UPCOMING, FINISHED, tournamentBySlug } from '~/test/generate'

/**
 * Všechny nástrojové dialogy na jednom místě.
 *
 * V layoutu stojí jednou a otevírají se odkudkoli — kdyby seděly u tlačítka,
 * musely by existovat v sidebaru i v liště nad seznamem a stav by se rozdvojil.
 */
const { active, close, detail, closeDetail } = useTestDialogs()
const { countries, numeric, insights, setRange, cycleInsight, reset, activeCount } = useTestFilters()
const { sortField, sortDirection, visibleColumns, showDiffs, toggleColumn, resetColumns } = useTestSettings()

const isOpen = (name: 'filters' | 'sort' | 'display') => computed({
  get: () => active.value === name,
  set: (value: boolean) => { if (!value) close() },
})

const filtersOpen = isOpen('filters')
const sortOpen = isOpen('sort')
const displayOpen = isOpen('display')

/* ------------------------------------------------------------------ filtry */

const COUNTRY_OPTIONS = ['cz', 'jp', 'us', 'it', 'es', 'de', 'br', 'ar', 'au', 'kr']

function toggleCountry(code: string) {
  countries.value = countries.value.includes(code)
    ? countries.value.filter((c) => c !== code)
    : [...countries.value, code]
}

/** Rozsahy se zadávají textem — posuvník by u žebříčku 40–1400 nešel trefit. */
function onRangeInput(key: string, edge: 'min' | 'max', raw: string) {
  const value = raw.trim() === '' ? null : Number(raw.replace(',', '.'))
  setRange(key, { ...numeric.value[key]!, [edge]: Number.isNaN(value) ? null : value })
}

const insightGroups = computed(() => {
  const map = new Map<string, typeof INSIGHTS>()
  for (const insight of INSIGHTS) {
    if (!map.has(insight.group)) map.set(insight.group, [])
    map.get(insight.group)!.push(insight)
  }
  return [...map]
})

const modeLabel = { require: 'Vyžadovat', exclude: 'Vyloučit' } as const

/* ------------------------------------------------------------------- detail */

const match = computed(() => [...UPCOMING, ...FINISHED].find((m) => m.id === detail.value))
const detailOpen = computed({
  get: () => detail.value !== null,
  set: (value: boolean) => { if (!value) closeDetail() },
})

const tab = ref('prehled')
const tabs = [
  { label: 'Přehled', value: 'prehled' },
  { label: 'Vzájemné', value: 'h2h' },
  { label: 'Kurzy', value: 'kurzy' },
]

watch(detail, () => { tab.value = 'prehled' })
</script>

<template>
  <!-- ═══════════════════════════════════════════════════════════ filtry ═══ -->
  <UDialog v-model="filtersOpen" title="Filtry" size="lg">
    <div class="flex flex-col gap-6">
      <section class="flex flex-col gap-2">
        <h3 class="text-callout font-semibold">Země</h3>
        <p class="text-footnote text-(--fg-secondary)">
          Skládá se přes „nebo“ — zápas projde, hraje-li v něm někdo z vybraných.
        </p>
        <div class="flex flex-wrap gap-1.5">
          <UButton
            v-for="code in COUNTRY_OPTIONS"
            :key="code"
            :label="code.toUpperCase()"
            :variant="countries.includes(code) ? 'solid' : 'glass'"
            :tone="countries.includes(code) ? 'accent' : 'neutral'"
            size="xs"
            @click="toggleCountry(code)"
          />
        </div>
      </section>

      <section class="flex flex-col gap-2">
        <h3 class="text-callout font-semibold">Číselné rozsahy</h3>
        <p class="text-footnote text-(--fg-secondary)">
          Stačí, když podmínku splní jeden z dvojice. Vyžadovat obojí by
          vyhodilo právě ty zápasy, kde favorit hraje s outsiderem.
        </p>

        <div class="grid gap-2 sm:grid-cols-2">
          <div v-for="key in NUMERIC_KEYS" :key="key" class="flex items-center gap-2">
            <label class="w-28 shrink-0 truncate text-footnote" :for="`min-${key}`">
              {{ columnByKey(key)?.label }}
            </label>
            <input
              :id="`min-${key}`"
              type="number"
              placeholder="od"
              class="w-full min-w-0 rounded-control bg-(--field-fill) px-2.5 py-1 text-footnote tabular-nums outline-none placeholder:text-(--field-placeholder) focus:bg-(--field-fill-focus) focus:ring-2 focus:ring-(--focus-ring)"
              :value="numeric[key]?.min ?? ''"
              @input="onRangeInput(key, 'min', ($event.target as HTMLInputElement).value)"
            >
            <input
              type="number"
              placeholder="do"
              :aria-label="`${columnByKey(key)?.label} do`"
              class="w-full min-w-0 rounded-control bg-(--field-fill) px-2.5 py-1 text-footnote tabular-nums outline-none placeholder:text-(--field-placeholder) focus:bg-(--field-fill-focus) focus:ring-2 focus:ring-(--focus-ring)"
              :value="numeric[key]?.max ?? ''"
              @input="onRangeInput(key, 'max', ($event.target as HTMLInputElement).value)"
            >
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <h3 class="text-callout font-semibold">Insighty</h3>
        <p class="text-footnote text-(--fg-secondary)">
          Klikáním se cyklí: bez omezení → vyžadovat → vyloučit. Vyloučení je
          to zajímavější — hráč po skreči nebo v sérii proher.
        </p>

        <div v-for="[group, list] in insightGroups" :key="group" class="flex flex-col gap-1.5">
          <p class="text-caption-2 tracking-wide text-(--fg-tertiary) uppercase">{{ group }}</p>
          <div class="flex flex-wrap gap-1.5">
            <UButton
              v-for="insight in list"
              :key="insight.key"
              :label="insights[insight.key] ? `${insight.label} · ${modeLabel[insights[insight.key]!]}` : insight.label"
              :variant="insights[insight.key] ? 'solid' : 'glass'"
              :tone="insights[insight.key] === 'require' ? 'success' : insights[insight.key] === 'exclude' ? 'danger' : 'neutral'"
              size="xs"
              :aria-label="`${insight.label} — ${insight.description}`"
              @click="cycleInsight(insight.key)"
            />
          </div>
        </div>
      </section>
    </div>

    <template #footer>
      <UButton v-if="activeCount" label="Zrušit vše" variant="plain" size="sm" @click="reset" />
      <UButton label="Hotovo" variant="solid" tone="accent" size="sm" @click="close" />
    </template>
  </UDialog>

  <!-- ═══════════════════════════════════════════════════════════ řazení ═══ -->
  <UDialog v-model="sortOpen" title="Řazení" size="sm">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <UListRow
          v-for="field in SORT_FIELDS"
          :key="field.key"
          variant="inset"
          :title="field.label"
          :checked="sortField === field.key"
          :selected="sortField === field.key"
          @select="sortField = field.key"
        />
      </div>

      <USegmentedControl
        v-model="sortDirection"
        :segments="[
          { label: 'Vzestupně', value: 'asc' },
          { label: 'Sestupně', value: 'desc' },
        ]"
        block
        size="sm"
        aria-label="Směr řazení"
      />
    </div>

    <template #footer>
      <UButton label="Hotovo" variant="solid" tone="accent" size="sm" @click="close" />
    </template>
  </UDialog>

  <!-- ════════════════════════════════════════════════════════ zobrazení ═══ -->
  <UDialog v-model="displayOpen" title="Zobrazení" size="md">
    <div class="flex flex-col gap-4">
      <p class="text-footnote text-(--fg-secondary)">
        Které sloupce jsou v seznamu vidět. Poslední se vypnout nedá — prázdná
        tabulka není nastavení, ale rozbitý stav.
      </p>

      <div class="grid gap-1 sm:grid-cols-2">
        <UCheckbox
          v-for="column in COLUMNS"
          :key="column.key"
          :model-value="visibleColumns.includes(column.key)"
          :label="column.description"
          size="sm"
          @update:model-value="toggleColumn(column.key)"
        />
      </div>

      <hr class="vos-separator">

      <UListRow title="Zvýraznit lepší hodnotu" subtitle="V každém sloupci se obarví lepší z dvojice">
        <template #trailing>
          <UToggle v-model="showDiffs" size="sm" aria-label="Zvýraznit lepší hodnotu" />
        </template>
      </UListRow>
    </div>

    <template #footer>
      <UButton label="Výchozí" variant="plain" size="sm" @click="resetColumns" />
      <UButton label="Hotovo" variant="solid" tone="accent" size="sm" @click="close" />
    </template>
  </UDialog>

  <!-- ═══════════════════════════════════════════════════════════ detail ═══ -->
  <UDialog
    v-model="detailOpen"
    :title="match ? `${match.players[0].name} – ${match.players[1].name}` : ''"
    :description="match ? `${tournamentBySlug(match.tournament)?.name} · ${match.round} · ${match.time}` : ''"
    size="lg"
  >
    <div v-if="match" class="flex flex-col gap-4">
      <UTabs v-model="tab" :items="tabs" aria-label="Detail zápasu" />

      <div v-if="tab === 'prehled'" class="flex flex-col gap-3">
        <UCard
          v-for="(player, side) in match.players"
          :key="side"
          material="thin"
          padding="sm"
        >
          <div class="flex items-center gap-2 pb-2">
            <Icon :name="`circle-flags:${player.country}`" class="size-5 shrink-0" />
            <span class="flex-1 truncate text-body font-semibold">{{ player.name }}</span>
            <UTag v-if="player.seed" :label="`[${player.seed}]`" />
          </div>

          <div class="flex flex-wrap gap-1.5">
            <UTag
              v-for="key in player.insights"
              :key="key"
              :label="insightByKey(key)?.label ?? key"
              tone="accent"
            />
            <span v-if="!player.insights.length" class="text-footnote text-(--fg-tertiary)">
              Žádná zjištění.
            </span>
          </div>
        </UCard>
      </div>

      <div v-else-if="tab === 'h2h'">
        <UEmpty
          icon="lucide:swords"
          size="sm"
          title="Vzájemné zápasy nejsou"
          description="Hráči se zatím nepotkali. Až se potkají, bude tu jejich bilance."
        />
      </div>

      <div v-else class="flex flex-col gap-2">
        <UListRow
          v-for="(player, side) in match.players"
          :key="side"
          variant="inset"
          :title="player.name"
          :value="player.stats.odds === null ? '—' : String(player.stats.odds).replace('.', ',')"
          class="vos-view-thin"
        />
      </div>
    </div>

    <template #footer>
      <UButton label="Zavřít" variant="glass" size="sm" @click="closeDetail" />
    </template>
  </UDialog>
</template>
