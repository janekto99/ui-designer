<script setup lang="ts">
import { advantage, metrics, type Match, type Tournament } from '~/showcase/sport/data'

/**
 * Tentýž seznam zápasů ve třech strukturách.
 *
 * Není to jen jiná barva — každý návrh mění, **co se dá přečíst naráz**.
 * Proto je to jedna komponenta se třemi větvemi a ne tři soubory: rozdíl
 * má být vidět vedle sebe, ne v diffu.
 */
const props = withDefaults(
  defineProps<{
    tournament: Tournament
    variant: 'linka' | 'mrizka' | 'karta'
    /** Zkrácená podoba do porovnání tří návrhů vedle sebe. */
    compact?: boolean
  }>(),
  { compact: false },
)

const shown = computed(() =>
  props.compact ? props.tournament.matches.slice(0, 3) : props.tournament.matches,
)

const surfaceTone = { Hard: 'info', Clay: 'warning', Grass: 'success' } as const

const oddsMetric = metrics.find((m) => m.key === 'odds')!
const rankMetric = metrics.find((m) => m.key === 'rank')!
const tableMetrics = metrics.filter((m) => m.key !== 'odds' && m.key !== 'rank')

/**
 * Sloupce mřížky. V porovnání tří návrhů vedle sebe je na sedm sloupců
 * třetina šířky — utnout je je poctivější než nechat tabulku přetéct,
 * protože přetečení by se posuzovalo jako vada návrhu, a přitom je to
 * vada náhledu.
 */
const gridMetrics = computed(() =>
  props.compact
    ? [rankMetric, oddsMetric, ...tableMetrics.slice(0, 2)]
    : [rankMetric, oddsMetric, ...tableMetrics],
)

const fmt = (v: number | null | undefined, f: (n: number) => string) =>
  v === null || v === undefined ? '—' : f(v)

const favouriteOf = (match: Match) => advantage(match, oddsMetric)?.side ?? null

/** Metriky, které ukazují na jiného hráče než kurz. To je ta informace navíc. */
function disagreements(match: Match) {
  const fav = favouriteOf(match)
  if (fav === null) return []
  return tableMetrics
    .map((metric) => ({ metric, edge: advantage(match, metric) }))
    .filter((row) => row.edge?.side !== null && row.edge !== null && row.edge.side !== fav)
}

const strongest = (match: Match) =>
  disagreements(match).sort((a, b) => b.edge!.size - a.edge!.size)[0]
</script>

<template>
  <!-- ═══ LINKA — žádné karty, řádky drží vlasová čára a rytmus ═══ -->
  <div v-if="variant === 'linka'" class="w-full">
    <div class="flex items-baseline gap-2 pb-2">
      <h3 class="text-callout font-semibold">{{ tournament.name }}</h3>
      <span class="text-caption-1 text-(--fg-tertiary)">
        {{ tournament.surface }} · {{ tournament.matches.length }}
      </span>
    </div>

    <div
      v-for="match in shown"
      :key="match.id"
      class="grid grid-cols-[3.5rem_1fr_auto] items-start gap-x-4 border-t border-(--separator) py-3"
    >
      <span class="pt-0.5 text-footnote tabular-nums text-(--fg-tertiary)">{{ match.time }}</span>

      <div class="min-w-0">
        <div
          v-for="(player, side) in match.players"
          :key="side"
          class="flex items-baseline gap-2 py-0.5"
        >
          <span
            class="min-w-0 flex-1 truncate text-callout"
            :class="favouriteOf(match) === side ? 'font-semibold' : 'text-(--fg-secondary)'"
          >{{ player.name }}</span>
          <span class="w-12 shrink-0 text-right text-footnote tabular-nums text-(--fg-tertiary)">
            {{ fmt(player.stats.rank, rankMetric.format) }}
          </span>
          <span
            class="w-12 shrink-0 text-right text-callout tabular-nums"
            :class="favouriteOf(match) === side ? 'font-semibold' : 'text-(--fg-secondary)'"
          >{{ fmt(player.stats.odds, oddsMetric.format) }}</span>
        </div>

        <p v-if="strongest(match)" class="pt-1 text-caption-1 text-(--fg-tertiary)">
          <span class="text-(--tone-warning-strong)">
            {{ strongest(match)!.metric.label }} ukazuje na
            {{ match.players[strongest(match)!.edge!.side!].name.split(' ').at(-1) }}
          </span>
          <span v-if="disagreements(match).length > 1">
            · a další {{ disagreements(match).length - 1 }}
          </span>
        </p>
      </div>

      <div class="flex items-center gap-1 pt-0.5">
        <Icon
          v-if="match.live"
          name="lucide:radio"
          class="size-3.5 text-(--tone-danger)"
          aria-label="Živě"
        />
        <Icon
          v-if="match.insight"
          name="lucide:lightbulb"
          class="size-3.5 text-(--fg-tertiary)"
          aria-label="Rozbor"
        />
      </div>
    </div>
  </div>

  <!-- ═══ MŘÍŽKA — jeden panel, hlavička jednou, sloupce drží ═══ -->
  <UCard v-else-if="variant === 'mrizka'" material="regular" padding="none" class="w-full overflow-hidden">
    <div class="flex items-center gap-2 border-b border-(--separator) px-3 py-2">
      <h3 class="text-callout font-semibold">{{ tournament.name }}</h3>
      <UTag :label="tournament.surface" :tone="surfaceTone[tournament.surface]" />
      <div class="flex-1" />
      <span class="text-footnote tabular-nums text-(--fg-tertiary)">
        {{ tournament.matches.length }}
      </span>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-left">
        <!--
          Hlavička JEDNOU pro celý turnaj. Původní obrazovka ji opakuje
          u každého zápasu — osmkrát pod sebou totéž, a svislá linka,
          které by se oko drželo, tím zmizí.
        -->
        <thead>
          <tr class="border-b border-(--separator)">
            <th scope="col" class="px-3 py-1.5 text-caption-2 font-semibold tracking-wide text-(--fg-secondary) uppercase">
              Hráč
            </th>
            <th
              v-for="metric in gridMetrics"
              :key="metric.key"
              scope="col"
              class="border-l border-(--separator) px-3 py-1.5 text-right text-caption-2 font-semibold tracking-wide text-(--fg-secondary) uppercase"
            >
              {{ metric.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-for="match in shown" :key="match.id">
            <tr class="border-t-4 border-(--separator)">
              <td :colspan="gridMetrics.length + 1" class="px-3 pt-1.5 pb-0.5">
                <span class="flex items-center gap-2 text-caption-1 text-(--fg-tertiary)">
                  <span class="tabular-nums">{{ match.time }}</span>
                  <UTag v-if="match.live" label="Živě" tone="danger" solid />
                </span>
              </td>
            </tr>

            <tr
              v-for="(player, side) in match.players"
              :key="`${match.id}-${side}`"
              class="border-t border-(--separator)"
            >
              <td class="px-3 py-1.5">
                <span
                  class="block truncate text-footnote"
                  :class="favouriteOf(match) === side ? 'font-semibold' : 'text-(--fg-secondary)'"
                >{{ player.name }}</span>
              </td>
              <td
                v-for="metric in gridMetrics"
                :key="metric.key"
                class="border-l border-(--separator) px-3 py-1.5 text-right text-footnote tabular-nums"
                :class="[
                  player.stats[metric.key] === null ? 'text-(--fg-tertiary)' : 'text-(--fg-secondary)',
                  metric.key === 'odds' && favouriteOf(match) === side && 'font-semibold text-(--fg-primary)',
                  advantage(match, metric)?.side === side && metric.key !== 'odds' && 'text-(--tone-success-strong)',
                ]"
              >
                {{ fmt(player.stats[metric.key], metric.format) }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </UCard>

  <!-- ═══ KARTA — míň jednotek, víc hierarchie ═══ -->
  <div v-else class="grid w-full gap-3" :class="compact ? '' : 'md:grid-cols-2'">
    <div class="flex items-baseline gap-2" :class="compact ? '' : 'md:col-span-2'">
      <h3 class="text-title-3 font-semibold">{{ tournament.name }}</h3>
      <UTag :label="tournament.surface" :tone="surfaceTone[tournament.surface]" />
      <span class="text-footnote text-(--fg-tertiary)">
        {{ tournament.matches.length }} zápasů
      </span>
    </div>

    <UCard v-for="match in shown" :key="match.id" material="regular" padding="lg" interactive>
      <div class="flex items-center gap-2 pb-3">
        <span class="text-footnote tabular-nums text-(--fg-tertiary)">{{ match.time }}</span>
        <UTag v-if="match.live" label="Živě" tone="danger" solid icon="lucide:radio" />
        <div class="flex-1" />
        <Icon
          v-if="match.insight"
          name="lucide:lightbulb"
          class="size-4 text-(--tone-accent)"
          aria-label="Rozbor"
        />
      </div>

      <div
        v-for="(player, side) in match.players"
        :key="side"
        class="flex items-center gap-3 py-1"
      >
        <Icon
          v-if="player.country"
          :name="`circle-flags:${player.country}`"
          class="size-5 shrink-0"
          aria-hidden="true"
        />
        <span v-else class="size-5 shrink-0" aria-hidden="true" />

        <span
          class="min-w-0 flex-1 truncate"
          :class="favouriteOf(match) === side ? 'text-title-3 font-semibold' : 'text-body text-(--fg-secondary)'"
        >{{ player.name }}</span>

        <span
          class="shrink-0 tabular-nums"
          :class="favouriteOf(match) === side
            ? 'text-title-2 font-semibold text-(--tone-accent-strong)'
            : 'text-title-3 text-(--fg-tertiary)'"
        >{{ fmt(player.stats.odds, oddsMetric.format) }}</span>
      </div>

      <p class="pt-3 text-footnote text-(--fg-secondary)">
        <template v-if="strongest(match)">
          Trh věří
          <strong class="font-semibold text-(--fg-primary)">
            {{ match.players[favouriteOf(match)!].name.split(' ').at(-1) }}
          </strong>, ale
          <strong class="font-semibold text-(--tone-warning-strong)">
            {{ strongest(match)!.metric.label.toLowerCase() }}
          </strong>
          ukazuje na soupeře.
        </template>
        <template v-else>Data se s kurzem shodují.</template>
      </p>
    </UCard>
  </div>
</template>
