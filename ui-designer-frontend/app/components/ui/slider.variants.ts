import { tv, type VariantProps } from 'tailwind-variants'

/**
 * U tenkých posuvníků sedí knoflík **na** dráze, u tlustých **v** ní. To je
 * ve Figmě nejvýraznější rozdíl mezi velikostmi — není to jen jiná výška.
 */
export const slider = tv({
  slots: {
    root: 'flex w-full items-center gap-3 select-none',
    track: 'relative w-full cursor-pointer rounded-full bg-(--slider-track)',
    fill: 'pointer-events-none absolute inset-y-0 left-0 rounded-full bg-(--slider-fill)',
    knob: [
      'pointer-events-none absolute top-1/2 rounded-full bg-(--knob)',
      'shadow-[0_1px_3px_rgb(0_0_0/0.3)] transition-shadow',
    ],
    tick: 'pointer-events-none absolute top-1/2 size-1 -translate-y-1/2 rounded-full bg-(--fg-tertiary)',
    icon: 'shrink-0 text-(--fg-secondary)',
  },
  variants: {
    size: {
      sm: { track: 'h-1.5', knob: 'size-4', icon: 'size-3.5' },
      md: { track: 'h-3', knob: 'size-5', icon: 'size-4' },
      lg: { track: 'h-5', knob: 'size-5', icon: 'size-5' },
      xl: { track: 'h-7', knob: 'size-6', icon: 'size-6' },
    },
    /** U tlustých dráh je knoflík uvnitř, takže nesmí přetékat. */
    inside: {
      true: { track: 'overflow-hidden' },
      false: {},
    },
    variant: {
      default: {},
      /** Barevný přechod — knoflík je prstenec, aby byla barva pod ním vidět. */
      color: { knob: 'border-2 border-(--knob) bg-transparent', fill: 'opacity-0' },
      segmented: {},
    },
    disabled: {
      true: { root: 'pointer-events-none opacity-40' },
      false: {},
    },
  },
  defaultVariants: { size: 'md', inside: false, variant: 'default', disabled: false },
})

export type SliderVariants = VariantProps<typeof slider>
export type SliderSize = NonNullable<SliderVariants['size']>
export type SliderVariant = NonNullable<SliderVariants['variant']>

export const sliderSizes: SliderSize[] = ['sm', 'md', 'lg', 'xl']
export const sliderVariantNames: SliderVariant[] = ['default', 'color', 'segmented']

/** Dráhy od `lg` výš pojmou knoflík dovnitř. */
export const knobIsInside = (size: SliderSize) => size === 'lg' || size === 'xl'
