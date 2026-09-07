<script setup lang="ts">
import type { SidebarSection } from '~/components/ui/USidebar.vue'

const searchable = ref(true)
const editable = ref(true)
const value = ref('vse')
const query = ref('')

const searchOptions = [
  { label: 'S hledáním', value: true },
  { label: 'Bez hledání', value: false },
]
const editOptions = [
  { label: 'S Upravit', value: true },
  { label: 'Bez Upravit', value: false },
]

const sections: SidebarSection<string>[] = [
  {
    items: [
      { label: 'Vše', value: 'vse', icon: 'lucide:inbox', count: 42 },
      { label: 'Nepřečtené', value: 'neprectene', icon: 'lucide:mail', count: 7 },
      { label: 'S hvězdičkou', value: 'hvezdicka', icon: 'lucide:star' },
    ],
  },
  {
    heading: 'Projekty',
    items: [
      { label: 'Tenis', value: 'tenis', icon: 'lucide:circle-dot', count: 12 },
      { label: 'Fotbal', value: 'fotbal', icon: 'lucide:circle' },
      { label: 'Archiv', value: 'archiv', icon: 'lucide:archive' },
    ],
  },
  {
    heading: 'Štítky',
    items: [
      { label: 'Důležité', value: 'dulezite', icon: 'lucide:tag' },
      { label: 'Později', value: 'pozdeji', icon: 'lucide:clock' },
    ],
  },
]
</script>

<template>
  <DocPage
    title="Sidebar"
    description="Sedí na materiálu thin — nejlehčím ze čtyř, protože je to plocha pod obsahem, ne nad ním. Sekce s nadpisem se dají sbalit."
  >
    <DocSection
      title="Náhled"
      description="Hledání filtruje napříč sekcemi a prázdné sekce vypadnou. Klikni na nadpis sekce, sbalí se."
    >
      <template #controls>
        <VariantPicker v-model="searchable" label="Hledání" :options="searchOptions" />
        <VariantPicker v-model="editable" label="Úpravy" :options="editOptions" />
      </template>

      <PreviewStage min-height="32rem">
        <USidebar
          v-model="value"
          v-model:query="query"
          title="Pošta"
          :sections="sections"
          :searchable="searchable"
          :editable="editable"
        />
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
