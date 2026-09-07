<script setup lang="ts">
const { designs, id, design } = useDesign()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function close() {
  open.value = false
}

function pick(value: string) {
  id.value = value
  close()
}

onMounted(() => {
  const onPointerDown = (event: PointerEvent) => {
    if (root.value && !root.value.contains(event.target as Node)) close()
  }
  document.addEventListener('pointerdown', onPointerDown)
  onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown))
})
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="vos-surface vos-glass flex h-11 cursor-pointer items-center gap-2 rounded-full pr-3 pl-4 text-body outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="open = !open"
      @keydown.esc="close"
    >
      <span>{{ design.name }}</span>
      <Icon name="lucide:chevron-down" class="size-4 text-(--fg-secondary)" />
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <ul
        v-if="open"
        class="vos-panel absolute right-0 z-50 mt-2 min-w-56 rounded-2xl p-1.5"
        role="listbox"
      >
        <li v-for="d in designs" :key="d.id">
          <button
            type="button"
            role="option"
            :aria-selected="d.id === id"
            class="vos-surface flex w-full cursor-pointer items-start gap-2 rounded-xl px-3 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
            :class="d.id === id ? 'vos-selected' : 'vos-plain'"
            @click="pick(d.id)"
          >
            <span class="min-w-0 flex-1">
              <span class="block text-callout">{{ d.name }}</span>
              <span class="block text-caption-1 opacity-60">{{ d.tagline }}</span>
            </span>
            <Icon v-if="d.id === id" name="lucide:check" class="mt-0.5 size-4 shrink-0" />
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>
