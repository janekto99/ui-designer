<script setup lang="ts">
type Material = 'thin' | 'regular' | 'thick' | 'glass' | 'recessed'

const material = ref<Material>('thin')
const padding = ref<'none' | 'sm' | 'md' | 'lg'>('md')
const interactive = ref(false)

const materialOptions: { label: string, value: Material }[] = [
  { label: 'thin', value: 'thin' },
  { label: 'regular', value: 'regular' },
  { label: 'thick', value: 'thick' },
  { label: 'glass', value: 'glass' },
  { label: 'recessed', value: 'recessed' },
]
const paddingOptions = [
  { label: 'none', value: 'none' as const },
  { label: 'sm', value: 'sm' as const },
  { label: 'md', value: 'md' as const },
  { label: 'lg', value: 'lg' as const },
]
const interactiveOptions = [
  { label: 'Statická', value: false },
  { label: 'Klikací', value: true },
]

const scale: { material: Material, use: string }[] = [
  { material: 'thin', use: 'plocha pod obsahem — seznam, filtry' },
  { material: 'regular', use: 'vrstva nad obsahem — menu, panel' },
  { material: 'thick', use: 'musí se číst i nad rušným pozadím — data, alert' },
  { material: 'glass', use: 'ovládací prvek, ne plocha' },
  { material: 'recessed', use: 'vyhloubené místo, do kterého se něco sází' },
]
</script>

<template>
  <DocPage
    title="Card"
    description="Plocha, na které něco leží. Materiál se volí podle toho, co je pod ní — ne podle důležitosti obsahu."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="material" label="Materiál" :options="materialOptions" />
        <VariantPicker v-model="padding" label="Odsazení" :options="paddingOptions" />
        <VariantPicker v-model="interactive" label="Chování" :options="interactiveOptions" />
      </template>

      <PreviewStage min-height="14rem">
        <UCard :material="material" :padding="padding" :interactive="interactive" class="w-80">
          <p class="text-headline font-semibold">Challenger Phan Thiet</p>
          <p class="mt-1 text-callout text-(--fg-secondary)">
            Osm zápasů, tvrdý povrch, Vietnam.
          </p>
        </UCard>
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Škála materiálů"
      description="Číselná data patří na thick. Sklo je na tom, co se překrývá, ne na tom, co se čte."
    >
      <PreviewStage min-height="26rem">
        <div class="flex w-full max-w-lg flex-col gap-3">
          <UCard v-for="item in scale" :key="item.material" :material="item.material" padding="sm">
            <p class="text-callout font-semibold">{{ item.material }}</p>
            <p class="text-footnote text-(--fg-secondary)">{{ item.use }}</p>
          </UCard>
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
