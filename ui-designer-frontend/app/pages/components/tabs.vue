<script setup lang="ts">
const withIcons = ref(true)
const withCounts = ref(false)
const value = ref('zapasy')

const iconOptions = [
  { label: 'S ikonami', value: true },
  { label: 'Bez ikon', value: false },
]
const countOptions = [
  { label: 'S počty', value: true },
  { label: 'Bez počtů', value: false },
]

const base = [
  { label: 'Zápasy', value: 'zapasy', icon: 'lucide:chart-column', count: 72 },
  { label: 'Výsledky', value: 'vysledky', icon: 'lucide:trophy', count: 148 },
  { label: 'Analýza', value: 'analyza', icon: 'lucide:microscope', count: 9 },
]

const items = computed(() =>
  base.map((item) => ({
    ...item,
    icon: withIcons.value ? item.icon : undefined,
    count: withCounts.value ? item.count : undefined,
  })),
)

const many = ref('a')
const manyItems = [
  { label: 'Přehled', value: 'a' },
  { label: 'Statistiky', value: 'b' },
  { label: 'Vzájemné zápasy', value: 'c' },
  { label: 'Forma', value: 'd' },
  { label: 'Kurzy', value: 'e' },
  { label: 'Historie', value: 'f' },
  { label: 'Poznámky', value: 'g', disabled: true },
]
</script>

<template>
  <DocPage
    title="Tabs"
    description="Proti Segmented Controlu nesou míň vizuální váhy a hlavně škálují. Segmentovaný ovladač je na dvě až tři vzájemně výlučné volby, záložky na navigaci mezi sekcemi obsahu."
  >
    <DocSection
      title="Náhled"
      description="V kitu tahle komponenta není — visionOS má jen svislou lištu vedle okna. Je to odvození, ne přepis."
    >
      <template #controls>
        <VariantPicker v-model="withIcons" label="Ikony" :options="iconOptions" />
        <VariantPicker v-model="withCounts" label="Počty" :options="countOptions" />
      </template>

      <PreviewStage min-height="12rem">
        <UCard material="thin" class="w-96">
          <UTabs v-model="value" :items="items" aria-label="Sekce" />
          <p class="pt-4 text-callout text-(--fg-secondary)">
            Obsah sekce <strong class="text-(--fg-primary)">{{ value }}</strong>.
          </p>
        </UCard>
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Přetečení"
      description="Položky si berou jen svou šířku; při přetečení se dají odrolovat. Šipky vlevo a vpravo přepínají, Home a End skočí na kraje."
    >
      <PreviewStage min-height="12rem">
        <UCard material="thin" class="w-80">
          <UTabs v-model="many" :items="manyItems" aria-label="Detail zápasu" />
        </UCard>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
