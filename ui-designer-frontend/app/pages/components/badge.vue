<script setup lang="ts">
const size = ref<'sm' | 'md'>('md')
const asDot = ref(false)
const value = ref(8)

const sizeOptions = [
  { label: 'sm', value: 'sm' as const },
  { label: 'md', value: 'md' as const },
]
const kindOptions = [
  { label: 'Číslo', value: false },
  { label: 'Tečka', value: true },
]
const valueOptions = [1, 8, 42, 128].map((n) => ({ label: String(n), value: n }))
</script>

<template>
  <DocPage
    title="Badge"
    description="Buď číslo, nebo jen tečka. Vždy systémová červená — v obou režimech stejná, protože význam se režimem nemění."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="asDot" label="Druh" :options="kindOptions" />
        <VariantPicker v-model="value" label="Hodnota" :options="valueOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <UBadge :value="asDot ? undefined : value" :size="size" />
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Přetečení"
      description="Nad 99 se místo přesného čísla ukáže „99+“ — jinak by odznáček přerostl prvek, na kterém sedí."
    >
      <PreviewStage min-height="10rem">
        <div class="flex items-center gap-4">
          <UBadge :value="1" />
          <UBadge :value="42" />
          <UBadge :value="99" />
          <UBadge :value="128" />
          <UBadge :value="5" :max="3" />
          <UBadge />
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="Na jiných prvcích">
      <PreviewStage min-height="10rem">
        <div class="flex items-center gap-8">
          <span class="relative inline-flex">
            <UButton icon="lucide:bell" aria-label="Oznámení" />
            <UBadge :value="3" size="sm" class="absolute -top-1 -right-1" />
          </span>

          <span class="relative inline-flex">
            <UAvatar name="Jana Nováková" />
            <UBadge size="sm" class="absolute -top-0.5 -right-0.5" />
          </span>
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
