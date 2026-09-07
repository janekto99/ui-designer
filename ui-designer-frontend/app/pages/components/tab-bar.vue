<script setup lang="ts">
const expanded = ref(false)
const count = ref(5)
const value = ref('domu')

const expandOptions = [
  { label: 'Sbalená', value: false },
  { label: 'Rozbalená', value: true },
]
const countOptions = [2, 3, 4, 5, 6, 7].map((n) => ({ label: String(n), value: n }))

const all = [
  { label: 'Domů', value: 'domu', icon: 'lucide:house' },
  { label: 'Hledat', value: 'hledat', icon: 'lucide:search' },
  { label: 'Knihovna', value: 'knihovna', icon: 'lucide:library' },
  { label: 'Oblíbené', value: 'oblibene', icon: 'lucide:heart' },
  { label: 'Sdílené', value: 'sdilene', icon: 'lucide:users' },
  { label: 'Stažené', value: 'stazene', icon: 'lucide:download' },
  { label: 'Nastavení', value: 'nastaveni', icon: 'lucide:settings' },
]

const items = computed(() => all.slice(0, count.value))

watchEffect(() => {
  if (!items.value.some((i) => i.value === value.value)) value.value = items.value[0]!.value
})

const collapsedValue = ref('domu')
const expandedValue = ref('knihovna')
</script>

<template>
  <DocPage
    title="Tab Bar"
    description="Ve visionOS je lišta karet svislá a stojí vedle okna, ne pod ním. Sbalená ukazuje jen ikony, rozbalená ikony s popisky — je to jedna lišta, která se roztáhne."
  >
    <DocSection
      title="Náhled"
      description="Šipkami nahoru a dolů se přepíná karta, jak se u svislé lišty čeká."
    >
      <template #controls>
        <VariantPicker v-model="expanded" label="Podoba" :options="expandOptions" />
        <VariantPicker v-model="count" label="Položek" :options="countOptions" />
      </template>

      <PreviewStage min-height="24rem">
        <UTabBar v-model="value" :items="items" :expanded="expanded" aria-label="Sekce" />
      </PreviewStage>
    </DocSection>

    <DocSection title="Obě podoby vedle sebe">
      <PreviewStage min-height="24rem">
        <div class="flex items-start gap-8">
          <UTabBar v-model="collapsedValue" :items="all.slice(0, 5)" aria-label="Sbalená" />
          <UTabBar v-model="expandedValue" :items="all.slice(0, 5)" expanded aria-label="Rozbalená" />
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
