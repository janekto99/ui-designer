<script setup lang="ts">
const size = ref<'sm' | 'md'>('md')
const count = ref(5)
const page = ref(0)

const sizeOptions = [
  { label: 'sm', value: 'sm' as const },
  { label: 'md', value: 'md' as const },
]
const countOptions = [2, 3, 4, 5, 6, 7, 8].map((n) => ({ label: String(n), value: n }))

watchEffect(() => {
  if (page.value > count.value - 1) page.value = count.value - 1
})

const rows = ref<Record<number, number>>({ 2: 0, 3: 1, 4: 2, 5: 2, 6: 3, 7: 3, 8: 4 })
</script>

<template>
  <DocPage
    title="Page Control"
    description="Aktivní tečka je plná, ostatní tlumené — a čím dál od aktivní, tím menší. Bez toho zmenšování vypadá řada osmi teček jako mřížka, ne jako stránkování."
  >
    <DocSection
      title="Náhled"
      description="Šipkami vlevo a vpravo se listuje, Home a End skočí na kraje."
    >
      <template #controls>
        <VariantPicker v-model="size" label="Velikost" :options="sizeOptions" />
        <VariantPicker v-model="count" label="Stránek" :options="countOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <div class="flex flex-col items-center gap-4">
          <UPageControl v-model="page" :count="count" :size="size" />
          <span class="text-caption-1 text-(--fg-tertiary)">
            stránka {{ page + 1 }} z {{ count }}
          </span>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="Počty" description="Dvě až osm stránek, jak je to v kitu vykreslené.">
      <PreviewStage min-height="16rem">
        <div class="flex flex-col items-center gap-4">
          <UPageControl
            v-for="n in [2, 3, 4, 5, 6, 7, 8]"
            :key="n"
            v-model="rows[n]"
            :count="n"
            :aria-label="`${n} stránek`"
          />
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
