<script setup lang="ts">
import type { MenuItem } from '~/components/ui/UMenu.vue'

const withAccessories = ref(true)
const withSections = ref(true)
const last = ref<string>()

const accessoryOptions = [
  { label: 'S pruhem ikon', value: true },
  { label: 'Bez pruhu', value: false },
]
const sectionOptions = [
  { label: 'Se sekcemi', value: true },
  { label: 'Bez sekcí', value: false },
]

const accessories = [
  { icon: 'lucide:scissors', label: 'Vyjmout' },
  { icon: 'lucide:copy', label: 'Kopírovat' },
  { icon: 'lucide:clipboard', label: 'Vložit' },
  { icon: 'lucide:trash-2', label: 'Smazat' },
]

const flat: MenuItem[] = [
  { label: 'Otevřít', icon: 'lucide:external-link' },
  { label: 'Přejmenovat', icon: 'lucide:pencil' },
  { label: 'Duplikovat', icon: 'lucide:copy-plus' },
  { label: 'Přesunout', submenu: true },
  {},
  { label: 'Smazat', icon: 'lucide:trash-2', destructive: true },
]

const sectioned: MenuItem[] = [
  { label: 'Otevřít', icon: 'lucide:external-link' },
  { label: 'Otevřít v novém okně', icon: 'lucide:app-window', disabled: true },
  { header: 'Zobrazení' },
  { label: 'Jako mřížku', checked: true },
  { label: 'Jako seznam', checked: false },
  { label: 'Jako sloupce', checked: false },
  {},
  { label: 'Přesunout do', submenu: true },
  { label: 'Smazat', icon: 'lucide:trash-2', destructive: true },
]

const items = computed(() => (withSections.value ? sectioned : flat))

/* Menu u tlačítka — v aplikaci se takhle používá nejčastěji. */
const open = ref(false)
const anchor = useTemplateRef<HTMLElement>('anchor')

onMounted(() => {
  const onPointerDown = (event: PointerEvent) => {
    if (anchor.value && !anchor.value.contains(event.target as Node)) open.value = false
  }
  document.addEventListener('pointerdown', onPointerDown)
  onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown))
})
</script>

<template>
  <DocPage
    title="Menu"
    description="Sedí na materiálu regular — mezi seznamem (thin) a alertem (thick), přesně jak je to ve Figmě odstupňované."
  >
    <DocSection
      title="Náhled"
      description="Šipkami se prochází položky; oddělovače a nadpisy sekcí se přeskakují."
    >
      <template #controls>
        <VariantPicker v-model="withAccessories" label="Pruh ikon" :options="accessoryOptions" />
        <VariantPicker v-model="withSections" label="Struktura" :options="sectionOptions" />
      </template>

      <PreviewStage min-height="24rem">
        <UMenu
          :items="items"
          :accessories="withAccessories ? accessories : []"
          aria-label="Ukázkové menu"
          @select="(item) => (last = item.label ?? '')"
          @accessory="(i) => (last = accessories[i]!.label)"
        />
      </PreviewStage>

      <p v-if="last" class="mt-3 text-center text-footnote text-(--fg-secondary)">
        Naposledy vybráno: {{ last }}
      </p>
    </DocSection>

    <DocSection
      title="U tlačítka"
      description="Nejčastější použití: menu ukotvené pod spouštěčem."
    >
      <PreviewStage min-height="22rem">
        <div ref="anchor" class="relative">
          <UButton
            label="Možnosti"
            icon="lucide:ellipsis"
            :aria-expanded="open"
            aria-haspopup="menu"
            @click="open = !open"
          />

          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            leave-active-class="transition duration-100 ease-in"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <UMenu
              v-if="open"
              :items="flat"
              class="absolute top-full left-0 z-50 mt-2"
              aria-label="Možnosti"
              @select="(item) => { last = item.label ?? ''; open = false }"
            />
          </Transition>
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
