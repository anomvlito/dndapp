<script setup>
import { ref } from 'vue'

const open = ref(false)
const rolling = ref(null)   // sides of die currently rolling
const lastRoll = ref(null)

const DICE = [
  {
    sides: 4, label: 'd4', accent: '#E53E3E',
    // Triángulo equilátero
    viewBox: '0 0 100 90',
    polygon: '50,4 96,86 4,86',
    innerLabel: { x: 50, y: 68 }
  },
  {
    sides: 6, label: 'd6', accent: '#805AD5',
    // Cuadrado
    viewBox: '0 0 100 100',
    polygon: '8,8 92,8 92,92 8,92',
    innerLabel: { x: 50, y: 58 }
  },
  {
    sides: 8, label: 'd8', accent: '#3182CE',
    // Diamante (rombo vertical)
    viewBox: '0 0 100 100',
    polygon: '50,4 96,50 50,96 4,50',
    innerLabel: { x: 50, y: 58 }
  },
  {
    sides: 10, label: 'd10', accent: '#2F855A',
    // Cometa/kite d10
    viewBox: '0 0 100 110',
    polygon: '50,4 96,42 50,106 4,42',
    innerLabel: { x: 50, y: 62 }
  },
  {
    sides: 12, label: 'd12', accent: '#C05621',
    // Pentágono
    viewBox: '0 0 100 100',
    polygon: '50,4 96,35 78,90 22,90 4,35',
    innerLabel: { x: 50, y: 60 }
  },
  {
    sides: 20, label: 'd20', accent: '#C9A84C',
    // Triángulo grande con detalles internos
    viewBox: '0 0 100 94',
    polygon: '50,2 98,90 2,90',
    innerLabel: { x: 50, y: 70 }
  },
]

function roll(die) {
  if (rolling.value !== null) return
  rolling.value = die.sides
  lastRoll.value = null
  setTimeout(() => {
    lastRoll.value = {
      sides: die.sides,
      result: Math.floor(Math.random() * die.sides) + 1,
      accent: die.accent,
      label: die.label
    }
    rolling.value = null
  }, 1400)
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-[9999] no-print flex flex-col items-end">

    <!-- Panel de dados colapsable -->
    <Transition name="slide-up">
      <div
        v-if="open"
        class="mb-4 rounded-2xl shadow-2xl flex flex-col items-center gap-4 w-72 overflow-hidden"
        style="background: #12050050; backdrop-filter: blur(24px); border: 1.5px solid rgba(201,168,76,0.35);"
      >
        <!-- Header -->
        <div class="w-full text-center px-4 py-2.5 font-black text-xs uppercase tracking-[0.25em]"
             style="background: rgba(28,10,0,0.9); color:#C9A84C; border-bottom:1px solid rgba(201,168,76,0.2);">
          ⚔️ Lanzador de Dados
        </div>

        <!-- Dados grid -->
        <div class="grid grid-cols-3 gap-4 px-5 pt-1">
          <button
            v-for="die in DICE"
            :key="die.sides"
            @click="roll(die)"
            :disabled="rolling !== null"
            class="flex flex-col items-center gap-1.5 group cursor-pointer disabled:cursor-not-allowed"
            :title="`Lanzar ${die.label}`"
          >
            <!-- SVG del dado con animación 3D única -->
            <div
              class="relative w-14 h-14 flex items-center justify-center"
              :class="`die-wrapper-${die.sides}`"
              :style="rolling === die.sides ? `animation: spin-d${die.sides} 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;` : 'animation: none;'"
            >
              <svg
                :viewBox="die.viewBox"
                class="w-full h-full"
                style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.7)); overflow: visible;"
              >
                <!-- Sombra del polígono -->
                <polygon
                  :points="die.polygon"
                  fill="rgba(0,0,0,0.4)"
                  transform="translate(3,4)"
                />
                <!-- Fondo del polígono -->
                <polygon
                  :points="die.polygon"
                  :fill="`${die.accent}22`"
                  :stroke="die.accent"
                  stroke-width="3"
                  stroke-linejoin="round"
                />
                <!-- Línea interna diagonal (detalle de dado) -->
                <line
                  v-if="die.sides !== 6"
                  :x1="die.sides === 4 || die.sides === 20 ? 50 : 50"
                  :y1="die.sides === 4 ? 86 : die.sides === 10 ? 106 : die.sides === 20 ? 90 : die.sides === 8 ? 50 : 90"
                  :x2="die.sides === 4 ? 50 : 50"
                  :y2="die.sides === 4 ? 45 : die.sides === 10 ? 42 : die.sides === 20 ? 46 : 10"
                  :stroke="`${die.accent}55`"
                  stroke-width="1.5"
                />
                <!-- Número del dado -->
                <text
                  :x="die.innerLabel.x"
                  :y="die.innerLabel.y"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  :fill="die.accent"
                  font-family="'Libre Baskerville', serif"
                  font-weight="900"
                  font-size="22"
                  :style="`text-shadow: 0 0 8px ${die.accent};`"
                >
                  {{ die.label }}
                </text>
              </svg>

              <!-- Glow durante el roll -->
              <div
                v-if="rolling === die.sides"
                class="absolute inset-0 rounded-full pointer-events-none"
                :style="`box-shadow: 0 0 20px ${die.accent}80, 0 0 40px ${die.accent}40; border-radius: 4px;`"
              ></div>
            </div>

            <!-- Label debajo -->
            <span
              class="text-[0.6rem] font-black uppercase tracking-wider transition-colors"
              :style="rolling === die.sides ? `color: ${die.accent}` : 'color: rgba(253,246,227,0.35)'"
            >
              {{ die.sides }} caras
            </span>
          </button>
        </div>

        <!-- Resultado -->
        <div
          class="w-full mx-4 mb-4 rounded-xl flex items-center justify-center min-h-[80px] relative overflow-hidden"
          style="background: rgba(0,0,0,0.5); border: 1px dashed rgba(201,168,76,0.25); margin: 0 16px 16px; width: calc(100% - 32px);"
        >
          <!-- Rolling state: muestra todos los dados girando pequeñitos -->
          <div v-if="rolling !== null" class="flex flex-col items-center gap-2">
            <div class="flex gap-2">
              <span
                v-for="die in DICE"
                :key="die.sides"
                class="text-xl transition-all duration-300"
                :style="die.sides === rolling ? `opacity: 1; font-size: 2rem; animation: spin-fast 0.15s linear infinite;` : 'opacity: 0.15; filter: grayscale(1);'"
              >
                {{ die.sides === 4 ? '△' : die.sides === 6 ? '⬜' : die.sides === 8 ? '◇' : die.sides === 10 ? '⬦' : die.sides === 12 ? '⬠' : '▽' }}
              </span>
            </div>
            <span class="text-xs uppercase tracking-widest" style="color: rgba(201,168,76,0.5);">Lanzando...</span>
          </div>

          <!-- Resultado final -->
          <Transition name="result-pop" v-else-if="lastRoll">
            <div class="flex flex-col items-center">
              <span
                class="font-black leading-none"
                :style="`font-size: 4rem; color: ${lastRoll.accent}; font-family: 'Libre Baskerville', serif; text-shadow: 0 0 20px ${lastRoll.accent}80, 0 0 40px ${lastRoll.accent}30;`"
              >
                {{ lastRoll.result }}
              </span>
              <span class="text-[0.6rem] font-black uppercase tracking-[0.2em]" :style="`color: ${lastRoll.accent}80;`">
                {{ lastRoll.label }} · {{ lastRoll.result === lastRoll.sides ? '⚡ CRÍTICO' : lastRoll.result === 1 ? '💀 PIFIA' : 'resultado' }}
              </span>
            </div>
          </Transition>

          <div v-else class="text-xs italic" style="color: rgba(201,168,76,0.3);">Elige un dado para lanzar</div>
        </div>
      </div>
    </Transition>

    <!-- FAB con ring pulsante -->
    <div class="relative">
      <div
        class="absolute inset-0 rounded-full opacity-25"
        style="background: #C9A84C; animation: ping-gold 2s cubic-bezier(0, 0, 0.2, 1) infinite;"
      ></div>
      <button
        @click="open = !open"
        class="dice-fab relative"
        aria-label="Abrir lanzador de dados"
      >
        <span v-if="!open" style="font-size:1.7rem; line-height:1;">🎲</span>
        <span v-else style="font-size:1.3rem; color:#C9A84C; font-weight:900;">✕</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ================================================
   ANIMACIONES ÚNICAS POR GEOMETRÍA DE DADO
   Cada dado gira diferente según su forma real
   ================================================ */

/* D4 — Tetraedro: gira con tilt como una peonza triangular */
@keyframes spin-d4 {
  0%   { transform: perspective(120px) rotateY(0deg) rotateX(15deg) rotateZ(0deg); }
  25%  { transform: perspective(120px) rotateY(90deg) rotateX(-10deg) rotateZ(5deg); }
  50%  { transform: perspective(120px) rotateY(180deg) rotateX(20deg) rotateZ(-5deg); }
  75%  { transform: perspective(120px) rotateY(270deg) rotateX(-10deg) rotateZ(5deg); }
  100% { transform: perspective(120px) rotateY(360deg) rotateX(15deg) rotateZ(0deg); }
}

/* D6 — Cubo: tumble clásico en X e Y */
@keyframes spin-d6 {
  0%   { transform: perspective(120px) rotateX(0deg) rotateY(0deg); }
  20%  { transform: perspective(120px) rotateX(72deg) rotateY(90deg); }
  40%  { transform: perspective(120px) rotateX(144deg) rotateY(180deg); }
  60%  { transform: perspective(120px) rotateX(216deg) rotateY(270deg); }
  80%  { transform: perspective(120px) rotateX(288deg) rotateY(320deg); }
  100% { transform: perspective(120px) rotateX(360deg) rotateY(360deg); }
}

/* D8 — Octaedro: flip dramático como un rombo que vuela */
@keyframes spin-d8 {
  0%   { transform: perspective(120px) rotate3d(1, 0.8, 0.2, 0deg); }
  100% { transform: perspective(120px) rotate3d(1, 0.8, 0.2, 360deg); }
}

/* D10 — Trapezoedro pentagonal: wobble asimétrico */
@keyframes spin-d10 {
  0%   { transform: perspective(120px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  30%  { transform: perspective(120px) rotateX(108deg) rotateY(60deg) rotateZ(20deg); }
  60%  { transform: perspective(120px) rotateX(216deg) rotateY(-60deg) rotateZ(-20deg); }
  100% { transform: perspective(120px) rotateX(360deg) rotateY(0deg) rotateZ(0deg); }
}

/* D12 — Dodecaedro: rotación majestuosa en eje diagonal */
@keyframes spin-d12 {
  0%   { transform: perspective(120px) rotate3d(2, 1, 0.5, 0deg); }
  100% { transform: perspective(120px) rotate3d(2, 1, 0.5, 360deg); }
}

/* D20 — Icosaedro: caos controlado, 3 ejes a la vez */
@keyframes spin-d20 {
  0%   { transform: perspective(120px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1); }
  15%  { transform: perspective(120px) rotateX(108deg) rotateY(72deg) rotateZ(30deg) scale(1.1); }
  30%  { transform: perspective(120px) rotateX(216deg) rotateY(144deg) rotateZ(60deg) scale(0.95); }
  50%  { transform: perspective(120px) rotateX(324deg) rotateY(216deg) rotateZ(90deg) scale(1.05); }
  70%  { transform: perspective(120px) rotateX(432deg) rotateY(288deg) rotateZ(120deg) scale(0.95); }
  85%  { transform: perspective(120px) rotateX(540deg) rotateY(324deg) rotateZ(150deg) scale(1.1); }
  100% { transform: perspective(120px) rotateX(720deg) rotateY(360deg) rotateZ(180deg) scale(1); }
}

/* Resultado pop-in */
@keyframes result-pop {
  0%   { transform: scale(0.3) rotate(-10deg); opacity: 0; }
  60%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
  80%  { transform: scale(0.95) rotate(-1deg); }
  100% { transform: scale(1) rotate(0deg); }
}

/* Ping del FAB */
@keyframes ping-gold {
  0%   { transform: scale(1); opacity: 0.4; }
  75%  { transform: scale(2); opacity: 0; }
  100% { transform: scale(2); opacity: 0; }
}

/* Spin rápido del ícono en resultado */
@keyframes spin-fast {
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(360deg); }
}

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

.result-pop-enter-active {
  animation: result-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.result-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.result-pop-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
