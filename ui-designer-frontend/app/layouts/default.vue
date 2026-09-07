<script setup lang="ts">
const { entries } = useComponents()
const route = useRoute()
</script>

<template>
  <div class="flex min-h-dvh gap-4 p-4">
    <aside class="vos-panel sticky top-4 flex h-[calc(100dvh-2rem)] w-64 shrink-0 flex-col rounded-3xl p-3">
      <NuxtLink to="/" class="mb-4 block px-3 pt-2">
        <span class="block text-title-3 font-semibold">UI Designer</span>
        <span class="block text-caption-1 text-(--fg-secondary)">Sada komponent</span>
      </NuxtLink>

      <p class="px-3 pb-2 text-caption-2 tracking-wide text-(--fg-tertiary) uppercase">Komponenty</p>

      <nav class="flex flex-col gap-0.5 overflow-y-auto">
        <NuxtLink
          v-for="entry in entries"
          :key="entry.slug"
          :to="`/components/${entry.slug}`"
          class="vos-surface flex items-center gap-2.5 rounded-xl px-3 py-2 text-callout outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
          :class="route.path === `/components/${entry.slug}` ? 'vos-selected' : 'vos-plain'"
        >
          <Icon :name="entry.icon" class="size-4 shrink-0" />
          <span class="truncate">{{ entry.name }}</span>
        </NuxtLink>
      </nav>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col gap-4">
      <header class="flex items-center justify-end gap-2">
        <ModeToggle />
        <DesignSelect />
      </header>

      <main class="min-w-0 flex-1 pb-4">
        <slot />
      </main>
    </div>
  </div>
</template>
