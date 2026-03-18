# Vue 3 Best Practices for D&D Sheet

## Component Communication
- Props down, Events up.
- Use `v-model` for two-way binding on complex state handled in `App.vue`.
- Prefer `SFC` (Single File Components) with `script setup`.

## State Management
- Local UI state stays in components (e.g., active dropdown).
- Game state (stats, HP, inventory) must live in `App.vue` or a Pinia store to ensure real-time sync with Neon.
- Use `lodash-es` for debounced updates to the database.

## Real-Time Sync
- Watch all core state objects and trigger `PATCH` requests on change.
- Show a central "Sincronizado" or "Guardando" indicator in the header.
