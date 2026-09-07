<script setup lang="ts">
defineProps<{ title: string, description?: string }>()
</script>

<template>
  <section class="vos-panel rounded-3xl p-6">
    <h2 class="text-title-3 font-semibold">{{ title }}</h2>
    <p v-if="description" class="mt-1 text-footnote text-(--fg-secondary)">{{ description }}</p>

    <!-- Ovládání náhledu; když stránka nic nepředá, mezera nevznikne. -->
    <div v-if="$slots.controls" class="mt-4 mb-5 flex flex-wrap gap-x-8 gap-y-3">
      <slot name="controls" />
    </div>
    <div v-else class="h-4" />

    <slot />
  </section>
</template>
