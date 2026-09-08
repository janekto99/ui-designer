<script setup lang="ts">
import type { Match } from '~/test/generate'
import { SURFACES, columnByKey, entryByKey, insightByKey } from '~/test/sport'
import { tournamentBySlug } from '~/test/generate'

/**
 * Řádek zápasu. Sloupce si nebere z tenisu, ale z toho, co je zapnuté
 * v nastavení — proto tu není jediné `if (sport === 'tennis')`.
 */
const props = defineProps<{ match: Match, source: 'upcoming' | 'results' }>()

const { visibleColumns, showDiffs } = useTestSettings()
const { has, toggle } = useTestFavourites()
const { openDetail } = useTestDialogs()

const tournament = computed(() => tournamentBySlug(props.match.tournament)!)
const columns = computed(() => visibleColumns.value.map(columnByKey).filter(Boolean))

const value = (side: 0 | 1, key: string) =>
  key === 'seed' ? props.match.players[side].seed : props.match.players[side].stats[key] ?? null

/** Která strana má v tomto sloupci lepší hodnotu. `null`, když to nejde říct. */
function better(key: string): 0 | 1 | null {
  if (!showDiffs.value) return null
  const column = columnByKey(key)
  if (!column || column.kind) return null
  const a = value(0, key)
  const b = value(1, key)
  if (a === null || b === null || a === b) return null
  return (column.lowerIsBetter ? a < b : a > b) ? 0 : 1
}

const winner = computed(() => props.match.result?.winner ?? null)
</script>

<template>
  <UCard material="regular" padding="none" as="article" class="overflow-hidden">
    <div class="flex items-center gap-2 px-4 pt-3">
      <span class="text-footnote tabular-nums text-(--fg-secondary)">{{ match.time }}</span>
      <UTag :label="match.round" />
      <UTag :label="SURFACES[tournament.surface].label" :tone="SURFACES[tournament.surface].tone" />
      <UTag v-if="match.live" label="Živě" tone="danger" solid icon="lucide:radio" />

      <div class="flex-1" />

      <UButton
        v-if="match.insight"
        icon="lucide:lightbulb"
        variant="plain"
        tone="accent"
        size="xs"
        aria-label="Rozbor"
        @click="openDetail(match.id)"
      />
      <UButton
        icon="lucide:star"
        size="xs"
        :variant="has(match.id) ? 'selected' : 'plain'"
        :aria-pressed="has(match.id)"
        :aria-label="`Oblíbené: ${match.players[0].name} – ${match.players[1].name}`"
        @click="toggle(match.id)"
      />
      <UButton
        icon="lucide:chevron-right"
        variant="plain"
        size="xs"
        aria-label="Detail zápasu"
        @click="openDetail(match.id)"
      />
    </div>

    <div class="overflow-x-auto px-2 pt-1 pb-2">
      <table class="w-full table-fixed border-collapse">
        <caption class="sr-only">
          {{ match.players[0].name }} proti {{ match.players[1].name }}
        </caption>

        <colgroup>
          <col>
          <col v-for="column in columns" :key="column!.key" class="w-20">
          <col v-if="source === 'results'" class="w-28">
        </colgroup>

        <thead>
          <tr>
            <th scope="col"><span class="sr-only">Hráč</span></th>
            <th
              v-for="column in columns"
              :key="column!.key"
              scope="col"
              class="px-2 pb-1 text-center text-caption-2 font-semibold tracking-wide text-(--fg-secondary) uppercase"
            >
              {{ column!.label }}
              <span class="sr-only"> — {{ column!.description }}</span>
            </th>
            <th
              v-if="source === 'results'"
              scope="col"
              class="px-2 pb-1 text-right text-caption-2 font-semibold tracking-wide text-(--fg-secondary) uppercase"
            >
              Sety
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(player, side) in match.players" :key="side">
            <td class="py-1 pr-3 pl-2">
              <span class="flex min-w-0 items-center gap-2">
                <span
                  class="truncate text-body"
                  :class="winner === side ? 'font-semibold' : 'text-(--fg-secondary)'"
                >{{ player.name }}</span>
              </span>
            </td>

            <td
              v-for="column in columns"
              :key="column!.key"
              class="px-2 py-1 text-center text-footnote tabular-nums"
              :class="better(column!.key) === side
                ? 'font-semibold text-(--tone-success-strong)'
                : 'text-(--fg-secondary)'"
            >
              <!-- Nečíselné sloupce mají vlastní buňku: vlajka, štítek, ikony. -->
              <Icon
                v-if="column!.kind === 'flag'"
                :name="`circle-flags:${player.country}`"
                class="mx-auto size-4"
                :aria-label="player.country.toUpperCase()"
              />

              <UTag
                v-else-if="column!.kind === 'entry' && player.entry"
                :label="entryByKey(player.entry)?.short ?? ''"
              />

              <span v-else-if="column!.kind === 'insights'" class="flex items-center justify-center gap-1">
                <UTooltip
                  v-for="key in player.insights.slice(0, 3)"
                  :key="key"
                  :label="insightByKey(key)?.label ?? key"
                >
                  <Icon name="lucide:sparkle" class="size-3.5 text-(--tone-accent)" />
                </UTooltip>
                <span v-if="!player.insights.length" class="text-(--fg-tertiary)">—</span>
              </span>

              <span v-else-if="column!.kind">—</span>

              <template v-else>
                <span :class="value(side as 0 | 1, column!.key) === null ? 'text-(--fg-tertiary)' : ''">
                  {{ value(side as 0 | 1, column!.key) === null
                    ? '—'
                    : column!.format(value(side as 0 | 1, column!.key) as number) }}
                </span>
              </template>
            </td>

            <td v-if="source === 'results' && match.result" class="px-2 py-1 text-right">
              <span class="inline-flex items-center gap-1.5 tabular-nums">
                <span
                  v-for="(set, i) in match.result.sets"
                  :key="i"
                  class="text-footnote"
                  :class="(side === 0 ? set.home > set.away : set.away > set.home)
                    ? 'font-semibold text-(--fg-primary)'
                    : 'text-(--fg-tertiary)'"
                >{{ side === 0 ? set.home : set.away }}</span>
                <span
                  class="ml-1 text-callout font-semibold"
                  :class="winner === side ? 'text-(--fg-primary)' : 'text-(--fg-tertiary)'"
                >{{ side === 0 ? match.result.home : match.result.away }}</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UCard>
</template>
