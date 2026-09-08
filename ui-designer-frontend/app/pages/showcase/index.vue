<script setup lang="ts">
definePageMeta({ layout: 'showcase' })

const { entries } = useComponents()

const showcases = [
  {
    slug: 'sport',
    name: 'Sportovní data',
    description:
      'Obrazovka zápasů přestavěná z původního frontendu. Sedm rovnocenných číselných sloupců dostalo hierarchii, rozdíly dostaly význam.',
    icon: 'lucide:circle-dot',
    uses: ['Table', 'Tree', 'Breadcrumb', 'Tag', 'Card', 'Dialog', 'Empty', 'Segmented Control'],
  },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <UCard material="regular" padding="lg">
      <h1 class="text-large-title font-semibold">Ukázky</h1>
      <p class="mt-1 max-w-2xl text-body text-(--fg-secondary)">
        Celé obrazovky složené z katalogu. Bez nich se u sady komponent nepozná,
        jestli k něčemu je — jednotlivé prvky vypadají dobře, dokud nemají vedle
        sebe nic dalšího.
      </p>
      <p class="mt-4 text-callout text-(--fg-tertiary)">
        {{ entries.length }} komponent v katalogu · {{ showcases.length }} ukázka
      </p>
    </UCard>

    <NuxtLink v-for="item in showcases" :key="item.slug" :to="`/showcase/${item.slug}`">
      <UCard material="thin" padding="lg" interactive>
        <div class="flex items-start gap-4">
          <span class="vos-view-thick flex size-12 shrink-0 items-center justify-center rounded-2xl">
            <Icon :name="item.icon" class="size-6" />
          </span>

          <div class="min-w-0 flex-1">
            <h2 class="text-title-3 font-semibold">{{ item.name }}</h2>
            <p class="mt-1 text-callout text-(--fg-secondary)">{{ item.description }}</p>

            <div class="mt-3 flex flex-wrap gap-1.5">
              <UTag v-for="used in item.uses" :key="used" :label="used" />
            </div>
          </div>

          <Icon name="lucide:chevron-right" class="size-5 shrink-0 text-(--fg-tertiary)" />
        </div>
      </UCard>
    </NuxtLink>
  </div>
</template>
