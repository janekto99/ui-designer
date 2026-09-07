<script setup lang="ts">
import { fieldSizes, type FieldSize } from '~/components/ui/field.variants'

const size = ref<FieldSize>('md')
const withIcon = ref(false)
const clearable = ref(true)
const disabled = ref(false)
const value = ref('Hodnota')

const sizeOptions = fieldSizes.map((v) => ({ label: v, value: v }))
const iconOptions = [
  { label: 'Bez ikony', value: false },
  { label: 'S ikonou', value: true },
]
const clearOptions = [
  { label: 'S křížkem', value: true },
  { label: 'Bez křížku', value: false },
]
const stateOptions = [
  { label: 'Výchozí', value: false },
  { label: 'Disabled', value: true },
]

const empty = ref('')
const filled = ref('Hodnota')
const off = ref('Hodnota')
</script>

<template>
  <DocPage
    title="Text Field"
    description="Pole je vyhloubené — tmavší než plocha, na které leží. Sklo se nad plochu zvedá, pole se pod ni zapouští."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="withIcon" label="Ikona" :options="iconOptions" />
        <VariantPicker v-model="clearable" label="Mazání" :options="clearOptions" />
        <VariantPicker v-model="disabled" label="Stav" :options="stateOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <div class="w-80">
          <UTextField
            v-model="value"
            placeholder="Hodnota"
            :icon="withIcon ? 'lucide:pencil' : undefined"
            :size="size"
            :clearable="clearable"
            :disabled="disabled"
            aria-label="Ukázkové pole"
          />
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Stavy"
      description="Prázdné, vyplněné a zakázané. Stav pod kurzorem a při zaostření je v CSS, ne v props — je to jen jiná průhlednost téže výplně."
    >
      <PreviewStage min-height="12rem">
        <div class="flex w-80 flex-col gap-3">
          <UTextField v-model="empty" placeholder="Prázdné" aria-label="Prázdné" />
          <UTextField v-model="filled" clearable aria-label="Vyplněné" />
          <UTextField v-model="off" disabled aria-label="Zakázané" />
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
