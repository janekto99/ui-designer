<script setup lang="ts">
import { advantage, metrics, type Match } from '~/showcase/sport/data'
import type { TableColumn } from '~/components/ui/UTable.vue'

/**
 * Karta zápasu.
 *
 * Původní obrazovka měla sedm rovnocenných číselných sloupců. Sedm čísel
 * stejné váhy neřekne, co je důležité — oko nemá kam jít. Tady je hierarchie:
 *
 * 1. **Kurz** velký, protože je to jediné číslo, které shrnuje všechna ostatní.
 * 2. **Žebříček** vedle jména, tlumeně.
 * 3. **Převaha** jako řádek štítků — to byl v originále prostřední řádek
 *    tabulky, což ho dělalo třetím hráčem.
 * 4. **Všechno ostatní** až po rozbalení.
 *
 * Barva na štítku převahy neznamená „dobře / špatně" — ani jeden hráč není
 * náš. Znamená **nesoulad s kurzem**: metrika ukazuje na jiného hráče než
 * sázkový trh. To je informace, kterou původní obrazovka neukazovala vůbec.
 */
const props = defineProps<{ match: Match }>()

const open = ref(false)
const starred = ref(false)

const surfaceTone = { Hard: 'info', Clay: 'warning', Grass: 'success' } as const

const fmt = (value: number | null | undefined, format: (v: number) => string) =>
  value === null || value === undefined ? '—' : format(value)

const oddsMetric = metrics.find((m) => m.key === 'odds')!

/** Koho favorizuje trh — podle kurzu, ne podle žebříčku. */
const favourite = computed(() => advantage(props.match, oddsMetric)?.side ?? null)

const rows = computed(() =>
  metrics
    .filter((metric) => metric.key !== 'odds' && metric.key !== 'rank')
    .map((metric) => ({ metric, edge: advantage(props.match, metric) }))
    .filter((row) => row.edge && row.edge.side !== null),
)

const table = computed<TableColumn<Record<string, unknown>>[]>(() => [
  { key: 'name', label: 'Hráč', width: '11rem' },
  ...metrics.map((metric) => ({
    key: metric.key,
    label: metric.label,
    description: metric.description,
    align: 'end' as const,
    format: (row: Record<string, unknown>) => fmt(row[metric.key] as number | null, metric.format),
  })),
])

const tableRows = computed(() =>
  props.match.players.map((player, side) => ({ id: String(side), name: player.name, ...player.stats })),
)
</script>

<template>
  <UCard material="thick" padding="none" as="article" class="overflow-hidden">
    <div class="flex items-center gap-2 px-4 pt-3">
      <span class="text-footnote tabular-nums text-(--fg-secondary)">{{ match.time }}</span>
      <UTag :label="match.surface" :tone="surfaceTone[match.surface]" />
      <UTag v-if="match.live" label="Živě" tone="danger" solid icon="lucide:radio" />

      <div class="flex-1" />

      <UTooltip v-if="match.insight" label="Rozbor připraven">
        <UButton icon="lucide:lightbulb" size="xs" variant="plain" tone="accent" aria-label="Rozbor" />
      </UTooltip>

      <UButton
        icon="lucide:star"
        size="xs"
        :variant="starred ? 'selected' : 'plain'"
        :aria-pressed="starred"
        aria-label="Přidat mezi oblíbené"
        @click="starred = !starred"
      />

      <UButton
        :icon="open ? 'lucide:chevron-up' : 'lucide:chevron-down'"
        size="xs"
        variant="plain"
        :aria-expanded="open"
        :aria-label="open ? 'Skrýt čísla' : 'Zobrazit všechna čísla'"
        @click="open = !open"
      />
    </div>

    <div class="px-4 py-2">
      <div
        v-for="(player, side) in match.players"
        :key="side"
        class="flex items-center gap-3 py-1.5"
      >
        <Icon
          v-if="player.country"
          :name="`circle-flags:${player.country}`"
          class="size-4 shrink-0"
          :aria-label="player.country.toUpperCase()"
        />
        <span v-else class="size-4 shrink-0" aria-hidden="true" />

        <span
          class="min-w-0 flex-1 truncate text-body"
          :class="favourite === side ? 'font-semibold' : ''"
        >{{ player.name }}</span>

        <UTag v-if="player.seed" :label="`[${player.seed}]`" size="sm" />
        <UTag v-if="player.entry" :label="player.entry" size="sm" />

        <!-- `--fg-secondary`, ne tertiary: 30 % krytí neprojde kontrastem. -->
        <span class="w-14 shrink-0 text-right text-footnote tabular-nums text-(--fg-secondary)">
          {{ fmt(player.stats.rank, (v) => `#${v}`) }}
        </span>

        <span
          class="w-14 shrink-0 text-right text-title-3 tabular-nums"
          :class="favourite === side ? 'font-semibold text-(--tone-accent-strong)' : 'text-(--fg-secondary)'"
        >{{ fmt(player.stats.odds, oddsMetric.format) }}</span>
      </div>
    </div>

    <!--
      Řádek převahy. Šipka ukazuje na hráče, kterému metrika svědčí; zvýrazněné
      jsou ty, které nesouhlasí s kurzem.
    -->
    <div v-if="rows.length" class="flex flex-wrap items-center gap-1.5 px-4 pb-3">
      <UTag
        v-for="row in rows"
        :key="row.metric.key"
        :tone="favourite !== null && row.edge!.side !== favourite ? 'warning' : 'neutral'"
        :title="`${row.metric.description}: svědčí hráči ${match.players[row.edge!.side!].name}`"
      >
        {{ row.metric.label }}
        <Icon
          :name="row.edge!.side === 0 ? 'lucide:arrow-up' : 'lucide:arrow-down'"
          class="size-3"
          aria-hidden="true"
        />
        <span class="tabular-nums">{{ row.edge!.size }}</span>
      </UTag>
    </div>

    <div
      class="grid transition-[grid-template-rows] duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]"
      :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      :aria-hidden="!open"
    >
      <div class="overflow-hidden">
        <div class="border-t border-(--separator) px-2 pt-2 pb-1">
          <UTable
            :columns="table"
            :rows="tableRows"
            row-key="id"
            density="compact"
            :caption="`Všechna čísla — ${match.players[0].name} proti ${match.players[1].name}`"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>
