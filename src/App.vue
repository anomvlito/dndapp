<script setup>
import { watch, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useUser } from '@clerk/vue'

const auth = useAuthStore()
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Is Clerk present and valid?
const hasClerk = clerkKey && clerkKey.startsWith('pk_')

if (hasClerk) {
  try {
    const { isSignedIn, user, isLoaded } = useUser()
    
    // Watch for Clerk state changes to sync with our store
    watch([isLoaded, isSignedIn], ([loaded, signedIn]) => {
      if (loaded) {
        auth.syncFromClerk(user.value, signedIn)
      }
    }, { immediate: true })
  } catch (error) {
    console.error('Clerk hook failure:', error)
  }
} else {
  // Demo mode: auto-load a mock user if no Clerk key
  onMounted(() => {
    auth.loading = false
  })
}
</script>

<template>
  <router-view />
</template>
