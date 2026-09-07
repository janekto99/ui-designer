<script setup lang="ts">
const withAction = ref(true)
const withSubtitle = ref(true)
const closed = ref(false)

const actionOptions = [
  { label: 'S akcí', value: true },
  { label: 'Bez akce', value: false },
]
const subtitleOptions = [
  { label: 'Dva řádky', value: true },
  { label: 'Jeden řádek', value: false },
]
</script>

<template>
  <DocPage
    title="Temporary Notice"
    description="Krátkodobé sdělení. Proti oznámení nemá hlavičku ani rozbalenou podobu — ve Figmě jsou jen dvě varianty, s akcí a bez ní."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="withAction" label="Akce" :options="actionOptions" />
        <VariantPicker v-model="withSubtitle" label="Text" :options="subtitleOptions" />
      </template>

      <PreviewStage min-height="10rem">
        <UTemporaryNotice
          v-if="!closed"
          icon="lucide:wifi-off"
          title="Bez připojení"
          :subtitle="withSubtitle ? 'Změny se uloží později' : undefined"
          :action="withAction ? 'Zkusit znovu' : undefined"
          @close="closed = true"
        />
        <UButton v-else label="Vrátit zpět" @click="closed = false" />
      </PreviewStage>
    </DocSection>

    <DocSection title="Varianty">
      <PreviewStage min-height="12rem">
        <div class="flex flex-col gap-3">
          <UTemporaryNotice icon="lucide:check" title="Uloženo" />
          <UTemporaryNotice icon="lucide:cloud-off" title="Offline" subtitle="Pracuje se lokálně" />
          <UTemporaryNotice
            icon="lucide:refresh-cw"
            title="Nová verze"
            subtitle="Restartuj pro dokončení"
            action="Restartovat"
          />
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
