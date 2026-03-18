<script setup>
import { watch } from 'vue'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()

// Sincronizar con Clerk si fue instalado. 
// useUser() es una importación estática - si Clerk no fue instalado como plugin,
// inject() retorna undefined y las propiedades son refs vacías (no lanza error).
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (clerkKey?.startsWith('pk_')) {
  import('@clerk/vue').then(({ useUser }) => {
    try {
      const { isSignedIn, user, isLoaded } = useUser()
      watch([isLoaded, isSignedIn, user], async ([loaded, signedIn, clerkUser]) => {
        if (!loaded) return
        if (signedIn && clerkUser && !auth.isSignedIn) {
          await auth.initFromClerk(clerkUser)
        } else if (!signedIn && auth.isSignedIn) {
          auth.signOut()
        }
      }, { immediate: true })
    } catch (e) {
      // silenciar si Clerk no está listo
    }
  })
}
</script>

<template>
  <router-view />
</template>
