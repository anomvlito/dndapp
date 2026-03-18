<script setup>
import { watch, ref, onErrorCaptured } from 'vue'
import { useAuthStore } from './stores/auth'
import { useUser } from '@clerk/vue'

const auth = useAuthStore()
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const hasClerk = clerkKey && clerkKey.startsWith('pk_')

// Emergency Error Tracking
const fatalError = ref(null)
onErrorCaptured((err) => {
  fatalError.value = err?.message || err
  console.error('Captured app error:', err)
  return true
})

// Safe check: useUser must ONLY be called if clerkKey exists, 
// and we must ensure it's at the top level for Vue lifecycle
let clerkHook = null
if (hasClerk) {
  try {
    clerkHook = useUser()
    const { isLoaded, isSignedIn, user } = clerkHook
    
    // Sincronizar con nuestro store
    watch([isLoaded, isSignedIn], ([loaded, signedIn]) => {
      if (loaded) {
        auth.syncFromClerk(user.value, signedIn)
      }
    }, { immediate: true })
  } catch (e) {
    console.warn('Clerk initialization issue:', e)
  }
} else {
  // Modo sin Clerk (demo)
  auth.loading = false
}

function handlePrint() {
  window.print()
}

// Global expose for template if needed
window.handlePrintView = handlePrint
</script>

<template>
  <div v-if="fatalError" class="fixed inset-0 z-50 bg-red-950 flex items-center justify-center p-10 text-center">
    <div>
      <h1 class="text-3xl font-black text-red-500 mb-4">CRITICAL APP CRASH</h1>
      <pre class="bg-black/50 p-4 rounded text-xs text-red-200 overflow-auto max-w-lg mb-6">{{ fatalError }}</pre>
      <button onclick="window.location.reload()" class="px-6 py-2 bg-red-600 text-white rounded font-bold">REINTENTAR</button>
    </div>
  </div>
  <router-view v-else />
</template>
