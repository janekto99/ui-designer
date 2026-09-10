<script setup lang="ts">
import {
  buttonSizes,
  buttonVariantNames,
  tones,
  type ButtonSize,
  type ButtonVariant,
  type Tone,
} from '~/components/ui/button.variants'

type Fill = 'label' | 'icon' | 'both'
type State = 'default' | 'disabled' | 'loading'

const variant = ref<ButtonVariant>('glass')
const tone = ref<Tone>('neutral')
const size = ref<ButtonSize>('md')
const fill = ref<Fill>('both')
const state = ref<State>('default')

const variantOptions = buttonVariantNames.map((value) => ({ label: value, value }))
const toneOptions = tones.map((value) => ({ label: value, value }))
const sizeOptions = buttonSizes.map((value) => ({ label: value, value }))

const fillOptions: { label: string, value: Fill }[] = [
  { label: 'Text', value: 'label' },
  { label: 'Ikona', value: 'icon' },
  { label: 'Text + ikona', value: 'both' },
]

const stateOptions: { label: string, value: State }[] = [
  { label: 'Výchozí', value: 'default' },
  { label: 'Disabled', value: 'disabled' },
  { label: 'Loading', value: 'loading' },
]

const preview = computed(() => ({
  label: fill.value === 'icon' ? undefined : 'Pokračovat',
  icon: fill.value === 'label' ? undefined : 'lucide:sparkles',
  disabled: state.value === 'disabled',
  loading: state.value === 'loading',
  ariaLabel: fill.value === 'icon' ? 'Pokračovat' : undefined,
}))

const snippet = computed(() => {
  const attrs = [
    preview.value.label ? `label="${preview.value.label}"` : null,
    preview.value.icon ? `icon="${preview.value.icon}"` : null,
    `variant="${variant.value}"`,
    tone.value === 'neutral' ? null : `tone="${tone.value}"`,
    `size="${size.value}"`,
    preview.value.disabled ? 'disabled' : null,
    preview.value.loading ? 'loading' : null,
    preview.value.ariaLabel ? `aria-label="${preview.value.ariaLabel}"` : null,
  ].filter(Boolean)

  return `<UButton ${attrs.join(' ')} />`
})

/*
 * Tři návrhy dvojice akcí v hlavičce. Tichá akce (`Přihlásit`) je všude
 * `glass` — mění se jen ta hlavní, protože právě o ní se rozhoduje.
 */
const authPairs = [
  { key: 'A', variant: 'solid' as const, tone: 'neutral' as const, note: 'inkoust — nejtišší, drží se katalogu' },
  { key: 'B', variant: 'solid' as const, tone: 'accent' as const, note: 'accent — barva značky, výraznější' },
  { key: 'C', variant: 'brand' as const, tone: 'neutral' as const, note: 'přechod jako logo — nejvýraznější' },
]
</script>

<template>
  <DocPage
    title="Button"
    description="Jedna komponenta, tři obsazení. Text dá pilulku, ikona kruh, obojí pilulku s ikonou vlevo."
  >
    <DocSection
      title="Náhled"
      description="variant říká, jak je prvek udělaný, tone co znamená. Jsou to dvě nezávislé osy — nevratná akce může být tichá i křiklavá podle toho, kde stojí."
    >
      <template #controls>
        <VariantPicker v-model="fill" label="Obsazení" :options="fillOptions" />
        <VariantPicker v-model="variant" label="Varianta" :options="variantOptions" />
        <VariantPicker v-model="tone" label="Tón" :options="toneOptions" />
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="state" label="Stav" :options="stateOptions" />
      </template>

      <PreviewStage>
        <UButton
          :label="preview.label"
          :icon="preview.icon"
          :variant="variant"
          :tone="tone"
          :size="size"
          :disabled="preview.disabled"
          :loading="preview.loading"
          :aria-label="preview.ariaLabel"
        />
      </PreviewStage>

      <pre
        class="vos-recessed mt-4 overflow-x-auto rounded-2xl px-4 py-3 text-footnote text-(--fg-secondary)"
      ><code>{{ snippet }}</code></pre>
    </DocSection>

    <DocSection
      title="Varianta × tón"
      description="Sklo nese barvu jen v textu — obarvit i výplň by z něj udělalo soft. Plná výplň je ve světlém režimu hluboká s bílým textem, v tmavém sytá s černým."
    >
      <PreviewStage min-height="18rem">
        <div class="flex flex-col gap-3">
          <div v-for="v in buttonVariantNames" :key="v" class="flex items-center gap-3">
            <span class="w-16 shrink-0 text-right text-caption-1 text-(--fg-tertiary)">{{ v }}</span>
            <UButton v-for="t in tones" :key="t" :label="t" :variant="v" :tone="t" size="sm" />
          </div>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Dvojice akcí v liště"
      description="Tři návrhy, jak může vypadat Přihlásit + Registrovat v hlavičce webu. Liší se jen tím, co nese hlavní akce — tichá akce je ve všech třech stejná."
    >
      <PreviewStage min-height="16rem">
        <div class="flex flex-col gap-5">
          <div v-for="pair in authPairs" :key="pair.key" class="flex items-center gap-4">
            <span class="w-6 shrink-0 text-right text-caption-1 font-semibold text-(--fg-tertiary)">
              {{ pair.key }}
            </span>
            <div class="flex items-center gap-2.5">
              <UButton label="Přihlásit" variant="glass" size="sm" />
              <UButton
                label="Registrovat"
                :variant="pair.variant"
                :tone="pair.tone"
                size="sm"
              />
            </div>
            <span class="text-caption-1 text-(--fg-tertiary)">{{ pair.note }}</span>
          </div>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="Všechny velikosti">
      <PreviewStage min-height="10rem">
        <UButton
          v-for="s in buttonSizes"
          :key="`icon-${s}`"
          icon="lucide:sparkles"
          :size="s"
          :variant="variant"
          :tone="tone"
          :aria-label="`Ikonové tlačítko ${s}`"
        />
      </PreviewStage>

      <PreviewStage min-height="10rem" class="mt-4">
        <UButton
          v-for="s in buttonSizes"
          :key="`label-${s}`"
          label="Pokračovat"
          icon="lucide:sparkles"
          :size="s"
          :variant="variant"
          :tone="tone"
        />
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
