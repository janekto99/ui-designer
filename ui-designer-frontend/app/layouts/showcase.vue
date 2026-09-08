<script setup lang="ts">
/**
 * Rozvržení ukázek. Proti katalogu tu není postranní panel s komponentami —
 * ukázka si celou plochu bere pro sebe, jinak by se posuzovala v příliš úzkém
 * sloupci a hustá tabulka by vypadala hůř, než jaká je.
 */
const route = useRoute()
</script>

<template>
  <div class="flex min-h-dvh flex-col gap-4 p-4">
    <header class="flex flex-wrap items-center gap-2">
      <NuxtLink to="/" class="vos-surface vos-panel flex items-center gap-2 rounded-2xl px-3 py-2">
        <span class="text-callout font-semibold">UI Designer</span>
      </NuxtLink>

      <AreaSwitch />

      <!-- Jen uvnitř konkrétní ukázky. Na rozcestníku by vedl sám na sebe. -->
      <NuxtLink v-if="route.path !== '/showcase'" to="/showcase">
        <UButton icon="lucide:arrow-left" label="Zpět na rozcestník" variant="plain" size="sm" />
      </NuxtLink>

      <div class="flex-1" />

      <ModeToggle />
      <DesignSelect />
    </header>

    <main class="min-w-0 flex-1">
      <slot />
    </main>
  </div>
</template>
