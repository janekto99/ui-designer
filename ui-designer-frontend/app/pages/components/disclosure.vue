<script setup lang="ts">
const plain = ref(false)
const withHint = ref(true)
const open = ref(true)

const styleOptions = [
  { label: 'S rámem', value: false },
  { label: 'Bez rámu', value: true },
]
const hintOptions = [
  { label: 'S počtem', value: true },
  { label: 'Bez počtu', value: false },
]

const groups = ref<Record<string, boolean>>({ atp: true, challenger: false, itf: false })
</script>

<template>
  <DocPage
    title="Disclosure"
    description="Obsah zůstává v DOM i zavřený — nemusí se při otevření znovu vykreslovat a nepřeskočí to. Výška se animuje přes grid-template-rows, protože height: auto se animovat nedá."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="plain" label="Rám" :options="styleOptions" />
        <VariantPicker v-model="withHint" label="Vpravo" :options="hintOptions" />
      </template>

      <PreviewStage min-height="14rem">
        <div class="w-96">
          <UDisclosure
            v-model="open"
            label="Challenger Phan Thiet"
            icon="lucide:trophy"
            :hint="withHint ? 8 : undefined"
            :plain="plain"
          >
            <p class="text-callout text-(--fg-secondary)">
              Tvrdý povrch, Vietnam. Osm zápasů v hlavní soutěži, první výkop v 5:00.
            </p>
          </UDisclosure>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Skupiny pod sebou"
      description="Každá si drží svůj stav; sbalení jedné se ostatních netýká."
    >
      <PreviewStage min-height="20rem">
        <div class="flex w-96 flex-col gap-2">
          <UDisclosure v-model="groups.atp" label="ATP" :hint="6">
            <UList variant="plain">
              <UListRow title="Roland Garros" subtitle="Antuka" chevron />
              <UListRow title="Wimbledon" subtitle="Tráva" chevron />
            </UList>
          </UDisclosure>

          <UDisclosure v-model="groups.challenger" label="Challenger" :hint="26">
            <UList variant="plain">
              <UListRow title="Phan Thiet" subtitle="Hard" chevron />
            </UList>
          </UDisclosure>

          <UDisclosure v-model="groups.itf" label="ITF" :hint="27" disabled />
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
