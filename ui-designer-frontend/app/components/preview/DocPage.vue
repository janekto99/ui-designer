<script setup lang="ts">
defineProps<{ title: string, description?: string }>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <header class="vos-panel rounded-3xl px-6 py-5">
      <h1 class="text-title-1 font-semibold">{{ title }}</h1>
      <p v-if="description" class="mt-1 text-callout text-(--fg-secondary)">{{ description }}</p>
    </header>

    <slot />
  </div>
</template>
