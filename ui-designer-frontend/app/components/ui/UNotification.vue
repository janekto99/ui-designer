<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

export interface NotificationAction {
  label: string
  role?: 'default' | 'destructive'
}

/**
 * Oznámení má ve Figmě dvě podoby: sbalenou pilulku a rozbalenou kartu
 * s hlavičkou, náhledem a akcemi. Není to dvojí komponenta — je to jeden
 * prvek, který se po rozbalení dopne.
 */
const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    /** Ikona aplikace vlevo. */
    icon?: string
    expanded?: boolean
    /** Obrázek v rozbalené podobě. */
    image?: string
    actions?: NotificationAction[]
    dismissLabel?: string
    class?: ClassValue
  }>(),
  {
    description: undefined,
    icon: 'lucide:bell',
    expanded: false,
    image: undefined,
    actions: () => [],
    dismissLabel: 'Zavřít',
    class: undefined,
  },
)

defineEmits<{ action: [action: NotificationAction, index: number], dismiss: [], back: [], more: [] }>()
</script>

<template>
  <!-- Sbalená podoba: pilulka, nic víc než ikona a dva řádky textu. -->
  <div
    v-if="!expanded"
    role="status"
    :class="cn(
      'vos-surface vos-glass flex w-80 items-center gap-3 rounded-full py-2.5 pr-5 pl-3',
      props.class,
    )"
  >
    <span class="vos-view-thin flex size-9 shrink-0 items-center justify-center rounded-full">
      <Icon :name="icon" class="size-5" />
    </span>
    <span class="min-w-0 flex-1">
      <span class="block truncate text-callout font-semibold">{{ title }}</span>
      <span v-if="description" class="block truncate text-caption-1 text-(--fg-secondary)">
        {{ description }}
      </span>
    </span>
  </div>

  <!-- Rozbalená podoba: hlavička, náhled, akce, zavření. -->
  <div
    v-else
    role="status"
    :class="cn(
      'vos-view-thick flex w-80 flex-col overflow-hidden rounded-3xl',
      'shadow-(--panel-shadow)',
      props.class,
    )"
  >
    <div class="flex items-center justify-between gap-2 px-3 pt-3">
      <UButton icon="lucide:chevron-left" size="sm" aria-label="Zpět" @click="$emit('back')" />
      <span class="vos-view-thin flex size-8 items-center justify-center rounded-full">
        <Icon :name="icon" class="size-4" />
      </span>
      <UButton icon="lucide:ellipsis" size="sm" aria-label="Další" @click="$emit('more')" />
    </div>

    <div class="px-5 pt-3 pb-4">
      <h3 class="text-headline font-semibold">{{ title }}</h3>
      <p v-if="description" class="mt-0.5 text-subheadline text-(--fg-secondary)">
        {{ description }}
      </p>
    </div>

    <div v-if="image || $slots.default" class="px-4 pb-4">
      <img v-if="image" :src="image" alt="" class="w-full rounded-2xl object-cover">
      <slot />
    </div>

    <div class="flex flex-col">
      <template v-for="(action, index) in actions" :key="index">
        <hr class="vos-separator">
        <button
          type="button"
          class="vos-surface vos-plain h-11 w-full cursor-pointer px-4 text-body font-semibold outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:-outline-offset-2"
          :class="action.role === 'destructive' && 'text-(--vos-red)'"
          @click="$emit('action', action, index)"
        >
          {{ action.label }}
        </button>
      </template>

      <hr class="vos-separator">
      <button
        type="button"
        class="vos-surface vos-plain h-11 w-full cursor-pointer px-4 text-body text-(--fg-secondary) outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:-outline-offset-2"
        @click="$emit('dismiss')"
      >
        {{ dismissLabel }}
      </button>
    </div>
  </div>
</template>
