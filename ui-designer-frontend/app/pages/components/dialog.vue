<script setup lang="ts">
const size = ref<'sm' | 'md' | 'lg'>('md')
const closable = ref(true)
const dismissible = ref(true)

const sizeOptions = [
  { label: 'sm', value: 'sm' as const },
  { label: 'md', value: 'md' as const },
  { label: 'lg', value: 'lg' as const },
]
const closeOptions = [
  { label: 'S křížkem', value: true },
  { label: 'Bez křížku', value: false },
]
const dismissOptions = [
  { label: 'Escape zavírá', value: true },
  { label: 'Nutné rozhodnutí', value: false },
]

const open = ref(false)
const formOpen = ref(false)

const name = ref('')
const note = ref('')
const last = ref<string>()
</script>

<template>
  <DocPage
    title="Dialog"
    description="Proti Alertu — ta je jen karta — tohle navíc drží fokus uvnitř, po zavření ho vrátí na spouštěč a zamkne rolování pozadí. Bez toho je modál jen div s překryvem."
  >
    <DocSection
      title="Náhled"
      description="Otevři a zkus tabovat. Fokus se za poslední prvek nedostane, Escape zavře a kurzor se vrátí na tlačítko, ze kterého dialog vyšel."
    >
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="closable" label="Křížek" :options="closeOptions" />
        <VariantPicker v-model="dismissible" label="Zavírání" :options="dismissOptions" />
      </template>

      <PreviewStage min-height="12rem">
        <UButton label="Otevřít dialog" variant="solid" tone="accent" @click="open = true" />
      </PreviewStage>

      <UDialog
        v-model="open"
        :size="size"
        :closable="closable"
        :close-on-escape="dismissible"
        :close-on-overlay="dismissible"
        title="Smazat uložený filtr?"
        description="Filtr „Challenger tvrdý povrch“ se odstraní ze všech zařízení."
      >
        <p class="text-callout text-(--fg-secondary)">
          Tenhle krok se nedá vzít zpět. Zápasy zůstanou, zmizí jen uložené zúžení.
        </p>

        <template #footer>
          <UButton label="Zrušit" variant="glass" @click="open = false" />
          <UButton
            label="Smazat"
            variant="solid"
            tone="danger"
            @click="last = 'Smazat'; open = false"
          />
        </template>
      </UDialog>
    </DocSection>

    <DocSection
      title="S formulářem"
      description="Fokus skočí na první pole samo — uživatel klávesnice nemusí hledat, kde začít."
    >
      <PreviewStage min-height="12rem">
        <UButton label="Uložit filtr" icon="lucide:bookmark" @click="formOpen = true" />
      </PreviewStage>

      <UDialog v-model="formOpen" title="Uložit filtr" size="md">
        <div class="flex flex-col gap-4">
          <UTextField v-model="name" placeholder="Název filtru" aria-label="Název filtru" />
          <UTextarea v-model="note" placeholder="Poznámka" :rows="3" aria-label="Poznámka" />
          <UCheckbox label="Připnout do postranního panelu" />
        </div>

        <template #footer>
          <UButton label="Zrušit" variant="glass" @click="formOpen = false" />
          <UButton
            label="Uložit"
            variant="solid"
            tone="accent"
            @click="last = `Uloženo: ${name || 'bez názvu'}`; formOpen = false"
          />
        </template>
      </UDialog>

      <p v-if="last" class="mt-3 text-center text-footnote text-(--fg-secondary)">
        Naposledy: {{ last }}
      </p>
    </DocSection>
  </DocPage>
</template>
