<script setup lang="ts">
import { sportTree } from '~/showcase/sport/data'

/**
 * Sada prvků, které sportovní web potřebuje — v tom designu, ve kterém
 * zrovna stojí. Slouží k porovnání, ne k dokumentaci: každý prvek je tu
 * jednou a v tom stavu, ve kterém se nejčastěji ukáže.
 *
 * Odpovídá inventáři z `sport-project/frontend/app/components/ui/`.
 */
const query = ref('')
const note = ref('')
const city = ref('genoa')
const view = ref('zapasy')
const tab = ref('prehled')
const switched = ref(true)
const checked = ref(true)
const selected = ref<string | undefined>('challenger')
const expanded = ref(['tenis', 'tenis-muzi'])
const dialogOpen = ref(false)
</script>

<template>
  <div class="flex flex-col gap-6">
    <section class="flex flex-col gap-2">
      <p class="text-caption-2 tracking-wide text-(--fg-tertiary) uppercase">Akce</p>
      <div class="flex flex-wrap items-center gap-2">
        <UButton label="Registrovat" variant="solid" tone="accent" size="sm" />
        <UButton label="Přihlásit" variant="glass" size="sm" />
        <UButton label="Zrušit filtry" variant="soft" tone="accent" size="sm" />
        <UButton label="Smazat" variant="soft" tone="danger" size="sm" />
        <UButton label="EN" variant="plain" size="sm" />
        <UButton icon="lucide:star" variant="plain" size="sm" aria-label="Oblíbené" />
        <UButton label="Detail" icon="lucide:info" variant="glass" size="xs" />
      </div>
    </section>

    <section class="flex flex-col gap-2">
      <p class="text-caption-2 tracking-wide text-(--fg-tertiary) uppercase">Stav a značky</p>
      <div class="flex flex-wrap items-center gap-2">
        <UTag label="Antuka" tone="warning" />
        <UTag label="Hard" tone="info" />
        <UTag label="Challenger" />
        <UTag label="Živě" tone="danger" solid icon="lucide:radio" />
        <UTag label="Q" />
        <UTag label="[1]" />
        <UBadge :value="12" />
        <UAvatar name="Thiago Seyboth Wild" size="sm" />
        <UActivityIndicator size="sm" />
      </div>
      <UProgressBar :value="62" class="max-w-xs" aria-label="Průběh" />
    </section>

    <section class="flex flex-col gap-2">
      <p class="text-caption-2 tracking-wide text-(--fg-tertiary) uppercase">Zadávání</p>
      <div class="grid gap-3 sm:grid-cols-2">
        <USearchField v-model="query" placeholder="Hráč, turnaj…" />
        <USelect
          v-model="city"
          :options="[
            { label: 'Challenger Genoa', value: 'genoa' },
            { label: 'Challenger Phan Thiet', value: 'phan' },
          ]"
          aria-label="Turnaj"
        />
      </div>
      <UTextarea v-model="note" placeholder="Poznámka k zápasu" :rows="2" aria-label="Poznámka" />
      <div class="flex flex-wrap items-center gap-4">
        <UCheckbox v-model="checked" label="Jen oblíbené" size="sm" />
        <label class="flex items-center gap-2 text-callout">
          <UToggle v-model="switched" size="sm" aria-label="Jen živé" />
          Jen živé
        </label>
      </div>
    </section>

    <section class="flex flex-col gap-2">
      <p class="text-caption-2 tracking-wide text-(--fg-tertiary) uppercase">Navigace</p>
      <USegmentedControl
        v-model="view"
        :segments="[
          { label: 'Zápasy', value: 'zapasy' },
          { label: 'Výsledky', value: 'vysledky' },
          { label: 'Analýza', value: 'analyza' },
        ]"
        size="sm"
        aria-label="Zobrazení"
      />
      <UTabs
        v-model="tab"
        :items="[
          { label: 'Přehled', value: 'prehled' },
          { label: 'Vzájemné', value: 'h2h' },
          { label: 'Kurzy', value: 'kurzy' },
        ]"
        aria-label="Detail"
      />
      <UBreadcrumb
        :items="[
          { label: 'Tenis', to: '/playground' },
          { label: 'Muži', to: '/playground' },
          { label: 'Challenger Genoa' },
        ]"
      />
      <div class="max-w-56">
        <UTree
          v-model="selected"
          v-model:expanded="expanded"
          :nodes="sportTree.slice(0, 1)"
          aria-label="Sporty"
        />
      </div>
    </section>

    <section class="flex flex-col gap-2">
      <p class="text-caption-2 tracking-wide text-(--fg-tertiary) uppercase">Vrstvy a prázdno</p>
      <div class="flex flex-wrap items-center gap-3">
        <UButton label="Otevřít dialog" variant="glass" size="sm" @click="dialogOpen = true" />
        <UCard material="thin" padding="none" class="min-w-56 flex-1">
          <UEmpty size="sm" icon="lucide:search-x" title="Žádný zápas nevyhovuje" />
        </UCard>
      </div>

      <UDialog v-model="dialogOpen" title="Uložit filtr" size="sm">
        <UTextField placeholder="Název filtru" aria-label="Název filtru" />
        <template #footer>
          <UButton label="Zrušit" variant="glass" size="sm" @click="dialogOpen = false" />
          <UButton label="Uložit" variant="solid" tone="accent" size="sm" @click="dialogOpen = false" />
        </template>
      </UDialog>
    </section>
  </div>
</template>
