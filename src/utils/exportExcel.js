import * as XLSX from 'xlsx';

export const exportToExcel = ({ charInfo, stats, equipment, armorClass, initiative, speed, hitDice, getMod }) => {
  const data = [
    ['HOJA DE PERSONAJE D&D 5E - ITERACIÓN'],
    ['Nombre', charInfo.name],
    ['Clase y Nivel', charInfo.classLevel],
    [],
    ['ATRIBUTOS', 'PUNTUACIÓN', 'MODIFICADOR'],
    ['FUERZA', stats.fuerza, getMod(stats.fuerza)],
    ['DESTREZA', stats.destreza, getMod(stats.destreza)],
    ['CONSTITUCIÓN', stats.constitucion, getMod(stats.constitucion)],
    ['INTELIGENCIA', stats.inteligencia, getMod(stats.inteligencia)],
    ['SABIDURÍA', stats.sabiduria, getMod(stats.sabiduria)],
    ['CARISMA', stats.carisma, getMod(stats.carisma)],
    [],
    ['COMBATE'],
    ['CA', armorClass],
    ['Iniciativa', initiative],
    ['Velocidad', speed],
    ['PG Max', charInfo.maxHp],
    ['PG Actual', charInfo.currentHp],
    ['Hit Dice', `${hitDice.current}/${hitDice.total}`],
    [],
    ['EQUIPO'],
    ...equipment.map((e) => [e.name, e.qty, e.weight]),
    [],
    ['EL PACTO SILENCIOSO (SEROSH)'],
    ['Estado', 'Latente'],
    ['Fuerza Escalada', stats.fuerza],
    ['Vida Escalada', 5 * 1 + getMod(stats.constitucion)],
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Ficha Iteración');
  XLSX.writeFile(wb, `${charInfo.name}_DnD5e.xlsx`);
};
