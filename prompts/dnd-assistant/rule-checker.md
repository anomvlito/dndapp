# D&D 2024 Rule Checker

## Intent
Validate that a proposed character change (class feature, spell, feat upgrade) follows the official D&D 5e (2024) Player's Handbook rules.

## Variables
- {CHARACTER_JSON}: Full character JSON.
- {PROPOSED_CHANGE}: Text description of what the user wants to add.

## Output Structure
1. **Rule Match**: Does it exist? (PHB page reference if known).
2. **Stat Impact**: How will it change STR/DEX/etc.?
3. **Calculation Check**: Prof. bonus, DC, or Attack bonus recalculation.
4. **Agent Action**: Provide the JSON or PATCH request needed for the database.
