<script setup lang="ts">
const { entries } = useComponents()
const { design } = useDesign()
</script>

<template>
  <div class="vos-panel rounded-3xl p-8">
    <h1 class="text-large-title font-semibold">{{ design.name }}</h1>
    <p class="mt-1 text-body text-(--fg-secondary)">{{ design.tagline }}</p>

    <div class="mt-8 flex flex-wrap gap-3">
      <NuxtLink v-for="entry in entries" :key="entry.slug" :to="`/components/${entry.slug}`">
        <UButton :icon="entry.icon" :label="entry.name" size="lg" />
      </NuxtLink>
    </div>
  </div>
</template>
