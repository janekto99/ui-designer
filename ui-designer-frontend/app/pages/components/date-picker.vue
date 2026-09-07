<script setup lang="ts">
const expanded = ref(true)
const value = ref(new Date(2026, 5, 5))

const shapeOptions = [
  { label: 'Sbalený', value: false },
  { label: 'Rozbalený', value: true },
]

const compact = ref(new Date(2026, 5, 5))
</script>

<template>
  <DocPage
    title="Date Picker"
    description="Dvě podoby: tlačítko s datem a rozbalený kalendář. Ve Figmě jsou to dvě komponenty, tady jeden prvek — obsah je totožný."
  >
    <DocSection
      title="Náhled"
      description="Týden začíná pondělím, protože je to česká lokalizace. Intl to samo neřeší, posun se počítá ručně."
    >
      <template #controls>
        <VariantPicker v-model="expanded" label="Podoba" :options="shapeOptions" />
      </template>

      <PreviewStage min-height="26rem">
        <div class="flex flex-col items-center gap-4">
          <UDatePicker v-model="value" :expanded="expanded" />
          <span class="text-caption-1 text-(--fg-tertiary)">
            {{ value.toLocaleDateString('cs-CZ', { dateStyle: 'full' }) }}
          </span>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Sbalený"
      description="Tlačítko otevře kalendář pod sebou — klikni na něj."
    >
      <PreviewStage min-height="26rem">
        <UDatePicker v-model="compact" />
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
