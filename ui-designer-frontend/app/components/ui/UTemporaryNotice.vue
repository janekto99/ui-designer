<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Krátkodobé sdělení — pilulka s křížkem vlevo. Na rozdíl od oznámení nemá
 * hlavičku ani rozbalenou podobu; ve Figmě jsou jen dvě varianty, s akcí
 * a bez ní.
 */
const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    icon?: string
    /** Popisek tlačítka vpravo. Bez něj je pilulka jen informativní. */
    action?: string
    class?: ClassValue
  }>(),
  { subtitle: undefined, icon: undefined, action: undefined, class: undefined },
)

defineEmits<{ close: [], action: [] }>()
</script>

<template>
  <div
    role="status"
    :class="cn(
      'vos-surface vos-glass flex items-center gap-3 rounded-full py-2 pr-2 pl-3',
      props.class,
    )"
  >
    <button
      type="button"
      class="vos-surface vos-plain flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
      aria-label="Zavřít"
      @click="$emit('close')"
    >
      <Icon name="lucide:x" class="size-4" />
    </button>

    <Icon v-if="icon" :name="icon" class="size-5 shrink-0 text-(--fg-secondary)" />

    <span class="min-w-0 flex-1 pr-1">
      <span class="block truncate text-callout font-semibold">{{ title }}</span>
      <span v-if="subtitle" class="block truncate text-caption-1 text-(--fg-secondary)">
        {{ subtitle }}
      </span>
    </span>

    <UButton v-if="action" :label="action" size="sm" @click="$emit('action')" />
  </div>
</template>
