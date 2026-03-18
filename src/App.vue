<script setup>
import { ref, computed, watch, onMounted } from 'vue'

import DiceTray from './components/DiceTray.vue'
import CharacterStats from './components/CharacterStats.vue'
import SkillsPanel from './components/SkillsPanel.vue'
import CombatPanel from './components/CombatPanel.vue'
import PersonalityPanel from './components/PersonalityPanel.vue'
import BioTab from './components/BioTab.vue'

import {
  INITIAL_STATS,
  INITIAL_CHAR_INFO,
  INITIAL_PROFICIENCIES,
  INITIAL_ATTACKS,
  INITIAL_EQUIPMENT,
  INITIAL_FEATURES,
  INITIAL_COINS,
} from './constants/dndData'
import { getMod } from './utils/modifiers'
import { exportToExcel } from './utils/exportExcel'
import { debounce } from 'lodash-es'

const charId = ref(null)
const isSaving = ref(false)
const lastSaved = ref(null)

const activeTab = ref('main')

const stats = ref({ ...INITIAL_STATS })
const charInfo = ref({ ...INITIAL_CHAR_INFO })
const proficiencies = ref({
  saves: { ...INITIAL_PROFICIENCIES.saves },
  skills: { ...INITIAL_PROFICIENCIES.skills },
})
const speed = ref(30)
const hitDice = ref({ total: '1d12', current: 1 })
const deathSaves = ref({
  successes: [false, false, false],
  failures: [false, false, false],
})
const coins = ref({ ...INITIAL_COINS })

const armorClass = computed(() => 10 + getMod(stats.value.destreza) + getMod(stats.value.constitucion))
const initiative = computed(() => getMod(stats.value.destreza))

function handleStatChange(stat, val) {
  stats.value = { ...stats.value, [stat]: parseInt(val) || 0 }
}

function handleCharInfoChange(changes) {
  charInfo.value = { ...charInfo.value, ...changes }
}

function toggleSave(stat) {
  proficiencies.value = {
    ...proficiencies.value,
    saves: { ...proficiencies.value.saves, [stat]: !proficiencies.value.saves[stat] },
  }
}

function toggleSkill(skill) {
  proficiencies.value = {
    ...proficiencies.value,
    skills: { ...proficiencies.value.skills, [skill]: !proficiencies.value.skills[skill] },
  }
}

function toggleDeathSave(type, index) {
  const updated = [...deathSaves.value[type]]
  updated[index] = !updated[index]
  deathSaves.value = { ...deathSaves.value, [type]: updated }
}

function handleHitDiceChange(changes) {
  hitDice.value = { ...hitDice.value, ...changes }
}

function handleExport() {
  exportToExcel({
    charInfo: charInfo.value,
    stats: stats.value,
    equipment: INITIAL_EQUIPMENT,
    armorClass: armorClass.value,
    initiative: initiative.value,
    speed: speed.value,
    hitDice: hitDice.value,
    getMod,
  })
}

function handleReset() {
  if (confirm('¿Reiniciar memoria?')) window.location.reload()
}

// REAL-TIME SAVE LOGIC
const saveToDb = async (type, data) => {
  if (!charId.value) return
  isSaving.value = true
  try {
    const res = await fetch(`/api/characters?id=${charId.value}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    })
    if (res.ok) {
      lastSaved.value = new Date().toLocaleTimeString()
    }
  } catch (e) {
    console.error('Error saving:', e)
  } finally {
    isSaving.value = false
  }
}

const debouncedSaveStats = debounce((val) => saveToDb('stats', val), 1000)
const debouncedSaveBasics = debounce((val) => saveToDb('basics', val), 1000)
const debouncedSaveHp = debounce((val) => saveToDb('hp', val), 1000)

watch(stats, (newVal) => debouncedSaveStats(newVal), { deep: true })
watch(charInfo, (newVal) => {
  debouncedSaveBasics(newVal)
  debouncedSaveHp({ current: newVal.currentHp, temp: newVal.tempHp })
}, { deep: true })

onMounted(async () => {
  // Try to load first char or create one
  try {
    const res = await fetch('/api/characters')
    const data = await res.json()
    if (data && data.length > 0) {
      const char = data[0]
      charId.value = char.id
      charInfo.value = {
        name: char.name,
        classLevel: char.class_level,
        background: char.background,
        race: char.race,
        alignment: char.alignment,
        currentHp: char.current_hp,
        maxHp: char.max_hp
      }
      stats.value = {
        fuerza: char.fuerza,
        destreza: char.destreza,
        constitucion: char.constitucion,
        inteligencia: char.inteligencia,
        sabiduria: char.sabiduria,
        carisma: char.carisma
      }
    } else {
      // Create new
      const createRes = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'El Olvidado', stats: INITIAL_STATS })
      })
      const createData = await createRes.json()
      charId.value = createData.id
    }
  } catch (e) {
    console.error('Failed to init char:', e)
  }
})
</script>

<template>
  <div class="min-h-screen p-2 sm:p-4 md:p-6 bg-gray-50">
    <div class="max-w-5xl mx-auto">
      <!-- NAV -->
      <nav class="flex w-full no-print">
        <button
          @click="activeTab = 'main'"
          :class="['tab-btn', activeTab === 'main' ? 'active' : 'inactive']"
        >
          ⚔️ Amnesia y Combate
        </button>
        <button
          @click="activeTab = 'bio'"
          :class="['tab-btn', activeTab === 'bio' ? 'active' : 'inactive']"
        >
          📜 Búsqueda sin Nombre
        </button>
      </nav>

      <div class="parchment-bg rounded-b-xl p-3 sm:p-5 md:p-8 shadow-2xl border-x-2 border-b-2 border-black/5">
        <!-- HEADER -->
        <header class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 items-end border-b-4 border-dnd-red/20 pb-6">
          <div class="md:col-span-5 relative">
            <label class="text-[0.6rem] font-black uppercase text-dnd-red tracking-widest block mb-1">Nombre del Personaje</label>
            <input
              type="text"
              class="text-3xl font-bold header-font w-full bg-transparent outline-none focus:border-b-2 border-dnd-gold"
              v-model="charInfo.name"
            />
            <div v-if="isSaving" class="absolute -top-6 right-0 text-[0.5rem] font-bold text-dnd-gold animate-pulse uppercase tracking-tighter">
              Guardando esencia...
            </div>
            <div v-else-if="lastSaved" class="absolute -top-6 right-0 text-[0.5rem] font-bold text-gray-400 uppercase tracking-tighter">
              Sincronizado: {{ lastSaved }}
            </div>
          </div>
          <div class="md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-3">
            <div v-for="field in [
              { label: 'Clase/Nivel', key: 'classLevel' },
              { label: 'Trasfondo', key: 'background' },
              { label: 'Raza/Especie', key: 'race' },
            ]" :key="field.key">
              <label class="text-[0.55rem] font-bold uppercase text-gray-400 block">{{ field.label }}</label>
              <input
                type="text"
                v-model="charInfo[field.key]"
                class="font-black text-sm w-full bg-transparent border-b border-gray-100 py-1 outline-none focus:border-dnd-red"
              />
            </div>
            <div>
              <label class="text-[0.55rem] font-bold uppercase text-gray-400 block">Esencia</label>
              <input type="text" value="Recuerdo Borroso" class="font-black text-sm text-gray-400 bg-transparent w-full border-b border-gray-100 py-1" readonly />
            </div>
          </div>
        </header>

        <!-- TAB MAIN -->
        <Transition name="tab" mode="out-in">
          <div
            v-if="activeTab === 'main'"
            key="main"
            class="grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            <!-- Lado Izquierdo: Stats + Skills -->
            <div class="md:col-span-5 grid grid-cols-1 md:grid-cols-5 gap-6">
              <CharacterStats
                :stats="stats"
                @statChange="handleStatChange"
              />
              <SkillsPanel
                :stats="stats"
                :proficiencies="proficiencies"
                @toggleSave="toggleSave"
                @toggleSkill="toggleSkill"
              />
            </div>

            <!-- Lado Derecho: Combate + Personalidad -->
            <div class="md:col-span-7 space-y-8">
              <CombatPanel
                :armorClass="armorClass"
                :initiative="initiative"
                :speed="speed"
                :charInfo="charInfo"
                :hitDice="hitDice"
                :deathSaves="deathSaves"
                :attacks="INITIAL_ATTACKS"
                @speedChange="(v) => (speed = parseInt(v) || 0)"
                @charInfoChange="handleCharInfoChange"
                @hitDiceChange="handleHitDiceChange"
                @toggleDeathSave="toggleDeathSave"
              />
              <PersonalityPanel :features="INITIAL_FEATURES" />
            </div>
          </div>

          <!-- TAB BIO -->
          <div v-else-if="activeTab === 'bio'" key="bio">
            <BioTab
              :stats="stats"
              :equipment="INITIAL_EQUIPMENT"
              :coins="coins"
              @coinsChange="(v) => (coins = v)"
            />
          </div>
        </Transition>

        <!-- FOOTER -->
        <footer class="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 no-print border-t border-black/10 pt-8">
          <button
            @click="window.print()"
            class="w-full sm:w-auto bg-dnd-red text-white px-8 py-3 rounded-xl font-black shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
          >
            🖨️ PDF de Hoja
          </button>
          <button
            @click="handleExport"
            class="w-full sm:w-auto bg-green-700 text-white px-8 py-3 rounded-xl font-black shadow-lg hover:bg-green-800 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
          >
            📊 Exportar a Excel
          </button>
          <button
            @click="handleReset"
            class="w-full sm:w-auto bg-gray-200 text-gray-500 px-8 py-3 rounded-xl font-black shadow hover:bg-gray-300 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
          >
            ♻️ Reiniciar
          </button>
        </footer>
      </div>

      <!-- El dado ahora vive en su propio tray con FAB -->
      <DiceTray />
    </div>
  </div>
</template>
