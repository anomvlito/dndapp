<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const campaign = ref(null)
const members = ref([])
const characters = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [campRes, membersRes, charsRes] = await Promise.all([
      fetch(`/api/campaigns/${route.params.id}`),
      fetch(`/api/campaigns/${route.params.id}/members`),
      fetch(`/api/characters?campaign_id=${route.params.id}`)
    ])
    campaign.value = campRes.ok ? await campRes.json() : null
    members.value = membersRes.ok ? await membersRes.json() : []
    characters.value = charsRes.ok ? await charsRes.json() : []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>

<template>
  <div class="min-h-screen text-white" style="background: linear-gradient(180deg, #0d0500, #1a0800);">
    <!-- NAVBAR -->
    <nav class="nav-glass sticky top-0 z-40 px-6 py-4 flex items-center gap-4">
      <button @click="router.back()" style="color: rgba(201,168,76,0.7);" class="text-sm">← Volver</button>
      <span style="color: rgba(253,246,227,0.3);">|</span>
      <span class="font-bold" style="font-family:'Metamorphous',serif; color:#C9A84C;">
        {{ campaign?.name || 'Campaña' }}
      </span>
    </nav>

    <div class="max-w-4xl mx-auto px-6 py-10">
      <div v-if="loading" class="py-20 flex flex-col items-center gap-4">
        <div class="text-4xl animate-bounce">🗺️</div>
        <p class="text-xs" style="color: rgba(201,168,76,0.5);">Cargando campaña...</p>
      </div>

      <template v-else>
        <h1 class="text-3xl font-black mb-2" style="font-family:'Metamorphous',serif; color:#C9A84C;">
          {{ campaign?.name }}
        </h1>
        <p class="text-sm mb-10" style="color: rgba(253,246,227,0.4);">{{ campaign?.description }}</p>

        <!-- Characters in this campaign -->
        <section class="mb-10">
          <h2 class="text-xl font-black mb-5" style="font-family:'Metamorphous',serif; color:#fdf6e3;">⚔️ Personajes</h2>
          <div v-if="characters.length === 0" class="feature-glass p-10 text-center rounded-2xl">
            <p class="text-sm" style="color: rgba(253,246,227,0.4);">Sin personajes aún.</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="char in characters" :key="char.id"
                 class="campaign-card p-5 cursor-pointer"
                 @click="router.push(`/character/${char.id}`)">
              <div class="font-black" style="color:#fdf6e3; font-family:'Metamorphous',serif;">{{ char.name }}</div>
              <div class="text-xs mt-1" style="color: rgba(201,168,76,0.6);">{{ char.race }} · {{ char.class }} · Nv. {{ char.level }}</div>
            </div>
          </div>
        </section>

        <!-- Members -->
        <section>
          <h2 class="text-xl font-black mb-5" style="font-family:'Metamorphous',serif; color:#fdf6e3;">👥 Jugadores</h2>
          <div class="space-y-3">
            <div v-for="member in members" :key="member.id" class="feature-glass p-4 rounded-xl flex items-center gap-4">
              <div class="w-10 h-10 rounded-full overflow-hidden border flex-shrink-0"
                   style="border-color: rgba(201,168,76,0.3);">
                <img v-if="member.avatar" :src="member.avatar" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-sm" style="background:#1C0A00; color:#C9A84C;">
                  {{ member.name?.[0] || '?' }}
                </div>
              </div>
              <div class="flex-1">
                <div class="font-bold text-sm" style="color:#fdf6e3;">{{ member.name }}</div>
                <div class="text-xs" style="color: rgba(201,168,76,0.5);">{{ member.email }}</div>
              </div>
              <span :class="member.role === 'dm' ? 'role-pill-dm' : 'role-pill-player'">
                {{ member.role === 'dm' ? 'DM' : 'Jugador' }}
              </span>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>
