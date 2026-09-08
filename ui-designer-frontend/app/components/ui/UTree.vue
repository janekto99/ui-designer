<script setup lang="ts" generic="T extends string | number">
import type { ClassValue } from '~/utils/cn'

export interface TreeNode<V> {
  label: string
  value: V
  icon?: string
  /** Počet vpravo. Nezobrazuje se, když je `undefined` — nula je jiné tvrzení. */
  count?: number
  /** Barevná tečka vlevo, např. povrch kurtu. */
  dotColor?: string
  children?: TreeNode<V>[]
  disabled?: boolean
}

/**
 * Víceúrovňová navigace.
 *
 * Vykresluje se **naplocho**, ne vnořeně: každý řádek nese `aria-level`
 * a odsazení. Vnořené `<ul>` by sice odpovídalo struktuře, ale ovládání
 * klávesnicí by muselo lézt stromem nahoru a dolů; nad plochým seznamem
 * viditelných řádků je to posun o jedna.
 *
 * Klávesnice se řídí vzorem pro strom: šipky nahoru a dolů jdou po
 * **viditelných** řádcích, vpravo rozbalí nebo skočí na první dítě, vlevo
 * sbalí nebo skočí na rodiče.
 */
const props = withDefaults(
  defineProps<{
    nodes: TreeNode<T>[]
    /**
     * Jak se pozná vybraný řádek:
     *
     * - `solid` — celý řádek vybarvený, čte se na první pohled
     * - `soft` — jemný nádech akcentu, drží hustotu a nekřičí
     * - `subtle` — jen ztučnění a linka vlevo; menu zůstane pozadím
     *
     * V dlouhém stromu překřičí plná výplň i obsah vedle, proto není `solid`
     * automaticky správná volba.
     */
    selection?: 'solid' | 'soft' | 'subtle'
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { selection: 'solid', ariaLabel: undefined, class: undefined },
)

const model = defineModel<T | undefined>({ default: undefined })
const expanded = defineModel<T[]>('expanded', { default: () => [] })

const root = useTemplateRef<HTMLElement>('root')

const isOpen = (value: T) => expanded.value.includes(value)

interface Row {
  node: TreeNode<T>
  level: number
  parent?: T
  hasChildren: boolean
  posinset: number
  setsize: number
}

/** Ploché pořadí viditelných řádků — z něj se odvozuje i pohyb šipkami. */
const rows = computed(() => {
  const out: Row[] = []
  const walk = (list: TreeNode<T>[], level: number, parent?: T) => {
    list.forEach((node, index) => {
      const hasChildren = Boolean(node.children?.length)
      out.push({ node, level, parent, hasChildren, posinset: index + 1, setsize: list.length })
      if (hasChildren && isOpen(node.value)) walk(node.children!, level + 1, node.value)
    })
  }
  walk(props.nodes, 0)
  return out
})

const focused = ref<T>()

function toggle(value: T) {
  expanded.value = isOpen(value)
    ? expanded.value.filter((v) => v !== value)
    : [...expanded.value, value]
}

function focusRow(value: T | undefined) {
  if (value === undefined) return
  focused.value = value
  nextTick(() => {
    root.value?.querySelector<HTMLElement>(`[data-value="${String(value)}"]`)?.focus()
  })
}

function move(step: number) {
  const list = rows.value.filter((r) => !r.node.disabled)
  if (!list.length) return
  const current = list.findIndex((r) => r.node.value === focused.value)
  const next = (current + step + list.length) % list.length
  focusRow(list[next]!.node.value)
}

function onKeydown(event: KeyboardEvent, row: Row) {
  /*
   * Fokus mohl přijít Tabem, aniž by se `focused` nastavil — pak by se posun
   * počítal od −1 a první šipka by skončila na řádku, kde už kurzor stojí.
   * Odsud se ví, na kterém řádku klávesa padla, tak se stav srovná napřed.
   */
  focused.value = row.node.value

  switch (event.key) {
    case 'ArrowDown': event.preventDefault(); move(1); break
    case 'ArrowUp': event.preventDefault(); move(-1); break
    case 'Home': event.preventDefault(); focusRow(rows.value[0]?.node.value); break
    case 'End': event.preventDefault(); focusRow(rows.value.at(-1)?.node.value); break
    case 'ArrowRight':
      event.preventDefault()
      if (row.hasChildren && !isOpen(row.node.value)) toggle(row.node.value)
      else if (row.hasChildren) move(1)
      break
    case 'ArrowLeft':
      event.preventDefault()
      if (row.hasChildren && isOpen(row.node.value)) toggle(row.node.value)
      else if (row.parent !== undefined) focusRow(row.parent)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      activate(row)
      break
  }
}

/** Rozcestník rozbaluje, list vybírá. Uzel s dětmi dělá obojí. */
function activate(row: Row) {
  if (row.node.disabled) return
  if (row.hasChildren) toggle(row.node.value)
  else model.value = row.node.value
}

// Statické třídy, ne dopočítávané odsazení — Tailwind skenuje zdroj.
const indents = ['pl-2', 'pl-6', 'pl-10', 'pl-14'] as const

/*
 * `subtle` musí mít rovný levý roh: přes zaoblení by se z linky stal oblouk
 * a vypadalo by to jako chyba vykreslení, ne jako značka výběru.
 */
const selectedClass = computed(() => ({
  solid: 'vos-selected',
  soft: 'bg-(--tone-accent-surface) font-medium text-(--tone-accent-strong)',
  subtle: 'vos-plain rounded-none border-l-2 border-(--tone-accent) font-semibold text-(--fg-primary)',
}[props.selection]))
</script>

<template>
  <div
    ref="root"
    role="tree"
    :aria-label="ariaLabel"
    :class="cn('flex flex-col gap-0.5', props.class)"
  >
    <button
      v-for="row in rows"
      :key="String(row.node.value)"
      type="button"
      role="treeitem"
      :data-value="String(row.node.value)"
      :aria-level="row.level + 1"
      :aria-posinset="row.posinset"
      :aria-setsize="row.setsize"
      :aria-expanded="row.hasChildren ? isOpen(row.node.value) : undefined"
      :aria-selected="row.node.value === model"
      :aria-disabled="row.node.disabled"
      :tabindex="(focused ?? rows[0]?.node.value) === row.node.value ? 0 : -1"
      :class="cn(
        'vos-surface flex cursor-pointer items-center gap-2 rounded-xl py-1.5 pr-2.5 text-left outline-none',
        'focus-visible:ring-2 focus-visible:ring-(--focus-ring)',
        indents[Math.min(row.level, 3)],
        row.node.value === model ? selectedClass : 'vos-plain',
        row.node.disabled && 'pointer-events-none opacity-40',
      )"
      @click="activate(row); focused = row.node.value"
      @keydown="onKeydown($event, row)"
    >
      <Icon
        v-if="row.hasChildren"
        name="lucide:chevron-down"
        class="size-3.5 shrink-0 text-(--fg-secondary) transition-transform duration-200"
        :class="!isOpen(row.node.value) && '-rotate-90'"
      />
      <span v-else class="size-3.5 shrink-0" aria-hidden="true" />

      <span
        v-if="row.node.dotColor"
        class="size-2 shrink-0 rounded-full"
        :style="{ backgroundColor: row.node.dotColor }"
        aria-hidden="true"
      />
      <Icon v-else-if="row.node.icon" :name="row.node.icon" class="size-4 shrink-0" />

      <span class="min-w-0 flex-1 truncate text-callout">{{ row.node.label }}</span>

      <span
        v-if="row.node.count !== undefined"
        class="shrink-0 text-footnote tabular-nums"
        :class="row.node.value === model && selection === 'solid'
          ? 'opacity-60'
          : row.node.value === model && selection === 'soft'
            ? 'text-(--tone-accent-strong)'
            : 'text-(--fg-tertiary)'"
      >{{ row.node.count }}</span>
    </button>
  </div>
</template>
