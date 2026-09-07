<script setup lang="ts">
import {
  buttonSizes,
  buttonVariantNames,
  type ButtonSize,
  type ButtonVariant,
} from '~/components/ui/button.variants'

type Fill = 'label' | 'icon' | 'both'
type State = 'default' | 'disabled' | 'loading'

const variant = ref<ButtonVariant>('glass')
const size = ref<ButtonSize>('md')
const fill = ref<Fill>('both')
const state = ref<State>('default')

const variantOptions = buttonVariantNames.map((value) => ({ label: value, value }))
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
  variant: variant.value,
  size: size.value,
  disabled: state.value === 'disabled',
  loading: state.value === 'loading',
  ariaLabel: fill.value === 'icon' ? 'Pokračovat' : undefined,
}))

const snippet = computed(() => {
  const attrs = [
    preview.value.label ? `label="${preview.value.label}"` : null,
    preview.value.icon ? `icon="${preview.value.icon}"` : null,
    `variant="${variant.value}"`,
    `size="${size.value}"`,
    preview.value.disabled ? 'disabled' : null,
    preview.value.loading ? 'loading' : null,
    preview.value.ariaLabel ? `aria-label="${preview.value.ariaLabel}"` : null,
  ].filter(Boolean)

  return `<UButton ${attrs.join(' ')} />`
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <section class="vos-panel rounded-3xl p-6">
      <header class="mb-6">
        <h1 class="text-title-1 font-semibold">Button</h1>
        <p class="mt-1 text-callout text-(--fg-secondary)">
          Jedna komponenta, tři obsazení. Text dá pilulku, ikona kruh, obojí pilulku s ikonou vlevo.
        </p>
      </header>

      <div class="mb-6 flex flex-wrap gap-x-8 gap-y-3">
        <VariantPicker v-model="fill" label="Obsazení" :options="fillOptions" />
        <VariantPicker v-model="variant" label="Varianta" :options="variantOptions" />
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="state" label="Stav" :options="stateOptions" />
      </div>

      <PreviewStage>
        <UButton
          :label="preview.label"
          :icon="preview.icon"
          :variant="preview.variant"
          :size="preview.size"
          :disabled="preview.disabled"
          :loading="preview.loading"
          :aria-label="preview.ariaLabel"
        />
      </PreviewStage>

      <pre
        class="vos-recessed mt-4 overflow-x-auto rounded-2xl px-4 py-3 text-footnote text-(--fg-secondary)"
      ><code>{{ snippet }}</code></pre>
    </section>

    <section class="vos-panel rounded-3xl p-6">
      <h2 class="text-title-3 font-semibold">Všechny velikosti</h2>
      <p class="mt-1 mb-4 text-footnote text-(--fg-secondary)">
        Ikonové tlačítko je kruh v 28 · 32 · 44 · 52 · 64 px, textové pilulka o téže výšce.
      </p>

      <PreviewStage min-height="10rem">
        <UButton
          v-for="s in buttonSizes"
          :key="`icon-${s}`"
          icon="lucide:sparkles"
          :size="s"
          :variant="variant"
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
        />
      </PreviewStage>
    </section>

    <section class="vos-panel rounded-3xl p-6">
      <h2 class="text-title-3 font-semibold">Všechny varianty</h2>
      <p class="mt-1 mb-4 text-footnote text-(--fg-secondary)">
        <code>plain</code> nemá podložku a sklo se objeví až pod kurzorem, <code>glass</code> ji má
        pořád, <code>selected</code> je plná neprůhledná výplň s obráceným textem.
      </p>

      <PreviewStage min-height="10rem">
        <div v-for="v in buttonVariantNames" :key="v" class="flex flex-col items-center gap-2">
          <UButton :label="v" icon="lucide:sparkles" :variant="v" :size="size" />
          <span class="text-caption-1 text-(--fg-tertiary)">{{ v }}</span>
        </div>
      </PreviewStage>
    </section>
  </div>
</template>
