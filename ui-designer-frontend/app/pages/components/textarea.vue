<script setup lang="ts">
const autoGrow = ref(true)
const counter = ref(true)
const disabled = ref(false)
const value = ref('Kumasaka má na tvrdém povrchu lepší formu, ale Borisiouk vede ve vzájemných zápasech 2:1.')

const growOptions = [
  { label: 'Roste s obsahem', value: true },
  { label: 'Pevná výška', value: false },
]
const counterOptions = [
  { label: 'S počítadlem', value: true },
  { label: 'Bez počítadla', value: false },
]
const stateOptions = [
  { label: 'Výchozí', value: false },
  { label: 'Disabled', value: true },
]

const short = ref('')
const limited = ref('Krátká poznámka')
</script>

<template>
  <DocPage
    title="Textarea"
    description="Stejné vyhloubení jako Text Field, jen hranatější — pilulka o čtyřech řádcích už není pilulka."
  >
    <DocSection
      title="Náhled"
      description="Posuvník uvnitř pole je horší než delší pole: skryje text, který uživatel právě napsal."
    >
      <template #controls>
        <VariantPicker v-model="autoGrow" label="Výška" :options="growOptions" />
        <VariantPicker v-model="counter" label="Počítadlo" :options="counterOptions" />
        <VariantPicker v-model="disabled" label="Stav" :options="stateOptions" />
      </template>

      <PreviewStage min-height="16rem">
        <div class="w-96">
          <UTextarea
            v-model="value"
            :auto-grow="autoGrow"
            :counter="counter"
            :disabled="disabled"
            placeholder="Poznámka k zápasu"
            aria-label="Poznámka"
          />
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="Stavy">
      <PreviewStage min-height="20rem">
        <div class="flex w-96 flex-col gap-4">
          <UTextarea v-model="short" placeholder="Prázdné" aria-label="Prázdné" />
          <UTextarea v-model="limited" counter :maxlength="80" aria-label="S limitem" />
          <UTextarea v-model="limited" disabled aria-label="Zakázané" />
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
