<script setup lang="ts" generic="T extends string | number">
import { select, type SelectSize, type SelectVariant } from './select.variants'
import type { ClassValue } from '~/utils/cn'

export interface SelectOption<V> {
  label: string
  value: V
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    options: SelectOption<T>[]
    placeholder?: string
    variant?: SelectVariant
    size?: SelectSize
    disabled?: boolean
    ariaLabel?: string
    class?: ClassValue
  }>(),
  {
    placeholder: 'Vybrat',
    variant: 'glass',
    size: 'md',
    disabled: false,
    ariaLabel: undefined,
    class: undefined,
  },
)

const model = defineModel<T | undefined>({ default: undefined })

const open = ref(false)
const active = ref(-1)
const root = useTemplateRef<HTMLElement>('root')
const id = useId()

const ui = computed(() => select({ variant: props.variant, size: props.size, open: open.value }))
const selected = computed(() => props.options.find((o) => o.value === model.value))
const enabled = computed(() => props.options.filter((o) => !o.disabled))

function openPanel() {
  if (props.disabled) return
  open.value = true
  active.value = Math.max(0, props.options.findIndex((o) => o.value === model.value))
}

function close() {
  open.value = false
  active.value = -1
}

function pick(option: SelectOption<T>) {
  if (option.disabled) return
  model.value = option.value
  close()
}

/** Přeskakuje zakázané položky, aby se šipkami nedalo zaseknout. */
function move(step: number) {
  if (!open.value) return openPanel()
  if (!enabled.value.length) return
  let next = active.value
  for (let i = 0; i < props.options.length; i++) {
    next = (next + step + props.options.length) % props.options.length
    if (!props.options[next]?.disabled) break
  }
  active.value = next
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown': event.preventDefault(); move(1); break
    case 'ArrowUp': event.preventDefault(); move(-1); break
    case 'Home': event.preventDefault(); active.value = props.options.indexOf(enabled.value[0]!); break
    case 'End': event.preventDefault(); active.value = props.options.indexOf(enabled.value.at(-1)!); break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (open.value && active.value >= 0) pick(props.options[active.value]!)
      else openPanel()
      break
    case 'Escape': close(); break
    case 'Tab': close(); break
  }
}

onMounted(() => {
  const onPointerDown = (event: PointerEvent) => {
    if (root.value && !root.value.contains(event.target as Node)) close()
  }
  document.addEventListener('pointerdown', onPointerDown)
  onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown))
})
</script>

<template>
  <div ref="root" class="relative inline-block">
    <button
      type="button"
      role="combobox"
      :aria-expanded="open"
      :aria-controls="`${id}-listbox`"
      :aria-activedescendant="open && active >= 0 ? `${id}-option-${active}` : undefined"
      :aria-label="ariaLabel"
      :disabled="disabled"
      :class="cn(ui.trigger(), props.class)"
      @click="open ? close() : openPanel()"
      @keydown="onKeydown"
    >
      <span :class="cn(ui.value(), !selected && 'text-(--fg-secondary)')">
        {{ selected?.label ?? placeholder }}
      </span>
      <Icon name="lucide:chevron-down" :class="ui.chevron()" />
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <ul
        v-if="open"
        :id="`${id}-listbox`"
        role="listbox"
        :class="cn(ui.panel(), 'mt-2 min-w-full')"
      >
        <li v-for="(option, index) in options" :key="String(option.value)">
          <button
            :id="`${id}-option-${index}`"
            type="button"
            role="option"
            :aria-selected="option.value === model"
            :aria-disabled="option.disabled"
            :class="cn(
              ui.option(),
              option.value === model ? 'vos-selected' : 'vos-plain',
              option.disabled && 'pointer-events-none opacity-40',
              index === active && option.value !== model && 'bg-(--platter-tint)',
            )"
            @click="pick(option)"
            @mousemove="active = index"
          >
            <span :class="ui.optionLabel()">{{ option.label }}</span>
            <Icon v-if="option.value === model" name="lucide:check" :class="ui.optionCheck()" />
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>
