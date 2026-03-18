# D&D Project Coding Style & Patterns

## UI/UX: Liquid Glass Aesthetic
- Use `backdrop-blur-*` and `bg-white/10` or `bg-slate-900/40` for main panels.
- Buttons should have subtle `hover:scale-105` and `active:scale-95` transitions.
- Interactive elements (like dice) should feel "alive" with micro-animations.
- Use a color palette of `dnd-red (#8B1A1A)`, `dnd-gold (#C9A84C)`, and `parchment (#fdf6e3)`.

## Database: Neon & Postgres Patterns
- Always use `timestamptz` for date fields.
- Prefer `text` over `varchar(n)` for flexibility.
- Use `ON DELETE CASCADE` for all relations to characters.
- Implement the **Repository Pattern** for database access to separate SQL from business logic.
- Use `FOR UPDATE SKIP LOCKED` when handling turn-based or real-time state updates.

## Game Logic: D&D 5e (2024)
- Values for Ability Scores must follow the `(Stat - 10) / 2` floor calculation.
- Proficiency bonus should be derived from level (Level 1-4 = +2, etc.).
- Ensure all skill checks use the correct attribute as the base.

## API Consistency
- All API responses must follow this structure:
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null,
    "meta": { "timestamp": "..." }
  }
  ```
