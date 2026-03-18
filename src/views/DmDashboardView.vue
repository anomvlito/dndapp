<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const campaigns = ref([])
const loading = ref(true)
const showCreateModal = ref(false)
const showInviteModal = ref(false)
const selectedCampaign = ref(null)
const inviteEmail = ref('')
const inviteLink = ref('')
const newCampaign = ref({ name: '', description: '' })
const creatingCampaign = ref(false)

onMounted(async () => {
  await loadCampaigns()
})

async function loadCampaigns() {
  loading.value = true
  try {
    const res = await fetch(`/api/campaigns?dm_id=${auth.user?.clerkId}`)
    campaigns.value = res.ok ? await res.json() : []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

async function createCampaign() {
  if (!newCampaign.value.name.trim()) return
  creatingCampaign.value = true
  try {
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newCampaign.value.name,
        description: newCampaign.value.description,
        dm_clerk_id: auth.user?.clerkId
      })
    })
    if (res.ok) {
      newCampaign.value = { name: '', description: '' }
      showCreateModal.value = false
      await loadCampaigns()
    }
  } finally { creatingCampaign.value = false }
}

async function generateInvite(campaign) {
  selectedCampaign.value = campaign
  showInviteModal.value = true
  inviteLink.value = ''
  inviteEmail.value = ''
  try {
    const res = await fetch('/api/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaign_id: campaign.id, dm_clerk_id: auth.user?.clerkId })
    })
    const data = await res.json()
    inviteLink.value = `${window.location.origin}/invite/${data.token}`
  } catch (e) { console.error(e) }
}

function copyInvite() {
  navigator.clipboard.writeText(inviteLink.value)
}
</script>

<template>
  <div class="min-h-screen text-white" style="background: linear-gradient(180deg, #0d0500, #1a0800);">
    <!-- NAVBAR -->
    <nav class="nav-glass sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span>🐉</span>
        <span class="font-bold" style="font-family:'Metamorphous',serif; color:#C9A84C;">Dragon's Table</span>
        <span class="role-pill-dm">DM</span>
      </div>
      <div class="flex items-center gap-4">
        <button @click="router.push('/dashboard')" class="btn-dnd-secondary py-1.5 px-4 text-xs">
          Vista Jugador
        </button>
        <div class="w-8 h-8 rounded-full overflow-hidden border" style="border-color: rgba(201,168,76,0.4);">
          <img v-if="auth.user?.imageUrl" :src="auth.user.imageUrl" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-xs" style="background:#1C0A00; color:#C9A84C;">
            {{ auth.user?.firstName?.[0] || '?' }}
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-5xl mx-auto px-6 py-10">
      <!-- Header -->
      <div class="flex items-center justify-between mb-10">
        <div>
          <h1 class="text-3xl font-black" style="font-family:'Metamorphous',serif; color:#C9A84C;">
            👑 Panel del Dungeon Master
          </h1>
          <p class="text-sm mt-1" style="color: rgba(253,246,227,0.4);">
            Tú controlas el mundo. Ellos escriben la historia.
          </p>
        </div>
        <button @click="showCreateModal = true" class="btn-dnd-primary text-xs">
          + Nueva Campaña
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="py-20 flex flex-col items-center gap-4">
        <div class="text-4xl animate-bounce">👑</div>
        <p class="text-xs" style="color: rgba(201,168,76,0.5);">Cargando tus campañas...</p>
      </div>

      <template v-else>
        <!-- Empty state -->
        <div v-if="campaigns.length === 0" class="feature-glass p-16 text-center rounded-2xl">
          <div class="text-6xl mb-4 opacity-40">🗺️</div>
          <h3 class="text-xl font-black mb-3" style="font-family:'Metamorphous',serif; color:#fdf6e3;">
            Ninguna campaña aún
          </h3>
          <p class="text-sm mb-6" style="color: rgba(253,246,227,0.4);">
            El mundo está en blanco. Tú decides cómo comienza la historia.
          </p>
          <button @click="showCreateModal = true" class="btn-dnd-primary text-sm">
            🗺️ Crear Primera Campaña
          </button>
        </div>

        <!-- Campaigns Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="camp in campaigns" :key="camp.id" class="campaign-card p-6">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-black text-lg" style="font-family:'Metamorphous',serif; color:#fdf6e3;">
                  {{ camp.name }}
                </h3>
                <p class="text-xs mt-1" style="color: rgba(253,246,227,0.4);">
                  {{ camp.description || 'Sin descripción' }}
                </p>
              </div>
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                   style="background: linear-gradient(135deg, #2a1000, #1a0800); border: 2px solid rgba(201,168,76,0.3);">
                🗺️
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-3 mb-5">
              <div class="text-center p-2 rounded-lg" style="background: rgba(0,0,0,0.3);">
                <div class="text-lg font-black" style="color:#C9A84C;">{{ camp.player_count || 0 }}</div>
                <div class="text-[0.55rem] uppercase tracking-widest" style="color: rgba(253,246,227,0.3);">Jugadores</div>
              </div>
              <div class="text-center p-2 rounded-lg" style="background: rgba(0,0,0,0.3);">
                <div class="text-lg font-black" style="color:#C9A84C;">{{ camp.character_count || 0 }}</div>
                <div class="text-[0.55rem] uppercase tracking-widest" style="color: rgba(253,246,227,0.3);">Personajes</div>
              </div>
              <div class="text-center p-2 rounded-lg" style="background: rgba(0,0,0,0.3);">
                <div class="text-lg font-black" style="color:#C9A84C;">{{ camp.session_count || 1 }}</div>
                <div class="text-[0.55rem] uppercase tracking-widest" style="color: rgba(253,246,227,0.3);">Sesiones</div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="router.push(`/campaign/${camp.id}`)"
                class="btn-dnd-primary flex-1 text-xs py-2"
              >
                Gestionar →
              </button>
              <button
                @click="generateInvite(camp)"
                class="btn-dnd-secondary flex-shrink-0 text-xs py-2 px-3"
                title="Generar invitación"
              >
                🔗 Invitar
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- MODAL: Nueva Campaña -->
    <Transition name="modal-fade">
      <div v-if="showCreateModal"
           class="fixed inset-0 z-50 flex items-center justify-center px-4"
           style="background: rgba(0,0,0,0.8);"
           @click.self="showCreateModal = false">
        <div class="auth-card p-8 w-full max-w-md">
          <h3 class="text-xl font-black mb-6" style="font-family:'Metamorphous',serif; color:#C9A84C;">
            🗺️ Nueva Campaña
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs mb-1 uppercase tracking-widest" style="color: rgba(201,168,76,0.7);">
                Nombre de la Campaña *
              </label>
              <input
                v-model="newCampaign.name"
                type="text"
                placeholder="La Maldición del Valle..."
                class="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
                style="background: rgba(0,0,0,0.4); border: 1px solid rgba(201,168,76,0.2); font-size:1rem;"
                @keydown.enter="createCampaign"
              />
            </div>
            <div>
              <label class="block text-xs mb-1 uppercase tracking-widest" style="color: rgba(201,168,76,0.7);">
                Descripción
              </label>
              <textarea
                v-model="newCampaign.description"
                rows="3"
                placeholder="Una breve descripción de la campaña..."
                class="w-full px-4 py-3 rounded-lg text-white text-sm outline-none resize-none"
                style="background: rgba(0,0,0,0.4); border: 1px solid rgba(201,168,76,0.2); font-size:1rem;"
              ></textarea>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button @click="showCreateModal = false" class="btn-dnd-secondary flex-1 text-xs py-3">
              Cancelar
            </button>
            <button
              @click="createCampaign"
              class="btn-dnd-primary flex-1 text-xs py-3"
              :disabled="creatingCampaign"
            >
              {{ creatingCampaign ? '⏳ Creando...' : '✦ Crear Campaña' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MODAL: Invitar Jugador -->
    <Transition name="modal-fade">
      <div v-if="showInviteModal"
           class="fixed inset-0 z-50 flex items-center justify-center px-4"
           style="background: rgba(0,0,0,0.8);"
           @click.self="showInviteModal = false">
        <div class="auth-card p-8 w-full max-w-md">
          <h3 class="text-xl font-black mb-2" style="font-family:'Metamorphous',serif; color:#C9A84C;">
            🔗 Invitar Jugador
          </h3>
          <p class="text-xs mb-6" style="color: rgba(253,246,227,0.4);">
            Comparte este link mágico con tu jugador para que se una a
            <strong style="color:#C9A84C;">{{ selectedCampaign?.name }}</strong>
          </p>

          <div v-if="!inviteLink" class="py-8 flex flex-col items-center gap-3">
            <div class="text-3xl animate-pulse">🔮</div>
            <p class="text-xs" style="color: rgba(201,168,76,0.5);">Generando link mágico...</p>
          </div>

          <div v-else class="space-y-4">
            <div class="rounded-lg p-3 flex items-center gap-3"
                 style="background: rgba(0,0,0,0.4); border: 1px solid rgba(201,168,76,0.2);">
              <span class="text-xs flex-1 truncate" style="color: rgba(201,168,76,0.8); font-family: monospace;">
                {{ inviteLink }}
              </span>
              <button @click="copyInvite" class="flex-shrink-0 text-xs px-3 py-1.5 rounded-md transition-all"
                      style="background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); color:#C9A84C;">
                Copiar
              </button>
            </div>
            <p class="text-xs text-center" style="color: rgba(253,246,227,0.3);">
              El link es válido por 7 días y se puede usar una sola vez.
            </p>
          </div>

          <button @click="showInviteModal = false" class="btn-dnd-secondary w-full mt-6 text-xs py-3">
            Cerrar
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
