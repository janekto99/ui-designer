<script setup lang="ts">
type Shape = 'plain' | 'avatar' | 'actions' | 'search' | 'back' | 'backLabel'

const shape = ref<Shape>('actions')
const query = ref('')

const shapeOptions: { label: string, value: Shape }[] = [
  { label: 'Jen titulek', value: 'plain' },
  { label: 'S avatarem', value: 'avatar' },
  { label: 'S akcemi', value: 'actions' },
  { label: 'S hledáním', value: 'search' },
  { label: 'Se šipkou', value: 'back' },
  { label: 'S popiskem zpět', value: 'backLabel' },
]

const back = computed<boolean | string>(() => {
  if (shape.value === 'back') return true
  if (shape.value === 'backLabel') return 'Zpět'
  return false
})
</script>

<template>
  <DocPage
    title="Navigation Bar"
    description="Ve Figmě má šest podob a liší se jedinou věcí: kde je titulek. Bez návratu je vlevo a velký, s návratem se přesune doprostřed a zmenší."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="shape" label="Podoba" :options="shapeOptions" />
      </template>

      <PreviewStage min-height="12rem">
        <div class="vos-view-thin w-full max-w-2xl rounded-3xl">
          <UNavigationBar title="Knihovna" :back="back">
            <template v-if="shape !== 'plain'" #trailing>
              <UAvatar v-if="shape === 'avatar'" name="Jana Nováková" size="sm" />
              <div v-else-if="shape === 'search'" class="w-56">
                <USearchField v-model="query" size="md" />
              </div>
              <template v-else>
                <UButton icon="lucide:plus" size="sm" aria-label="Přidat" />
                <UButton icon="lucide:ellipsis" size="sm" aria-label="Další" />
              </template>
            </template>
          </UNavigationBar>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="Všechny podoby">
      <PreviewStage min-height="26rem">
        <div class="vos-view-thin flex w-full max-w-2xl flex-col divide-y divide-(--separator) rounded-3xl">
          <UNavigationBar title="Knihovna" />

          <UNavigationBar title="Knihovna">
            <template #trailing>
              <UAvatar name="Jana Nováková" size="sm" />
            </template>
          </UNavigationBar>

          <UNavigationBar title="Knihovna">
            <template #trailing>
              <UButton icon="lucide:plus" size="sm" aria-label="Přidat" />
              <UButton icon="lucide:ellipsis" size="sm" aria-label="Další" />
            </template>
          </UNavigationBar>

          <UNavigationBar title="Detail" back>
            <template #trailing>
              <UButton icon="lucide:share" size="sm" aria-label="Sdílet" />
            </template>
          </UNavigationBar>

          <UNavigationBar title="Detail" back="Zpět">
            <template #trailing>
              <UButton icon="lucide:share" size="sm" aria-label="Sdílet" />
            </template>
          </UNavigationBar>
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
