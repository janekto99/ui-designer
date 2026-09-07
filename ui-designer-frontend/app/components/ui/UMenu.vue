<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

export interface MenuItem {
  /** Bez `label` je z položky oddělovač. */
  label?: string
  icon?: string
  /** Fajfka vlevo — položka je zaškrtávací, ne prostá akce. */
  checked?: boolean
  /** Šipka vpravo — vede do podmenu. */
  submenu?: boolean
  /** Nadpis sekce; taková položka není klikací. */
  header?: string
  disabled?: boolean
  destructive?: boolean
}

/**
 * Panel menu. Sedí na materiálu `regular` — mezi seznamem (thin) a alertem
 * (thick), přesně jak je to ve Figmě odstupňované.
 *
 * Volitelný pruh ikon nahoře je ve Figmě „Context Menu - Accessory": vyjmout,
 * kopírovat, vložit, smazat.
 */
const props = withDefaults(
  defineProps<{
    items: MenuItem[]
    /** Ikonové akce v pruhu nad položkami. */
    accessories?: { icon: string, label: string }[]
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { accessories: () => [], ariaLabel: undefined, class: undefined },
)

const emit = defineEmits<{ select: [item: MenuItem, index: number], accessory: [index: number] }>()

const active = ref(-1)
const root = useTemplateRef<HTMLElement>('root')

/** Oddělovače a nadpisy se přeskakují — do fokusu patří jen skutečné položky. */
const selectable = computed(() =>
  props.items.map((item, index) => ({ item, index }))
    .filter(({ item }) => item.label && !item.header && !item.disabled),
)

function choose(item: MenuItem, index: number) {
  if (!item.label || item.header || item.disabled) return
  emit('select', item, index)
}

function move(step: number) {
  if (!selectable.value.length) return
  const current = selectable.value.findIndex((s) => s.index === active.value)
  const next = (current + step + selectable.value.length) % selectable.value.length
  active.value = selectable.value[next]!.index
  nextTick(() => {
    root.value?.querySelector<HTMLElement>(`[data-index="${active.value}"]`)?.focus()
  })
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown': event.preventDefault(); move(1); break
    case 'ArrowUp': event.preventDefault(); move(-1); break
    case 'Home': event.preventDefault(); active.value = -1; move(1); break
    case 'End': event.preventDefault(); active.value = -1; move(-1); break
  }
}
</script>

<template>
  <div
    ref="root"
    role="menu"
    :aria-label="ariaLabel"
    :class="cn(
      'vos-view-regular w-64 rounded-2xl p-1.5 shadow-(--panel-shadow)',
      props.class,
    )"
    @keydown="onKeydown"
  >
    <template v-if="accessories.length">
      <div class="flex items-center justify-around px-1 pt-0.5 pb-1.5">
        <button
          v-for="(accessory, index) in accessories"
          :key="index"
          type="button"
          role="menuitem"
          class="vos-surface vos-plain flex size-9 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
          :aria-label="accessory.label"
          @click="$emit('accessory', index)"
        >
          <Icon :name="accessory.icon" class="size-4.5" />
        </button>
      </div>
      <hr class="vos-separator mb-1.5">
    </template>

    <template v-for="(item, index) in items" :key="index">
      <hr v-if="!item.label && !item.header" class="vos-separator my-1.5">

      <p
        v-else-if="item.header"
        class="px-3 pt-2 pb-1 text-caption-1 font-semibold text-(--fg-secondary)"
      >
        {{ item.header }}
      </p>

      <button
        v-else
        type="button"
        :role="item.checked === undefined ? 'menuitem' : 'menuitemcheckbox'"
        :aria-checked="item.checked"
        :aria-disabled="item.disabled"
        :data-index="index"
        :tabindex="index === active ? 0 : -1"
        :class="cn(
          'vos-surface vos-plain flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-callout',
          'outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)',
          item.disabled && 'pointer-events-none opacity-40',
          item.destructive && 'text-(--vos-red)',
        )"
        @click="choose(item, index)"
      >
        <Icon
          v-if="item.checked !== undefined"
          name="lucide:check"
          class="size-4 shrink-0"
          :class="!item.checked && 'opacity-0'"
        />
        <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
        <Icon v-if="item.icon" :name="item.icon" class="size-4 shrink-0" />
        <Icon
          v-if="item.submenu"
          name="lucide:chevron-right"
          class="size-4 shrink-0 text-(--fg-secondary)"
        />
      </button>
    </template>
  </div>
</template>
