<script setup lang="ts">
withDefaults(defineProps<{ minHeight?: string }>(), { minHeight: '14rem' })
</script>

<template>
  <!--
    Vyhloubený rám se scénou uvnitř. Bez něčeho pod sklem se sklo neposoudí:
    bílá výplň na 6 % je na bílé ploše neviditelná a na šedé vypadá jako chyba.
  -->
  <div
    class="vos-stage vos-recessed flex items-center justify-center overflow-hidden rounded-3xl p-10"
    :style="{ minHeight }"
  >
    <div class="flex flex-wrap items-center justify-center gap-6">
      <slot />
    </div>
  </div>
</template>
