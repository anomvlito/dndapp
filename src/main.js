import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './index.css'
import './styles/landing.css'

// Clerk static import for reliability
import { clerkPlugin } from '@clerk/vue'

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const app = createApp(App)
app.use(createPinia())
app.use(router)

if (clerkKey && clerkKey.startsWith('pk_')) {
  app.use(clerkPlugin, { publishableKey: clerkKey })
} else {
  console.warn('⚠️ No VITE_CLERK_PUBLISHABLE_KEY defined. Auth will not work.')
}

app.mount('#app')
