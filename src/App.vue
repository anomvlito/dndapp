<script setup>
import { defineAsyncComponent, shallowRef } from 'vue'

// ClerkSync se monta sólo si hay key — componente raíz NUNCA es async
const hasClerk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.startsWith('pk_')
const ClerkSync = hasClerk ? defineAsyncComponent(() => import('./components/ClerkSync.vue')) : null
</script>

<template>
  <component :is="ClerkSync" v-if="ClerkSync" />
  <router-view />
</template>
