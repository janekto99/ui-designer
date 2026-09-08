<script setup lang="ts">
definePageMeta({ layout: 'test' })
useHead({ title: 'Výsledky — Test' })
</script>

<template>
  <div class="flex gap-5">
    <TestSidebar source="results" />
    <TestMatchList source="results" />
  </div>
</template>
