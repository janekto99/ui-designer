<script setup lang="ts">
const variant = ref<'plain' | 'inset'>('plain')
const withSubtitle = ref(true)
const withHeader = ref(true)

const variantOptions = [
  { label: 'plain', value: 'plain' as const },
  { label: 'inset', value: 'inset' as const },
]
const subtitleOptions = [
  { label: 'Dva řádky', value: true },
  { label: 'Jeden řádek', value: false },
]
const headerOptions = [
  { label: 'S hlavičkou', value: true },
  { label: 'Bez hlavičky', value: false },
]

const selected = ref('b')
const rows = [
  { key: 'a', title: 'Wi-Fi', subtitle: 'Domácí síť', icon: 'lucide:wifi', value: 'Připojeno' },
  { key: 'b', title: 'Bluetooth', subtitle: 'Zapnuto', icon: 'lucide:bluetooth', value: '3 zařízení' },
  { key: 'c', title: 'Mobilní data', subtitle: 'Vypnuto', icon: 'lucide:signal' },
]

const notifications = ref(true)
const sounds = ref(false)
const order = ['První položka', 'Druhá položka', 'Třetí položka']
</script>

<template>
  <DocPage
    title="List"
    description="Seznam sedí na materiálu thin — nejlehčím ze čtyř. Je to plocha pod obsahem, ne nad ním; kdyby byl tlustší, přebil by okno, ve kterém leží."
  >
    <DocSection
      title="Náhled"
      description="plain má řádky na sobě oddělené vlasovou čárou, inset je od sebe odsazuje a každý dostane vlastní zaoblení."
    >
      <template #controls>
        <VariantPicker v-model="variant" label="Varianta" :options="variantOptions" />
        <VariantPicker v-model="withSubtitle" label="Text" :options="subtitleOptions" />
        <VariantPicker v-model="withHeader" label="Hlavička" :options="headerOptions" />
      </template>

      <PreviewStage min-height="20rem">
        <div class="w-96">
          <UList
            :variant="variant"
            :header="withHeader ? 'Připojení' : undefined"
            :footer="withHeader ? 'Nastavení platí jen pro tuto síť.' : undefined"
            aria-label="Připojení"
          >
            <UListRow
              v-for="row in rows"
              :key="row.key"
              :variant="variant"
              :title="row.title"
              :subtitle="withSubtitle ? row.subtitle : undefined"
              :icon="row.icon"
              :value="row.value"
              :selected="row.key === selected"
              chevron
              @select="selected = row.key"
            />
          </UList>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection
      title="Doplňky vpravo"
      description="Šipka, fajfka, text, přepínač a úchyt pro přesun — ve Figmě je to jeden řádek, ne pět komponent."
    >
      <PreviewStage min-height="24rem">
        <div class="w-96">
          <UList header="Doplňky">
            <UListRow title="Vede jinam" chevron />
            <UListRow title="Je vybraná" checked />
            <UListRow title="Má hodnotu" value="Vždy" />
            <UListRow title="Oznámení">
              <template #trailing>
                <UToggle v-model="notifications" size="sm" aria-label="Oznámení" />
              </template>
            </UListRow>
            <UListRow title="Zvuky">
              <template #trailing>
                <UToggle v-model="sounds" size="sm" aria-label="Zvuky" />
              </template>
            </UListRow>
            <UListRow title="S avatarem" chevron interactive>
              <template #leading>
                <UAvatar name="Jana Nováková" size="sm" />
              </template>
            </UListRow>
            <UListRow title="Zakázaná" chevron disabled />
          </UList>
        </div>
      </PreviewStage>
    </DocSection>

    <DocSection title="Přeuspořádání">
      <PreviewStage min-height="16rem">
        <div class="w-96">
          <UList variant="inset">
            <UListRow
              v-for="item in order"
              :key="item"
              variant="inset"
              :title="item"
              reorderable
              class="vos-view-thin"
            >
              <template #leading>
                <UCheckbox size="sm" :aria-label="item" />
              </template>
            </UListRow>
          </UList>
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
