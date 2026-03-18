<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const heroStats = [
  { value: '∞', label: 'Personajes' },
  { value: '5e', label: 'D&D 2024' },
  { value: '🌐', label: 'En tiempo real' },
]

const features = [
  { icon: '📋', title: 'Hojas Inteligentes', desc: 'Hojas de personaje dinámicas con cálculos automáticos de modificadores, CA, iniciativa y mucho más.' },
  { icon: '🎲', title: 'Dados en Tiempo Real', desc: 'Lanza dados d4 al d20 con animaciones. Cada resultado queda registrado en el historial de sesión.' },
  { icon: '👑', title: 'Control Total del DM', desc: 'El Dungeon Master crea la campaña, invita jugadores, crea sus personajes y controla qué ven.' },
  { icon: '💾', title: 'Sincronización Neon', desc: 'Cada cambio en la hoja se guarda automáticamente en la nube. Nunca más perderás una sesión.' },
  { icon: '🔗', title: 'Invitaciones por Link', desc: 'El DM manda un link mágico a sus jugadores. Con un click ya están en la mesa, listos para jugar.' },
  { icon: '📱', title: 'Mobile-Ready', desc: 'Diseñado para funcionar perfecto en el celular durante la partida. Sin apps extras, solo el navegador.' },
]

const dmFeatures = [
  'Crea y gestiona múltiples campañas',
  'Invita jugadores con links únicos',
  'Crea personajes y los asigna a jugadores',
  'Ve todas las hojas de personaje de la mesa',
  'Controla quién puede editar qué',
  'Historial completo de cada sesión',
]

const playerFeatures = [
  'Acepta invitación del DM sin esfuerzo',
  'Accede a tu hoja de personaje desde cualquier lugar',
  'Actualiza HP, stats e inventario en tiempo real',
  'Historial de tus tiradas de dados',
  'Sin necesidad de imprimir nada',
  'Sincronizado automáticamente mid-sesión',
]
</script>

<template>
  <div class="landing-hero bg-white">
    <!-- NAVBAR -->
    <nav class="nav-glass fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🐉</span>
        <span class="font-bold text-lg tracking-wide" style="font-family: 'Metamorphous', serif; color: #C9A84C;">
          Dragon's Table
        </span>
      </div>
      <div class="flex items-center gap-4">
        <button
          v-if="auth.isSignedIn"
          @click="router.push('/dashboard')"
          class="btn-dnd-primary py-2 px-5 text-xs"
        >
          Mi Mesa →
        </button>
        <template v-else>
          <button @click="router.push('/sign-in')" class="btn-dnd-secondary py-2 px-5 text-xs">
            Iniciar Sesión
          </button>
          <button @click="router.push('/sign-up')" class="btn-dnd-primary py-2 px-5 text-xs">
            Unirse Gratis
          </button>
        </template>
      </div>
    </nav>

    <!-- HERO -->
    <section class="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-20">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
           style="background: radial-gradient(circle, rgba(139,26,26,0.2) 0%, transparent 70%); filter: blur(40px);"></div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest fade-in-up"
             style="border-color: rgba(201,168,76,0.3); color: rgba(201,168,76,0.8); background: rgba(201,168,76,0.05);">
          <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background:#C9A84C;"></span>
          Hogares de Héroes y Leyendas
        </div>

        <h1 class="text-5xl sm:text-6xl md:text-8xl font-black mb-6 leading-none fade-in-up fade-in-up-delay-1"
            style="font-family: 'Metamorphous', serif;">
          <span class="glow-gold" style="color: #C9A84C;">Dragon's</span>
          <br />
          <span class="glow-red" style="color: #cc2222;">Table</span>
        </h1>

        <p class="text-lg md:text-xl mb-4 fade-in-up fade-in-up-delay-2 max-w-2xl mx-auto"
           style="color: #4B5563; line-height: 1.8;">
          La plataforma definitiva para tus partidas de D&D. Hojas de personaje inteligentes,
          gestión de campañas, tirada de dados en tiempo real y mucho más.
        </p>
        <p class="text-sm mb-10 fade-in-up fade-in-up-delay-2"
           style="color: rgba(201,168,76,0.6); font-style: italic;">
          El Dungeon Master controla el mundo. Los héroes escriben la historia.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center fade-in-up fade-in-up-delay-3">
          <button @click="router.push('/sign-up')" class="btn-dnd-primary text-sm">
            ⚔️ Comenzar Aventura Gratis
          </button>
          <button @click="router.push('/sign-in')" class="btn-dnd-secondary text-sm">
            📜 Ya tengo cuenta
          </button>
        </div>

        <div class="mt-16 flex flex-col sm:flex-row gap-8 justify-center fade-in-up fade-in-up-delay-4">
          <div v-for="stat in heroStats" :key="stat.label" class="text-center">
            <div class="text-2xl font-black" style="color: #C9A84C; font-family:'Metamorphous',serif;">{{ stat.value }}</div>
            <div class="text-xs uppercase tracking-widest mt-1" style="color: rgba(253,246,227,0.4);">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span class="text-xs uppercase tracking-widest" style="color:#C9A84C;">Descubrir</span>
        <div class="w-px h-8 animate-bounce" style="background: linear-gradient(to bottom, #C9A84C, transparent);"></div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="relative py-28 px-6">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
          <div class="dnd-divider mb-6"><span class="text-xs uppercase tracking-widest" style="color: rgba(201,168,76,0.5);">Para tu Mesa</span></div>
          <h2 class="text-3xl md:text-5xl font-black" style="font-family:'Metamorphous',serif; color: #fdf6e3;">
            Todo lo que necesitas para
            <span style="color:#C9A84C;"> jugar</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="feature in features" :key="feature.title" class="feature-glass p-6">
            <div class="text-3xl mb-4">{{ feature.icon }}</div>
            <h3 class="font-black text-lg mb-2" style="font-family:'Metamorphous',serif; color:#fdf6e3;">{{ feature.title }}</h3>
            <p class="text-sm leading-relaxed" style="color: rgba(253,246,227,0.5);">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- DM vs PLAYER -->
    <section class="py-28 px-6 bg-gray-50 border-y border-gray-100">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-5xl font-black" style="font-family:'Metamorphous',serif; color:#fdf6e3;">
            Dos roles,<span style="color:#C9A84C;"> una aventura</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="feature-glass p-8 relative overflow-hidden" style="border-color: rgba(201,168,76,0.3);">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-4xl">👑</span>
              <div>
                <div class="font-black text-xl" style="font-family:'Metamorphous',serif; color:#C9A84C;">Dungeon Master</div>
                <span class="role-pill-dm">Admin</span>
              </div>
            </div>
            <ul class="space-y-3">
              <li v-for="item in dmFeatures" :key="item" class="flex items-start gap-3 text-sm" style="color: rgba(253,246,227,0.7);">
                <span style="color:#C9A84C;" class="mt-0.5 flex-shrink-0">✦</span>{{ item }}
              </li>
            </ul>
            <button @click="router.push('/sign-up')" class="btn-dnd-primary w-full mt-8 text-xs">Crear mi Mesa →</button>
          </div>

          <div class="feature-glass p-8 relative overflow-hidden">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-4xl">⚔️</span>
              <div>
                <div class="font-black text-xl" style="font-family:'Metamorphous',serif; color:#fdf6e3;">Aventurero</div>
                <span class="role-pill-player">Jugador</span>
              </div>
            </div>
            <ul class="space-y-3">
              <li v-for="item in playerFeatures" :key="item" class="flex items-start gap-3 text-sm" style="color: rgba(253,246,227,0.7);">
                <span style="color: rgba(201,168,76,0.5);" class="mt-0.5 flex-shrink-0">◆</span>{{ item }}
              </li>
            </ul>
            <button @click="router.push('/sign-up')" class="btn-dnd-secondary w-full mt-8 text-xs">Unirse a una Mesa →</button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="py-28 px-6 text-center relative">
      <div class="absolute inset-0 pointer-events-none"
           style="background: radial-gradient(ellipse at center, rgba(139,26,26,0.15) 0%, transparent 60%);"></div>
      <div class="relative max-w-2xl mx-auto">
        <div class="text-6xl mb-6">🎲</div>
        <h2 class="text-3xl md:text-5xl font-black mb-6" style="font-family:'Metamorphous',serif; color:#fdf6e3;">
          La aventura comienza<br /><span style="color:#C9A84C;">hoy</span>
        </h2>
        <p class="text-base mb-10" style="color: rgba(253,246,227,0.5);">
          Gratis para siempre. Sin límites de personajes. Sin cartas de crédito.
        </p>
        <button @click="router.push('/sign-up')" class="btn-dnd-primary text-base px-12 py-4">
          🐉 Comenzar Gratis
        </button>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="py-8 px-6 text-center border-t" style="border-color: rgba(201,168,76,0.1);">
      <p class="text-xs" style="color: rgba(253,246,227,0.3);">
        Dragon's Table © 2026 · Hecho con ❤️ para aventureros y dungeon masters
      </p>
    </footer>
  </div>
</template>
