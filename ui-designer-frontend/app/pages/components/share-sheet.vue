<script setup lang="ts">
const closable = ref(true)
const withPeople = ref(true)
const last = ref<string>()

const closeOptions = [
  { label: 'S křížkem', value: true },
  { label: 'Bez křížku', value: false },
]
const peopleOptions = [
  { label: 'S osobami', value: true },
  { label: 'Bez osob', value: false },
]

const people = [
  { name: 'Jana Nováková' },
  { name: 'Petr Svoboda' },
  { name: 'Eva Dvořáková' },
  { name: 'Tomáš Janek' },
]

const targets = [
  { name: 'AirDrop', icon: 'lucide:radio', color: '#0A84FF' },
  { name: 'Zprávy', icon: 'lucide:message-circle', color: '#32D74B' },
  { name: 'Mail', icon: 'lucide:mail', color: '#5AC8F5' },
  { name: 'Poznámky', icon: 'lucide:notebook-pen', color: '#FFD60A' },
]

const actions = [
  { label: 'Kopírovat', icon: 'lucide:copy' },
  { label: 'Tisknout', icon: 'lucide:printer' },
  { label: 'Duplikovat', icon: 'lucide:copy-plus' },
]

const thumbnail =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
       <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0%" stop-color="%23ffd9a8"/><stop offset="100%" stop-color="%235e5ce6"/>
       </linearGradient></defs>
       <rect width="80" height="80" fill="url(%23g)"/>
     </svg>`,
  )
</script>

<template>
  <DocPage
    title="Share Sheet"
    description="Není to nová hmota, je to sestava — segmentovaný ovladač, avatary a řádky seznamu, které už existují jinde. Tak je poskládaný i ve Figmě."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="closable" label="Zavření" :options="closeOptions" />
        <VariantPicker v-model="withPeople" label="Osoby" :options="peopleOptions" />
      </template>

      <PreviewStage min-height="40rem">
        <UShareSheet
          title="Zápis z porady"
          :thumbnail="thumbnail"
          :closable="closable"
          :people="withPeople ? people : []"
          :targets="targets"
          :actions="actions"
          permission-title="Lidé můžou provádět změny"
          permission-subtitle="Sdílí Tomáš Janek"
          @action="(a) => (last = a.label)"
          @permission="last = 'Oprávnění'"
          @close="last = 'Zavřít'"
          @more="last = 'Další'"
        />
      </PreviewStage>

      <p v-if="last" class="mt-3 text-center text-footnote text-(--fg-secondary)">
        Naposledy stisknuto: {{ last }}
      </p>
    </DocSection>
  </DocPage>
</template>
