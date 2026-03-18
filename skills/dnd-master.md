---
name: dnd-master
description: Expert in D&D 5e (2024) game mechanics, character sheet dynamics, and session tracking.
---

# D&D Master Skill

Expert guidance for building and playing D&D with friends using this app.

## When to Activate

- Implementing new game mechanics (spells, class features, combat actions)
- Designing UI for complex interactions (advantage rolls, multi-target damage)
- Optimizing database queries for real-time game state
- Drafting session notes or item descriptions

## PHB 2024 Patterns

- **Ability Checks**: Rule for `(Stat - 10) / 2` floor.
- **Advantage/Disadvantage**: Always offer a "reroll" or "double roll" UI.
- **Inspiration**: A boolean toggle in the header that "glows" when active.
- **Short/Long Rest**: Button to reset `hit_dice_current` and `current_hp` (long rest) or roll hit dice (short rest).

## Session Dynamic Patterns

- **Turn Tracking**: If multiple characters are in a campaign, show a "Turn Order" sidebar.
- **Narrative Log**: Every HP change should generate a descriptive text like:
  - `Damage (Fire)`: "El calor de las llamas consume parte de su esencia (-8 HP)."
  - `Healing`: "Una luz divina repone sus fuerzas (+10 HP)."

## UI Guidelines: Liquid Glass

- Use `backdrop-blur-md` for the Dice Tray and active modals.
- Glass transparency should be `bg-white/10` in dark mode and `bg-slate-200/40` in light mode.
- Interactive cards should use `ring-1 ring-inset ring-white/20` for a sharp edges look.
