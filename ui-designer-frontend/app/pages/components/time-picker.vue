<script setup lang="ts">
const expanded = ref(true)
const ampm = ref(true)
const value = ref(9 * 60 + 41)

const shapeOptions = [
  { label: 'Sbalený', value: false },
  { label: 'Rozbalený', value: true },
]
const formatOptions = [
  { label: '12 h', value: true },
  { label: '24 h', value: false },
]

const compact = ref(14 * 60 + 30)

const label = computed(() => {
  const h = Math.floor(value.value / 60)
  const m = value.value % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
})
</script>

<template>
  <DocPage
    title="Time Picker"
    description="Vybraná hodnota je uprostřed, sousedé blednou. To blednutí je ve Figmě to hlavní, co dělá z rolovacího seznamu kolečko."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="expanded" label="Podoba" :options="shapeOptions" />
        <VariantPicker v-model="ampm" label="Formát" :options="formatOptions" />
      </template>

      <PreviewStage min-height="22rem">
        <div class="flex flex-col items-center gap-4">
          <UTimePicker v-model="value" :expanded="expanded" :ampm="ampm" />
          <span class="text-caption-1 text-(--fg-tertiary)">{{ label }}</span>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="Sbalený">
      <PreviewStage min-height="22rem">
        <UTimePicker v-model="compact" ampm />
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
