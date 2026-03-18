import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './index.css'
import './styles/landing.css'

async function bootstrap() {
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)

  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  if (clerkKey?.startsWith('pk_')) {
    try {
      const { clerkPlugin } = await import('@clerk/vue')
      app.use(clerkPlugin, { publishableKey: clerkKey })
    } catch (e) {
      console.warn('Clerk init failed:', e.message)
    }
  } else {
    console.warn('⚠️ No VITE_CLERK_PUBLISHABLE_KEY — modo demo')
  }

  app.mount('#app')
}

bootstrap()
