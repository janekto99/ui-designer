<script setup lang="ts">
import { fieldSizes, type FieldSize } from '~/components/ui/field.variants'

const size = ref<FieldSize>('md')
const dictating = ref(false)
const disabled = ref(false)
const value = ref('Hledaný výraz')

const sizeOptions = fieldSizes.map((v) => ({ label: v, value: v }))
const dictateOptions = [
  { label: 'Klid', value: false },
  { label: 'Diktování', value: true },
]
const stateOptions = [
  { label: 'Výchozí', value: false },
  { label: 'Disabled', value: true },
]

const empty = ref('')
const filled = ref('Hledaný výraz')
const speaking = ref('')
const off = ref('')
</script>

<template>
  <DocPage
    title="Search Field"
    description="Proti Text Fieldu tři věci navíc: mikrofon, křížek napevno a stav diktování. Ve Figmě je to kvůli nim samostatná komponenta."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="dictating" label="Mikrofon" :options="dictateOptions" />
        <VariantPicker v-model="disabled" label="Stav" :options="stateOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <div class="w-80">
          <USearchField
            v-model="value"
            :size="size"
            :dictating="dictating"
            :disabled="disabled"
          />
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="Stavy">
      <PreviewStage min-height="14rem">
        <div class="flex w-80 flex-col gap-3">
          <USearchField v-model="empty" />
          <USearchField v-model="filled" />
          <USearchField v-model="speaking" dictating placeholder="Mluvte" />
          <USearchField v-model="off" disabled />
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
