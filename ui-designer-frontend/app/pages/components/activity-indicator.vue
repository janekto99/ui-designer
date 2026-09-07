<script setup lang="ts">
const size = ref<'sm' | 'md' | 'lg'>('md')

const sizeOptions = [
  { label: 'sm', value: 'sm' as const },
  { label: 'md', value: 'md' as const },
  { label: 'lg', value: 'lg' as const },
]
</script>

<template>
  <DocPage
    title="Activity Indicator"
    description="Osm paprsků, které skáčou po krocích — ne plynule točící se kolečko. Plynulá rotace vypadá jako web, skoková jako systém."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <UActivityIndicator :size="size" />
      </PreviewStage>
    </DocSection>

    <DocSection title="Velikosti">
      <PreviewStage min-height="10rem">
        <div v-for="s in (['sm', 'md', 'lg'] as const)" :key="s" class="flex flex-col items-center gap-3">
          <UActivityIndicator :size="s" />
          <span class="text-caption-1 text-(--fg-tertiary)">{{ s }}</span>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="V tlačítku" description="Tlačítko má stav loading, který ukazuje totéž.">
      <PreviewStage min-height="10rem">
        <UButton label="Ukládá se" loading />
        <UButton icon="lucide:save" loading aria-label="Ukládá se" />
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
