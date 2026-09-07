<script setup lang="ts">
const { groups, entries } = useComponents()
const { design } = useDesign()
</script>

<template>
  <div class="flex flex-col gap-4">
    <section class="vos-panel rounded-3xl p-8">
      <h1 class="text-large-title font-semibold">{{ design.name }}</h1>
      <p class="mt-1 text-body text-(--fg-secondary)">{{ design.tagline }}</p>
      <p class="mt-4 text-callout text-(--fg-tertiary)">
        {{ entries.length }} komponent podle Apple visionOS UI Kitu.
      </p>
    </section>

    <DocSection v-for="group in groups" :key="group.name" :title="group.name">
      <div class="flex flex-wrap gap-3">
        <NuxtLink v-for="entry in group.items" :key="entry.slug" :to="`/components/${entry.slug}`">
          <UButton :icon="entry.icon" :label="entry.name" />
        </NuxtLink>
      </div>
    </DocSection>
  </div>
</template>
