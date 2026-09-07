<script setup lang="ts">
import {
  sliderSizes,
  sliderVariantNames,
  type SliderSize,
  type SliderVariant,
} from '~/components/ui/slider.variants'

const size = ref<SliderSize>('md')
const variant = ref<SliderVariant>('default')
const withIcons = ref(false)
const disabled = ref(false)
const value = ref(40)

const sizeOptions = sliderSizes.map((v) => ({ label: v, value: v }))
const variantOptions = sliderVariantNames.map((v) => ({ label: v, value: v }))
const iconOptions = [
  { label: 'Bez ikon', value: false },
  { label: 'S ikonami', value: true },
]
const stateOptions = [
  { label: 'Výchozí', value: false },
  { label: 'Disabled', value: true },
]

const perSize = ref<Record<SliderSize, number>>({ sm: 20, md: 40, lg: 60, xl: 80 })
const colorValue = ref(55)
const segmentedValue = ref(4)
</script>

<template>
  <DocPage
    title="Slider"
    description="U tenkých dráh sedí knoflík na dráze, u tlustých v ní. To je ve Figmě nejvýraznější rozdíl mezi velikostmi — není to jen jiná výška."
  >
    <DocSection
      title="Náhled"
      description="Ovládá se myší i klávesnicí: šipky po kroku, PageUp/PageDown po desetině rozsahu, Home a End na kraje."
    >
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="variant" label="Varianta" :options="variantOptions" />
        <VariantPicker v-model="withIcons" label="Ikony" :options="iconOptions" />
        <VariantPicker v-model="disabled" label="Stav" :options="stateOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <div class="w-96">
          <USlider
            v-model="value"
            :size="size"
            :variant="variant"
            :step="variant === 'segmented' ? 10 : 1"
            :min-icon="withIcons ? 'lucide:volume-1' : undefined"
            :max-icon="withIcons ? 'lucide:volume-2' : undefined"
            :disabled="disabled"
            aria-label="Ukázkový posuvník"
          />
          <p class="mt-3 text-center text-caption-1 text-(--fg-tertiary)">{{ value }}</p>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="Tloušťky" description="U lg a xl je knoflík uvnitř dráhy.">
      <PreviewStage min-height="14rem">
        <div class="flex w-96 flex-col gap-6">
          <div v-for="s in sliderSizes" :key="s" class="flex items-center gap-4">
            <span class="w-6 shrink-0 text-caption-1 text-(--fg-tertiary)">{{ s }}</span>
            <USlider v-model="perSize[s]" :size="s" :aria-label="`Tloušťka ${s}`" />
          </div>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Barevný a segmentovaný"
      description="U barevného je knoflík prstenec, aby byla barva pod ním vidět. Segmentovaný ukazuje kroky tečkami."
    >
      <PreviewStage min-height="12rem">
        <div class="flex w-96 flex-col gap-8">
          <USlider v-model="colorValue" variant="color" size="lg" aria-label="Barva" />
          <USlider
            v-model="segmentedValue"
            variant="segmented"
            :min="0"
            :max="8"
            :step="1"
            aria-label="Kroky"
          />
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
