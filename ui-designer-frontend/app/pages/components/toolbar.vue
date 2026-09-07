<script setup lang="ts">
import type { ToolbarItem } from '~/components/ui/UToolbar.vue'

const kind = ref<'icons' | 'text'>('icons')
const count = ref(4)
const active = ref(0)

const kindOptions = [
  { label: 'Ikony', value: 'icons' as const },
  { label: 'Text', value: 'text' as const },
]
const countOptions = [2, 3, 4, 5, 6, 8].map((n) => ({ label: String(n), value: n }))

const icons = [
  'lucide:pencil', 'lucide:eraser', 'lucide:shapes', 'lucide:type',
  'lucide:image', 'lucide:ruler', 'lucide:palette', 'lucide:layers',
]
const labels = ['Kreslit', 'Mazat', 'Tvary', 'Text', 'Obrázek', 'Míra', 'Barvy', 'Vrstvy']

const items = computed<ToolbarItem[]>(() =>
  Array.from({ length: count.value }, (_, i) => ({
    icon: icons[i],
    label: kind.value === 'text' ? labels[i] : undefined,
    active: i === active.value,
  })),
)
</script>

<template>
  <DocPage
    title="Toolbar"
    description="Plovoucí pilulka s nástroji. Ve Figmě roste po 60 px na položku a drží výšku 44 — proto nemá velikosti, toolbar má ve visionOS jednu."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="kind" label="Obsazení" :options="kindOptions" />
        <VariantPicker v-model="count" label="Položek" :options="countOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <UToolbar :items="items" aria-label="Nástroje" @select="(_, i) => (active = i)" />
      </PreviewStage>
    </DocSection>

    <DocSection title="Šířky" description="Dvě až osm položek, jak je to v kitu vykreslené.">
      <PreviewStage min-height="18rem">
        <div class="flex flex-col items-center gap-3">
          <UToolbar
            v-for="n in [2, 3, 4, 5, 6, 7, 8]"
            :key="n"
            :items="icons.slice(0, n).map((icon, i) => ({ icon, active: i === 0 }))"
            :aria-label="`${n} nástrojů`"
          />
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
