<script setup lang="ts">
const text = ref('Ahoj')
const sent = ref<string>()
</script>

<template>
  <DocPage
    title="Keyboard"
    description="Na web se nehodí — prohlížeč má vlastní klávesnici a tahle ji nenahradí. Je tu proto, že ve Figmě je to stránka jako každá jiná, a je to nejnázornější ukázka toho, jak se sklo chová v hustém rastru."
  >
    <DocSection
      title="Náhled"
      description="Klávesy opravdu píšou. Shift funguje na jeden znak, 123 přepne na čísla a interpunkci."
    >
      <PreviewStage min-height="30rem">
        <UKeyboard v-model="text" @submit="sent = text" />
      </PreviewStage>

      <p v-if="sent" class="mt-3 text-center text-footnote text-(--fg-secondary)">
        Odesláno: {{ sent }}
      </p>
    </DocSection>
  </DocPage>
</template>
