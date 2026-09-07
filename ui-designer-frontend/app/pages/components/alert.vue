<script setup lang="ts">
import type { AlertAction } from '~/components/ui/UAlert.vue'

type Shape = 'plain' | 'action' | 'cancel' | 'two' | 'destructive' | 'field' | 'code'

const shape = ref<Shape>('cancel')
const last = ref<string>()

const shapeOptions: { label: string, value: Shape }[] = [
  { label: 'Bez akcí', value: 'plain' },
  { label: 'Jedna akce', value: 'action' },
  { label: 'Akce + Zrušit', value: 'cancel' },
  { label: 'Dvě akce', value: 'two' },
  { label: 'Nevratná', value: 'destructive' },
  { label: 'S polem', value: 'field' },
  { label: 'S kódem', value: 'code' },
]

const actions = computed<AlertAction[]>(() => {
  switch (shape.value) {
    case 'plain': return []
    case 'action': return [{ label: 'Rozumím' }]
    case 'two': return [{ label: 'Uložit' }, { label: 'Neukládat' }, { label: 'Zrušit', role: 'cancel' }]
    case 'destructive': return [{ label: 'Smazat', role: 'destructive' }, { label: 'Zrušit', role: 'cancel' }]
    case 'field':
    case 'code': return [{ label: 'Potvrdit' }, { label: 'Zrušit', role: 'cancel' }]
    default: return [{ label: 'Pokračovat' }, { label: 'Zrušit', role: 'cancel' }]
  }
})

const name = ref('')
const code = ref(['', '', '', '', '', ''])
</script>

<template>
  <DocPage
    title="Alert"
    description="Sedí na materiálu thick — nejneprůhlednějším ze čtyř. Je to jediný prvek, který smí obsah pod sebou skoro zakrýt, protože čeká na rozhodnutí."
  >
    <DocSection
      title="Náhled"
      description="Akce jsou svislé řádky oddělené vlasovou čárou, ne tlačítka vedle sebe."
    >
      <template #controls>
        <VariantPicker v-model="shape" label="Podoba" :options="shapeOptions" />
      </template>

      <PreviewStage min-height="22rem">
        <UAlert
          icon="lucide:image"
          title="Uložit změny?"
          description="Rozpracovaná úprava se jinak ztratí."
          :actions="actions"
          @action="(a) => (last = a.label)"
        >
          <UTextField v-if="shape === 'field'" v-model="name" placeholder="Název" aria-label="Název" />

          <div v-else-if="shape === 'code'" class="flex justify-center gap-2">
            <span
              v-for="(digit, i) in code"
              :key="i"
              class="vos-view-recessed flex size-9 items-center justify-center rounded-xl text-title-3 font-semibold"
            >{{ digit || '·' }}</span>
          </div>
        </UAlert>
      </PreviewStage>

      <p v-if="last" class="mt-3 text-center text-footnote text-(--fg-secondary)">
        Naposledy stisknuto: {{ last }}
      </p>
    </DocSection>

    <DocSection
      title="Role akcí"
      description="Výchozí je tučná, Zrušit světlejší, nevratná červená. Barvu určuje role, ne pořadí."
    >
      <PreviewStage min-height="20rem">
        <UAlert
          icon="lucide:trash-2"
          title="Smazat záznam?"
          description="Tenhle krok se nedá vzít zpět."
          :actions="[
            { label: 'Smazat', role: 'destructive' },
            { label: 'Archivovat' },
            { label: 'Zrušit', role: 'cancel' },
          ]"
        />
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
