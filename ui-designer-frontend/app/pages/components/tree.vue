<script setup lang="ts">
import type { TreeNode } from '~/components/ui/UTree.vue'

const withCounts = ref(true)
const selected = ref<string>()
const expanded = ref(['tenis', 'tenis-muzi'])

const countOptions = [
  { label: 'S počty', value: true },
  { label: 'Bez počtů', value: false },
]

const raw: TreeNode<string>[] = [
  {
    label: 'Tenis',
    value: 'tenis',
    icon: 'lucide:circle-dot',
    count: 131,
    children: [
      {
        label: 'Muži',
        value: 'tenis-muzi',
        count: 72,
        children: [
          { label: 'ATP', value: 'atp', count: 6 },
          { label: 'Challenger', value: 'challenger', count: 26 },
          { label: 'ITF', value: 'itf-m', count: 27 },
          { label: 'UTR', value: 'utr-m', count: 13 },
        ],
      },
      {
        label: 'Ženy',
        value: 'tenis-zeny',
        count: 59,
        children: [
          { label: 'WTA', value: 'wta', count: 20 },
          { label: 'ITF', value: 'itf-z', count: 25 },
          { label: 'UTR', value: 'utr-z', count: 14 },
        ],
      },
    ],
  },
  {
    label: 'Fotbal',
    value: 'fotbal',
    icon: 'lucide:volleyball',
    count: 0,
    children: [
      { label: 'Muži', value: 'fotbal-muzi', count: 0, disabled: true },
    ],
  },
]

/** Počty se dají schovat, ať je vidět, že je nula jiné tvrzení než nic. */
function strip(nodes: TreeNode<string>[]): TreeNode<string>[] {
  return nodes.map((node) => ({
    ...node,
    count: withCounts.value ? node.count : undefined,
    children: node.children ? strip(node.children) : undefined,
  }))
}

const nodes = computed(() => strip(raw))
</script>

<template>
  <DocPage
    title="Tree"
    description="Vykresluje se naplocho, ne vnořeně: každý řádek nese aria-level a odsazení. Ovládání klávesnicí je pak posun o jedna v seznamu viditelných řádků."
  >
    <DocSection
      title="Náhled"
      description="Šipky nahoru a dolů jdou po viditelných řádcích, vpravo rozbalí nebo skočí na dítě, vlevo sbalí nebo skočí na rodiče."
    >
      <template #controls>
        <VariantPicker v-model="withCounts" label="Počty" :options="countOptions" />
      </template>

      <PreviewStage min-height="26rem">
        <UCard material="thin" class="w-72">
          <UTree
            v-model="selected"
            v-model:expanded="expanded"
            :nodes="nodes"
            aria-label="Sporty a soutěže"
          />
        </UCard>
      </PreviewStage>

      <p class="mt-3 text-center text-footnote text-(--fg-secondary)">
        Vybráno: {{ selected ?? 'nic — rozcestník jen rozbaluje, vybírá se až list' }}
      </p>
    </DocSection>
  </DocPage>
</template>
