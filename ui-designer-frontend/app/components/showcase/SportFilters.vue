<script setup lang="ts">
import { sportTree } from '~/showcase/sport/data'

/**
 * Postranní panel filtrů.
 *
 * Původní byl plochý seznam s odsazením — tři úrovně hierarchie vyjádřené
 * jen mezerou vlevo. Strom to řekne sám a navíc jde ovládat klávesnicí.
 */
const selected = defineModel<string | undefined>('selected', { default: 'challenger' })
const query = defineModel<string>('query', { default: '' })

const expanded = ref(['tenis', 'tenis-muzi'])
const date = ref(new Date(2026, 8, 6))
const onlyFavourites = ref(false)
const onlyLive = ref(false)
</script>

<template>
  <aside class="vos-panel flex w-64 shrink-0 flex-col gap-4 rounded-3xl p-3">
    <p class="px-2 pt-1 text-caption-2 tracking-wide text-(--fg-tertiary) uppercase">Filtry</p>

    <div class="flex flex-col gap-2">
      <UDatePicker v-model="date" aria-label="Datum" class="w-full" />
      <USearchField v-model="query" placeholder="Hráč, turnaj…" />
    </div>

    <div class="flex flex-col gap-1">
      <UListRow title="Jen oblíbené" icon="lucide:star">
        <template #trailing>
          <UToggle v-model="onlyFavourites" size="sm" aria-label="Jen oblíbené" />
        </template>
      </UListRow>
      <UListRow title="Jen živé" icon="lucide:radio">
        <template #trailing>
          <UToggle v-model="onlyLive" size="sm" aria-label="Jen živé" />
        </template>
      </UListRow>
    </div>

    <hr class="vos-separator">

    <UTree
      v-model="selected"
      v-model:expanded="expanded"
      :nodes="sportTree"
      aria-label="Sporty a soutěže"
      class="overflow-y-auto"
    />
  </aside>
</template>
