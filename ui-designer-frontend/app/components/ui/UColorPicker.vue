<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Tři režimy z Figmy: mřížka, spektrum a posuvníky. Nejsou to tři komponenty
 * — je to jeden panel, který přepíná, **jak** se barva zadává. Hodnota je
 * pořád jedna a přepnutí režimu ji nemění.
 */
const props = withDefaults(
  defineProps<{
    /** Uložené barvy pod výběrem. */
    swatches?: string[]
    closable?: boolean
    class?: ClassValue
  }>(),
  { swatches: () => ['#000000', '#0A84FF', '#32D74B', '#FF453A', '#5AC8F5', '#BF5AF2', '#5E5CE6'], closable: false, class: undefined },
)

defineEmits<{ close: [] }>()

const model = defineModel<string>({ default: '#FF5505' })
const opacity = defineModel<number>('opacity', { default: 100 })

const mode = ref('grid')
const modes = [
  { label: 'Mřížka', value: 'grid' },
  { label: 'Spektrum', value: 'spectrum' },
  { label: 'Posuvníky', value: 'sliders' },
]

/* ---------------------------------------------------------------- převody */

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')
  return {
    r: parseInt(clean.slice(0, 2), 16) || 0,
    g: parseInt(clean.slice(2, 4), 16) || 0,
    b: parseInt(clean.slice(4, 6), 16) || 0,
  }
}

const toHex = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0')
const rgbToHex = (r: number, g: number, b: number) => `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()

const rgb = computed(() => hexToRgb(model.value))

const red = computed({ get: () => rgb.value.r, set: (v) => { model.value = rgbToHex(v, rgb.value.g, rgb.value.b) } })
const green = computed({ get: () => rgb.value.g, set: (v) => { model.value = rgbToHex(rgb.value.r, v, rgb.value.b) } })
const blue = computed({ get: () => rgb.value.b, set: (v) => { model.value = rgbToHex(rgb.value.r, rgb.value.g, v) } })

function hslToHex(h: number, s: number, l: number) {
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))
  }
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255)
}

/* ------------------------------------------------------------------ režimy */

/** Mřížka 12 × 10: odstín po sloupcích, světlost po řádcích. */
const gridColors = computed(() =>
  Array.from({ length: 10 }, (_, row) =>
    Array.from({ length: 12 }, (_, col) => {
      if (col === 0) return hslToHex(0, 0, 1 - row / 9)
      return hslToHex(((col - 1) / 11) * 360, 0.85, 0.9 - (row / 9) * 0.75)
    }),
  ),
)

const spectrum = useTemplateRef<HTMLElement>('spectrum')

function pickFromSpectrum(event: PointerEvent) {
  const el = spectrum.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
  model.value = hslToHex(x * 360, 1, 1 - y * 0.9)
}

const rgbSliderTrack = (channel: 'r' | 'g' | 'b') => {
  const { r, g, b } = rgb.value
  const from = channel === 'r' ? `rgb(0,${g},${b})` : channel === 'g' ? `rgb(${r},0,${b})` : `rgb(${r},${g},0)`
  const to = channel === 'r' ? `rgb(255,${g},${b})` : channel === 'g' ? `rgb(${r},255,${b})` : `rgb(${r},${g},255)`
  return `linear-gradient(to right, ${from}, ${to})`
}

/** Šachovnice pod krytím — bez ní není poznat, co průhlednost dělá. */
const checker =
  'repeating-conic-gradient(rgb(0 0 0 / 0.25) 0% 25%, transparent 0% 50%) 50% / 12px 12px'
</script>

<template>
  <div
    :class="cn(
      'vos-view-regular flex w-80 flex-col gap-4 rounded-3xl p-4 shadow-(--panel-shadow)',
      props.class,
    )"
  >
    <div class="flex items-center gap-3">
      <UButton
        v-if="closable"
        icon="lucide:x"
        size="sm"
        aria-label="Zavřít"
        @click="$emit('close')"
      />
      <span class="flex-1 text-center text-headline font-semibold">Barva</span>
      <span v-if="closable" class="size-8" />
    </div>

    <USegmentedControl v-model="mode" :segments="modes" block size="sm" aria-label="Režim výběru" />

    <div v-if="mode === 'grid'" class="grid grid-cols-12 gap-0.5 overflow-hidden rounded-xl">
      <button
        v-for="(color, i) in gridColors.flat()"
        :key="i"
        type="button"
        class="aspect-square cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
        :class="color === model && 'ring-2 ring-white'"
        :style="{ backgroundColor: color }"
        :aria-label="color"
        @click="model = color"
      />
    </div>

    <div
      v-else-if="mode === 'spectrum'"
      ref="spectrum"
      class="h-44 cursor-crosshair rounded-xl"
      style="background:
        linear-gradient(to bottom, transparent, #000),
        linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"
      @pointerdown="pickFromSpectrum"
    />

    <div v-else class="flex flex-col gap-3">
      <div v-for="ch in (['r', 'g', 'b'] as const)" :key="ch" class="flex flex-col gap-1">
        <span class="text-footnote text-(--fg-secondary)">
          {{ ch === 'r' ? 'Červená' : ch === 'g' ? 'Zelená' : 'Modrá' }}
        </span>
        <div class="flex items-center gap-2">
          <USlider
            :model-value="ch === 'r' ? red : ch === 'g' ? green : blue"
            :min="0"
            :max="255"
            size="lg"
            variant="color"
            :gradient="rgbSliderTrack(ch)"
            :aria-label="ch"
            @update:model-value="(v) => { if (ch === 'r') red = v; else if (ch === 'g') green = v; else blue = v }"
          />
          <span class="vos-view-recessed w-14 shrink-0 rounded-lg py-1 text-center text-footnote">
            {{ ch === 'r' ? red : ch === 'g' ? green : blue }}
          </span>
        </div>
      </div>

      <div class="flex items-center justify-between gap-2">
        <span class="text-footnote text-(--fg-secondary)">RGB Hex</span>
        <span class="vos-view-recessed rounded-lg px-3 py-1 text-footnote">{{ model.slice(1) }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <span class="text-footnote text-(--fg-secondary)">Krytí</span>
      <div class="flex items-center gap-2">
        <div class="flex-1 rounded-full" :style="{ background: checker }">
          <USlider
            v-model="opacity"
            :min="0"
            :max="100"
            size="lg"
            variant="color"
            :gradient="`linear-gradient(to right, transparent, ${model})`"
            aria-label="Krytí"
          />
        </div>
        <span class="vos-view-recessed w-14 shrink-0 rounded-lg py-1 text-center text-footnote">
          {{ opacity }} %
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <span
        class="size-11 shrink-0 rounded-xl"
        :style="{ backgroundColor: model, opacity: opacity / 100 }"
        :aria-label="`Vybráno ${model}`"
        role="img"
      />
      <button
        v-for="swatch in swatches"
        :key="swatch"
        type="button"
        class="size-7 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
        :class="swatch === model && 'ring-2 ring-white'"
        :style="{ backgroundColor: swatch }"
        :aria-label="swatch"
        @click="model = swatch"
      />
    </div>
  </div>
</template>
