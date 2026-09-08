import { tv, type VariantProps } from 'tailwind-variants'

/**
 * Vybraný segment je ve Figmě **světlejší pilulka uvnitř tmavší dráhy**, ne
 * plná bílá. Plná bílá je až `selected` u tlačítka — segmentovaný ovladač
 * zůstává sklem, jinak by v řadě segmentů překřičel všechno kolem.
 */
export const segmented = tv({
  slots: {
    track: [
      'vos-surface vos-glass inline-flex items-center rounded-control',
      'has-disabled:pointer-events-none has-disabled:opacity-40',
    ],
    segment: [
      'vos-surface relative flex-1 cursor-pointer rounded-control text-center font-medium whitespace-nowrap',
      'outline-none transition-colors duration-200',
      'focus-visible:ring-2 focus-visible:ring-(--focus-ring)',
    ],
  },
  variants: {
    size: {
      sm: { track: 'h-8 gap-0.5 p-0.5', segment: 'h-7 px-3 text-footnote' },
      md: { track: 'h-11 gap-1 p-1', segment: 'h-9 px-4 text-body' },
      lg: { track: 'h-13 gap-1 p-1', segment: 'h-11 px-5 text-title-3' },
    },
    /** Roztáhne dráhu na plnou šířku a segmenty rozdělí rovným dílem. */
    block: {
      true: { track: 'flex w-full' },
      false: {},
    },
  },
  defaultVariants: { size: 'md', block: false },
})

export type SegmentedVariants = VariantProps<typeof segmented>
export type SegmentedSize = NonNullable<SegmentedVariants['size']>

export const segmentedSizes: SegmentedSize[] = ['sm', 'md', 'lg']
