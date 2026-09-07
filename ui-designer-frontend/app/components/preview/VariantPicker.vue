<script setup lang="ts" generic="T extends string | number | boolean">
defineProps<{
  label: string
  options: { label: string, value: T }[]
}>()

const model = defineModel<T>({ required: true })
</script>

<template>
  <div class="flex items-center gap-3">
    <span class="shrink-0 text-footnote text-(--fg-secondary)">{{ label }}</span>

    <div
      class="vos-surface vos-glass flex items-center gap-1 rounded-full p-1"
      role="radiogroup"
      :aria-label="label"
    >
      <button
        v-for="option in options"
        :key="String(option.value)"
        type="button"
        role="radio"
        :aria-checked="model === option.value"
        class="vos-surface h-7 cursor-pointer rounded-full px-3 text-footnote outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
        :class="model === option.value ? 'vos-selected' : 'vos-plain'"
        @click="model = option.value"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
