---
description: Manage a live D&D session — updates, dice, and tracking
---

# 🎲 Workflow: live-dnd-session

Use this workflow when the user is playing a real-time D&D game and wants to update character states or track events.

## 1. Status Check
- Review `current_hp` and `temp_hp`.
- Check active `effects` (if implemented).
- Identify whose "turn" or "active memory" is being modified.

## // turbo
## 2. Fast Roll 🎲
- Command: `roll d20 + mod`
- Implementation: Use `DiceTray.vue` logic.
- Log result into `session_history`.

## 3. State Update
- If damage taken:
  ```sql
  UPDATE characters SET current_hp = current_hp - $damage WHERE id = $id;
  ```
- If level up:
  - Recalculate Proficiency.
  - Recalculate HP Max.

## 4. Summary & Log
- Output a "Character Narrative" summary of the change.
- Example: "El Olvidado siente un dolor agudo (-5 HP), pero su voluntad de hierro se mantiene."
