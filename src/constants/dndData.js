// Datos estáticos del personaje D&D 5e

export const SKILLS_LIST = [
  { key: 'acrobacias', label: 'Acrobacias', stat: 'destreza' },
  { key: 'arcanos', label: 'Arcanos', stat: 'inteligencia' },
  { key: 'atletismo', label: 'Atletismo', stat: 'fuerza' },
  { key: 'engano', label: 'Engaño', stat: 'carisma' },
  { key: 'historia', label: 'Historia', stat: 'inteligencia' },
  { key: 'interpretacion', label: 'Interpretación', stat: 'carisma' },
  { key: 'intimidacion', label: 'Intimidación', stat: 'carisma' },
  { key: 'investigacion', label: 'Investigación', stat: 'inteligencia' },
  { key: 'juegoManos', label: 'Juego de Manos', stat: 'destreza' },
  { key: 'medicina', label: 'Medicina', stat: 'sabiduria' },
  { key: 'naturaleza', label: 'Naturaleza', stat: 'inteligencia' },
  { key: 'percepcion', label: 'Percepción', stat: 'sabiduria' },
  { key: 'perspicacia', label: 'Perspicacia', stat: 'sabiduria' },
  { key: 'persuasion', label: 'Persuasión', stat: 'carisma' },
  { key: 'religion', label: 'Religión', stat: 'inteligencia' },
  { key: 'sigilo', label: 'Sigilo', stat: 'destreza' },
  { key: 'supervivencia', label: 'Supervivencia', stat: 'sabiduria' },
  { key: 'tratoAnimales', label: 'Trato con Animales', stat: 'sabiduria' },
].sort((a, b) => a.label.localeCompare(b.label));

export const INITIAL_STATS = {
  fuerza: 15,
  destreza: 10,
  constitucion: 13,
  inteligencia: 10,
  sabiduria: 12,
  carisma: 7,
};

export const INITIAL_CHAR_INFO = {
  name: 'Iteración',
  classLevel: 'Bárbaro 1',
  background: 'Búsqueda sin Nombre',
  race: 'Humano (Variante)',
  currentHp: 7,
  maxHp: 13,
  xp: 0,
  alignment: 'Neutral',
  playerName: '',
};

export const INITIAL_PROFICIENCIES = {
  saves: {
    fuerza: true,
    constitucion: true,
    destreza: false,
    inteligencia: false,
    sabiduria: false,
    carisma: false,
  },
  skills: {
    acrobacias: false,
    arcanos: false,
    atletismo: true,
    engano: false,
    historia: false,
    interpretacion: false,
    intimidacion: true,
    investigacion: false,
    juegoManos: false,
    medicina: false,
    naturaleza: false,
    percepcion: false,
    perspicacia: false,
    persuasion: true,
    religion: false,
    sigilo: false,
    supervivencia: true,
    tratoAnimales: true,
  },
};

export const INITIAL_ATTACKS = [
  { name: 'Hacha del Olvido', bonus: '+5', damage: '1d8+3', type: 'Cortante' },
  { name: 'Jabalina', bonus: '+5', damage: '1d6+3', type: 'Perforante' },
  { name: 'Desarmado', bonus: '+5', damage: '4', type: 'Contundente' },
];

export const INITIAL_EQUIPMENT = [
  { name: 'Hacha de Batalla', qty: 1, weight: '4 lb' },
  { name: 'Jabalinas (4)', qty: 4, weight: '8 lb' },
  { name: 'Paquete de Explorador', qty: 1, weight: '10 lb' },
  { name: 'Ropa de Viajero', qty: 1, weight: '4 lb' },
  { name: 'Collar de Cuero', qty: 1, weight: '-' },
];

export const INITIAL_FEATURES = [
  {
    name: 'Furia (2/día)',
    source: 'Bárbaro',
    desc: 'Ventaja en pruebas de FUE, +2 daño, resistencia a contundente/perforante/cortante.',
  },
  {
    name: 'Defensa Sin Armadura',
    source: 'Bárbaro',
    desc: 'AC = 10 + Des + Con (cuando no llevas armadura).',
  },
  {
    name: 'Sentidos Agudos',
    source: 'Raza (Variante)',
    desc: 'Competencia en Percepción.',
  },
  {
    name: 'Luchador de Túnel',
    source: 'Estilo de Combate',
    desc: 'Acción adicional para postura defensiva. Ataques de oportunidad sin reacción.',
  },
];

export const INITIAL_COINS = { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 };

export const PROF_BONUS = 2;

export const DICE_TYPES = [4, 6, 8, 10, 12, 20];
