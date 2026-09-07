<script setup lang="ts">
import { checkboxSizes, type CheckboxSize } from '~/components/ui/checkbox.variants'

const size = ref<CheckboxSize>('md')
const withLabel = ref(true)
const disabled = ref(false)
const value = ref(true)

const sizeOptions = checkboxSizes.map((v) => ({ label: v, value: v }))
const labelOptions = [
  { label: 'S popiskem', value: true },
  { label: 'Bez popisku', value: false },
]
const stateOptions = [
  { label: 'Výchozí', value: false },
  { label: 'Disabled', value: true },
]
</script>

<template>
  <DocPage
    title="Checkbox"
    description="Ve visionOS je zaškrtávátko kruh, ne čtverec. Není to rádiové tlačítko — kruh je tvar, ne význam."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="withLabel" label="Popisek" :options="labelOptions" />
        <VariantPicker v-model="disabled" label="Stav" :options="stateOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <UCheckbox
          v-model="value"
          :size="size"
          :label="withLabel ? 'Souhlasím' : undefined"
          :disabled="disabled"
          aria-label="Ukázkové zaškrtávátko"
        />
      </PreviewStage>
    </DocSection>

    <DocSection title="Stavy" description="Zaškrtnuto, prázdné a zakázané ve všech velikostech.">
      <PreviewStage min-height="10rem">
        <div v-for="s in checkboxSizes" :key="s" class="flex flex-col items-center gap-3">
          <UCheckbox :model-value="true" :size="s" :aria-label="`Zaškrtnuto ${s}`" />
          <UCheckbox :model-value="false" :size="s" :aria-label="`Prázdné ${s}`" />
          <UCheckbox :model-value="true" :size="s" disabled :aria-label="`Zakázáno ${s}`" />
          <span class="text-caption-1 text-(--fg-tertiary)">{{ s }}</span>
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
