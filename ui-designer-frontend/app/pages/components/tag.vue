<script setup lang="ts">
import { tones, type Tone } from '~/components/ui/button.variants'

const tone = ref<Tone>('neutral')
const solid = ref(false)
const size = ref<'sm' | 'md'>('sm')
const withIcon = ref(false)

const toneOptions = tones.map((t) => ({ label: t, value: t }))
const fillOptions = [
  { label: 'Měkká', value: false },
  { label: 'Plná', value: true },
]
const sizeOptions = [
  { label: 'sm', value: 'sm' as const },
  { label: 'md', value: 'md' as const },
]
const iconOptions = [
  { label: 'Bez ikony', value: false },
  { label: 'S ikonou', value: true },
]
</script>

<template>
  <DocPage
    title="Tag"
    description="Štítek se stavem. Nezaměňovat s Badge: ten je červený počet přilepený k jinému prvku, tohle je popisek stojící sám za sebe. Odtud i jiný tvar."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="tone" label="Tón" :options="toneOptions" />
        <VariantPicker v-model="solid" label="Výplň" :options="fillOptions" />
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="withIcon" label="Ikona" :options="iconOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <UTag
          label="Challenger"
          :tone="tone"
          :solid="solid"
          :size="size"
          :icon="withIcon ? 'lucide:trophy' : undefined"
        />
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Tóny"
      description="Barva jde ze sémantických tokenů, takže „varovný štítek“ a „varovné tlačítko“ berou odstín ze stejného místa."
    >
      <PreviewStage min-height="12rem">
        <div class="flex flex-col gap-4">
          <div class="flex flex-wrap items-center justify-center gap-2">
            <UTag v-for="t in tones" :key="t" :tone="t" :label="t" size="md" />
          </div>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <UTag v-for="t in tones" :key="t" :tone="t" :label="t" size="md" solid />
          </div>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="V praxi">
      <PreviewStage min-height="10rem">
        <div class="flex flex-wrap items-center justify-center gap-2">
          <UTag label="Hard" tone="info" />
          <UTag label="Challenger" />
          <UTag label="8 zápasů" />
          <UTag label="Živě" tone="danger" solid icon="lucide:radio" />
          <UTag label="Dokončeno" tone="success" icon="lucide:check" />
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
