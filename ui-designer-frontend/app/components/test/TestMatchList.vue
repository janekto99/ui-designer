<script setup lang="ts">
import { SURFACES, columnByKey } from '~/test/sport'
import { tournamentBySlug } from '~/test/generate'
import type { Crumb } from '~/components/ui/UBreadcrumb.vue'

const props = withDefaults(defineProps<{ source?: 'upcoming' | 'results' }>(), { source: 'upcoming' })

const {
  grouping, selected, query, filtered, groups,
  isCollapsed, toggleGroup, allCollapsed, toggleAll,
} = useTestListing(props.source)

const { sortField, sortDirection, visibleColumns } = useTestSettings()
const { activeCount, reset } = useTestFilters()
const { open } = useTestDialogs()

const groupings = [
  { label: 'Po turnajích', value: 'tournament' },
  { label: 'Vše', value: 'all' },
]

const crumbs = computed<Crumb[]>(() => {
  const trail: Crumb[] = [
    { label: 'Tenis', to: '/test' },
    { label: props.source === 'results' ? 'Výsledky' : 'Zápasy', to: props.source === 'results' ? '/test/vysledky' : '/test' },
  ]
  const t = selected.value ? tournamentBySlug(selected.value) : undefined
  if (t) trail.push({ label: t.category, to: '/test' }, { label: t.name })
  return trail
})

const sortLabel = computed(() => {
  const field = sortField.value === 'time' ? 'Čas' : columnByKey(sortField.value)?.label ?? sortField.value
  return `${field} ${sortDirection.value === 'asc' ? '↑' : '↓'}`
})
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-col gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <UBreadcrumb :items="crumbs">
        <template #trailing>
          <UTag :label="`${filtered.length} zápasů`" />
        </template>
      </UBreadcrumb>

      <div class="flex-1" />

      <UButton :label="sortLabel" icon="lucide:arrow-up-down" variant="plain" size="sm" @click="open('sort')" />
      <UButton
        :label="`Sloupce · ${visibleColumns.length}`"
        icon="lucide:columns-3"
        variant="plain"
        size="sm"
        @click="open('display')"
      />
      <UButton
        :label="allCollapsed ? 'Rozbalit vše' : 'Sbalit vše'"
        :icon="allCollapsed ? 'lucide:chevrons-up-down' : 'lucide:chevrons-down-up'"
        variant="plain"
        size="sm"
        @click="toggleAll"
      />
      <USegmentedControl v-model="grouping" :segments="groupings" size="sm" aria-label="Seskupení" />
    </div>

    <template v-if="filtered.length">
      <section v-for="group in groups" :key="group.slug" class="flex flex-col gap-2">
        <div class="flex items-center gap-2 px-1">
          <UButton
            :icon="isCollapsed(group.slug) ? 'lucide:chevron-right' : 'lucide:chevron-down'"
            variant="plain"
            size="xs"
            :aria-expanded="!isCollapsed(group.slug)"
            :aria-label="`Sbalit ${group.name}`"
            @click="toggleGroup(group.slug)"
          />
          <h2 class="text-callout font-semibold">{{ group.name }}</h2>

          <template v-if="grouping === 'tournament' && tournamentBySlug(group.slug)">
            <UTag
              :label="SURFACES[tournamentBySlug(group.slug)!.surface].label"
              :tone="SURFACES[tournamentBySlug(group.slug)!.surface].tone"
            />
            <Icon :name="`circle-flags:${tournamentBySlug(group.slug)!.country}`" class="size-4 shrink-0" />
          </template>

          <div class="flex-1" />
          <span class="text-footnote tabular-nums text-(--fg-tertiary)">{{ group.matches.length }}</span>
        </div>

        <!--
          `inert` a `aria-hidden`, ne jen `overflow-hidden`. Bez nich sbalená
          skupina zmizí z očí, ale zůstane v pořadí tabulátoru a čtečka ji
          přečte — uživatel klávesnice by procházel zápasy, které nevidí.
        -->
        <div
          class="grid transition-[grid-template-rows] duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]"
          :class="isCollapsed(group.slug) ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'"
          :inert="isCollapsed(group.slug)"
          :aria-hidden="isCollapsed(group.slug)"
          :data-collapsed="isCollapsed(group.slug)"
        >
          <div class="overflow-hidden">
            <div class="flex flex-col gap-2">
              <TestMatchRow
                v-for="match in group.matches"
                :key="match.id"
                :match="match"
                :source="source"
              />
            </div>
          </div>
        </div>
      </section>
    </template>

    <UCard v-else material="regular">
      <UEmpty
        icon="lucide:search-x"
        title="Žádný zápas nevyhovuje"
        :description="query
          ? `Hledání „${query}“ nic nenašlo.`
          : activeCount
            ? 'Filtry jsou moc úzké — zkus některý zrušit.'
            : 'Pro tenhle výběr nejsou data.'"
      >
        <div class="flex gap-2">
          <UButton v-if="query" label="Zrušit hledání" variant="soft" tone="accent" size="sm" @click="query = ''" />
          <UButton v-if="activeCount" label="Zrušit filtry" variant="soft" tone="accent" size="sm" @click="reset" />
          <UButton v-if="selected" label="Všechny soutěže" variant="glass" size="sm" @click="selected = undefined" />
        </div>
      </UEmpty>
    </UCard>
  </div>
</template>
