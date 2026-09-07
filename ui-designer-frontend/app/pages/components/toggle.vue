<script setup lang="ts">
import { toggleSizes, type ToggleSize } from '~/components/ui/toggle.variants'

const size = ref<ToggleSize>('md')
const disabled = ref(false)
const value = ref(true)

const sizeOptions = toggleSizes.map((v) => ({ label: v, value: v }))
const stateOptions = [
  { label: 'Výchozí', value: false },
  { label: 'Disabled', value: true },
]
</script>

<template>
  <DocPage
    title="Toggle"
    description="Volba mezi dvěma opačnými stavy. Zapnutý je systémová zelená — ve Figmě je to jediná barva, kterou přepínač používá."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="disabled" label="Stav" :options="stateOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <UToggle v-model="value" :size="size" :disabled="disabled" aria-label="Ukázkový přepínač" />
      </PreviewStage>
    </DocSection>

    <DocSection title="Stavy" description="Zapnuto a vypnuto ve všech velikostech, plus zakázaný stav.">
      <PreviewStage min-height="10rem">
        <div v-for="s in toggleSizes" :key="s" class="flex flex-col items-center gap-3">
          <UToggle :model-value="true" :size="s" :aria-label="`Zapnuto ${s}`" />
          <UToggle :model-value="false" :size="s" :aria-label="`Vypnuto ${s}`" />
          <UToggle :model-value="true" :size="s" disabled :aria-label="`Zakázáno ${s}`" />
          <span class="text-caption-1 text-(--fg-tertiary)">{{ s }}</span>
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
