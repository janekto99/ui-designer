import { tv, type VariantProps } from 'tailwind-variants'

/**
 * Ve Figmě „Drop Down Button" — je to tlačítko se šipkou, ne vstupní pole.
 * Proto sdílí stavy skla s `Button` a ne vyhloubení s `TextField`.
 */
export const select = tv({
  slots: {
    trigger: [
      'vos-surface inline-flex cursor-pointer items-center justify-between rounded-control font-medium',
      'outline-none select-none',
      'focus-visible:ring-2 focus-visible:ring-(--focus-ring)',
      'disabled:cursor-not-allowed',
    ],
    value: 'truncate',
    chevron: 'shrink-0 transition-transform duration-200',
    panel: [
      'vos-view-regular absolute z-50 max-h-72 overflow-y-auto rounded-surface p-1.5',
      'shadow-(--panel-shadow)',
    ],
    option: [
      'vos-surface flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left',
      'outline-none',
    ],
    optionLabel: 'min-w-0 flex-1 truncate',
    optionCheck: 'size-4 shrink-0',
  },
  variants: {
    variant: {
      plain: { trigger: 'vos-plain' },
      glass: { trigger: 'vos-glass' },
      selected: { trigger: 'vos-selected' },
    },
    size: {
      xs: { trigger: 'h-7 gap-1 px-2.5 text-caption-1', chevron: 'size-3.5' },
      sm: { trigger: 'h-8 gap-1.5 px-3 text-footnote', chevron: 'size-4' },
      md: { trigger: 'h-11 gap-1.5 px-4 text-body', chevron: 'size-5' },
      lg: { trigger: 'h-13 gap-2 px-5 text-title-3', chevron: 'size-6' },
      xl: { trigger: 'h-16 gap-2.5 px-6 text-title-2', chevron: 'size-7' },
    },
    open: {
      true: { chevron: 'rotate-180' },
      false: {},
    },
  },
  defaultVariants: { variant: 'glass', size: 'md', open: false },
})

export type SelectVariants = VariantProps<typeof select>
export type SelectSize = NonNullable<SelectVariants['size']>
export type SelectVariant = NonNullable<SelectVariants['variant']>

export const selectSizes: SelectSize[] = ['xs', 'sm', 'md', 'lg', 'xl']
export const selectVariantNames: SelectVariant[] = ['plain', 'glass', 'selected']
