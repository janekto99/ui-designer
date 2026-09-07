<script setup lang="ts">
const size = ref<'sm' | 'md'>('md')
const withIcon = ref(true)
const withAction = ref(true)

const sizeOptions = [
  { label: 'sm', value: 'sm' as const },
  { label: 'md', value: 'md' as const },
]
const iconOptions = [
  { label: 'S ikonou', value: true },
  { label: 'Bez ikony', value: false },
]
const actionOptions = [
  { label: 'S východiskem', value: true },
  { label: 'Bez akce', value: false },
]
</script>

<template>
  <DocPage
    title="Empty"
    description="Prázdno není chyba — je to informace. Proto má text, ne jen mlčící plochu, a proto se navrhuje současně s naplněným stavem, ne až potom."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="withIcon" label="Ikona" :options="iconOptions" />
        <VariantPicker v-model="withAction" label="Akce" :options="actionOptions" />
      </template>

      <PreviewStage min-height="16rem">
        <UCard material="thin" class="w-96">
          <UEmpty
            :size="size"
            :icon="withIcon ? 'lucide:search-x' : undefined"
            title="Žádný zápas nevyhovuje"
            description="Zkus rozšířit datum nebo zrušit filtr povrchu."
          >
            <UButton v-if="withAction" label="Zrušit filtry" size="sm" variant="soft" tone="accent" />
          </UEmpty>
        </UCard>
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Bez ikony v hustém seznamu"
      description="Ikona je nepovinná: v hustém seznamu by ji sedm prázdných sekcí pod sebou jen zaplevelilo."
    >
      <PreviewStage min-height="16rem">
        <div class="flex w-96 flex-col gap-2">
          <UCard v-for="section in ['ATP', 'Challenger', 'ITF']" :key="section" material="thin" padding="none">
            <p class="px-4 pt-3 text-caption-2 tracking-wide text-(--fg-tertiary) uppercase">
              {{ section }}
            </p>
            <UEmpty size="sm" title="Dnes se nehraje" />
          </UCard>
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
