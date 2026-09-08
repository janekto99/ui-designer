<script setup lang="ts">
/**
 * Horní lišta ve třech podobách.
 *
 * Společné je zacházení s vedlejšími ovládacími prvky: jazyk, motiv a
 * přihlášení jsou **holý text nebo holá ikona**, ne tlačítka s výplní. Jediná
 * plná výplň na celé liště je registrace — jinak by ztratila váhu.
 *
 * Liší se navigace, protože právě ta rozhoduje, jak lišta působí:
 * podtržítko je tiché, segment je ovladač, tečka je téměř neviditelná.
 */
defineProps<{ variant: 'linka' | 'mrizka' | 'karta' }>()

const view = defineModel<string>('view', { default: 'zapasy' })

const items = [
  { label: 'Zápasy', value: 'zapasy' },
  { label: 'Výsledky', value: 'vysledky' },
  { label: 'Analýza', value: 'analyza' },
]
</script>

<template>
  <header
    :class="[
      'flex flex-wrap items-center gap-x-6 gap-y-3',
      variant === 'mrizka' ? 'border-b border-(--separator) px-4 py-2' : '',
      variant === 'linka' ? 'border-b border-(--separator) px-1 pb-3' : '',
      variant === 'karta' ? 'p-2' : '',
    ]"
  >
    <span
      class="font-semibold tracking-tight"
      :class="variant === 'karta' ? 'text-title-2' : 'text-title-3'"
    >SPORT</span>

    <!-- Linka: podtržítko. Nejtišší z trojice, splyne s textem stránky. -->
    <UTabs
      v-if="variant === 'linka'"
      v-model="view"
      :items="items"
      class="border-0"
      aria-label="Zobrazení"
    />

    <!-- Mřížka: segment. Čte se jako ovladač, sedí k hutné tabulce vedle. -->
    <USegmentedControl
      v-else-if="variant === 'mrizka'"
      v-model="view"
      :segments="items"
      size="sm"
      aria-label="Zobrazení"
    />

    <!-- Karta: holý text, aktivní jen ztučněný. Nejvzdušnější. -->
    <nav v-else class="flex items-center gap-5" aria-label="Zobrazení">
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        :aria-current="view === item.value ? 'page' : undefined"
        class="cursor-pointer text-body outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
        :class="view === item.value
          ? 'font-semibold text-(--fg-primary)'
          : 'text-(--fg-secondary) hover:text-(--fg-primary)'"
        @click="view = item.value"
      >{{ item.label }}</button>
    </nav>

    <div class="flex-1" />

    <div class="flex items-center gap-1">
      <UButton label="EN" variant="plain" size="sm" />
      <UButton icon="lucide:moon" variant="plain" size="sm" aria-label="Tmavý režim" />
      <UButton label="Přihlásit" variant="plain" size="sm" />
      <UButton label="Registrovat" variant="solid" tone="accent" size="sm" />
    </div>
  </header>
</template>
