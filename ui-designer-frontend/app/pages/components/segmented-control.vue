<script setup lang="ts">
import { segmentedSizes, type SegmentedSize } from '~/components/ui/segmented.variants'

const size = ref<SegmentedSize>('md')
const count = ref(3)
const disabled = ref(false)
const value = ref('b')

const sizeOptions = segmentedSizes.map((v) => ({ label: v, value: v }))
const countOptions = [2, 3, 4, 5].map((n) => ({ label: String(n), value: n }))
const stateOptions = [
  { label: 'Výchozí', value: false },
  { label: 'Disabled', value: true },
]

const all = [
  { label: 'První', value: 'a' },
  { label: 'Druhý', value: 'b' },
  { label: 'Třetí', value: 'c' },
  { label: 'Čtvrtý', value: 'd' },
  { label: 'Pátý', value: 'e' },
]

const segments = computed(() => all.slice(0, count.value))

watchEffect(() => {
  if (!segments.value.some((s) => s.value === value.value)) value.value = segments.value[0]!.value
})

const perSize = ref<Record<SegmentedSize, string>>({ sm: 'a', md: 'b', lg: 'c' })
const withIcons = ref('grid')
const iconSegments = [
  { label: 'Mřížka', value: 'grid', icon: 'lucide:layout-grid' },
  { label: 'Seznam', value: 'list', icon: 'lucide:list' },
  { label: 'Sloupce', value: 'columns', icon: 'lucide:columns-3' },
]
</script>

<template>
  <DocPage
    title="Segmented Control"
    description="Vybraný segment je světlejší pilulka uvnitř tmavší dráhy, ne plná bílá. Plná bílá patří tlačítku — v řadě segmentů by překřičela okolí."
  >
    <DocSection
      title="Náhled"
      description="Šipkami se přepíná rovnou hodnota, jak se u radiogroup čeká."
    >
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="count" label="Segmentů" :options="countOptions" />
        <VariantPicker v-model="disabled" label="Stav" :options="stateOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <USegmentedControl
          v-model="value"
          :segments="segments"
          :size="size"
          :disabled="disabled"
          aria-label="Ukázkový přepínač"
        />
      </PreviewStage>
    </DocSection>

    <DocSection title="Velikosti">
      <PreviewStage min-height="12rem">
        <div class="flex flex-col items-center gap-4">
          <div v-for="s in segmentedSizes" :key="s" class="flex items-center gap-3">
            <span class="w-6 text-caption-1 text-(--fg-tertiary)">{{ s }}</span>
            <USegmentedControl
              v-model="perSize[s]"
              :segments="all.slice(0, 3)"
              :size="s"
              :aria-label="`Velikost ${s}`"
            />
          </div>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="S ikonami">
      <PreviewStage min-height="10rem">
        <USegmentedControl v-model="withIcons" :segments="iconSegments" aria-label="Zobrazení" />
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
