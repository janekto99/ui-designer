<script setup lang="ts">
const size = ref<'sm' | 'md' | 'lg'>('md')
const determinate = ref(true)
const value = ref(60)

const sizeOptions = [
  { label: 'sm', value: 'sm' as const },
  { label: 'md', value: 'md' as const },
  { label: 'lg', value: 'lg' as const },
]
const kindOptions = [
  { label: 'Určitý', value: true },
  { label: 'Neurčitý', value: false },
]

const steps = [0, 20, 40, 60, 80, 100]
</script>

<template>
  <DocPage
    title="Progress Bar"
    description="Sdílí dráhu i výplň s posuvníkem — ve Figmě je to vizuálně tentýž prvek bez knoflíku."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="determinate" label="Druh" :options="kindOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <div class="w-96">
          <UProgressBar
            :value="determinate ? value : undefined"
            :size="size"
            aria-label="Průběh"
          />
          <div v-if="determinate" class="mt-6">
            <USlider v-model="value" size="sm" aria-label="Nastavit průběh" />
          </div>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="Stupně">
      <PreviewStage min-height="12rem">
        <div class="flex w-96 flex-col gap-4">
          <div v-for="s in steps" :key="s" class="flex items-center gap-4">
            <span class="w-9 shrink-0 text-right text-caption-1 text-(--fg-tertiary)">{{ s }} %</span>
            <UProgressBar :value="s" :aria-label="`${s} procent`" />
          </div>
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
