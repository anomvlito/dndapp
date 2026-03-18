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
  <div class="fixed bottom-6 right-6 z-[9999] no-print flex flex-col items-end">
    <!-- Panel de dados colapsable -->
    <Transition name="slide-up">
      <div
        v-if="open"
        class="mb-4 rounded-2xl shadow-2xl flex flex-col items-center gap-3 w-64 overflow-hidden"
        style="background: #fdf6e3; border: 2px solid #C9A84C;"
      >
        <div class="w-full text-center px-4 py-2 font-black text-xs uppercase tracking-widest" style="background:#1C0A00; color:#C9A84C; letter-spacing:0.2em;">
          🎲 Lanzador de Dados
        </div>

        <div class="grid grid-cols-3 gap-2 w-full px-4 pb-1">
          <button
            v-for="sides in DICE_SIDES"
            :key="sides"
            @click="roll(sides)"
            class="rounded-lg font-black text-sm min-w-[44px] text-center aspect-square flex items-center justify-center shadow-sm transition-all duration-150 active:scale-95"
            :style="`background: #1C0A00; color: #C9A84C; border: 2px solid #8B1A1A; font-size: 0.9rem;`"
            :title="`Lanzar d${sides}`"
          >
            d{{ sides }}
          </button>
        </div>

        <div class="text-center min-h-[72px] w-full flex items-center justify-center rounded-xl mx-4 mb-4 px-4"
             style="background: #2a1500; border: 1px dashed #C9A84C40;">
          <div v-if="rolling" class="text-3xl animate-bounce">🎲</div>
          <Transition name="dice-result" v-else-if="lastRoll">
            <div class="flex flex-col items-center">
              <span class="text-5xl font-black drop-shadow-lg" style="color: #C9A84C;">
                {{ lastRoll.result }}
              </span>
              <span class="text-[0.6rem] font-bold uppercase tracking-tighter" style="color: #C9A84C80;">
                resultado d{{ lastRoll.sides }}
              </span>
            </div>
          </Transition>
          <div v-else class="text-xs italic" style="color: #C9A84C60;">Elige un dado...</div>
        </div>
      </div>
    </Transition>

    <!-- Botón FAB principal con ring pulsante -->
    <div class="relative">
      <div class="absolute inset-0 rounded-full animate-ping opacity-30" style="background: #C9A84C;"></div>
      <button
        @click="open = !open"
        class="dice-fab relative"
        aria-label="Abrir lanzador de dados"
        style="z-index: 9999;"
      >
        <span v-if="!open" style="font-size: 1.6rem;">🎲</span>
        <span v-else style="font-size: 1.4rem; color: #C9A84C;">✕</span>
      </button>
    </div>
  </div>
</template>
