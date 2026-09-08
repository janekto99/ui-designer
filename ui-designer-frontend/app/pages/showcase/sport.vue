<script setup lang="ts">
import { tournaments } from '~/showcase/sport/data'
import type { Crumb } from '~/components/ui/UBreadcrumb.vue'

definePageMeta({ layout: 'showcase' })

const view = ref('zapasy')
const grouping = ref('tournament')
const selected = ref<string | undefined>('challenger')
const query = ref('')
const collapsed = ref<string[]>([])
const authOpen = ref(false)

const views = [
  { label: 'Zápasy', value: 'zapasy', icon: 'lucide:chart-column' },
  { label: 'Výsledky', value: 'vysledky', icon: 'lucide:trophy' },
  { label: 'Analýza', value: 'analyza', icon: 'lucide:microscope' },
]

const groupings = [
  { label: 'Po turnajích', value: 'tournament', icon: 'lucide:layers' },
  { label: 'Vše', value: 'all', icon: 'lucide:list' },
]

/**
 * Drobečky nesou cestu. Hlavička skupiny pak už nemusí opakovat název
 * turnaje — na původní obrazovce stál dvakrát pod sebou.
 */
const crumbs: Crumb[] = [
  { label: 'Tenis', to: '/showcase/sport', icon: 'lucide:circle-dot' },
  { label: 'Muži', to: '/showcase/sport' },
  { label: 'Challenger', to: '/showcase/sport' },
  { label: 'Phan Thiet' },
]

const matches = computed(() => tournaments.flatMap((t) => t.matches))

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return matches.value
  return matches.value.filter((m) =>
    m.players.some((p) => p.name.toLowerCase().includes(q)),
  )
})

const isCollapsed = (id: string) => collapsed.value.includes(id)

function toggleGroup(id: string) {
  collapsed.value = isCollapsed(id) ? collapsed.value.filter((x) => x !== id) : [...collapsed.value, id]
}

const allCollapsed = computed(() => collapsed.value.length === tournaments.length)

function toggleAll() {
  collapsed.value = allCollapsed.value ? [] : tournaments.map((t) => t.id)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Chrome je sklo. Data budou hutná — sklo je na tom, co se překrývá. -->
    <div class="vos-panel flex flex-wrap items-center gap-3 rounded-3xl px-4 py-3">
      <span class="text-title-3 font-semibold tracking-tight">SPORT</span>

      <div class="flex-1" />
      <USegmentedControl v-model="view" :segments="views" aria-label="Zobrazení" />
      <div class="flex-1" />

      <UButton label="EN" variant="plain" size="sm" />
      <UButton label="Přihlásit" variant="glass" size="sm" @click="authOpen = true" />
      <UButton label="Registrovat" variant="solid" tone="accent" size="sm" @click="authOpen = true" />
    </div>

    <div class="flex min-w-0 flex-1 gap-4">
      <SportFilters v-model:selected="selected" v-model:query="query" />

      <div class="flex min-w-0 flex-1 flex-col gap-3">
        <div class="vos-panel flex flex-wrap items-center gap-2 rounded-2xl px-3 py-2">
          <UBreadcrumb :items="crumbs">
            <template #trailing>
              <UTag :label="`${filtered.length} zápasů`" />
            </template>
          </UBreadcrumb>

          <div class="flex-1" />

          <UButton
            :icon="allCollapsed ? 'lucide:chevrons-up-down' : 'lucide:chevrons-down-up'"
            :label="allCollapsed ? 'Rozbalit vše' : 'Sbalit vše'"
            variant="plain"
            size="sm"
            @click="toggleAll"
          />
          <USegmentedControl v-model="grouping" :segments="groupings" size="sm" aria-label="Seskupení" />
        </div>

        <template v-if="filtered.length">
          <section v-for="tournament in tournaments" :key="tournament.id" class="flex flex-col gap-2">
            <!--
              Hlavička skupiny nese jen to, co je pro skupinu vlastní — povrch,
              kategorii, zemi a počet. Název turnaje už stojí v drobečkách.
            -->
            <div class="flex items-center gap-2 px-1">
              <UButton
                :icon="isCollapsed(tournament.id) ? 'lucide:chevron-right' : 'lucide:chevron-down'"
                variant="plain"
                size="xs"
                :aria-expanded="!isCollapsed(tournament.id)"
                :aria-label="`Sbalit ${tournament.name}`"
                @click="toggleGroup(tournament.id)"
              />
              <Icon name="lucide:trophy" class="size-4 shrink-0 text-(--fg-secondary)" />
              <h2 class="text-callout font-semibold">{{ tournament.name }}</h2>
              <UTag :label="tournament.surface" tone="info" />
              <UTag :label="tournament.category" />
              <Icon :name="`circle-flags:${tournament.country}`" class="size-4 shrink-0" />

              <div class="flex-1" />

              <span class="text-footnote tabular-nums text-(--fg-tertiary)">
                {{ tournament.matches.length }}
              </span>
              <UButton label="Detail" icon="lucide:info" variant="glass" size="xs" />
            </div>

            <div
              class="grid transition-[grid-template-rows] duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]"
              :class="isCollapsed(tournament.id) ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'"
            >
              <div class="overflow-hidden">
                <div class="flex flex-col gap-2">
                  <SportMatchRow
                    v-for="match in tournament.matches.filter((m) => filtered.includes(m))"
                    :key="match.id"
                    :match="match"
                  />
                </div>
              </div>
            </div>
          </section>

          <p class="px-1 pt-1 text-caption-1 text-(--fg-tertiary)">
            Zvýrazněná metrika ukazuje na jiného hráče než kurz.
          </p>
        </template>

        <UCard v-else material="thin">
          <UEmpty
            icon="lucide:search-x"
            title="Žádný zápas nevyhovuje"
            :description="`Hledání „${query}“ nic nenašlo. Zkus jiné jméno nebo hledání zruš.`"
          >
            <UButton label="Zrušit hledání" size="sm" variant="soft" tone="accent" @click="query = ''" />
          </UEmpty>
        </UCard>
      </div>
    </div>

    <UDialog
      v-model="authOpen"
      title="Přihlásit se"
      description="Ukázka dialogu — fokus zůstává uvnitř, Escape zavírá."
      size="sm"
    >
      <div class="flex flex-col gap-3">
        <UTextField placeholder="E-mail" aria-label="E-mail" />
        <USecureField placeholder="Heslo" />
        <UCheckbox label="Zůstat přihlášen" />
      </div>

      <template #footer>
        <UButton label="Zrušit" variant="glass" @click="authOpen = false" />
        <UButton label="Přihlásit" variant="solid" tone="accent" @click="authOpen = false" />
      </template>
    </UDialog>
  </div>
</template>
