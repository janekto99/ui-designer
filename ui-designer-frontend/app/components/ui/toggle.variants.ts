import { tv, type VariantProps } from 'tailwind-variants'

/**
 * Dráha je pilulka, knoflík kruh. Zapnutý stav je systémová zelená —
 * ve Figmě je to jediná barva, kterou přepínač používá.
 */
export const toggle = tv({
  slots: {
    track: [
      'vos-surface relative inline-flex shrink-0 cursor-pointer items-center rounded-full',
      'outline-none transition-colors duration-200',
      'focus-visible:ring-2 focus-visible:ring-(--focus-ring)',
      'disabled:cursor-not-allowed disabled:opacity-40',
    ],
    knob: 'pointer-events-none rounded-full bg-(--knob) shadow-sm transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
  },
  variants: {
    size: {
      sm: { track: 'h-6 w-10 px-0.5', knob: 'size-5' },
      md: { track: 'h-8 w-13 px-0.5', knob: 'size-7' },
      lg: { track: 'h-10 w-16 px-0.5', knob: 'size-9' },
    },
    on: {
      true: { track: 'bg-(--track-on)' },
      false: { track: 'bg-(--track-off)' },
    },
  },
  compoundVariants: [
    { on: true, size: 'sm', class: { knob: 'translate-x-4' } },
    { on: true, size: 'md', class: { knob: 'translate-x-5' } },
    { on: true, size: 'lg', class: { knob: 'translate-x-6' } },
  ],
  defaultVariants: { size: 'md', on: false },
})

export type ToggleVariants = VariantProps<typeof toggle>
export type ToggleSize = NonNullable<ToggleVariants['size']>

export const toggleSizes: ToggleSize[] = ['sm', 'md', 'lg']
