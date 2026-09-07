<script setup lang="ts">
type Size = 'xs' | 'sm' | 'md' | 'lg'

const size = ref<Size>('md')
const withBadge = ref(false)
const withImage = ref(false)

const sizeOptions: { label: string, value: Size }[] = [
  { label: 'xs', value: 'xs' },
  { label: 'sm', value: 'sm' },
  { label: 'md', value: 'md' },
  { label: 'lg', value: 'lg' },
]
const badgeOptions = [
  { label: 'Bez odznáčku', value: false },
  { label: 'S odznáčkem', value: true },
]
const imageOptions = [
  { label: 'Iniciály', value: false },
  { label: 'Obrázek', value: true },
]

/**
 * Schválně nefunkční obrázek — ukazuje, že se komponenta při chybě načtení
 * vrátí k iniciálám a nezůstane po ní prázdné místo. Je to `data:` adresa
 * s poškozeným obsahem, ne 404 na server: nemá smysl kvůli ukázce střílet
 * požadavek, který stejně nemůže projít.
 */
const brokenSrc = 'data:image/png;base64,TotoNeniObrazek'
</script>

<template>
  <DocPage
    title="Avatar"
    description="Kruhový portrét. Když obrázek chybí nebo se nenačte, zbydou iniciály — ve Figmě je avatar vždy kruh."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="withImage" label="Obsah" :options="imageOptions" />
        <VariantPicker v-model="withBadge" label="Odznáček" :options="badgeOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <UAvatar
          name="Jana Nováková"
          :size="size"
          :src="withImage ? brokenSrc : undefined"
          :badge-icon="withBadge ? 'lucide:radio' : undefined"
        />
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Velikosti"
      description="Obrázek je schválně rozbitá adresa — komponenta se vrátí k iniciálám místo prázdného místa."
    >
      <PreviewStage min-height="10rem">
        <div class="flex items-end gap-6">
          <div v-for="s in sizeOptions" :key="s.value" class="flex flex-col items-center gap-2">
            <UAvatar name="Jana Nováková" :size="s.value" :src="brokenSrc" />
            <span class="text-caption-1 text-(--fg-tertiary)">{{ s.label }}</span>
          </div>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="Ve skupině">
      <PreviewStage min-height="10rem">
        <div class="flex items-center gap-3">
          <UAvatar name="Jana Nováková" badge-icon="lucide:radio" />
          <UAvatar name="Petr Svoboda" />
          <UAvatar name="Eva Dvořáková" />
          <UAvatar name="Tomáš Janek" />
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
