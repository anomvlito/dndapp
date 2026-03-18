import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { clerkPlugin } from '@clerk/vue'
import App from './App.vue'
import router from './router/index.js'
import './index.css'
import './styles/landing.css'

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(clerkPlugin, {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
})
app.use(router)
app.mount('#app')
