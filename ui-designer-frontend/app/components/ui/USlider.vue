<script setup lang="ts">
import { slider, knobIsInside, type SliderSize, type SliderVariant } from './slider.variants'
import type { ClassValue } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    size?: SliderSize
    variant?: SliderVariant
    disabled?: boolean
    /** Ikony na krajích — ve Figmě „Min/Max Labels". */
    minIcon?: string
    maxIcon?: string
    /** Přechod pro variantu `color`. Výchozí je červená → modrá jako v kitu. */
    gradient?: string
    ariaLabel?: string
    class?: ClassValue
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    variant: 'default',
    disabled: false,
    minIcon: undefined,
    maxIcon: undefined,
    gradient: 'linear-gradient(to right, #FF3B30, #BF5AF2, #0A84FF)',
    ariaLabel: undefined,
    class: undefined,
  },
)

const model = defineModel<number>({ default: 50 })

const track = useTemplateRef<HTMLElement>('track')
const dragging = ref(false)

const inside = computed(() => knobIsInside(props.size))
const ui = computed(() =>
  slider({
    size: props.size,
    inside: inside.value,
    variant: props.variant,
    disabled: props.disabled,
  }),
)

const ratio = computed(() => {
  const span = props.max - props.min
  if (span <= 0) return 0
  return Math.min(1, Math.max(0, (model.value - props.min) / span))
})

/** Kroky pro segmentovanou variantu — tečky mezi krajními body. */
const ticks = computed(() => {
  if (props.variant !== 'segmented') return []
  const count = Math.round((props.max - props.min) / props.step)
  if (count < 2 || count > 24) return []
  return Array.from({ length: count + 1 }, (_, i) => i / count)
})

function clampToStep(raw: number) {
  const stepped = Math.round((raw - props.min) / props.step) * props.step + props.min
  const bounded = Math.min(props.max, Math.max(props.min, stepped))
  // Zaokrouhlení podle desetin kroku, jinak z 0.1 vypadne 0.30000000000000004.
  const decimals = (String(props.step).split('.')[1] ?? '').length
  return Number(bounded.toFixed(decimals))
}

function setFromPointer(clientX: number) {
  const el = track.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const r = (clientX - rect.left) / rect.width
  model.value = clampToStep(props.min + r * (props.max - props.min))
}

function onPointerDown(event: PointerEvent) {
  if (props.disabled) return
  dragging.value = true
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  setFromPointer(event.clientX)
}

function onPointerMove(event: PointerEvent) {
  if (dragging.value) setFromPointer(event.clientX)
}

function onPointerUp(event: PointerEvent) {
  dragging.value = false
  ;(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId)
}

function nudge(steps: number) {
  model.value = clampToStep(model.value + steps * props.step)
}

function onKeydown(event: KeyboardEvent) {
  const big = Math.max(props.step, (props.max - props.min) / 10)
  switch (event.key) {
    case 'ArrowRight': case 'ArrowUp': event.preventDefault(); nudge(1); break
    case 'ArrowLeft': case 'ArrowDown': event.preventDefault(); nudge(-1); break
    case 'PageUp': event.preventDefault(); model.value = clampToStep(model.value + big); break
    case 'PageDown': event.preventDefault(); model.value = clampToStep(model.value - big); break
    case 'Home': event.preventDefault(); model.value = props.min; break
    case 'End': event.preventDefault(); model.value = props.max; break
  }
}

const knobWidth: Record<SliderSize, number> = { sm: 16, md: 20, lg: 20, xl: 24 }

/**
 * Knoflík se u krajů nesmí vysunout ven z dráhy, takže se neposouvá přes celou
 * šířku, ale přes šířku zmenšenou o svůj průměr.
 */
const knobStyle = computed(() => {
  const w = knobWidth[props.size]
  return {
    left: `calc(${ratio.value} * (100% - ${w}px) + ${w / 2}px)`,
    transform: 'translate(-50%, -50%)',
  }
})
</script>

<template>
  <div :class="cn(ui.root(), props.class)">
    <Icon v-if="minIcon" :name="minIcon" :class="ui.icon()" />

    <div
      ref="track"
      role="slider"
      :aria-valuenow="model"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-label="ariaLabel"
      :aria-disabled="disabled || undefined"
      :tabindex="disabled ? -1 : 0"
      :class="cn(ui.track(), 'outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)')"
      :style="variant === 'color' ? { background: gradient } : undefined"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @keydown="onKeydown"
    >
      <span :class="ui.fill()" :style="{ width: `${ratio * 100}%` }" />

      <span
        v-for="(t, i) in ticks"
        :key="i"
        :class="ui.tick()"
        :style="{ left: `${t * 100}%`, transform: 'translate(-50%, -50%)' }"
      />

      <span :class="ui.knob()" :style="knobStyle" />
    </div>

    <Icon v-if="maxIcon" :name="maxIcon" :class="ui.icon()" />
  </div>
</template>
