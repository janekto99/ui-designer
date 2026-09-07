<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

export interface SharePerson {
  name: string
  src?: string
}

export interface ShareTarget {
  name: string
  icon: string
  /** Barva kolečka pod ikonou — v kitu je každá aplikace jinak barevná. */
  color?: string
}

export interface ShareAction {
  label: string
  icon: string
}

/**
 * Skládá se z hotových dílů: `USegmentedControl`, `UAvatar`, `UListRow`.
 * Sdílecí panel není nová hmota, je to sestava — a tak je i ve Figmě
 * poskládaný z komponent, které už existují jinde.
 */
const props = withDefaults(
  defineProps<{
    title: string
    /** Náhled sdíleného obsahu. */
    thumbnail?: string
    people?: SharePerson[]
    targets?: ShareTarget[]
    actions?: ShareAction[]
    /** Popis oprávnění nad seznamem osob. */
    permissionTitle?: string
    permissionSubtitle?: string
    /** Zavírací křížek vlevo nahoře. */
    closable?: boolean
    class?: ClassValue
  }>(),
  {
    thumbnail: undefined,
    people: () => [],
    targets: () => [],
    actions: () => [],
    permissionTitle: undefined,
    permissionSubtitle: undefined,
    closable: false,
    class: undefined,
  },
)

defineEmits<{ close: [], more: [], permission: [], action: [action: ShareAction] }>()

const mode = ref('collaborate')

const modes = [
  { label: 'Spolupracovat', value: 'collaborate', icon: 'lucide:users' },
  { label: 'Poslat kopii', value: 'copy', icon: 'lucide:file' },
]
</script>

<template>
  <div
    :class="cn(
      'vos-view-regular flex w-96 flex-col gap-4 rounded-3xl p-4 shadow-(--panel-shadow)',
      props.class,
    )"
  >
    <div class="flex items-center gap-3">
      <UButton
        v-if="closable"
        icon="lucide:x"
        size="sm"
        aria-label="Zavřít"
        @click="$emit('close')"
      />
      <img v-if="thumbnail" :src="thumbnail" alt="" class="size-10 shrink-0 rounded-lg object-cover">
      <span class="min-w-0 flex-1 truncate text-headline font-semibold">{{ title }}</span>
      <UButton icon="lucide:ellipsis" size="sm" aria-label="Další" @click="$emit('more')" />
    </div>

    <USegmentedControl v-model="mode" :segments="modes" block aria-label="Způsob sdílení" />

    <UListRow
      v-if="permissionTitle"
      variant="inset"
      :title="permissionTitle"
      :subtitle="permissionSubtitle"
      chevron
      class="vos-view-thin"
      @select="$emit('permission')"
    />

    <div v-if="people.length" class="flex gap-4 overflow-x-auto pb-1">
      <button
        v-for="person in people"
        :key="person.name"
        type="button"
        class="vos-surface vos-plain flex w-16 shrink-0 cursor-pointer flex-col items-center gap-1.5 rounded-2xl p-2 outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
      >
        <UAvatar :name="person.name" :src="person.src" size="md" />
        <span class="w-full text-center text-caption-2 leading-tight wrap-break-word">
          {{ person.name }}
        </span>
      </button>
    </div>

    <div v-if="targets.length" class="flex gap-4 overflow-x-auto pb-1">
      <button
        v-for="target in targets"
        :key="target.name"
        type="button"
        class="vos-surface vos-plain flex w-16 shrink-0 cursor-pointer flex-col items-center gap-1.5 rounded-2xl p-2 outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring)"
      >
        <span
          class="flex size-11 items-center justify-center rounded-full text-white"
          :style="{ backgroundColor: target.color ?? 'var(--vos-blue)' }"
        >
          <Icon :name="target.icon" class="size-6" />
        </span>
        <span class="w-full text-center text-caption-2 leading-tight wrap-break-word">
          {{ target.name }}
        </span>
      </button>
    </div>

    <UList v-if="actions.length" variant="plain">
      <UListRow
        v-for="action in actions"
        :key="action.label"
        :title="action.label"
        @select="$emit('action', action)"
      >
        <template #trailing>
          <Icon :name="action.icon" class="size-5 shrink-0 text-(--fg-secondary)" />
        </template>
      </UListRow>
    </UList>
  </div>
</template>
