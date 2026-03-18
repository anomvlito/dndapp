<script setup>
import { ref } from 'vue'

const open = ref(false)
const lastRoll = ref(null)
const rolling = ref(false)

const DICE_SIDES = [4, 6, 8, 10, 12, 20]

function roll(sides) {
  rolling.value = true
  lastRoll.value = null
  setTimeout(() => {
    lastRoll.value = { sides, result: Math.floor(Math.random() * sides) + 1 }
    rolling.value = false
  }, 600)
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 no-print flex flex-col items-end">
    <!-- Panel de dados colapsable -->
    <Transition name="slide-up">
      <div v-if="open" class="mb-4 bg-white/95 backdrop-blur border-2 border-black p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-3 w-64 overflow-hidden">
        <div class="section-banner w-full text-center rounded-t-lg -mt-4 -mx-4 px-4 py-1 mb-2">
          Lanzador de Dados
        </div>

        <div class="grid grid-cols-3 gap-2 w-full">
          <button
            v-for="sides in DICE_SIDES"
            :key="sides"
            @click="roll(sides)"
            class="p-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-red-50 hover:border-red-300 transition-colors font-bold text-sm min-w-[44px] text-center aspect-square flex items-center justify-center shadow-sm"
            :title="`Lanzar d${sides}`"
          >
            d{{ sides }}
          </button>
        </div>

        <div class="mt-2 text-center min-h-[72px] flex items-center justify-center bg-gray-50 w-full rounded-xl border border-dashed border-gray-300">
          <div v-if="rolling" class="text-3xl text-gray-400 animate-bounce">🎲</div>
          <Transition name="dice-result" v-else-if="lastRoll">
            <div class="flex flex-col items-center group">
              <span class="text-4xl font-black text-red-900 drop-shadow-sm scale-110">
                {{ lastRoll.result }}
              </span>
              <span class="text-[0.6rem] font-bold text-gray-400 uppercase tracking-tighter">
                Resultado d{{ lastRoll.sides }}
              </span>
            </div>
          </Transition>
          <div v-else class="text-gray-300 text-xs italic">Elige un dado</div>
        </div>
      </div>
    </Transition>

    <!-- Botón FAB principal -->
    <button @click="open = !open" class="dice-fab" aria-label="Abrir lanzador de dados">
      <span v-if="!open">🎲</span>
      <span v-else class="text-xl">✕</span>
    </button>
  </div>
</template>
