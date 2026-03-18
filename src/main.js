import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './index.css'
import './styles/landing.css'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// Clerk es opcional — si no hay key configurada, la app funciona sin auth
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (clerkKey && clerkKey.startsWith('pk_')) {
  import('@clerk/vue').then(({ clerkPlugin }) => {
    app.use(clerkPlugin, { publishableKey: clerkKey })
    app.use(router)
    app.mount('#app')
  })
} else {
  // Sin Clerk: arrancar igual (auth deshabilitado, modo demo)
  console.warn('⚠️  VITE_CLERK_PUBLISHABLE_KEY no configurada — modo demo sin auth')
  app.use(router)
  app.mount('#app')
}
