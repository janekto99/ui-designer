<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Seznam sedí na materiálu `thin` — nejlehčím ze čtyř. Je to plocha pod
 * obsahem, ne nad ním; kdyby byl tlustší, přebil by okno, ve kterém leží.
 *
 * `plain` má řádky na sobě oddělené vlasovou čárou, `inset` je od sebe
 * odsazuje a každý dostane vlastní zaoblení. Ve Figmě jsou to dvě různé
 * komponenty právě kvůli tomuhle.
 */
const props = withDefaults(
  defineProps<{
    variant?: 'plain' | 'inset'
    /** Nadpis nad seznamem — ve Figmě „Header text". */
    header?: string
    /** Vysvětlivka pod seznamem — ve Figmě „Footer text". */
    footer?: string
    ariaLabel?: string
    class?: ClassValue
  }>(),
  { variant: 'plain', header: undefined, footer: undefined, ariaLabel: undefined, class: undefined },
)
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <p v-if="header" class="px-1 pb-2 text-subheadline font-semibold">{{ header }}</p>

    <div
      role="list"
      :aria-label="ariaLabel"
      :class="props.variant === 'plain'
        ? 'vos-view-thin divide-y divide-(--separator) overflow-hidden rounded-surface'
        : 'flex flex-col gap-2'"
    >
      <slot />
    </div>

    <p v-if="footer" class="px-1 pt-2 text-caption-1 text-(--fg-secondary)">{{ footer }}</p>
  </div>
</template>
