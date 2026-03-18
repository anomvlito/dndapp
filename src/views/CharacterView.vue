<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
// Re-export the existing character sheet as a view wrapper
import CharacterSheet from '../components/CharacterSheet.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const character = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`/api/characters/${route.params.id}`)
    if (res.ok) {
      character.value = await res.json()
    } else {
      error.value = 'Personaje no encontrado'
    }
  } catch (e) {
    error.value = 'Error al cargar el personaje'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen" style="background: linear-gradient(180deg, #0d0500, #1a0800);">
    <!-- Simple back nav -->
    <div class="nav-glass sticky top-0 z-40 px-4 py-3 flex items-center gap-4">
      <button @click="router.back()" class="flex items-center gap-2 text-sm" style="color: rgba(201,168,76,0.7);">
        ← Volver
      </button>
      <span class="text-xs" style="color: rgba(253,246,227,0.3);">|</span>
      <span class="text-sm font-bold" style="font-family:'Metamorphous',serif; color:#C9A84C;">
        {{ character?.name || 'Hoja de Personaje' }}
      </span>
    </div>

    <div v-if="loading" class="py-20 flex flex-col items-center gap-4">
      <div class="text-4xl animate-bounce">📜</div>
      <p class="text-xs" style="color: rgba(201,168,76,0.5);">Cargando hoja de personaje...</p>
    </div>

    <div v-else-if="error" class="py-20 text-center">
      <div class="text-4xl mb-4">💀</div>
      <p class="text-white">{{ error }}</p>
    </div>

    <!-- THE CHARACTER SHEET COMPONENT -->
    <CharacterSheet v-else :character-id="route.params.id" :initial-data="character" />
  </div>
</template>
