import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('../views/LandingView.vue'),
    meta: { public: true }
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    component: () => import('../views/SignInView.vue'),
    meta: { public: true }
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: () => import('../views/SignUpView.vue'),
    meta: { public: true }
  },
  {
    path: '/invite/:token',
    name: 'invite',
    component: () => import('../views/InviteView.vue'),
    meta: { public: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dm',
    name: 'dm-dashboard',
    component: () => import('../views/DmDashboardView.vue'),
    meta: { requiresAuth: true, requiresDM: true }
  },
  {
    path: '/campaign/:id',
    name: 'campaign',
    component: () => import('../views/CampaignView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/character/:id',
    name: 'character',
    component: () => import('../views/CharacterView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  // Sin Clerk configurado, permitir todo (modo demo)
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  if (!clerkKey || !clerkKey.startsWith('pk_')) return

  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isSignedIn) {
    return { name: 'sign-in' }
  }
  if (to.meta.requiresDM && !auth.isDM) {
    return { name: 'dashboard' }
  }
  if (auth.isSignedIn && (to.name === 'sign-in' || to.name === 'sign-up')) {
    return { name: 'dashboard' }
  }
})

export default router
