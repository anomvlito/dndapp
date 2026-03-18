<script setup>
import { getMod } from '../utils/modifiers'

const props = defineProps({
  stats: { type: Object, required: true },
  equipment: { type: Array, required: true },
  coins: { type: Object, required: true },
})

const emit = defineEmits(['coinsChange'])

const coinTypes = [
  { label: 'PC', key: 'cp' },
  { label: 'PP', key: 'sp' },
  { label: 'PE', key: 'ep' },
  { label: 'PO', key: 'gp', highlight: true },
  { label: 'PL', key: 'pp' },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Intro -->
    <div class="md:col-span-12 border-b border-black pb-4">
      <h2 class="header-font text-2xl text-red-900 mb-2">Iteración: El Pacto Silencioso</h2>
      <p class="text-sm italic leading-relaxed">
        Despertó en el centro de un cráter sin saber quién era. Solo la palabra "Iteración"
        resonaba en su mente como un eco constante. Siente una conexión latente con una fiera que
        solo aparece en sus sueños, una sensación de calidez y rugidos que no logra procesar. Su
        hacha parece moverse sola, dictada por una memoria muscular que su mente consciente ha
        perdido.
      </p>
    </div>

    <!-- Columna izquierda -->
    <div class="md:col-span-6 space-y-4">
      <!-- Pacto Silencioso -->
      <div class="border-2 border-red-900 p-4 rounded bg-white shadow-xl">
        <p class="text-xs font-bold uppercase text-red-900 border-b border-red-900 mb-2">
          Escalamiento de la Memoria (Serosh)
        </p>
        <div class="text-[0.7rem] leading-loose">
          <p><strong>Estado Actual:</strong> Latente / Recuerdo Fragmentado.</p>
          <p><strong>Fuerza:</strong> Igual a Iteración (Actual: {{ stats.fuerza }})</p>
          <p><strong>Vida:</strong> 5 x Nivel + Con (Actual: {{ 5 * 1 + getMod(stats.constitucion) }})</p>
          <p class="mt-2 text-red-800 font-bold italic">
            "🛡️ Pacto Silencioso: Se manifestará físicamente cuando el Rugido del Yermo resuene
            en un momento crítico."
          </p>
        </div>
      </div>

      <!-- Monedas -->
      <div class="border-2 border-black p-4 rounded bg-white shadow-md">
        <p class="text-[0.6rem] font-bold uppercase border-b mb-2">Monedas y Riqueza</p>
        <div class="grid grid-cols-5 gap-2">
          <div
            v-for="coin in coinTypes"
            :key="coin.key"
            :class="['coin-box', coin.highlight ? 'bg-yellow-50' : '']"
          >
            <label
              :class="['text-[0.5rem] block text-center', coin.highlight ? 'font-bold text-yellow-800' : '']"
            >
              {{ coin.label }}
            </label>
            <input
              type="number"
              class="text-center font-bold"
              :value="coins[coin.key]"
              @change="emit('coinsChange', { ...coins, [coin.key]: $event.target.value })"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Columna derecha -->
    <div class="md:col-span-6 space-y-4">
      <div class="border-2 border-black p-4 rounded bg-white shadow-inner">
        <p class="text-[0.7rem] font-bold uppercase border-b mb-2">Equipo y Pertenencias</p>
        <table class="w-full text-left text-xs mb-4">
          <thead>
            <tr class="border-b border-gray-400">
              <th class="font-bold py-1 w-2/3">Objeto</th>
              <th class="font-bold py-1 text-center">Cant.</th>
              <th class="font-bold py-1 text-right">Peso</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in equipment" :key="idx" class="border-b border-gray-200">
              <td class="py-1">{{ item.name }}</td>
              <td class="py-1 text-center">{{ item.qty }}</td>
              <td class="py-1 text-right text-gray-500 text-[0.6rem]">{{ item.weight }}</td>
            </tr>
          </tbody>
        </table>

        <p class="text-[0.7rem] font-bold uppercase border-b mb-2 mt-6">Anclas de Memoria</p>
        <textarea class="text-xs h-32 leading-relaxed font-semibold w-full resize-none">- Collar de Cuero Viejo: Inusualmente grande. Atado a la muñeca izquierda.
- Piedra de Afilar Grabada: Con marcas de colmillos profundas.
- Retal de Estandarte Dorado: Sucio, con olor a fieras y ozono.</textarea>
      </div>
    </div>
  </div>
</template>
