<script setup lang="ts">
const expanded = ref(false)
const withImage = ref(true)
const last = ref<string>()

const shapeOptions = [
  { label: 'Sbalené', value: false },
  { label: 'Rozbalené', value: true },
]
const imageOptions = [
  { label: 'S náhledem', value: true },
  { label: 'Bez náhledu', value: false },
]

/**
 * Náhled je vykreslený přechodem, ne staženou fotkou — projekt nemá běžet
 * proti síti a pro posouzení rozvržení to stačí.
 */
const preview =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180">
       <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0%" stop-color="%23ffd9a8"/><stop offset="55%" stop-color="%237ea6c9"/>
         <stop offset="100%" stop-color="%232c2040"/>
       </linearGradient></defs>
       <rect width="320" height="180" fill="url(%23g)"/>
     </svg>`,
  )
</script>

<template>
  <DocPage
    title="Notification"
    description="Dvě podoby: sbalená pilulka a rozbalená karta s hlavičkou, náhledem a akcemi. Není to dvojí komponenta — je to jeden prvek, který se po rozbalení dopne."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="expanded" label="Podoba" :options="shapeOptions" />
        <VariantPicker v-model="withImage" label="Náhled" :options="imageOptions" />
      </template>

      <PreviewStage min-height="24rem">
        <UNotification
          icon="lucide:image"
          title="Nová vzpomínka"
          description="Album ze včerejšího výletu je připravené."
          :expanded="expanded"
          :image="expanded && withImage ? preview : undefined"
          :actions="[{ label: 'Zobrazit' }, { label: 'Sdílet' }]"
          dismiss-label="Zavřít"
          @action="(a) => (last = a.label)"
          @dismiss="last = 'Zavřít'"
        />
      </PreviewStage>

      <p v-if="last" class="mt-3 text-center text-footnote text-(--fg-secondary)">
        Naposledy stisknuto: {{ last }}
      </p>
    </DocSection>

    <DocSection title="Obě podoby vedle sebe">
      <PreviewStage min-height="26rem">
        <div class="flex flex-wrap items-start justify-center gap-6">
          <UNotification
            icon="lucide:message-circle"
            title="Zpráva"
            description="Petr Svoboda"
          />
          <UNotification
            icon="lucide:message-circle"
            title="Zpráva"
            description="Petr Svoboda"
            expanded
            :actions="[{ label: 'Odpovědět' }]"
          />
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
