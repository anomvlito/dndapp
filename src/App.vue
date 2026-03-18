<script setup>
import { useUser } from '@clerk/vue'
import { watch } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter, useRoute } from 'vue-router'

const { isSignedIn, user, isLoaded } = useUser()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

// Sync Clerk user with our store
watch([isLoaded, isSignedIn, user], async ([loaded, signedIn, clerkUser]) => {
  if (!loaded) return
  if (signedIn && clerkUser && !auth.isSignedIn) {
    await auth.initFromClerk(clerkUser)
  } else if (!signedIn && auth.isSignedIn) {
    auth.signOut()
  }
}, { immediate: true })
</script>

<template>
  <router-view />
</template>
