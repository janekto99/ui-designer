<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Plná QWERTY. Na web se nehodí — prohlížeč má vlastní klávesnici a tahle
 * nic nenahradí. Je tu proto, že ve Figmě je to stránka jako každá jiná
 * a je to nejnázornější ukázka toho, jak se sklo chová v hustém rastru.
 */
const props = withDefaults(
  defineProps<{
    /** Návrhy nad klávesami. */
    suggestions?: string[]
    class?: ClassValue
  }>(),
  { suggestions: () => ['„To"', 'to', 'na'], class: undefined },
)

const model = defineModel<string>({ default: '' })

const emit = defineEmits<{ submit: [] }>()

const shift = ref(false)
const numeric = ref(false)

const letterRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

const numericRows = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['-', '/', ':', ';', '(', ')', '@', '"'],
  ['.', ',', '?', '!', '\'', '+', '='],
]

const rows = computed(() => (numeric.value ? numericRows : letterRows))

function type(key: string) {
  model.value += shift.value && !numeric.value ? key.toUpperCase() : key
  shift.value = false
}

function backspace() {
  model.value = model.value.slice(0, -1)
}

const keyClass =
  'vos-surface vos-glass flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-2xl px-3 text-title-3 outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)'
</script>

<template>
  <div
    :class="cn('vos-view-thick flex w-2xl flex-col overflow-hidden rounded-3xl', props.class)"
    role="group"
    aria-label="Klávesnice"
  >
    <div class="vos-view-thick flex items-center gap-3 px-4 py-3">
      <span class="vos-surface vos-glass flex size-9 items-center justify-center rounded-full">
        <Icon name="lucide:globe" class="size-4" />
      </span>
      <span class="flex-1 text-center text-title-2">
        {{ model || ' ' }}<span class="animate-pulse">|</span>
      </span>
      <span class="size-9" />
    </div>

    <div class="flex flex-col gap-2 p-3">
      <div class="flex gap-2">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          type="button"
          class="vos-surface vos-plain h-10 flex-1 cursor-pointer rounded-xl text-body outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
          @click="model += suggestion.replaceAll('„', '').replaceAll('“', '') + ' '"
        >{{ suggestion }}</button>
      </div>

      <div v-for="(row, r) in rows" :key="r" class="flex justify-center gap-1.5">
        <button
          v-if="r === 2"
          type="button"
          :class="cn(keyClass, 'min-w-16', shift && 'vos-selected')"
          :aria-pressed="shift"
          aria-label="Velká písmena"
          @click="shift = !shift"
        >
          <Icon name="lucide:arrow-big-up" class="size-5" />
        </button>

        <button
          v-for="key in row"
          :key="key"
          type="button"
          :class="keyClass"
          @click="type(key)"
        >{{ shift && !numeric ? key.toUpperCase() : key }}</button>

        <button
          v-if="r === 2"
          type="button"
          :class="cn(keyClass, 'min-w-16')"
          aria-label="Smazat znak"
          @click="backspace"
        >
          <Icon name="lucide:delete" class="size-5" />
        </button>
      </div>

      <div class="flex justify-center gap-1.5">
        <button type="button" :class="cn(keyClass, 'min-w-14')" aria-label="Emoji">
          <Icon name="lucide:smile" class="size-5" />
        </button>
        <button
          type="button"
          :class="cn(keyClass, 'min-w-14')"
          :aria-pressed="numeric"
          @click="numeric = !numeric"
        >{{ numeric ? 'ABC' : '123' }}</button>
        <button
          type="button"
          :class="cn(keyClass, 'flex-1')"
          aria-label="Mezerník"
          @click="type(' ')"
        />
        <button
          type="button"
          :class="cn(keyClass, 'min-w-24')"
          @click="emit('submit')"
        >Odeslat</button>
      </div>
    </div>
  </div>
</template>
