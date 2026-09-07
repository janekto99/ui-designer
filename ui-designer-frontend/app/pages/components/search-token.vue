<script setup lang="ts">
const size = ref<'sm' | 'md'>('md')
const selected = ref(false)
const removable = ref(false)
const disabled = ref(false)

const sizeOptions = [
  { label: 'sm', value: 'sm' as const },
  { label: 'md', value: 'md' as const },
]
const selectedOptions = [
  { label: 'Nevybraný', value: false },
  { label: 'Vybraný', value: true },
]
const removeOptions = [
  { label: 'Bez křížku', value: false },
  { label: 'S křížkem', value: true },
]
const stateOptions = [
  { label: 'Výchozí', value: false },
  { label: 'Disabled', value: true },
]

const tokens = ref(['Tenis', 'Praha', '2026'])

function remove(token: string) {
  tokens.value = tokens.value.filter((t) => t !== token)
}
</script>

<template>
  <DocPage
    title="Search Token"
    description="Štítek ve vyhledávacím poli. Od tlačítka se liší jen tvarem — zaoblený obdélník místo pilulky."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="selected" label="Výběr" :options="selectedOptions" />
        <VariantPicker v-model="removable" label="Odebrání" :options="removeOptions" />
        <VariantPicker v-model="disabled" label="Stav" :options="stateOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <USearchToken
          label="Štítek"
          :size="size"
          :selected="selected"
          :removable="removable"
          :disabled="disabled"
        />
      </PreviewStage>
    </DocSection>

    <DocSection
      title="V řadě"
      description="Křížek štítek opravdu odebere — obnovíš ho přepnutím stránky."
    >
      <PreviewStage min-height="10rem">
        <USearchToken
          v-for="token in tokens"
          :key="token"
          :label="token"
          removable
          @remove="remove(token)"
        />
        <span v-if="!tokens.length" class="text-callout text-(--fg-tertiary)">
          Všechny štítky odebrané.
        </span>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
