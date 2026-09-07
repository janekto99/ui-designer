<script setup lang="ts" generic="T extends string | number">
import { segmented, type SegmentedSize } from './segmented.variants'
import type { ClassValue } from '~/utils/cn'

export interface Segment<V> {
  label: string
  value: V
  icon?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    segments: Segment<T>[]
    size?: SegmentedSize
    block?: boolean
    disabled?: boolean
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { size: 'md', block: false, disabled: false, ariaLabel: undefined, class: undefined },
)

const model = defineModel<T>({ required: true })

const ui = computed(() => segmented({ size: props.size, block: props.block }))
const enabled = computed(() => props.segments.filter((s) => !s.disabled))

function pick(segment: Segment<T>) {
  if (segment.disabled || props.disabled) return
  model.value = segment.value
}

/** Šipkami se přepíná rovnou hodnota — u radiogroup se to takhle čeká. */
function move(step: number) {
  if (!enabled.value.length) return
  const current = enabled.value.findIndex((s) => s.value === model.value)
  const next = (current + step + enabled.value.length) % enabled.value.length
  model.value = enabled.value[next]!.value
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    move(1)
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    move(-1)
  }
}
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="ariaLabel"
    :class="cn(ui.track(), props.class)"
    @keydown="onKeydown"
  >
    <button
      v-for="segment in segments"
      :key="String(segment.value)"
      type="button"
      role="radio"
      :aria-checked="segment.value === model"
      :disabled="segment.disabled || disabled"
      :tabindex="segment.value === model ? 0 : -1"
      :class="cn(
        ui.segment(),
        segment.value === model ? 'vos-glass' : 'vos-plain',
        segment.disabled && 'opacity-40',
      )"
      @click="pick(segment)"
    >
      <span class="inline-flex items-center justify-center gap-1.5">
        <Icon v-if="segment.icon" :name="segment.icon" class="size-4 shrink-0" />
        {{ segment.label }}
      </span>
    </button>
  </div>
</template>
