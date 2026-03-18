import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import { clerkPlugin } from '@clerk/vue'
import App from './App.vue'
import router from './router'
import './index.css'
import './styles/landing.css'

// Diagnostic tool: catch all errors and show them if we are in black screen
window.onerror = (msg, url, lineNo, columnNo, error) => {
  const div = document.createElement('div')
  div.style.position = 'fixed'
  div.style.top = '0'
  div.style.left = '0'
  div.style.width = '100%'
  div.style.background = 'red'
  div.style.color = 'white'
  div.style.padding = '20px'
  div.style.zIndex = '99999'
  div.innerText = `FATAL ERROR: ${msg} at ${lineNo}:${columnNo}`
  document.body.appendChild(div)
  return false
}

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
console.log('App initialization. Clerk Key present:', !!clerkKey)
if (clerkKey) {
  console.log('Clerk Key starts with:', clerkKey.substring(0, 8))
}

const app = createApp(App)
app.use(createPinia())
app.use(router)

if (clerkKey) {
  app.use(clerkPlugin, { publishableKey: clerkKey })
}

app.mount('#app')
