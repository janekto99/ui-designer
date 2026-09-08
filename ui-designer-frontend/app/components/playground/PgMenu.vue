<script setup lang="ts">
import { catalogTree, sports } from '~/showcase/sport/data'

/**
 * Tři odpovědi na tutéž výtku: menu je moc.
 *
 * Původní panel má rám okolo rámu, čtyři nepopsané ikony u sportu, barevné
 * tečky u turnajů bez legendy a strom, který zabírá půl obrazovky. Každý
 * návrh z toho ubere něco jiného:
 *
 * | | co dělá s menu |
 * | --- | --- |
 * | Linka | ruší rám — menu je text na stránce, oddělený jednou svislou čárou |
 * | Mřížka | drží sloupec, ale zhustí ho a počty srovná do sloupce jako v tabulce |
 * | Karta | menu schová — filtruje se pruhem nad obsahem, strom je až v dialogu |
 *
 * Liší se i tím, jak označují vybranou položku: linka vlevo, jemný nádech,
 * a u Karty vůbec — tam nese výběr pilulka v pruhu.
 *
 * Společné je, čeho se všechny tři zbavily: teček bez významu a ikon bez
 * popisku. Když u prvku nejde napsat, co dělá, na obrazovce nemá co dělat.
 */
const props = defineProps<{ variant: 'linka' | 'mrizka' | 'karta' }>()

const sport = defineModel<string>('sport', { default: 'tenis' })
const selected = defineModel<string | undefined>('selected', { default: 'genoa' })
const query = defineModel<string>('query', { default: '' })

const expanded = ref(['muzi', 'challenger'])
const filtersOpen = ref(false)

/** Cesta k vybrané soutěži — do pruhu u varianty Karta. */
const path = computed(() => {
  const trail: { label: string, count?: number }[] = []
  const walk = (nodes: typeof catalogTree, acc: typeof trail): boolean => {
    for (const node of nodes) {
      const next = [...acc, { label: node.label, count: node.count }]
      if (node.value === selected.value) {
        trail.push(...next)
        return true
      }
      if (node.children && walk(node.children as typeof catalogTree, next)) return true
    }
    return false
  }
  walk(catalogTree, [])
  return trail
})
</script>

<template>
  <!-- ═══ LINKA — menu je text, ne panel ═══ -->
  <nav
    v-if="variant === 'linka'"
    class="flex w-56 shrink-0 flex-col gap-5 border-r border-(--separator) pr-5"
    aria-label="Filtry"
  >
    <!-- Sport se přepíná výš než všechno ostatní, tak stojí jako první a
         vypadá jako obsah, ne jako ovladač. -->
    <div class="flex items-baseline gap-4">
      <button
        v-for="item in sports"
        :key="item.value"
        type="button"
        :aria-current="sport === item.value ? 'true' : undefined"
        class="cursor-pointer text-callout outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
        :class="sport === item.value
          ? 'font-semibold text-(--fg-primary)'
          : 'text-(--fg-tertiary) hover:text-(--fg-secondary)'"
        @click="sport = item.value"
      >{{ item.label }}</button>
    </div>

    <div class="flex flex-col gap-2">
      <USearchField v-model="query" placeholder="Hráč, turnaj…" />
      <UButton label="Dnes" icon="lucide:calendar" variant="plain" size="sm" class="justify-start" />
    </div>

    <UTree
      v-model="selected"
      v-model:expanded="expanded"
      :nodes="catalogTree"
      selection="subtle"
      aria-label="Soutěže"
    />

    <UButton label="Další filtry" variant="plain" size="sm" class="justify-start" @click="filtersOpen = true" />
  </nav>

  <!-- ═══ MŘÍŽKA — sloupec s pevnou hlavičkou ═══ -->
  <UCard
    v-else-if="variant === 'mrizka'"
    material="regular"
    padding="none"
    as="nav"
    class="flex w-60 shrink-0 flex-col self-start overflow-hidden"
    aria-label="Filtry"
  >
    <div class="flex flex-col gap-2 border-b border-(--separator) p-2">
      <USegmentedControl
        v-model="sport"
        :segments="sports.map((s) => ({ label: s.label, value: s.value }))"
        size="sm"
        block
        aria-label="Sport"
      />
      <USearchField v-model="query" placeholder="Hráč, turnaj…" />
    </div>

    <div class="p-1.5">
      <UTree
        v-model="selected"
        v-model:expanded="expanded"
        :nodes="catalogTree"
        selection="soft"
        aria-label="Soutěže"
      />
    </div>

    <div class="border-t border-(--separator) p-1.5">
      <UButton label="Další filtry" icon="lucide:sliders-horizontal" variant="plain" size="sm" block @click="filtersOpen = true" />
    </div>
  </UCard>

  <!-- ═══ KARTA — menu není, filtruje se pruhem ═══ -->
  <div v-else class="flex w-full flex-wrap items-center gap-2">
    <USegmentedControl
      v-model="sport"
      :segments="sports.map((s) => ({ label: s.label, value: s.value }))"
      size="sm"
      aria-label="Sport"
    />

    <!--
      Cesta ke vybrané soutěži jako klikací pilulky. Nahrazuje strom: stejná
      informace, ale zabírá jeden řádek místo poloviny obrazovky. Hlouběji se
      člověk dostane přes „Další filtry".
    -->
    <UButton
      v-for="step in path"
      :key="step.label"
      :label="step.count !== undefined ? `${step.label} · ${step.count}` : step.label"
      variant="glass"
      size="sm"
      @click="filtersOpen = true"
    />

    <div class="min-w-40 flex-1">
      <USearchField v-model="query" placeholder="Hráč, turnaj…" size="md" />
    </div>

    <UButton label="Filtry" icon="lucide:sliders-horizontal" variant="glass" size="sm" @click="filtersOpen = true" />
  </div>

  <UDialog
    v-model="filtersOpen"
    title="Filtry"
    :description="props.variant === 'karta' ? 'Celý strom soutěží bydlí tady, ne na obrazovce.' : undefined"
    size="md"
  >
    <UTree
      v-model="selected"
      v-model:expanded="expanded"
      :nodes="catalogTree"
      selection="subtle"
      aria-label="Soutěže"
    />
    <template #footer>
      <UButton label="Hotovo" variant="solid" tone="accent" size="sm" @click="filtersOpen = false" />
    </template>
  </UDialog>
</template>
