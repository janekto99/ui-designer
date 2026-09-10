import { tv, type VariantProps } from 'tailwind-variants'

/**
 * Společná anatomie pro Text Field, Search Field a Secure Field — ve Figmě
 * jsou to tři komponenty se stejnou kostrou, liší se jen obsahem.
 *
 * Pole je **vyhloubené**: tmavší než plocha, na které leží. Proto `--field-fill`
 * a ne `vos-glass` — sklo se zvedá nad plochu, pole se zapouští pod ni.
 */
export const field = tv({
  slots: {
    root: [
      'relative flex w-full items-center rounded-control',
      'bg-(--field-fill) transition-colors duration-150',
      // Obrys, ne jen prohlubeň. Ve světlém režimu je pole bílé na bílé
      // ploše a vyhloubení ho neoddělí — definici tam musí nést hrana.
      // V tmavém je token jemný, protože tam odděluje výplň.
      'shadow-(--recessed-shadow) ring-1 ring-(--field-edge)',
      'hover:bg-(--field-fill-hover)',
      'focus-within:bg-(--field-fill-focus)',
      'focus-within:ring-2 focus-within:ring-(--focus-ring)',
      'has-disabled:pointer-events-none has-disabled:opacity-40',
    ],
    icon: 'shrink-0 text-(--fg-secondary)',
    input: [
      'min-w-0 flex-1 bg-transparent text-(--fg-primary) outline-none',
      'placeholder:text-(--field-placeholder)',
    ],
    clear: [
      'flex shrink-0 cursor-pointer items-center justify-center rounded-full',
      'text-(--fg-secondary) transition-opacity hover:text-(--fg-primary)',
    ],
  },
  variants: {
    size: {
      md: {
        root: 'h-11 gap-2 px-4 text-body',
        icon: 'size-5',
        input: 'text-body',
        clear: 'size-5',
      },
      lg: {
        root: 'h-13 gap-2.5 px-5 text-title-3',
        icon: 'size-6',
        input: 'text-title-3',
        clear: 'size-6',
      },
    },
    /** Diktování — ve Figmě „Speak to Search", pole dostane barevný nádech. */
    dictating: {
      true: { root: 'bg-(--vos-indigo)/35', icon: 'text-(--fg-primary)' },
      false: {},
    },
  },
  defaultVariants: { size: 'md', dictating: false },
})

export type FieldVariants = VariantProps<typeof field>
export type FieldSize = NonNullable<FieldVariants['size']>

export const fieldSizes: FieldSize[] = ['md', 'lg']
