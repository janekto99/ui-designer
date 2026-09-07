<script setup lang="ts">
import type { ClassValue } from '~/utils/cn'

/**
 * Kruhový portrét. Když není obrázek, zbydou iniciály — ve Figmě je avatar
 * vždy kruh, i v rohu jiných prvků.
 */
const props = withDefaults(
  defineProps<{
    src?: string
    /** Jméno pro iniciály a pro čtečku. */
    name?: string
    size?: 'xs' | 'sm' | 'md' | 'lg'
    /** Malý odznáček v pravém dolním rohu — ikona nebo tečka. */
    badgeIcon?: string
    class?: ClassValue
  }>(),
  { src: undefined, name: undefined, size: 'md', badgeIcon: undefined, class: undefined },
)

const failed = ref(false)
const img = useTemplateRef<HTMLImageElement>('img')

watch(() => props.src, () => { failed.value = false })

/**
 * Když obrázek spadne dřív, než se komponenta zhydratuje, `@error` už nikdo
 * nezachytí a zůstala by po něm prázdná ikona. Po připojení se proto stav
 * ověří i zpětně: dokončené načtení s nulovou šířkou znamená chybu.
 */
function checkLoaded() {
  const el = img.value
  if (el?.complete && el.naturalWidth === 0) failed.value = true
}

onMounted(checkLoaded)
watch(img, checkLoaded)

const initials = computed(() => {
  if (!props.name) return ''
  return props.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
})

const sizes = {
  xs: { box: 'size-6 text-caption-2', badge: 'size-3 -right-0.5 -bottom-0.5', icon: 'size-2' },
  sm: { box: 'size-8 text-caption-1', badge: 'size-3.5 -right-0.5 -bottom-0.5', icon: 'size-2.5' },
  md: { box: 'size-11 text-callout', badge: 'size-4.5 -right-0.5 -bottom-0.5', icon: 'size-3' },
  lg: { box: 'size-16 text-title-3', badge: 'size-6 -right-1 -bottom-1', icon: 'size-4' },
} as const
</script>

<template>
  <span :class="cn('relative inline-flex shrink-0', sizes[props.size].box, props.class)">
    <img
      v-if="src && !failed"
      ref="img"
      :src="src"
      :alt="name ?? ''"
      class="size-full rounded-full object-cover"
      @error="failed = true"
      @load="checkLoaded"
    >
    <span
      v-else
      class="vos-surface vos-glass flex size-full items-center justify-center rounded-full font-medium"
      :aria-label="name"
      :role="name ? 'img' : undefined"
    >{{ initials }}</span>

    <span
      v-if="badgeIcon"
      class="absolute flex items-center justify-center rounded-full bg-(--vos-blue) text-white ring-2 ring-(--panel-tint)"
      :class="sizes[props.size].badge"
    >
      <Icon :name="badgeIcon" :class="sizes[props.size].icon" />
    </span>
  </span>
</template>
