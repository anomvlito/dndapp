import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(true)

  const isSignedIn = computed(() => !!user.value)
  const isDM = computed(() => user.value?.role === 'dm')
  const isPlayer = computed(() => user.value?.role === 'player')

  // Helper to handle Clerk synchronization
  async function syncFromClerk(clerkUser, signedIn) {
    if (!signedIn || !clerkUser) {
      user.value = null
      token.value = null
      loading.value = false
      return
    }

    try {
      const res = await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerk_id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          name: clerkUser.fullName || clerkUser.firstName,
          avatar: clerkUser.imageUrl
        })
      })
      const data = await res.json()
      user.value = { ...clerkUser, ...data, clerkId: clerkUser.id }
    } catch (e) {
      console.error('Error syncing user:', e)
      user.value = clerkUser
    } finally {
      loading.value = false
    }
  }

  function signOut() {
    user.value = null
    token.value = null
  }

  return { 
    user, token, loading, 
    isSignedIn, isDM, isPlayer, 
    syncFromClerk, signOut 
  }
})
