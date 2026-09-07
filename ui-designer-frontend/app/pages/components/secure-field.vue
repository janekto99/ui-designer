<script setup lang="ts">
import { fieldSizes, type FieldSize } from '~/components/ui/field.variants'

const size = ref<FieldSize>('md')
const disabled = ref(false)
const value = ref('tajneheslo')

const sizeOptions = fieldSizes.map((v) => ({ label: v, value: v }))
const stateOptions = [
  { label: 'Výchozí', value: false },
  { label: 'Disabled', value: true },
]

const empty = ref('')
const filled = ref('tajneheslo')
const off = ref('tajneheslo')
</script>

<template>
  <DocPage
    title="Secure Field"
    description="Stejná kostra jako Text Field, jen zamaskovaný obsah. Tečky vykresluje prohlížeč, ne komponenta."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="disabled" label="Stav" :options="stateOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <div class="w-80">
          <USecureField v-model="value" :size="size" :disabled="disabled" />
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="Stavy">
      <PreviewStage min-height="12rem">
        <div class="flex w-80 flex-col gap-3">
          <USecureField v-model="empty" placeholder="Heslo" />
          <USecureField v-model="filled" />
          <USecureField v-model="off" disabled />
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
