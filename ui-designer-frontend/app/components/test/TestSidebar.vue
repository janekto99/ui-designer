<script setup lang="ts">
const props = withDefaults(defineProps<{ source?: 'upcoming' | 'results' }>(), { source: 'upcoming' })

const { selected, query, onlyFavourites, tree } = useTestListing(props.source)
const { activeCount, reset } = useTestFilters()
const { open } = useTestDialogs()
const { ids } = useTestFavourites()

const expanded = ref(['tenis', 'cat-Challenger'])
const date = ref(new Date(2026, 8, 8))

/** Kliknutí na už vybraný turnaj výběr zruší — jinak by z něj nebylo cesty ven. */
function pick(value: string | undefined) {
  selected.value = selected.value === value ? undefined : value
}
</script>

<template>
  <aside class="flex w-64 shrink-0 flex-col gap-4">
    <UCard material="regular" padding="sm" class="flex flex-col gap-3">
      <UDatePicker v-model="date" aria-label="Datum" class="w-full" />
      <USearchField v-model="query" placeholder="Hráč, turnaj…" />

      <div class="flex flex-col gap-1">
        <UListRow title="Jen oblíbené" icon="lucide:star" :value="ids.length ? String(ids.length) : undefined">
          <template #trailing>
            <UToggle v-model="onlyFavourites" size="sm" aria-label="Jen oblíbené" />
          </template>
        </UListRow>
      </div>
    </UCard>

    <UCard material="regular" padding="sm" class="flex flex-col gap-2">
      <div class="flex items-center justify-between gap-2 px-1">
        <p class="text-caption-2 tracking-wide text-(--fg-tertiary) uppercase">Soutěže</p>
        <UButton
          v-if="selected"
          label="Zrušit"
          variant="plain"
          size="xs"
          @click="selected = undefined"
        />
      </div>

      <UTree
        v-model:expanded="expanded"
        :model-value="selected"
        :nodes="tree as never"
        selection="soft"
        aria-label="Soutěže"
        @update:model-value="pick($event as string)"
      />
    </UCard>

    <UCard material="regular" padding="sm" class="flex flex-col gap-2">
      <UButton
        :label="activeCount ? `Filtry · ${activeCount}` : 'Filtry'"
        icon="lucide:sliders-horizontal"
        :variant="activeCount ? 'soft' : 'plain'"
        :tone="activeCount ? 'accent' : 'neutral'"
        size="sm"
        block
        @click="open('filters')"
      />
      <UButton
        v-if="activeCount"
        label="Zrušit všechny filtry"
        variant="plain"
        size="sm"
        block
        @click="reset"
      />
    </UCard>
  </aside>
</template>
