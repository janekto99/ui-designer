<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

export interface Crumb {
  label: string
  /** Bez `to` je článek jen text — typicky poslední, kde už uživatel je. */
  to?: string
  icon?: string
}

/**
 * Cesta k místu, kde uživatel je.
 *
 * V kitu tahle komponenta není — visionOS řeší návrat jedním tlačítkem zpět.
 * Je to odvození pro web, kde je hierarchie hlubší než dvě úrovně.
 *
 * Poslední článek nese `aria-current="page"` a není odkaz: odkaz na místo,
 * kde už stojíš, je pro čtečku šum.
 *
 * Při přetečení se **zkracuje zprostřed**, ne z konce. Konec je to jediné,
 * co uživatel potřebuje vidět vždycky.
 */
const props = withDefaults(
  defineProps<{
    items: Crumb[]
    /** Nad tolik článků se prostředek sbalí do „…". */
    maxVisible?: number
    class?: ClassValue
  }>(),
  { maxVisible: 4, class: undefined },
)

const expanded = ref(false)

const collapsed = computed(() => props.items.length > props.maxVisible && !expanded.value)

/** První, výpustka, a poslední dva — to je ta část cesty, která něco říká. */
const shown = computed(() => {
  if (!collapsed.value) return props.items.map((item, index) => ({ item, index }))
  const all = props.items.map((item, index) => ({ item, index }))
  return [all[0]!, ...all.slice(-2)]
})

const hiddenCount = computed(() => props.items.length - shown.value.length)
</script>

<template>
  <nav :aria-label="'Drobečková navigace'" :class="cn('flex min-w-0 items-center', props.class)">
    <ol class="flex min-w-0 items-center gap-1">
      <template v-for="({ item, index }, position) in shown" :key="index">
        <li v-if="position > 0" aria-hidden="true" class="shrink-0 text-(--fg-tertiary)">
          <Icon name="lucide:chevron-right" class="size-3.5" />
        </li>

        <!-- Výpustka je tlačítko, ne text: skrytá cesta musí jít zobrazit. -->
        <li v-if="collapsed && position === 1" class="flex shrink-0 items-center gap-1">
          <button
            type="button"
            class="vos-surface vos-plain cursor-pointer rounded-md px-1.5 py-0.5 text-footnote text-(--fg-secondary) outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
            :aria-label="`Zobrazit ${hiddenCount} skrytých úrovní`"
            @click="expanded = true"
          >…</button>
          <span aria-hidden="true" class="text-(--fg-tertiary)">
            <Icon name="lucide:chevron-right" class="size-3.5" />
          </span>
        </li>

        <li class="min-w-0">
          <NuxtLink
            v-if="item.to && index !== items.length - 1"
            :to="item.to"
            class="vos-surface vos-plain flex items-center gap-1.5 truncate rounded-md px-1.5 py-0.5 text-footnote text-(--fg-secondary) outline-none hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
          >
            <Icon v-if="item.icon" :name="item.icon" class="size-3.5 shrink-0" />
            {{ item.label }}
          </NuxtLink>

          <span
            v-else
            :aria-current="index === items.length - 1 ? 'page' : undefined"
            class="flex items-center gap-1.5 truncate px-1.5 py-0.5 text-footnote"
            :class="index === items.length - 1 ? 'font-semibold text-(--fg-primary)' : 'text-(--fg-secondary)'"
          >
            <Icon v-if="item.icon" :name="item.icon" class="size-3.5 shrink-0" />
            {{ item.label }}
          </span>
        </li>
      </template>
    </ol>

    <div v-if="$slots.trailing" class="ml-2 flex shrink-0 items-center gap-2">
      <slot name="trailing" />
    </div>
  </nav>
</template>
