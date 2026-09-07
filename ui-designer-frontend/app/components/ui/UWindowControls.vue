<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Rám okna: zavírací tlačítko vlevo, úchyt dole, táhla v rozích a volitelné
 * odznaky nad oknem.
 *
 * Na webu tohle nemá obdobu — prohlížeč si okno řídí sám. Je to tu proto, že
 * ve Figmě je to stránka jako každá jiná, a bez ní by sada nebyla úplná.
 * V aplikaci se použije nanejvýš `documentTitle`.
 */
const props = withDefaults(
  defineProps<{
    /** Odznak s názvem dokumentu nad oknem. */
    documentTitle?: string
    /** Stav SharePlay: `null` se neukazuje. */
    shareStatus?: 'shared' | 'not-shared'
    /** Oranžový odznak nahrávání. */
    recording?: boolean
    /** Táhla v rozích, kterými se okno zvětšuje. */
    handles?: boolean
    class?: ClassValue
  }>(),
  {
    documentTitle: undefined,
    shareStatus: undefined,
    recording: false,
    handles: true,
    class: undefined,
  },
)

defineEmits<{ close: [], title: [], share: [] }>()

const hasOrnaments = computed(() =>
  Boolean(props.documentTitle) || Boolean(props.shareStatus) || props.recording,
)
</script>

<template>
  <div :class="cn('flex flex-col items-center gap-3', props.class)">
    <div v-if="hasOrnaments" class="flex flex-wrap items-center justify-center gap-2">
      <button
        v-if="documentTitle"
        type="button"
        class="vos-surface vos-glass flex h-9 cursor-pointer items-center gap-2 rounded-full pr-2.5 pl-2 text-callout outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
        @click="$emit('title')"
      >
        <span class="flex size-6 items-center justify-center rounded-full bg-(--vos-blue) text-white">
          <Icon name="lucide:file" class="size-3.5" />
        </span>
        <span class="max-w-40 truncate">{{ documentTitle }}</span>
        <Icon name="lucide:chevron-down" class="size-4 text-(--fg-secondary)" />
      </button>

      <button
        v-if="shareStatus"
        type="button"
        class="flex h-9 cursor-pointer items-center gap-2 rounded-full px-3 text-callout outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
        :class="shareStatus === 'shared'
          ? 'bg-(--vos-green) font-semibold text-black'
          : 'vos-surface vos-glass text-(--fg-secondary)'"
        @click="$emit('share')"
      >
        <Icon v-if="shareStatus === 'shared'" name="lucide:users" class="size-4" />
        {{ shareStatus === 'shared' ? 'Sdíleno' : 'Nesdíleno' }}
        <Icon name="lucide:chevron-right" class="size-4 opacity-60" />
      </button>

      <span
        v-if="recording"
        class="flex h-9 items-center gap-2 rounded-full bg-(--vos-orange) px-3 text-callout font-semibold text-black"
        role="status"
      >
        <Icon name="lucide:mic" class="size-4" />
        Nahrává se
      </span>
    </div>

    <div class="relative">
      <!-- Zavření sedí vlevo od okna, ne v jeho titulkovém pruhu. -->
      <button
        type="button"
        class="vos-surface vos-glass absolute top-1/2 -left-14 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
        aria-label="Zavřít okno"
        @click="$emit('close')"
      >
        <Icon name="lucide:x" class="size-5" />
      </button>

      <div class="vos-panel relative overflow-hidden rounded-3xl">
        <slot />

        <template v-if="handles">
          <span
            v-for="corner in ['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3']"
            :key="corner"
            class="pointer-events-none absolute size-5 rounded-full border-2 border-white/25"
            :class="corner"
            aria-hidden="true"
          />
        </template>
      </div>

      <!-- Úchyt pro posun okna. Ve Figmě je to jediná vodorovná pilulka. -->
      <span
        class="absolute -bottom-5 left-1/2 h-1.5 w-24 -translate-x-1/2 rounded-full bg-white/40"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
