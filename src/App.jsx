import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes
import DiceTray from './components/DiceTray';
import CharacterStats from './components/CharacterStats';
import SkillsPanel from './components/SkillsPanel';
import CombatPanel from './components/CombatPanel';
import PersonalityPanel from './components/PersonalityPanel';
import BioTab from './components/BioTab';

// Datos y utilidades
import {
  INITIAL_STATS,
  INITIAL_CHAR_INFO,
  INITIAL_PROFICIENCIES,
  INITIAL_ATTACKS,
  INITIAL_EQUIPMENT,
  INITIAL_FEATURES,
  INITIAL_COINS,
} from './constants/dndData';
import { getMod } from './utils/modifiers';
import { exportToExcel } from './utils/exportExcel';

function App() {
  const [activeTab, setActiveTab] = useState('main');

  // Estado del personaje
  const [stats, setStats] = useState(INITIAL_STATS);
  const [charInfo, setCharInfo] = useState(INITIAL_CHAR_INFO);
  const [proficiencies, setProficiencies] = useState(INITIAL_PROFICIENCIES);
  const [speed, setSpeed] = useState(30);
  const [hitDice, setHitDice] = useState({ total: '1d12', current: 1 });
  const [deathSaves, setDeathSaves] = useState({
    successes: [false, false, false],
    failures: [false, false, false],
  });
  const [coins, setCoins] = useState(INITIAL_COINS);

  // Valores derivados
  const armorClass = 10 + getMod(stats.destreza) + getMod(stats.constitucion);
  const initiative = getMod(stats.destreza);

  // Handlers
  const handleStatChange = (stat, val) =>
    setStats((prev) => ({ ...prev, [stat]: parseInt(val) || 0 }));

  const handleCharInfoChange = (changes) =>
    setCharInfo((prev) => ({ ...prev, ...changes }));

  const toggleSave = (stat) =>
    setProficiencies((prev) => ({
      ...prev,
      saves: { ...prev.saves, [stat]: !prev.saves[stat] },
    }));

  const toggleSkill = (skill) =>
    setProficiencies((prev) => ({
      ...prev,
      skills: { ...prev.skills, [skill]: !prev.skills[skill] },
    }));

  const toggleDeathSave = (type, index) =>
    setDeathSaves((prev) => {
      const updated = [...prev[type]];
      updated[index] = !updated[index];
      return { ...prev, [type]: updated };
    });

  const handleExport = () =>
    exportToExcel({
      charInfo,
      stats,
      equipment: INITIAL_EQUIPMENT,
      armorClass,
      initiative,
      speed,
      hitDice,
      getMod,
    });

  const handleReset = () => {
    if (confirm('¿Reiniciar memoria?')) window.location.reload();
  };

  return (
    <div className="min-h-screen p-2 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* NAV */}
        <nav className="flex gap-1 no-print">
          <button
            onClick={() => setActiveTab('main')}
            className={`tab-btn ${activeTab === 'main' ? 'active' : 'inactive'}`}
          >
            ⚔️ Amnesia y Combate
          </button>
          <button
            onClick={() => setActiveTab('bio')}
            className={`tab-btn ${activeTab === 'bio' ? 'active' : 'inactive'}`}
          >
            📜 Búsqueda sin Nombre
          </button>
        </nav>

        <div className="parchment-bg rounded-b-lg p-4 md:p-8 shadow-2xl">
          {/* HEADER */}
          <header className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 items-end border-b-2 border-black/20 pb-4">
            <div className="md:col-span-4">
              <label className="text-[0.6rem] font-bold uppercase text-red-900">El Olvidado</label>
              <input
                type="text"
                className="text-2xl font-bold header-font"
                value={charInfo.name}
                onChange={(e) => handleCharInfoChange({ name: e.target.value })}
              />
            </div>
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-2">
              {[
                { label: 'Clase/Nivel', key: 'classLevel' },
                { label: 'Trasfondo', key: 'background' },
                { label: 'Raza', key: 'race' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-[0.6rem] font-bold uppercase">{label}</label>
                  <input
                    type="text"
                    value={charInfo[key]}
                    onChange={(e) => handleCharInfoChange({ [key]: e.target.value })}
                    className="font-bold"
                  />
                </div>
              ))}
              <div>
                <label className="text-[0.6rem] font-bold uppercase">Esencia</label>
                <input type="text" value="Recuerdo Borroso" className="font-bold text-gray-500" readOnly />
              </div>
            </div>
          </header>

          {/* TAB MAIN */}
          <AnimatePresence mode="wait">
            {activeTab === 'main' && (
              <motion.div
                key="main"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6"
              >
                <CharacterStats stats={stats} onStatChange={handleStatChange} />
                <SkillsPanel
                  stats={stats}
                  proficiencies={proficiencies}
                  onToggleSave={toggleSave}
                  onToggleSkill={toggleSkill}
                />
                <CombatPanel
                  armorClass={armorClass}
                  initiative={initiative}
                  speed={speed}
                  onSpeedChange={setSpeed}
                  charInfo={charInfo}
                  onCharInfoChange={handleCharInfoChange}
                  hitDice={hitDice}
                  onHitDiceChange={(changes) => setHitDice((prev) => ({ ...prev, ...changes }))}
                  deathSaves={deathSaves}
                  onToggleDeathSave={toggleDeathSave}
                  attacks={INITIAL_ATTACKS}
                />
                <PersonalityPanel features={INITIAL_FEATURES} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB BIO */}
          <AnimatePresence mode="wait">
            {activeTab === 'bio' && (
              <motion.div
                key="bio"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BioTab
                  stats={stats}
                  equipment={INITIAL_EQUIPMENT}
                  coins={coins}
                  onCoinsChange={setCoins}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* FOOTER */}
          <footer className="mt-8 flex flex-wrap justify-center gap-4 no-print border-t pt-6">
            <button
              onClick={() => window.print()}
              className="bg-gray-800 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-black transition flex items-center gap-2"
            >
              🖨️ PDF de Iteración
            </button>
            <button
              onClick={handleExport}
              className="bg-green-700 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-800 transition flex items-center gap-2"
            >
              📊 Exportar Memoria a Excel
            </button>
            <button
              onClick={handleReset}
              className="bg-red-800 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-900 transition flex items-center gap-2"
            >
              ♻️ Reiniciar
            </button>
          </footer>
        </div>

        <DiceTray />
      </div>
    </div>
  );
}

export default App;
