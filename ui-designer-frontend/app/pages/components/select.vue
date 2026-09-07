<script setup lang="ts">
import {
  selectSizes,
  selectVariantNames,
  type SelectSize,
  type SelectVariant,
} from '~/components/ui/select.variants'

const variant = ref<SelectVariant>('glass')
const size = ref<SelectSize>('md')
const disabled = ref(false)
const value = ref<string | undefined>('praha')

const variantOptions = selectVariantNames.map((v) => ({ label: v, value: v }))
const sizeOptions = selectSizes.map((v) => ({ label: v, value: v }))
const stateOptions = [
  { label: 'Výchozí', value: false },
  { label: 'Disabled', value: true },
]

const cities = [
  { label: 'Praha', value: 'praha' },
  { label: 'Brno', value: 'brno' },
  { label: 'Ostrava', value: 'ostrava' },
  { label: 'Plzeň', value: 'plzen', disabled: true },
  { label: 'Olomouc', value: 'olomouc' },
]

const perVariant = ref<Record<string, string | undefined>>({
  plain: 'praha',
  glass: 'brno',
  selected: 'ostrava',
})
</script>

<template>
  <DocPage
    title="Select"
    description="Ve Figmě „Drop Down Button“ — je to tlačítko se šipkou, ne vstupní pole. Proto sdílí stavy skla s Buttonem."
  >
    <DocSection
      title="Náhled"
      description="Nabídka jde ovládat klávesnicí: šipky, Home, End, Enter, Escape. Zakázané položky se přeskakují."
    >
      <template #controls>
        <VariantPicker v-model="variant" label="Varianta" :options="variantOptions" />
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="disabled" label="Stav" :options="stateOptions" />
      </template>

      <PreviewStage min-height="16rem">
        <USelect
          v-model="value"
          :options="cities"
          :variant="variant"
          :size="size"
          :disabled="disabled"
          aria-label="Město"
        />
      </PreviewStage>
    </DocSection>

    <DocSection title="Varianty">
      <PreviewStage min-height="14rem">
        <div v-for="v in selectVariantNames" :key="v" class="flex flex-col items-center gap-2">
          <USelect
            v-model="perVariant[v]"
            :options="cities"
            :variant="v"
            :aria-label="`Město ${v}`"
          />
          <span class="text-caption-1 text-(--fg-tertiary)">{{ v }}</span>
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
