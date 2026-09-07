<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Modální dialog.
 *
 * Proti `UAlert` — ta je jen karta — tohle navíc řeší tři věci, bez kterých
 * je modál jen `div` s překryvem:
 *
 * 1. **Past na fokus.** Tab nesmí ven; za posledním prvkem se vrátí na první.
 * 2. **Návrat fokusu.** Po zavření se fokus vrátí tam, odkud dialog vyšel —
 *    jinak uživatel klávesnice skončí na začátku stránky.
 * 3. **Zámek rolování.** Pozadí se pod dialogem nesmí posouvat.
 *
 * Escape a kliknutí do překryvu zavírají; obojí jde vypnout u dialogů, které
 * čekají na rozhodnutí a nesmí zmizet omylem.
 */
const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    /** Zavření křížkem v rohu. */
    closable?: boolean
    /** Escape zavírá. Vypni u nevratných rozhodnutí. */
    closeOnEscape?: boolean
    /** Kliknutí mimo dialog zavírá. */
    closeOnOverlay?: boolean
    size?: 'sm' | 'md' | 'lg'
    class?: ClassValue
  }>(),
  {
    title: undefined,
    description: undefined,
    closable: true,
    closeOnEscape: true,
    closeOnOverlay: true,
    size: 'md',
    class: undefined,
  },
)

const open = defineModel<boolean>({ default: false })

const panel = useTemplateRef<HTMLElement>('panel')
const id = useId()

/** Odkud dialog vyšel — sem se fokus po zavření vrátí. */
let opener: HTMLElement | null = null

const sizes = { sm: 'w-80', md: 'w-[28rem]', lg: 'w-[36rem]' } as const

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',')

function focusables() {
  return [...(panel.value?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])]
    .filter((el) => el.offsetParent !== null)
}

function close() {
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEscape) {
    event.preventDefault()
    close()
    return
  }

  if (event.key !== 'Tab') return

  const list = focusables()
  if (!list.length) {
    event.preventDefault()
    return
  }

  const first = list[0]!
  const last = list.at(-1)!
  const active = document.activeElement

  // Cyklus na obou koncích. Bez toho Tab vypadne do stránky pod dialogem.
  if (event.shiftKey && (active === first || !panel.value?.contains(active))) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(open, async (isOpen, wasOpen) => {
  if (isOpen) {
    opener = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    await nextTick()
    ;(focusables()[0] ?? panel.value)?.focus()
  } else if (wasOpen) {
    document.body.style.overflow = ''
    opener?.focus()
    opener = null
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-100 flex items-center justify-center p-4"
        @keydown="onKeydown"
      >
        <!-- Překryv sám ztmavuje a rozostřuje; dialog nad ním je `thick`. -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-md"
          :aria-hidden="true"
          @click="closeOnOverlay && close()"
        />

        <Transition
          appear
          enter-active-class="transition duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]"
          enter-from-class="opacity-0 scale-95"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="open"
            ref="panel"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? `${id}-title` : undefined"
            :aria-describedby="description ? `${id}-desc` : undefined"
            tabindex="-1"
            :class="cn(
              'vos-view-thick relative max-h-[85dvh] overflow-y-auto rounded-3xl p-6 shadow-(--panel-shadow)',
              sizes[props.size],
              props.class,
            )"
          >
            <UButton
              v-if="closable"
              icon="lucide:x"
              size="sm"
              class="absolute top-4 right-4"
              aria-label="Zavřít"
              @click="close"
            />

            <header v-if="title || description" class="mb-4 pr-10">
              <h2 v-if="title" :id="`${id}-title`" class="text-title-3 font-semibold">
                {{ title }}
              </h2>
              <p v-if="description" :id="`${id}-desc`" class="mt-1 text-callout text-(--fg-secondary)">
                {{ description }}
              </p>
            </header>

            <slot />

            <footer v-if="$slots.footer" class="mt-6 flex items-center justify-end gap-2">
              <slot name="footer" />
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
