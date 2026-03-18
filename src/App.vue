<script setup>
import { watch } from 'vue'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()

// Intentar conectar con Clerk si está disponible
try {
  const { useUser } = await import('@clerk/vue')
  const { isSignedIn, user, isLoaded } = useUser()

  watch([isLoaded, isSignedIn, user], async ([loaded, signedIn, clerkUser]) => {
    if (!loaded) return
    if (signedIn && clerkUser && !auth.isSignedIn) {
      await auth.initFromClerk(clerkUser)
    } else if (!signedIn && auth.isSignedIn) {
      auth.signOut()
    }
  }, { immediate: true })
} catch {
  // Clerk no disponible — modo demo, sin auth
}
</script>

<template>
  <router-view />
</template>
