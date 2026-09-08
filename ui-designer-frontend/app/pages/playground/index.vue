<script setup lang="ts">
import { proposals } from '~/designs'
import { tournaments } from '~/showcase/sport/data'

definePageMeta({ layout: 'showcase' })

const genoa = tournaments.find((t) => t.id === 'genoa')!
</script>

<template>
  <div class="flex flex-col gap-4">
    <UCard material="regular" padding="lg">
      <h1 class="text-large-title font-semibold">Playground</h1>
      <p class="mt-2 max-w-3xl text-body text-(--fg-secondary)">
        Tři návrhy pro sportovní web. Každý bere z Apple prvků něco jiného a
        každý jinak odpovídá na tutéž výtku — že se původní obrazovka slévá.
      </p>
      <p class="mt-3 max-w-3xl text-callout text-(--fg-tertiary)">
        Data jsou ve všech třech stejná, aby šly porovnat. Designy jsou zároveň
        zapsané v přepínači vpravo nahoře, takže se dají pustit na celý katalog.
      </p>
    </UCard>

    <!--
      Tři návrhy vedle sebe. Třída designu sedí na obalu, ne na <html> —
      díky tomu jdou porovnat naráz, což je jediný způsob, jak se dá vybrat.
    -->
    <div class="grid items-start gap-4 xl:grid-cols-3">
      <div v-for="design in proposals" :key="design.id" :class="design.className">
        <UCard material="thin" padding="none" class="flex flex-col overflow-hidden">
          <div class="border-b border-(--separator) px-5 py-4">
            <div class="flex items-baseline gap-2">
              <h2 class="text-title-3 font-semibold">{{ design.name }}</h2>
              <span class="text-caption-1 text-(--fg-tertiary)">{{ design.tagline }}</span>
            </div>
            <p class="mt-2 text-footnote text-(--fg-secondary)">{{ design.premise }}</p>
          </div>

          <div class="bg-(--preview-backdrop) p-4">
            <PgMatchList :tournament="genoa" :variant="design.id as never" compact />
          </div>

          <div class="border-t border-(--separator) px-5 py-3">
            <NuxtLink :to="`/playground/${design.id}`">
              <UButton label="Otevřít návrh" icon="lucide:arrow-right" variant="soft" tone="accent" size="sm" block />
            </NuxtLink>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
