<script setup>
import { useUser, SignIn } from '@clerk/vue'
import { useRouter } from 'vue-router'
import { watch, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const hasClerk = clerkKey && clerkKey.startsWith('pk_')

const auth = useAuthStore()
const router = useRouter()

// Requerimos que Clerk esté presente para usar el hook
let hook = null
if (hasClerk) {
  try {
    hook = useUser()
    const { isSignedIn, user } = hook
    watch([isSignedIn, user], async ([signedIn, clerkUser]) => {
      if (signedIn && clerkUser) {
        await auth.syncFromClerk(clerkUser, true)
        router.push('/dashboard')
      }
    }, { immediate: true })
  } catch (error) {
    console.warn('Sign In View: Clerk hook failed', error)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4"
       style="background: linear-gradient(135deg, #0d0500, #1a0800, #0d0500);">
    <div class="auth-card p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🐉</div>
        <h1 class="text-2xl font-black" style="font-family:'Metamorphous',serif; color:#C9A84C;">
          Dragon's Table
        </h1>
        <p class="text-sm mt-2" style="color: rgba(253,246,227,0.5);">
          Inicia sesión para acceder a tu mesa
        </p>
      </div>

      <div v-if="!hasClerk" class="text-center p-6 bg-red-950/20 border border-red-900 rounded-xl">
        <p class="text-xs text-red-400 font-bold mb-4">⚠️ MODO DEMO - CLERK NO CONFIGURADO</p>
        <button @click="router.push('/dashboard')" class="btn-dnd-primary text-xs w-full py-3">
          Ver Dashboard (Simulado)
        </button>
      </div>

      <SignIn
        v-else
        :appearance="{
          elements: {
            card: 'bg-transparent shadow-none',
            headerTitle: 'hidden',
            socialButtonsBlockButton: 'border border-yellow-800 bg-red-950/30 text-yellow-200 hover:bg-red-900/40',
            formButtonPrimary: 'bg-red-800 hover:bg-red-700 border border-yellow-700',
            footerActionLink: 'text-yellow-400 hover:text-yellow-300',
          }
        }"
        redirect-url="/dashboard"
        sign-up-url="/sign-up"
      />

      <div class="text-center mt-6">
        <router-link to="/" class="text-xs" style="color: rgba(201,168,76,0.5);">
          ← Volver al inicio
        </router-link>
      </div>
    </div>
  </div>
</template>
