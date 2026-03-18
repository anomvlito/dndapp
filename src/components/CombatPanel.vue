<script setup>
import { computed } from 'vue'

const props = defineProps({
  armorClass: { type: Number, required: true },
  initiative: { type: Number, required: true },
  speed: { type: Number, required: true },
  charInfo: { type: Object, required: true },
  hitDice: { type: Object, required: true },
  deathSaves: { type: Object, required: true },
  attacks: { type: Array, required: true },
})

const emit = defineEmits(['speedChange', 'charInfoChange', 'hitDiceChange', 'toggleDeathSave'])

const hpColorClass = computed(() => {
  const ratio = props.charInfo.currentHp / props.charInfo.maxHp
  if (ratio >= 1) return 'text-green-600'
  if (ratio >= 0.5) return 'text-green-500'
  if (ratio >= 0.25) return 'text-amber-500'
  return 'text-red-600 animate-pulse'
})
</script>

<template>
  <div class="md:col-span-4 space-y-4">
    <div class="section-banner">Combate</div>
    
    <!-- CA / Iniciativa / Velocidad -->
    <div class="grid grid-cols-3 gap-3">
      <div class="ca-shield">
        <span class="text-[0.6rem] font-black uppercase text-dnd-red block mb-1">Clase Armad.</span>
        <div class="text-4xl font-black text-dnd-dark drop-shadow-sm">{{ armorClass }}</div>
      </div>
      
      <div class="border-2 border-black p-2 bg-white text-center rounded-xl relative shadow-sm h-full flex flex-col justify-center">
        <span class="text-[0.5rem] font-bold uppercase block text-gray-400">Iniciativa</span>
        <div class="text-3xl font-black mt-1 flex items-center justify-center">
          {{ initiative >= 0 ? '+' : '' }}{{ initiative }}
        </div>
      </div>

      <div class="border-2 border-black p-2 bg-white text-center rounded-xl relative shadow-sm h-full flex flex-col justify-center">
        <span class="text-[0.5rem] font-bold uppercase block text-gray-400">Velocidad</span>
        <div class="mt-1 flex flex-col items-center justify-center relative">
          <input
            type="number"
            class="text-3xl font-black text-center w-full bg-transparent outline-none"
            :value="speed"
            @change="emit('speedChange', Number($event.target.value))"
          />
          <span class="text-[0.5rem] font-bold uppercase absolute -bottom-1 right-0 text-gray-300">pies</span>
        </div>
      </div>
    </div>

    <!-- Puntos de Golpe -->
    <div class="border-2 border-black rounded-xl bg-white shadow-md overflow-hidden">
      <div class="flex justify-between items-center bg-gray-50 px-3 py-1 border-b border-black">
        <label class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Puntos de Golpe Máximos</label>
        <div class="flex items-center gap-1">
          <span class="text-[0.6rem] font-bold text-gray-300 uppercase">HP Máx</span>
          <input
            type="number"
            :value="charInfo.maxHp"
            @change="emit('charInfoChange', { maxHp: parseInt($event.target.value) })"
            class="w-10 text-center font-black text-sm bg-transparent border-b border-gray-200 focus:border-dnd-red outline-none"
          />
        </div>
      </div>
      
      <div class="p-2 flex flex-col items-center justify-center py-4">
        <input
          type="number"
          class="text-6xl font-black text-center w-full bg-transparent transition-colors duration-500 outline-none"
          :class="hpColorClass"
          :value="charInfo.currentHp"
          @change="emit('charInfoChange', { currentHp: parseInt($event.target.value) })"
        />
        <span class="text-[0.6rem] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">
          Puntos de Golpe Actuales
        </span>
      </div>
    </div>

    <!-- Temp HP & Dados de Golpe & Salvaciones -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-4">
        <div class="border-2 border-black p-2 rounded-xl bg-white shadow-sm text-center">
          <input
            type="number"
            class="text-3xl font-black text-center w-full text-gray-200 focus:text-black bg-transparent outline-none"
            placeholder="0"
          />
          <span class="text-[0.5rem] font-bold uppercase text-gray-400 block border-t mt-1 pt-1">PTOS Temporales</span>
        </div>

        <div class="border-2 border-black p-2 rounded-xl bg-white shadow-sm">
          <div class="flex justify-between text-[0.6rem] font-black mb-1 border-b border-gray-100 uppercase tracking-widest text-gray-400">
            <span>Total:</span>
            <input
              type="text"
              :value="hitDice.total"
              @change="emit('hitDiceChange', { total: $event.target.value })"
              class="w-10 text-right font-bold bg-transparent outline-none"
            />
          </div>
          <input
            type="number"
            :value="hitDice.current"
            @change="emit('hitDiceChange', { current: parseInt($event.target.value) })"
            class="text-3xl font-black text-center w-full py-1 bg-transparent outline-none"
          />
          <div class="text-center text-[0.5rem] font-bold uppercase text-gray-500 pt-1 border-t">Dados de Golpe</div>
        </div>
      </div>

      <div class="border-2 border-black p-2 rounded-xl bg-white shadow-sm flex flex-col justify-between overflow-hidden">
        <div class="space-y-4 py-2">
          <div
            v-for="type in ['successes', 'failures']"
            :key="type"
            class="flex items-center justify-between"
          >
            <span class="text-[0.55rem] font-black uppercase w-12 text-gray-400 leading-none">
              {{ type === 'successes' ? 'Éxitos' : 'Fallos' }}
            </span>
            <div class="flex gap-2">
              <div
                v-for="(val, i) in deathSaves[type]"
                :key="i"
                @click="emit('toggleDeathSave', type, i)"
                :class="[
                  'w-5 h-5 rounded-full border-2 border-black cursor-pointer shadow-sm transition-all',
                  val
                    ? type === 'successes' ? 'bg-black' : 'bg-red-600'
                    : 'bg-white hover:border-gray-400'
                ]"
              />
            </div>
          </div>
        </div>
        <div class="text-center text-[0.5rem] font-black uppercase text-gray-500 border-t pt-2 mt-2">
          Salvaciones de Muerte
        </div>
      </div>
    </div>

    <!-- Ataques (Scrollable horizontal on mobile) -->
    <div class="border-2 border-black rounded-xl bg-white shadow-md overflow-hidden">
      <div class="section-banner w-full text-center py-1">Ataques y Conjuros</div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs min-w-[300px]">
          <thead>
            <tr class="bg-gray-50 border-b-2 border-black">
              <th class="font-black py-2 px-3 text-dnd-red uppercase text-[0.6rem]">Nombre</th>
              <th class="font-black py-2 text-center text-dnd-red uppercase text-[0.6rem] w-12">Bono</th>
              <th class="font-black py-2 px-3 text-dnd-red uppercase text-[0.6rem]">Daño / Tipo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(atk, idx) in attacks" :key="idx" class="border-b border-gray-100 hover:bg-red-50/30 transition-colors">
              <td class="py-2 px-3 font-bold border-r table-cell align-middle">{{ atk.name }}</td>
              <td class="py-2 text-center font-black border-r text-sm align-middle">{{ atk.bonus }}</td>
              <td class="py-2 px-3 text-[0.7rem] bg-gray-50/50 align-middle">
                <div class="font-bold">{{ atk.damage }}</div>
                <div class="text-[0.6rem] text-gray-400 uppercase font-bold">{{ atk.type }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-2 border-t bg-gray-50">
        <textarea
          class="w-full h-20 text-[0.7rem] font-medium resize-none p-2 bg-white rounded border border-gray-200 focus:outline-none focus:border-dnd-red"
          placeholder="Notas de combate..."
        >Ira Frustrada (Furia): +2 daño cuerpo a cuerpo.
Lanzar jabalina: 30/120 pies.</textarea>
      </div>
    </div>
  </div>
</template>
