<script setup lang="ts">
import { proposals } from '~/designs'

definePageMeta({ layout: 'showcase' })

const route = useRoute()

const design = computed(() => proposals.find((d) => d.id === route.params.id))

if (!design.value) {
  throw createError({ statusCode: 404, statusMessage: 'Takový návrh není', fatal: true })
}

const variant = computed(() => design.value!.id as 'linka' | 'mrizka' | 'karta')

const view = ref('screen')
const views = [
  { label: 'Obrazovka', value: 'screen' },
  { label: 'Sada prvků', value: 'kit' },
]
</script>

<template>
  <div v-if="design" class="flex flex-col gap-4">
    <UCard material="regular" padding="lg">
      <div class="flex flex-wrap items-baseline gap-3">
        <h1 class="text-title-1 font-semibold">{{ design.name }}</h1>
        <span class="text-callout text-(--fg-secondary)">{{ design.tagline }}</span>
        <div class="flex-1" />
        <USegmentedControl v-model="view" :segments="views" size="sm" aria-label="Co ukázat" />
      </div>
      <p class="mt-2 max-w-3xl text-callout text-(--fg-secondary)">{{ design.premise }}</p>
    </UCard>

    <!-- Návrh běží ve své vlastní třídě, ne v designu katalogu okolo. -->
    <div :class="design.className">
      <UCard material="thin" padding="none" class="overflow-hidden">
        <div class="bg-(--preview-backdrop) p-6">
          <PgKit v-if="view === 'kit'" />

          <PgLayout v-else :variant="variant" />
        </div>
      </UCard>
    </div>
  </div>
</template>
