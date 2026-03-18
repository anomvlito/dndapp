import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(true)

  const isSignedIn = computed(() => !!user.value)
  const isDM = computed(() => user.value?.role === 'dm')
  const isPlayer = computed(() => user.value?.role === 'player')

  /**
   * Sincroniza desde el objeto User de Clerk
   * @param {object} clerkUser 
   * @param {boolean} signedIn 
   */
  async function syncFromClerk(clerkUser, signedIn) {
    if (!signedIn || !clerkUser) {
      user.value = null
      token.value = null
      loading.value = false
      return
    }

    try {
      const email = clerkUser.primaryEmailAddress?.emailAddress
      const name = clerkUser.fullName || clerkUser.firstName || 'Aventurero'

      const res = await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerk_id: clerkUser.id,
          email: email,
          name: name,
          avatar: clerkUser.imageUrl
        })
      })
      
      const data = await res.json()
      
      // Combinar datos locales con los de DB
      user.value = {
        clerkId: clerkUser.id,
        imageUrl: clerkUser.imageUrl,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        ...data // role, id (interno), etc.
      }
    } catch (e) {
      console.error('Error syncing user:', e)
      user.value = {
        clerkId: clerkUser.id,
        imageUrl: clerkUser.imageUrl,
        firstName: clerkUser.firstName
      }
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
