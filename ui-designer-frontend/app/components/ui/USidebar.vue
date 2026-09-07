<script setup lang="ts" generic="T extends string | number">
import type { ClassValue } from '~/utils/cn'

export interface SidebarItem<V> {
  label: string
  value: V
  icon?: string
  /** Počet vpravo — ve Figmě je to jen číslo, ne odznáček. */
  count?: number
}

export interface SidebarSection<V> {
  /** Bez nadpisu je sekce bez hlavičky a nedá se sbalit. */
  heading?: string
  items: SidebarItem<V>[]
}

const props = withDefaults(
  defineProps<{
    title: string
    sections: SidebarSection<T>[]
    /** Hledací pole pod titulkem. */
    searchable?: boolean
    /** Tlačítko Upravit vedle titulku. */
    editable?: boolean
    class?: ClassValue
  }>(),
  { searchable: false, editable: false, class: undefined },
)

const model = defineModel<T>({ required: true })
const query = defineModel<string>('query', { default: '' })

defineEmits<{ edit: [] }>()

/** Sbalené sekce se drží podle nadpisu — ten je v rámci sidebaru jedinečný. */
const collapsed = ref(new Set<string>())

function toggleSection(heading: string) {
  const next = new Set(collapsed.value)
  if (next.has(heading)) next.delete(heading)
  else next.add(heading)
  collapsed.value = next
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.sections
  return props.sections
    .map((section) => ({
      ...section,
      items: section.items.filter((i) => i.label.toLowerCase().includes(q)),
    }))
    .filter((section) => section.items.length > 0)
})
</script>

<template>
  <div :class="cn('vos-view-thin flex w-64 flex-col gap-3 rounded-3xl p-3', props.class)">
    <div class="flex items-center justify-between gap-2 px-2 pt-1">
      <h2 class="truncate text-title-3 font-semibold">{{ title }}</h2>
      <UButton v-if="editable" label="Upravit" variant="glass" size="xs" @click="$emit('edit')" />
    </div>

    <USearchField v-if="searchable" v-model="query" placeholder="Hledat" />

    <nav class="flex flex-col gap-3 overflow-y-auto">
      <div v-for="(section, s) in filtered" :key="s" class="flex flex-col gap-0.5">
        <button
          v-if="section.heading"
          type="button"
          class="vos-surface vos-plain flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
          :aria-expanded="!collapsed.has(section.heading)"
          @click="toggleSection(section.heading)"
        >
          <span class="truncate text-callout font-semibold">{{ section.heading }}</span>
          <Icon
            name="lucide:chevron-down"
            class="size-4 shrink-0 text-(--fg-secondary) transition-transform"
            :class="collapsed.has(section.heading) && '-rotate-90'"
          />
        </button>

        <template v-if="!section.heading || !collapsed.has(section.heading)">
          <button
            v-for="item in section.items"
            :key="String(item.value)"
            type="button"
            :aria-current="item.value === model ? 'page' : undefined"
            :class="cn(
              'vos-surface flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left outline-none',
              'focus-visible:ring-2 focus-visible:ring-(--focus-ring)',
              item.value === model ? 'vos-selected' : 'vos-plain',
            )"
            @click="model = item.value"
          >
            <Icon v-if="item.icon" :name="item.icon" class="size-4 shrink-0" />
            <span class="min-w-0 flex-1 truncate text-callout">{{ item.label }}</span>
            <span
              v-if="item.count !== undefined"
              class="shrink-0 text-footnote"
              :class="item.value === model ? 'opacity-60' : 'text-(--fg-tertiary)'"
            >{{ item.count }}</span>
          </button>
        </template>
      </div>

      <p v-if="!filtered.length" class="px-3 py-2 text-footnote text-(--fg-tertiary)">
        Nic nenalezeno.
      </p>
    </nav>
  </div>
</template>
