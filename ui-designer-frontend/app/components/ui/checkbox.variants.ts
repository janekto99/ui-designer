import { tv, type VariantProps } from 'tailwind-variants'

/**
 * Ve visionOS je zaškrtávátko **kruh**, ne čtverec — ve Figmě jsou to čtyři
 * kolečka (prázdné, prázdné pod kurzorem, modré s fajfkou, modré pod kurzorem).
 * Nezaměňovat s rádiovým tlačítkem: kruh je tvar, ne význam.
 */
export const checkbox = tv({
  slots: {
    box: [
      'vos-surface inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full',
      'outline-none transition-colors duration-200',
      'focus-visible:ring-2 focus-visible:ring-(--focus-ring)',
      'disabled:cursor-not-allowed disabled:opacity-40',
    ],
    mark: 'text-(--check-mark) transition-transform duration-150',
  },
  variants: {
    size: {
      sm: { box: 'size-5', mark: 'size-3' },
      md: { box: 'size-7', mark: 'size-4' },
      lg: { box: 'size-9', mark: 'size-5' },
    },
    checked: {
      true: { box: 'bg-(--check-fill) hover:brightness-110' },
      false: { box: 'vos-glass' },
    },
  },
  defaultVariants: { size: 'md', checked: false },
})

export type CheckboxVariants = VariantProps<typeof checkbox>
export type CheckboxSize = NonNullable<CheckboxVariants['size']>

export const checkboxSizes: CheckboxSize[] = ['sm', 'md', 'lg']
