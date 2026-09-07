<script setup lang="ts" generic="T extends string | number">
import type { ClassValue } from '~/utils/cn'

export interface TabItem<V> {
  label: string
  icon: string
  value: V
  disabled?: boolean
}

/**
 * Ve visionOS je lišta karet **svislá** a stojí vedle okna, ne pod ním.
 * Sbalená ukazuje jen ikony, rozbalená ikony s popisky — je to jedna lišta,
 * která se roztáhne, ne dvě různé.
 */
const props = withDefaults(
  defineProps<{
    items: TabItem<T>[]
    expanded?: boolean
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { expanded: false, ariaLabel: undefined, class: undefined },
)

const model = defineModel<T>({ required: true })

const enabled = computed(() => props.items.filter((i) => !i.disabled))

function pick(item: TabItem<T>) {
  if (!item.disabled) model.value = item.value
}

function move(step: number) {
  if (!enabled.value.length) return
  const current = enabled.value.findIndex((i) => i.value === model.value)
  const next = (current + step + enabled.value.length) % enabled.value.length
  model.value = enabled.value[next]!.value
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') { event.preventDefault(); move(1) }
  else if (event.key === 'ArrowUp') { event.preventDefault(); move(-1) }
}
</script>

<template>
  <div
    role="tablist"
    aria-orientation="vertical"
    :aria-label="ariaLabel"
    :class="cn(
      'vos-surface vos-glass flex flex-col gap-1 rounded-full p-2 transition-[width] duration-200',
      expanded ? 'w-48 items-stretch' : 'w-16 items-center',
      props.class,
    )"
    @keydown="onKeydown"
  >
    <button
      v-for="item in items"
      :key="String(item.value)"
      type="button"
      role="tab"
      :aria-selected="item.value === model"
      :disabled="item.disabled"
      :tabindex="item.value === model ? 0 : -1"
      :aria-label="expanded ? undefined : item.label"
      :class="cn(
        'vos-surface flex h-11 cursor-pointer items-center gap-3 rounded-full outline-none',
        'focus-visible:ring-2 focus-visible:ring-(--focus-ring)',
        expanded ? 'px-3.5' : 'w-11 justify-center',
        item.value === model ? 'vos-selected' : 'vos-plain',
        item.disabled && 'pointer-events-none opacity-40',
      )"
      @click="pick(item)"
    >
      <Icon :name="item.icon" class="size-5 shrink-0" />
      <span v-if="expanded" class="truncate text-callout">{{ item.label }}</span>
    </button>
  </div>
</template>
