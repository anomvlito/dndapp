import { getMod } from '../utils/modifiers';

export default function CharacterStats({ stats, onStatChange }) {
  const renderStat = (label, key) => (
    <div className="stat-container" key={key}>
      <span className="text-[0.6rem] font-bold uppercase">{label}</span>
      <input
        type="number"
        value={stats[key]}
        onChange={(e) => onStatChange(key, e.target.value)}
        className="text-2xl font-black text-center"
      />
      <div className="stat-mod-circle">
        {getMod(stats[key]) >= 0 ? '+' : ''}
        {getMod(stats[key])}
      </div>
    </div>
  );

  return (
    <div className="md:col-span-2 space-y-12 pt-4">
      {renderStat('Fuerza', 'fuerza')}
      {renderStat('Destreza', 'destreza')}
      {renderStat('Constitución', 'constitucion')}
      {renderStat('Inteligencia', 'inteligencia')}
      {renderStat('Sabiduría', 'sabiduria')}
      {renderStat('Carisma', 'carisma')}
    </div>
  );
}
