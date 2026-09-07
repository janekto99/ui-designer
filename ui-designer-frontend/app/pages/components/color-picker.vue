<script setup lang="ts">
const closable = ref(true)
const color = ref('#FF5505')
const opacity = ref(100)

const closeOptions = [
  { label: 'S křížkem', value: true },
  { label: 'Bez křížku', value: false },
]
</script>

<template>
  <DocPage
    title="Color Picker"
    description="Tři režimy z Figmy: mřížka, spektrum a posuvníky. Nejsou to tři komponenty — je to jeden panel, který přepíná, jak se barva zadává. Hodnota zůstává jedna."
  >
    <DocSection
      title="Náhled"
      description="Přepni režim uvnitř panelu a všimni si, že vybraná barva zůstane. To je to podstatné — režim mění zadávání, ne hodnotu."
    >
      <template #controls>
        <VariantPicker v-model="closable" label="Zavření" :options="closeOptions" />
      </template>

      <PreviewStage min-height="36rem">
        <div class="flex flex-col items-center gap-4">
          <UColorPicker v-model="color" v-model:opacity="opacity" :closable="closable" />
          <span class="text-caption-1 text-(--fg-tertiary)">{{ color }} · {{ opacity }} %</span>
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
