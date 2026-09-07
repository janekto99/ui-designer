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

/* Barvy si bere `UButton` z tónů; tady se jen překládá slovník karty. */
const actionVariant = (tone: ActivityAction['tone']) => (tone === 'plain' ? 'glass' : 'solid')
const actionTone = (tone: ActivityAction['tone']) =>
  tone === 'accept' ? 'success' : tone === 'decline' ? 'danger' : 'neutral'
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
      <UButton
        v-for="control in controls"
        :key="control.label"
        :icon="control.icon"
        :variant="control.destructive ? 'solid' : control.active ? 'selected' : 'glass'"
        :tone="control.destructive ? 'danger' : 'neutral'"
        :aria-label="control.label"
        :aria-pressed="control.active"
        class="aspect-auto flex-1"
        @click="$emit('control', control)"
      />
    </div>

    <div v-if="actions.length" class="flex items-center gap-2">
      <UButton
        v-for="action in actions"
        :key="action.label"
        :label="action.label"
        :icon="action.icon"
        :variant="actionVariant(action.tone)"
        :tone="actionTone(action.tone)"
        class="flex-1"
        @click="$emit('action', action)"
      />
    </div>
  </div>
</template>
