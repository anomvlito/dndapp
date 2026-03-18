<script setup>
import { useUser, SignUp } from '@clerk/vue'
import { useRouter } from 'vue-router'
import { watch } from 'vue'
import { useAuthStore } from '../stores/auth'

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const hasClerk = clerkKey && clerkKey.startsWith('pk_')

const auth = useAuthStore()
const router = useRouter()

// Sync logic
if (hasClerk) {
  try {
    const { isSignedIn, user } = useUser()
    watch([isSignedIn, user], async ([signedIn, clerkUser]) => {
      if (signedIn && clerkUser) {
        await auth.syncFromClerk(clerkUser, true)
        router.push('/dashboard')
      }
    }, { immediate: true })
  } catch (e) {
    console.warn('Sign Up View: Clerk hook failed', e)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4"
       style="background: linear-gradient(135deg, #0d0500, #1a0800, #0d0500);">
    <div class="auth-card p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">⚔️</div>
        <h1 class="text-2xl font-black" style="font-family:'Metamorphous',serif; color:#C9A84C;">
          Unirse a la Mesa
        </h1>
        <p class="text-sm mt-2" style="color: rgba(253,246,227,0.5);">
          Crea tu cuenta para comenzar la aventura
        </p>
      </div>

      <div v-if="!hasClerk" class="text-center p-6 bg-red-950/20 border border-red-900 rounded-xl">
        <p class="text-xs text-red-400 font-bold mb-4">⚠️ MODO DEMO - CLERK NO CONFIGURADO</p>
        <button @click="router.push('/dashboard')" class="btn-dnd-primary text-xs w-full py-3">
          Comenzar Aventura (Simulado)
        </button>
      </div>

      <SignUp
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
        sign-in-url="/sign-in"
      />

      <div class="text-center mt-6">
        <router-link to="/" class="text-xs" style="color: rgba(201,168,76,0.5);">
          ← Volver al inicio
        </router-link>
      </div>
    </div>
  </div>
</template>
