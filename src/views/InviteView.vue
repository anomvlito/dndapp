<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const token = route.params.token
const inviteData = ref(null)
const error = ref(null)
const loading = ref(true)
const accepting = ref(false)
const accepted = ref(false)

onMounted(async () => {
  try {
    const res = await fetch(`/api/invitations/${token}`)
    if (res.ok) {
      inviteData.value = await res.json()
    } else {
      error.value = 'El link de invitación es inválido o ha expirado.'
    }
  } catch (e) {
    error.value = 'Error al verificar la invitación.'
  } finally {
    loading.value = false
  }
})

async function acceptInvite() {
  if (!auth.isSignedIn) {
    router.push(`/sign-up?redirect=/invite/${token}`)
    return
  }
  accepting.value = true
  try {
    const res = await fetch(`/api/invitations/${token}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_clerk_id: auth.user?.clerkId })
    })
    if (res.ok) {
      accepted.value = true
      setTimeout(() => router.push('/dashboard'), 2500)
    } else {
      error.value = 'No se pudo aceptar la invitación.'
    }
  } finally { accepting.value = false }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4"
       style="background: linear-gradient(135deg, #0d0500, #1a0800, #0d0500);">
    <div class="auth-card p-10 w-full max-w-md text-center text-white">
      <div v-if="loading" class="py-8 flex flex-col items-center gap-4">
        <div class="text-5xl animate-pulse">🔮</div>
        <p style="color: rgba(201,168,76,0.6);">Verificando invitación...</p>
      </div>

      <div v-else-if="accepted" class="py-8">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-2xl font-black mb-2" style="font-family:'Metamorphous',serif; color:#C9A84C;">
          ¡Bienvenido a la Mesa!
        </h2>
        <p class="text-sm" style="color: rgba(253,246,227,0.5);">
          Te redirigiremos a tu dashboard...
        </p>
      </div>

      <template v-else-if="inviteData && !error">
        <div class="text-5xl mb-4">🐉</div>
        <h2 class="text-2xl font-black mb-2" style="font-family:'Metamorphous',serif; color:#C9A84C;">
          Invitación a la Mesa
        </h2>
        <p class="text-sm mb-6" style="color: rgba(253,246,227,0.5);">
          <strong style="color:#fdf6e3;">{{ inviteData.dm_name }}</strong> te invita a unirte a:
        </p>
        <div class="feature-glass p-6 rounded-2xl mb-8">
          <div class="text-3xl mb-2">🗺️</div>
          <div class="text-xl font-black" style="font-family:'Metamorphous',serif; color:#fdf6e3;">
            {{ inviteData.campaign_name }}
          </div>
          <div class="text-xs mt-2" style="color: rgba(201,168,76,0.5);">
            {{ inviteData.player_count || 0 }} aventureros en esta mesa
          </div>
        </div>

        <div v-if="!auth.isSignedIn" class="space-y-3">
          <button @click="acceptInvite" class="btn-dnd-primary w-full py-4">
            ⚔️ Crear cuenta y unirme
          </button>
          <button @click="router.push(`/sign-in?redirect=/invite/${token}`)" class="btn-dnd-secondary w-full py-3 text-xs">
            Ya tengo cuenta
          </button>
        </div>
        <button v-else @click="acceptInvite" class="btn-dnd-primary w-full py-4" :disabled="accepting">
          {{ accepting ? '⏳ Aceptando...' : '⚔️ Unirse a la Mesa' }}
        </button>
      </template>

      <div v-else class="py-8">
        <div class="text-5xl mb-4">💀</div>
        <h2 class="text-xl font-black mb-2" style="font-family:'Metamorphous',serif; color:#8B1A1A;">
          Link Inválido
        </h2>
        <p class="text-sm mb-6" style="color: rgba(253,246,227,0.5);">{{ error }}</p>
        <button @click="router.push('/')" class="btn-dnd-secondary text-sm">
          Volver al inicio
        </button>
      </div>
    </div>
  </div>
</template>
