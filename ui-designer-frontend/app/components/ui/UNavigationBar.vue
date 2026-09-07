<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Ve Figmě má šest podob a liší se jedinou věcí: **kde je titulek**. Bez
 * návratu je vlevo a velký, s návratem se přesune doprostřed a zmenší.
 * Proto se `centered` neodvozuje z prop, ale z toho, jestli je vlevo něco
 * dalšího.
 */
const props = withDefaults(
  defineProps<{
    title: string
    /** `true` dá jen šipku, řetězec dá šipku s popiskem. */
    back?: boolean | string
    class?: ClassValue
  }>(),
  { back: false, class: undefined },
)

const slots = useSlots()

defineEmits<{ back: [] }>()

const hasLeading = computed(() => Boolean(props.back) || Boolean(slots.leading))
</script>

<template>
  <div :class="cn('flex h-16 w-full items-center gap-3 px-4', props.class)">
    <div class="flex shrink-0 items-center gap-2">
      <UButton
        v-if="back"
        :icon="'lucide:chevron-left'"
        :label="typeof back === 'string' ? back : undefined"
        variant="glass"
        size="sm"
        :aria-label="typeof back === 'string' ? undefined : 'Zpět'"
        @click="$emit('back')"
      />
      <slot name="leading" />
    </div>

    <h2
      :class="hasLeading
        ? 'flex-1 truncate text-center text-headline font-semibold'
        : 'flex-1 truncate text-title-1 font-semibold'"
    >
      {{ title }}
    </h2>

    <div class="flex shrink-0 items-center gap-2">
      <slot name="trailing" />
    </div>
  </div>
</template>
