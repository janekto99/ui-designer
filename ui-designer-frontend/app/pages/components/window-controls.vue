<script setup lang="ts">
const withTitle = ref(true)
const share = ref<'shared' | 'not-shared'>('not-shared')
const recording = ref(false)

const titleOptions = [
  { label: 'S názvem', value: true },
  { label: 'Bez názvu', value: false },
]
const shareOptions = [
  { label: 'Nesdíleno', value: 'not-shared' as const },
  { label: 'Sdíleno', value: 'shared' as const },
]
const recordOptions = [
  { label: 'Klid', value: false },
  { label: 'Nahrává se', value: true },
]
</script>

<template>
  <DocPage
    title="Window Controls"
    description="Rám okna: zavření vlevo, úchyt dole, táhla v rozích. Na webu tohle nemá obdobu — prohlížeč si okno řídí sám. Z celé stránky se v aplikaci hodí nanejvýš odznak s názvem dokumentu."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="withTitle" label="Název" :options="titleOptions" />
        <VariantPicker v-model="share" label="SharePlay" :options="shareOptions" />
        <VariantPicker v-model="recording" label="Soukromí" :options="recordOptions" />
      </template>

      <PreviewStage min-height="26rem">
        <UWindowControls
          :document-title="withTitle ? 'Zápis z porady' : undefined"
          :share-status="share"
          :recording="recording"
        >
          <div class="flex h-56 w-96 items-center justify-center">
            <span class="text-callout text-(--fg-secondary)">Obsah okna</span>
          </div>
        </UWindowControls>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
