<script setup>
import { SKILLS_LIST, PROF_BONUS, SKILLS_BY_STAT } from '../constants/dndData'
import { calculateSave, calculateSkill } from '../utils/modifiers'

const props = defineProps({
  stats: { type: Object, required: true },
  proficiencies: { type: Object, required: true },
})

const emit = defineEmits(['toggleSave', 'toggleSkill'])

function getSkillByKey(key) {
  return SKILLS_LIST.find(s => s.key === key)
}

function saveVal(stat) {
  const v = calculateSave(props.stats, props.proficiencies, stat, PROF_BONUS)
  return (v >= 0 ? '+' : '') + v
}

function skillVal(skillKey) {
  const skill = getSkillByKey(skillKey)
  if (!skill) return '+0'
  const v = calculateSkill(props.stats, props.proficiencies, skill.stat, skill.key, PROF_BONUS)
  return (v >= 0 ? '+' : '') + v
}
</script>

<template>
  <div class="md:col-span-3 space-y-4">
    <!-- Bono de Competencia mejorado -->
    <div class="flex items-center justify-between border-2 border-black p-2 rounded-xl bg-white shadow-sm overflow-hidden">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full border-2 border-dnd-gold bg-dnd-dark text-dnd-gold flex items-center justify-center font-black text-xl shadow-inner">
          +{{ PROF_BONUS }}
        </div>
        <div class="flex flex-col">
          <span class="text-[0.6rem] font-black uppercase tracking-widest text-dnd-red leading-tight">Bono de</span>
          <span class="text-[0.65rem] font-bold uppercase tracking-widest text-gray-500 leading-tight">Competencia</span>
        </div>
      </div>
    </div>

    <!-- Panel de Habilidades Agrupadas estilo 2024 -->
    <div class="border-2 border-black p-0 rounded-xl bg-white shadow-md overflow-hidden">
      <div class="section-banner w-full text-center py-1">Habilidades y Salvaciones</div>
      
      <div class="p-3 space-y-4">
        <div v-for="group in SKILLS_BY_STAT" :key="group.stat" class="space-y-1">
          <!-- Sub-header del atributo -->
          <div class="flex items-center justify-between border-b border-gray-100 pb-0.5 mb-1">
            <span class="text-[0.65rem] font-black text-dnd-red uppercase tracking-wider">{{ group.label }}</span>
          </div>

          <!-- Salvación del atributo -->
          <div class="flex items-center gap-2 group cursor-pointer py-0.5" @click="emit('toggleSave', group.stat)">
            <div :class="['skill-dot', proficiencies.saves[group.stat] ? 'active' : '']" />
            <span class="w-7 font-black text-center text-xs text-gray-700 bg-gray-50 rounded">{{ saveVal(group.stat) }}</span>
            <span class="text-[0.7rem] font-bold text-gray-400 uppercase italic">Salvación</span>
          </div>

          <!-- Habilidades del atributo -->
          <div v-for="skillKey in group.skills" :key="skillKey" 
               class="flex items-center gap-2 group cursor-pointer py-0.5" 
               @click="emit('toggleSkill', skillKey)">
            <div :class="['skill-dot', proficiencies.skills[skillKey] ? 'active' : '']" />
            <span class="w-7 font-black text-center text-xs text-gray-900">{{ skillVal(skillKey) }}</span>
            <span class="text-[0.7rem] font-semibold text-gray-800">{{ getSkillByKey(skillKey)?.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Otras competencias -->
    <div class="border-2 border-black p-0 rounded-xl bg-white shadow-md overflow-hidden min-h-[120px]">
      <div class="section-banner w-full text-center py-1">Otras Competencias e Idiomas</div>
      <div class="p-2">
        <textarea
          class="w-full h-28 text-[0.7rem] font-medium resize-none bg-transparent p-1 focus:ring-0 border-none"
          placeholder="Idiomas, herramientas, armaduras..."
        >- Común, Primordial
- Armaduras ligeras, medias, escudos
- Armas simples y marciales</textarea>
      </div>
    </div>
  </div>
</template>
