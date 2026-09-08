<script setup lang="ts">
/**
 * Přepínač mezi katalogem a ukázkami.
 *
 * Katalog ukazuje komponenty jednu po druhé, ukázky celé obrazovky z nich
 * složené. Bez druhé části se u sady komponent nepozná, jestli k něčemu je —
 * všechno vypadá dobře, dokud to nemá vedle sebe nic dalšího.
 */
const route = useRoute()
const router = useRouter()

const area = computed({
  get: () => (route.path.startsWith('/showcase') ? 'showcase' : 'catalog'),
  set: (next: string) => {
    router.push(next === 'showcase' ? '/showcase' : '/')
  },
})

const areas = [
  { label: 'Komponenty', value: 'catalog', icon: 'lucide:component' },
  { label: 'Ukázky', value: 'showcase', icon: 'lucide:layout-dashboard' },
]
</script>

<template>
  <USegmentedControl v-model="area" :segments="areas" size="sm" aria-label="Oblast" />
</template>
