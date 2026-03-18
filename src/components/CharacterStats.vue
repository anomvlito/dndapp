<script setup>
import { getMod } from '../utils/modifiers'

const props = defineProps({
  stats: { type: Object, required: true },
})

const emit = defineEmits(['statChange'])

const statsList = [
  { label: 'Fuerza', key: 'fuerza' },
  { label: 'Destreza', key: 'destreza' },
  { label: 'Constitución', key: 'constitucion' },
  { label: 'Inteligencia', key: 'inteligencia' },
  { label: 'Sabiduría', key: 'sabiduria' },
  { label: 'Carisma', key: 'carisma' },
]
</script>

<template>
  <div class="md:col-span-2 space-y-4 pt-2">
    <div class="section-banner">Características</div>
    <div class="grid grid-cols-3 md:grid-cols-1 gap-3 sm:gap-4 p-1">
      <div
        v-for="stat in statsList"
        :key="stat.key"
        class="stat-container"
      >
        <span class="text-[0.6rem] font-bold uppercase tracking-tighter leading-none">{{ stat.label }}</span>
        <input
          type="number"
          :value="stats[stat.key]"
          @change="emit('statChange', stat.key, Number($event.target.value))"
          class="text-2xl sm:text-3xl font-black text-center w-full bg-transparent"
        />
        <div 
          class="stat-mod-circle"
          :class="{
            'positive': getMod(stats[stat.key]) > 0,
            'negative': getMod(stats[stat.key]) < 0
          }"
        >
          {{ getMod(stats[stat.key]) >= 0 ? '+' : '' }}{{ getMod(stats[stat.key]) }}
        </div>
      </div>
    </div>
  </div>
</template>
