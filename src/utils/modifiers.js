// Utilidades: modificadores de D&D 5e
export const getMod = (score) => Math.floor((score - 10) / 2);

export const formatMod = (score) => {
  const mod = getMod(score);
  return `${mod >= 0 ? '+' : ''}${mod}`;
};

export const calculateSave = (stats, proficiencies, stat, profBonus) => {
  const mod = getMod(stats[stat]);
  return mod + (proficiencies.saves[stat] ? profBonus : 0);
};

export const calculateSkill = (stats, proficiencies, stat, skillKey, profBonus) => {
  const mod = getMod(stats[stat]);
  return mod + (proficiencies.skills[skillKey] ? profBonus : 0);
};
