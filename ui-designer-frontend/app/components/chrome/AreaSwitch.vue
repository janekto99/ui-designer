<script setup lang="ts">
/**
 * Přepínač mezi katalogem a ukázkami.
 *
 * Katalog ukazuje komponenty jednu po druhé, ukázky celé obrazovky z nich
 * složené, playground návrhy k rozhodnutí. Bez druhé části se u sady
 * komponent nepozná, jestli k něčemu je — všechno vypadá dobře, dokud to
 * nemá vedle sebe nic dalšího.
 */
const route = useRoute()
const router = useRouter()

const paths: Record<string, string> = {
  catalog: '/',
  showcase: '/showcase',
  playground: '/playground',
}

const area = computed({
  get: () => {
    if (route.path.startsWith('/playground')) return 'playground'
    if (route.path.startsWith('/showcase')) return 'showcase'
    return 'catalog'
  },
  set: (next: string) => {
    router.push(paths[next] ?? '/')
  },
})

const areas = [
  { label: 'Komponenty', value: 'catalog', icon: 'lucide:component' },
  { label: 'Ukázky', value: 'showcase', icon: 'lucide:layout-dashboard' },
  { label: 'Playground', value: 'playground', icon: 'lucide:flask-conical' },
]
</script>

<template>
  <USegmentedControl v-model="area" :segments="areas" size="sm" aria-label="Oblast" />
</template>
