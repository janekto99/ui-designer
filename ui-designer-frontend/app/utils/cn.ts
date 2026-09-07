import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Vlastní velikosti písma musí tailwind-merge znát, jinak si `text-body`
 * splete s barvou textu a `text-(--fg-primary)` by ho vyhodilo.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'xl-title-1',
            'xl-title-2',
            'large-title',
            'title-1',
            'title-2',
            'title-3',
            'headline',
            'body',
            'callout',
            'subheadline',
            'footnote',
            'caption-1',
            'caption-2',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export type { ClassValue }
