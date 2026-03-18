# D&D Personaje — Guía del Agente

## Proyecto
Hoja de personaje inteligente para D&D 5e (2024), con integración de Neon Postgres y estética premium.

## Comandos Útiles
- Dev: `npm run dev`
- Build: `npm run build`
- DB Setup: `node scripts/init_db.js`
- Export: `node scripts/export_db.js`

## Estructura del Proyecto
- `api/`: Vercel serverless functions.
- `src/components/`: Componentes Vue (SFC).
- `lib/db/`: Lógica de repositorio y acceso a Neon.
- `skills/`: Habilidades personalizadas para el agente.
- `.claude/rules/`: Reglas locales de codificación y estilo.

## Patrones de Codificación
- **Database**: Repository Pattern (`lib/db/repository.js`).
- **Styles**: Liquid Glass + PHB 2024 (en `src/styles/liquid-glass.css`).
- **D&D Logic**: Fórmulas D&D 5e oficiales.

## Estado de la Base de Datos (Neon)
- Tablas: `campaigns`, `characters`, `character_stats`, `character_proficiencies`, `character_features`, `character_attacks`, `session_history`.
- Todos los cambios de estado deben registrarse en `session_history`.
