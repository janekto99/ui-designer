import { tv, type VariantProps } from 'tailwind-variants'

/**
 * Velikosti jsou z Figmy: ikonové tlačítko má 64 · 52 · 44 · 32 · 28 px
 * a je vždy kruh. Textové má u „regular" výšku 44 a je plná pilulka.
 *
 * Hover a active tady nejsou — jsou to `:hover` / `:active` na skle (viz
 * `vos-plain` a spol. v main.css), protože v originále je to jen jiná
 * průhlednost téže výplně, ne jiná varianta.
 */
export const button = tv({
  slots: {
    base: [
      'vos-surface inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full font-medium',
      'outline-none select-none',
      'focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:ring-offset-0',
      'disabled:cursor-not-allowed',
    ],
    icon: 'shrink-0',
    label: 'truncate',
  },
  variants: {
    variant: {
      plain: { base: 'vos-plain' },
      glass: { base: 'vos-glass' },
      selected: { base: 'vos-selected' },
    },
    size: {
      xs: { base: 'h-7 gap-1 text-caption-1', icon: 'size-3.5' },
      sm: { base: 'h-8 gap-1.5 text-footnote', icon: 'size-4' },
      md: { base: 'h-11 gap-1.5 text-body', icon: 'size-5' },
      lg: { base: 'h-13 gap-2 text-title-3', icon: 'size-6' },
      xl: { base: 'h-16 gap-2.5 text-title-2', icon: 'size-7' },
    },
    /** Jen ikona → kruh, šířka = výška, žádný vnitřní odsazení. */
    iconOnly: {
      true: { base: 'aspect-square p-0' },
      false: {},
    },
  },
  compoundVariants: [
    { iconOnly: false, size: 'xs', class: { base: 'px-2.5' } },
    { iconOnly: false, size: 'sm', class: { base: 'px-3' } },
    { iconOnly: false, size: 'md', class: { base: 'px-4' } },
    { iconOnly: false, size: 'lg', class: { base: 'px-5' } },
    { iconOnly: false, size: 'xl', class: { base: 'px-6' } },
  ],
  defaultVariants: {
    variant: 'glass',
    size: 'md',
    iconOnly: false,
  },
})

export type ButtonVariants = VariantProps<typeof button>
export type ButtonSize = NonNullable<ButtonVariants['size']>
export type ButtonVariant = NonNullable<ButtonVariants['variant']>

export const buttonSizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl']
export const buttonVariantNames: ButtonVariant[] = ['plain', 'glass', 'selected']
