<script setup lang="ts">
import type { ActivityControl } from '~/components/ui/USystemActivityCard.vue'

type Shape = 'call' | 'request' | 'invite' | 'row'

const shape = ref<Shape>('call')
const last = ref<string>()

const shapeOptions: { label: string, value: Shape }[] = [
  { label: 'Hovor', value: 'call' },
  { label: 'Žádost', value: 'request' },
  { label: 'Pozvánka', value: 'invite' },
  { label: 'Řádek', value: 'row' },
]

const controls = ref<ActivityControl[]>([
  { icon: 'lucide:video', label: 'Kamera', active: true },
  { icon: 'lucide:mic-off', label: 'Ztlumit' },
  { icon: 'lucide:message-circle', label: 'Zpráva' },
  { icon: 'lucide:phone-off', label: 'Zavěsit', destructive: true },
])

function toggleControl(control: ActivityControl) {
  last.value = control.label
  if (control.destructive) return
  controls.value = controls.value.map((c) =>
    c.label === control.label ? { ...c, active: !c.active } : c,
  )
}
</script>

<template>
  <DocPage
    title="System Activity"
    description="Ve Figmě jsou to dvě stránky — System Activities a System Requests — ale kostra je stejná: avatar, dva řádky a pod nimi buď ovladače, nebo dvojice tlačítek."
  >
    <DocSection title="Náhled">
      <template #controls>
        <VariantPicker v-model="shape" label="Podoba" :options="shapeOptions" />
      </template>

      <PreviewStage min-height="18rem">
        <USystemActivityCard
          v-if="shape === 'call'"
          title="Jana Nováková"
          subtitle="Probíhající hovor"
          avatar-name="Jana Nováková"
          avatar-badge="lucide:radio"
          :controls="controls"
          @control="toggleControl"
        />

        <USystemActivityCard
          v-else-if="shape === 'request'"
          title="Petr Svoboda"
          subtitle="Chce se připojit"
          avatar-name="Petr Svoboda"
          :actions="[
            { label: 'Odmítnout', tone: 'decline' },
            { label: 'Připojit', tone: 'accept', icon: 'lucide:video' },
          ]"
          @action="(a) => (last = a.label)"
        />

        <USystemActivityCard
          v-else-if="shape === 'invite'"
          title="Eva Dvořáková"
          subtitle="Sdílí obrazovku"
          avatar-name="Eva Dvořáková"
          avatar-badge="lucide:radio"
          :actions="[
            { label: 'Odmítnout', tone: 'plain' },
            { label: 'Přijmout', tone: 'plain' },
          ]"
          @action="(a) => (last = a.label)"
        />

        <USystemActivityCard
          v-else
          title="Hudba"
          subtitle="Přehrává se"
          icon="lucide:music"
          trailing-icon="lucide:pause"
          @trailing="last = 'Pauza'"
        />
      </PreviewStage>

      <p v-if="last" class="mt-3 text-center text-footnote text-(--fg-secondary)">
        Naposledy stisknuto: {{ last }}
      </p>
    </DocSection>

    <DocSection title="Všechny podoby">
      <PreviewStage min-height="26rem">
        <div class="flex flex-wrap items-start justify-center gap-4">
          <USystemActivityCard
            title="Jana Nováková"
            subtitle="Probíhající hovor"
            avatar-name="Jana Nováková"
            avatar-badge="lucide:radio"
            :controls="controls"
          />
          <USystemActivityCard
            title="Petr Svoboda"
            subtitle="Chce se připojit"
            avatar-name="Petr Svoboda"
            :actions="[
              { label: 'Odmítnout', tone: 'decline' },
              { label: 'Připojit', tone: 'accept', icon: 'lucide:video' },
            ]"
          />
        </div>
      </PreviewStage>
    </DocSection>
  </DocPage>
</template>
