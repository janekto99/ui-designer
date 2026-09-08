<script setup lang="ts">
import { tournaments } from '~/showcase/sport/data'
import type { Crumb } from '~/components/ui/UBreadcrumb.vue'

/**
 * Celá obrazovka jednoho návrhu.
 *
 * Rozvržení je součást návrhu, ne obal kolem něj: u Karty menu vůbec není,
 * takže obsah začíná jinde než u zbylých dvou. Proto se sem sáhne přes
 * `variant` a ne přes sloty.
 */
defineProps<{ variant: 'linka' | 'mrizka' | 'karta' }>()

const view = ref('zapasy')
const sport = ref('tenis')
const selected = ref<string | undefined>('genoa')
const query = ref('')
const grouping = ref('tournament')

const crumbs: Crumb[] = [
  { label: 'Tenis', to: '/playground' },
  { label: 'Muži', to: '/playground' },
  { label: 'Challenger', to: '/playground' },
  { label: 'Genoa' },
]

const groupings = [
  { label: 'Po turnajích', value: 'tournament' },
  { label: 'Vše', value: 'all' },
]

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return tournaments
  return tournaments
    .map((t) => ({ ...t, matches: t.matches.filter((m) => m.players.some((p) => p.name.toLowerCase().includes(q))) }))
    .filter((t) => t.matches.length > 0)
})
</script>

<template>
  <div class="flex flex-col" :class="variant === 'karta' ? 'gap-6' : 'gap-4'">
    <PgTopBar v-model:view="view" :variant="variant" />

    <!-- Karta menu nemá — filtruje se pruhem, takže stojí nad obsahem. -->
    <PgMenu
      v-if="variant === 'karta'"
      v-model:sport="sport"
      v-model:selected="selected"
      v-model:query="query"
      variant="karta"
    />

    <div class="flex min-w-0 gap-5">
      <PgMenu
        v-if="variant !== 'karta'"
        v-model:sport="sport"
        v-model:selected="selected"
        v-model:query="query"
        :variant="variant"
      />

      <div class="flex min-w-0 flex-1 flex-col gap-4">
        <div
          class="flex flex-wrap items-center gap-3"
          :class="variant === 'mrizka' ? 'border-b border-(--separator) pb-2' : ''"
        >
          <!-- U Karty nese cestu pruh filtrů výš; druhý nadpis by ji jen
               zopakoval, a navíc jiným turnajem, než jaký je pod ním. -->
          <UBreadcrumb v-if="variant !== 'karta'" :items="crumbs" />

          <div class="flex-1" />

          <UButton label="Sbalit vše" icon="lucide:chevrons-down-up" variant="plain" size="sm" />
          <USegmentedControl v-model="grouping" :segments="groupings" size="sm" aria-label="Seskupení" />
        </div>

        <template v-if="filtered.length">
          <PgMatchList
            v-for="tournament in filtered"
            :key="tournament.id"
            :tournament="tournament"
            :variant="variant"
          />
        </template>

        <UCard v-else material="thin">
          <UEmpty
            icon="lucide:search-x"
            title="Žádný zápas nevyhovuje"
            :description="`Hledání „${query}“ nic nenašlo.`"
          >
            <UButton label="Zrušit hledání" variant="soft" tone="accent" size="sm" @click="query = ''" />
          </UEmpty>
        </UCard>
      </div>
    </div>
  </div>
</template>
