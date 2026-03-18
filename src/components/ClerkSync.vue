<script setup>
// Componente síncrono que maneja la sincronización con Clerk
// Se importa estáticamente — Clerk está en el bundle de todos modos
// useUser() lanza si Clerk no fue instalado → lo capturamos
import { watch } from 'vue'
import { useUser } from '@clerk/vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

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
  // Clerk no inicializado — modo demo
}
</script>

<template><!-- Este componente no renderiza nada, sólo sincroniza estado --></template>
