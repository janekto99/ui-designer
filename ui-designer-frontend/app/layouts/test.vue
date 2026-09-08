<script setup lang="ts">
/**
 * Rozvržení testovací aplikace.
 *
 * Při vstupu přepne design na Pastel — ukázka je psaná pro něj. Přepínač
 * vpravo nahoře zůstává funkční, aby šlo porovnat s visionOS.
 */
const route = useRoute()
const { id } = useDesign()

onMounted(() => {
  if (id.value !== 'pastel') id.value = 'pastel'
})

const nav = [
  { label: 'Zápasy', value: '/test', icon: 'lucide:chart-column' },
  { label: 'Výsledky', value: '/test/vysledky', icon: 'lucide:trophy' },
  { label: 'Analýza', value: '/test/analyza', icon: 'lucide:microscope' },
]

const current = computed({
  get: () => nav.find((n) => n.value === route.path)?.value ?? '/test',
  set: (value: string) => navigateTo(value),
})
</script>

<template>
  <div class="flex min-h-dvh flex-col gap-4 p-4">
    <!-- Lišta katalogu, ne aplikace — odsud se dá vyskočit zpět. -->
    <header class="flex flex-wrap items-center gap-2">
      <NuxtLink to="/" class="vos-panel flex items-center gap-2 rounded-surface px-3 py-2">
        <span class="text-callout font-semibold">UI Designer</span>
      </NuxtLink>
      <AreaSwitch />
      <div class="flex-1" />
      <ModeToggle />
      <DesignSelect />
    </header>

    <UCard material="regular" padding="none" class="flex flex-1 flex-col overflow-hidden">
      <!-- Odsud dolů je to aplikace. -->
      <div class="flex flex-wrap items-center gap-4 border-b border-(--separator) px-5 py-3">
        <span class="text-title-3 font-semibold tracking-tight">SPORT</span>

        <div class="flex-1" />
        <USegmentedControl v-model="current" :segments="nav" size="sm" aria-label="Sekce" />
        <div class="flex-1" />

        <UButton label="EN" variant="plain" size="sm" />
        <UButton label="Přihlásit" variant="plain" size="sm" />
        <UButton label="Registrovat" variant="solid" tone="accent" size="sm" />
      </div>

      <div class="bg-(--preview-backdrop) p-5">
        <slot />
      </div>
    </UCard>

    <TestDialogs />
  </div>
</template>
