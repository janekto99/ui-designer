<script setup lang="ts">
import type { Crumb } from '~/components/ui/UBreadcrumb.vue'

const depth = ref(4)
const withTrailing = ref(true)

const depthOptions = [2, 3, 4, 6].map((n) => ({ label: String(n), value: n }))
const trailingOptions = [
  { label: 'S doplňkem', value: true },
  { label: 'Bez doplňku', value: false },
]

const full: Crumb[] = [
  { label: 'Tenis', to: '/components/breadcrumb', icon: 'lucide:circle-dot' },
  { label: 'Muži', to: '/components/breadcrumb' },
  { label: 'Challenger', to: '/components/breadcrumb' },
  { label: 'Vietnam', to: '/components/breadcrumb' },
  { label: 'Phan Thiet', to: '/components/breadcrumb' },
  { label: 'Čtvrtfinále' },
]

const items = computed(() => {
  const head = full.slice(0, depth.value - 1)
  return [...head, { label: full.at(-1)!.label }]
})
</script>

<template>
  <DocPage
    title="Breadcrumb"
    description="V kitu tahle komponenta není — visionOS řeší návrat jedním tlačítkem zpět. Je to odvození pro web, kde je hierarchie hlubší než dvě úrovně."
  >
    <DocSection
      title="Náhled"
      description="Poslední článek není odkaz a nese aria-current. Odkaz na místo, kde už stojíš, je pro čtečku šum."
    >
      <template #controls>
        <VariantPicker v-model="depth" label="Úrovní" :options="depthOptions" />
        <VariantPicker v-model="withTrailing" label="Vpravo" :options="trailingOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <UCard material="thin" padding="sm" class="w-full max-w-2xl">
          <UBreadcrumb :items="items">
            <template v-if="withTrailing" #trailing>
              <UTag label="8 zápasů" />
            </template>
          </UBreadcrumb>
        </UCard>
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Zkrácení"
      description="Nad čtyři úrovně se cesta zkracuje zprostřed, ne z konce — konec je to jediné, co uživatel potřebuje vidět vždycky. Výpustka je tlačítko, skrytá cesta jde zobrazit."
    >
      <PreviewStage min-height="10rem">
        <UCard material="thin" padding="sm" class="w-full max-w-2xl">
          <UBreadcrumb :items="full" :max-visible="4" />
        </UCard>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
