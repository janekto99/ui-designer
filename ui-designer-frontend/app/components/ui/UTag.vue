<script setup lang="ts">
import type { Tone } from './button.variants'
import type { ClassValue } from '~/utils/cn'

/**
 * Štítek se stavem — „Hard", „Challenger", „8 zápasů".
 *
 * Nezaměňovat s `UBadge`: ten je červený počet přilepený k jinému prvku,
 * tohle je popisek stojící sám za sebe. Odtud i jiný tvar — obdélník
 * se zaoblením, ne kruh.
 *
 * Barva jde z tónů, takže „varovný štítek" a „varovné tlačítko" berou odstín
 * ze stejného místa.
 */
const props = withDefaults(
  defineProps<{
    label?: string
    tone?: Tone
    /** Plná výplň místo měkké. Použij střídmě — štítek má informovat, ne křičet. */
    solid?: boolean
    icon?: string
    size?: 'sm' | 'md'
    class?: ClassValue
  }>(),
  { label: undefined, tone: 'neutral', solid: false, icon: undefined, size: 'sm', class: undefined },
)

const toneClasses = {
  neutral: 'vos-tone-neutral',
  accent: 'vos-tone-accent',
  success: 'vos-tone-success',
  warning: 'vos-tone-warning',
  danger: 'vos-tone-danger',
  info: 'vos-tone-info',
} as const

const sizes = {
  sm: { root: 'h-5 gap-1 rounded-md px-1.5 text-caption-2', icon: 'size-3' },
  md: { root: 'h-7 gap-1.5 rounded-lg px-2.5 text-caption-1', icon: 'size-3.5' },
} as const
</script>

<template>
  <span
    :class="cn(
      'inline-flex shrink-0 items-center font-semibold whitespace-nowrap',
      toneClasses[props.tone],
      sizes[props.size].root,
      solid
        ? 'bg-(--tone-solid) text-(--tone-solid-fg)'
        : 'bg-(--tone-surface) text-(--tone-strong)',
      props.class,
    )"
  >
    <Icon v-if="icon" :name="icon" :class="sizes[props.size].icon" />
    <slot>{{ label }}</slot>
  </span>
</template>
