<script setup lang="ts">
definePageMeta({ layout: 'test' })
useHead({ title: 'Zápasy — Test' })
</script>

<template>
  <div class="flex gap-5">
    <TestSidebar source="upcoming" />
    <TestMatchList source="upcoming" />
  </div>
</template>
