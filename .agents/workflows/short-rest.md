---
description: Perform a Short Rest in the current D&D session
---

# 🧉 Workflow: short-rest

Use this when the party is resting (1 hour) to recover hit dice.

## 1. Status Check
- Review `currentHp` and `hitDice.current`.

## // turbo
## 2. Hit Dice Recovery
- Ask user: "How many hit dice do you want to use? (Current: {{ hitDice.current }})".
- Roll: `#d12 + (CON mod * #)`.

## 3. State Update
- Update `charInfo.currentHp` with total rolled.
- Update `hitDice.current` decrementing by spent amount.
- PATCH to `/api/characters`.

## 4. Narrative
- Log: "Spent X hit dice during short rest. Feeling refreshed (+Y HP)."
