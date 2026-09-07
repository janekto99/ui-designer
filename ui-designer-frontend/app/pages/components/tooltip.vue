<script setup lang="ts">
type Placement = 'top' | 'bottom' | 'left' | 'right'

const placement = ref<Placement>('top')

const placementOptions: { label: string, value: Placement }[] = [
  { label: 'Nahoře', value: 'top' },
  { label: 'Dole', value: 'bottom' },
  { label: 'Vlevo', value: 'left' },
  { label: 'Vpravo', value: 'right' },
]
</script>

<template>
  <DocPage
    title="Tooltip"
    description="Ve visionOS se objeví, když se na prvek podíváš nebo nad ním podržíš ukazatel. Na webu je nejblíž hover a focus — najeď myší nebo se protabuj."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="placement" label="Umístění" :options="placementOptions" />
      </template>

      <PreviewStage min-height="12rem">
        <UTooltip label="Přidat položku" :placement="placement">
          <UButton icon="lucide:plus" aria-label="Přidat položku" />
        </UTooltip>
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Všechna umístění"
      description="Bublina je v DOMu pořád, jen průhledná — čtečka ji najde přes aria-describedby i bez najetí."
    >
      <PreviewStage min-height="14rem">
        <div class="flex flex-wrap items-center justify-center gap-10">
          <UTooltip v-for="p in placementOptions" :key="p.value" :label="p.label" :placement="p.value">
            <UButton :label="p.label" size="sm" />
          </UTooltip>
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
