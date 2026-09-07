<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

export interface AlertAction {
  label: string
  /** `cancel` je světlejší, `destructive` červená — obojí je z Figmy. */
  role?: 'default' | 'cancel' | 'destructive'
}

/**
 * Ve Figmě sedí alert na materiálu `thick` — nejneprůhlednějším ze čtyř.
 * Je to jediný prvek, který smí obsah pod sebou skoro zakrýt, protože čeká
 * na rozhodnutí.
 *
 * Akce jsou svislé řádky oddělené vlasovou čárou, ne tlačítka vedle sebe.
 */
const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    /** Ikona aplikace nad titulkem. */
    icon?: string
    actions?: AlertAction[]
    class?: ClassValue
  }>(),
  { description: undefined, icon: undefined, actions: () => [], class: undefined },
)

defineEmits<{ action: [action: AlertAction, index: number] }>()

const roleClass = (role: AlertAction['role']) => {
  if (role === 'destructive') return 'text-(--vos-red) font-semibold'
  if (role === 'cancel') return 'text-(--fg-secondary)'
  return 'font-semibold'
}
</script>

<template>
  <div
    role="alertdialog"
    aria-modal="true"
    :aria-label="title"
    :class="cn(
      'vos-view-thick flex w-80 flex-col overflow-hidden rounded-3xl',
      'shadow-(--panel-shadow)',
      props.class,
    )"
  >
    <div class="flex flex-col items-center px-6 pt-6 pb-5 text-center">
      <span
        v-if="icon"
        class="vos-surface vos-glass mb-3 flex size-14 items-center justify-center rounded-full"
      >
        <Icon :name="icon" class="size-7" />
      </span>

      <h2 class="text-headline font-semibold">{{ title }}</h2>
      <p v-if="description" class="mt-1 text-subheadline text-(--fg-secondary)">
        {{ description }}
      </p>

      <!-- Sem patří pole nebo zadání kódu — ve Figmě jsou to dvě varianty. -->
      <div v-if="$slots.default" class="mt-4 w-full">
        <slot />
      </div>
    </div>

    <div v-if="actions.length" class="flex flex-col">
      <template v-for="(action, index) in actions" :key="index">
        <hr class="vos-separator">
        <button
          type="button"
          class="vos-surface vos-plain h-11 w-full cursor-pointer px-4 text-body outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:-outline-offset-2"
          :class="roleClass(action.role)"
          @click="$emit('action', action, index)"
        >
          {{ action.label }}
        </button>
      </template>
    </div>
  </div>
</template>
