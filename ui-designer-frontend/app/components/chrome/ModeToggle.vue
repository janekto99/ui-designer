<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'lucide:moon' : 'lucide:sun'"
      variant="glass"
      :aria-label="isDark ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'"
      @click="toggle"
    />
    <template #fallback>
      <div class="size-11" />
    </template>
  </ClientOnly>
</template>
