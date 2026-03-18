<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const campaigns = ref([])
const characters = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    // Load player's campaigns and characters
    const [campsRes, charsRes] = await Promise.all([
      fetch(`/api/campaigns?user_id=${auth.user?.clerkId}`),
      fetch(`/api/characters?user_id=${auth.user?.clerkId}`)
    ])
    campaigns.value = campsRes.ok ? await campsRes.json() : []
    characters.value = charsRes.ok ? await charsRes.json() : []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

function openCharacter(char) {
  router.push(`/character/${char.id}`)
}
</script>

<template>
  <div class="min-h-screen" style="background: linear-gradient(180deg, #0d0500, #1a0800);">
    <!-- NAVBAR -->
    <nav class="nav-glass sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span>🐉</span>
        <span class="font-bold" style="font-family:'Metamorphous',serif; color:#C9A84C;">Dragon's Table</span>
      </div>
      <div class="flex items-center gap-4">
        <span v-if="auth.isDM" class="role-pill-dm">DM</span>
        <span v-else class="role-pill-player">Aventurero</span>
        <button
          v-if="auth.isDM"
          @click="router.push('/dm')"
          class="btn-dnd-primary py-1.5 px-4 text-xs"
        >
          Panel DM →
        </button>
        <div class="w-8 h-8 rounded-full overflow-hidden border" style="border-color: rgba(201,168,76,0.4);">
          <img v-if="auth.user?.imageUrl" :src="auth.user.imageUrl" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-xs" style="background:#1C0A00; color:#C9A84C;">
            {{ auth.user?.firstName?.[0] || '?' }}
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto px-6 py-10 text-white">
      <!-- Welcome -->
      <div class="mb-10">
        <h1 class="text-3xl font-black mb-1" style="font-family:'Metamorphous',serif; color:#fdf6e3;">
          Bienvenido, <span style="color:#C9A84C;">{{ auth.user?.firstName || 'Aventurero' }}</span>
        </h1>
        <p class="text-sm" style="color: rgba(253,246,227,0.4);">
          Tu mesa de juego está lista
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="py-20 flex flex-col items-center gap-4">
        <div class="text-4xl animate-bounce">🎲</div>
        <p class="text-xs" style="color: rgba(201,168,76,0.5);">Cargando tu mesa...</p>
      </div>

      <template v-else>
        <!-- My Characters -->
        <section class="mb-12">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-xl font-black" style="font-family:'Metamorphous',serif; color:#C9A84C;">
              ⚔️ Mis Personajes
            </h2>
          </div>

          <div v-if="characters.length === 0"
               class="feature-glass p-10 text-center rounded-2xl">
            <div class="text-4xl mb-3 opacity-40">📜</div>
            <p class="text-sm" style="color: rgba(253,246,227,0.4);">
              Aún no tienes personajes.<br/>
              Espera la invitación de tu Dungeon Master.
            </p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="char in characters"
              :key="char.id"
              class="campaign-card p-5 cursor-pointer"
              @click="openCharacter(char)"
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                     style="background: linear-gradient(135deg, #2a1000, #1a0800); border: 2px solid rgba(201,168,76,0.3);">
                  {{ char.race === 'elfo' ? '🧝' : char.race === 'enano' ? '⛏️' : char.race === 'humano' ? '🧑' : '⚔️' }}
                </div>
                <div class="min-w-0">
                  <div class="font-black text-base truncate" style="color:#fdf6e3; font-family:'Metamorphous',serif;">
                    {{ char.name || 'Personaje sin nombre' }}
                  </div>
                  <div class="text-xs mt-0.5" style="color: rgba(201,168,76,0.6);">
                    {{ char.race }} · {{ char.class }} · Nv. {{ char.level }}
                  </div>
                  <div class="text-xs mt-1" style="color: rgba(253,246,227,0.3);">
                    {{ char.campaign_name || 'Sin campaña' }}
                  </div>
                </div>
                <div class="ml-auto text-xs" style="color: rgba(201,168,76,0.4);">→</div>
              </div>
            </div>
          </div>
        </section>

        <!-- My Campaigns -->
        <section>
          <h2 class="text-xl font-black mb-5" style="font-family:'Metamorphous',serif; color:#C9A84C;">
            🗺️ Mis Campañas
          </h2>

          <div v-if="campaigns.length === 0"
               class="feature-glass p-10 text-center rounded-2xl">
            <div class="text-4xl mb-3 opacity-40">🗺️</div>
            <p class="text-sm" style="color: rgba(253,246,227,0.4);">
              No perteneces a ninguna campaña todavía.<br/>
              Pide a tu DM que te envíe una invitación.
            </p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="camp in campaigns"
              :key="camp.id"
              class="campaign-card p-5"
              @click="router.push(`/campaign/${camp.id}`)"
            >
              <div class="font-black text-base mb-1" style="color:#fdf6e3; font-family:'Metamorphous',serif;">
                {{ camp.name }}
              </div>
              <div class="text-xs" style="color: rgba(201,168,76,0.6);">
                DM: {{ camp.dm_name }}
              </div>
              <div class="text-xs mt-1" style="color: rgba(253,246,227,0.3);">
                {{ camp.player_count }} jugadores · Sesión {{ camp.session_count || 1 }}
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>
