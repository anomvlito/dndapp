<script setup>
import { useClerk, useUser, SignIn } from '@clerk/vue'
import { useRouter } from 'vue-router'
import { watch } from 'vue'
import { useAuthStore } from '../stores/auth'

const { isSignedIn, user } = useUser()
const auth = useAuthStore()
const router = useRouter()

watch([isSignedIn, user], async ([signedIn, clerkUser]) => {
  if (signedIn && clerkUser) {
    await auth.initFromClerk(clerkUser)
    router.push('/dashboard')
  }
}, { immediate: true })
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

      <SignIn
        :appearance="{
          elements: {
            card: 'bg-transparent shadow-none',
            headerTitle: 'text-yellow-400 font-bold',
            socialButtonsBlockButton: 'border border-yellow-800 bg-red-950/30 text-yellow-200 hover:bg-red-900/40',
            formButtonPrimary: 'bg-red-800 hover:bg-red-700 border border-yellow-700',
            footerActionLink: 'text-yellow-400 hover:text-yellow-300',
            formFieldInput: 'bg-black/30 border-yellow-900/50 text-white',
            formFieldLabel: 'text-yellow-200/60',
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
