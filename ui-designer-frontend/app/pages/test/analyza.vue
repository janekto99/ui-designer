<script setup lang="ts">
definePageMeta({ layout: 'test' })
useHead({ title: 'Analýza — Test' })
</script>

<template>
  <UCard material="regular">
    <!--
      V předloze je tahle stránka taky jen nadpis. Předstírat víc by byla lež —
      prázdný stav aspoň řekne, co sem přijde.
    -->
    <UEmpty
      icon="lucide:microscope"
      title="Analýza"
      description="Sekce zatím nemá obsah — stejně jako v předloze. Až bude, poskládá se ze stejných komponent jako seznam."
    >
      <NuxtLink to="/test">
        <UButton label="Zpět na zápasy" variant="soft" tone="accent" size="sm" />
      </NuxtLink>
    </UEmpty>
  </UCard>
</template>
