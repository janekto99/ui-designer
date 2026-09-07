<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

export interface ActivityControl {
  icon: string
  label: string
  /** Aktivní ovladač je plná bílá, jako `selected` u tlačítka. */
  active?: boolean
  /** Ukončení hovoru — červené kolečko. */
  destructive?: boolean
}

export interface ActivityAction {
  label: string
  icon?: string
  /** `accept` je zelená, `decline` červená, jinak sklo. */
  tone?: 'accept' | 'decline' | 'plain'
}

/**
 * Karta systémové aktivity — hovor, žádost o připojení, sdílení.
 *
 * Ve Figmě jsou to dvě stránky (System Activities a System Requests), ale
 * kostra je stejná: avatar, dva řádky a pod nimi buď ovladače, nebo dvojice
 * tlačítek. Proto jedna komponenta se dvěma způsoby obsazení.
 */
const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    avatarName?: string
    avatarSrc?: string
    /** Ikona místo avataru, když nejde o osobu. */
    icon?: string
    /** Odznáček v rohu avataru — např. SharePlay. */
    avatarBadge?: string
    controls?: ActivityControl[]
    actions?: ActivityAction[]
    /** Tlačítko vpravo v jednořádkové podobě. */
    trailingIcon?: string
    class?: ClassValue
  }>(),
  {
    subtitle: undefined,
    avatarName: undefined,
    avatarSrc: undefined,
    icon: undefined,
    avatarBadge: undefined,
    controls: () => [],
    actions: () => [],
    trailingIcon: undefined,
    class: undefined,
  },
)

defineEmits<{ control: [control: ActivityControl], action: [action: ActivityAction], trailing: [] }>()

const toneClass = (tone: ActivityAction['tone']) => {
  if (tone === 'accept') return 'bg-(--vos-green) font-semibold text-black hover:brightness-105'
  if (tone === 'decline') return 'bg-(--vos-red) font-semibold text-white hover:brightness-110'
  return 'vos-surface vos-glass'
}
</script>

<template>
  <div
    :class="cn('vos-surface vos-glass flex w-80 flex-col gap-3 rounded-3xl p-3', props.class)"
    role="group"
    :aria-label="title"
  >
    <div class="flex items-center gap-3">
      <span
        v-if="icon"
        class="vos-view-thin flex size-11 shrink-0 items-center justify-center rounded-full"
      >
        <Icon :name="icon" class="size-6" />
      </span>
      <UAvatar v-else :name="avatarName" :src="avatarSrc" :badge-icon="avatarBadge" size="md" />

      <span class="min-w-0 flex-1">
        <span class="block truncate text-callout font-semibold">{{ title }}</span>
        <span v-if="subtitle" class="block truncate text-footnote text-(--fg-secondary)">
          {{ subtitle }}
        </span>
      </span>

      <UButton
        v-if="trailingIcon"
        :icon="trailingIcon"
        size="sm"
        aria-label="Další"
        @click="$emit('trailing')"
      />
    </div>

    <div v-if="controls.length" class="flex items-center gap-2">
      <button
        v-for="control in controls"
        :key="control.label"
        type="button"
        :aria-label="control.label"
        :aria-pressed="control.active"
        :class="cn(
          'flex h-11 flex-1 cursor-pointer items-center justify-center rounded-full outline-none',
          'focus-visible:ring-2 focus-visible:ring-(--focus-ring)',
          control.destructive
            ? 'bg-(--vos-red) text-white hover:brightness-110'
            : control.active
              ? 'vos-surface vos-selected'
              : 'vos-surface vos-glass',
        )"
        @click="$emit('control', control)"
      >
        <Icon :name="control.icon" class="size-5" />
      </button>
    </div>

    <div v-if="actions.length" class="flex items-center gap-2">
      <button
        v-for="action in actions"
        :key="action.label"
        type="button"
        :class="cn(
          'flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full text-body outline-none',
          'focus-visible:ring-2 focus-visible:ring-(--focus-ring)',
          toneClass(action.tone),
        )"
        @click="$emit('action', action)"
      >
        <Icon v-if="action.icon" :name="action.icon" class="size-5" />
        {{ action.label }}
      </button>
    </div>
  </div>
</template>
