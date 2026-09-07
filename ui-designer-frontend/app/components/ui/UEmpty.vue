<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Prázdný stav.
 *
 * Prázdno není chyba — je to informace. Proto má text, ne jen mlčící plochu,
 * a proto se navrhuje současně s naplněným stavem, ne až potom.
 *
 * Ikona je nepovinná: v hustém seznamu by ji sedm prázdných sekcí pod sebou
 * jen zaplevelilo.
 */
const props = withDefaults(
  defineProps<{
    icon?: string
    title?: string
    description?: string
    size?: 'sm' | 'md'
    class?: ClassValue
  }>(),
  { icon: undefined, title: undefined, description: undefined, size: 'md', class: undefined },
)
</script>

<template>
  <div
    :class="cn(
      'flex flex-col items-center text-center text-(--fg-secondary)',
      props.size === 'sm' ? 'gap-1.5 px-4 py-6' : 'gap-2 px-6 py-10',
      props.class,
    )"
  >
    <slot name="icon">
      <Icon
        v-if="icon"
        :name="icon"
        :class="props.size === 'sm' ? 'size-5' : 'size-7'"
        class="text-(--fg-tertiary)"
        aria-hidden="true"
      />
    </slot>

    <p v-if="title" :class="props.size === 'sm' ? 'text-callout font-medium' : 'text-body font-semibold'">
      {{ title }}
    </p>
    <p v-if="description" class="max-w-xs text-footnote text-(--fg-tertiary)">
      {{ description }}
    </p>

    <!-- Východisko z prázdna. Bez něj je to jen konstatování. -->
    <div v-if="$slots.default" class="mt-1">
      <slot />
    </div>
  </div>
</template>
