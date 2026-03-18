import { SKILLS_LIST, PROF_BONUS } from '../constants/dndData';
import { calculateSave, calculateSkill } from '../utils/modifiers';

export default function SkillsPanel({ stats, proficiencies, onToggleSave, onToggleSkill }) {
  const renderSave = (stat, label) => (
    <div className="flex items-center gap-2 text-xs py-1" key={stat}>
      <div
        className={`skill-dot ${proficiencies.saves[stat] ? 'active' : ''}`}
        onClick={() => onToggleSave(stat)}
      />
      <span className="w-8 font-black text-center">
        {calculateSave(stats, proficiencies, stat, PROF_BONUS) >= 0 ? '+' : ''}
        {calculateSave(stats, proficiencies, stat, PROF_BONUS)}
      </span>
      <span className="capitalize font-bold text-gray-700">{label}</span>
    </div>
  );

  return (
    <div className="md:col-span-3 space-y-4">
      <div className="flex items-center gap-3 border-2 border-black p-2 rounded bg-white">
        <span className="text-xl font-black">+{PROF_BONUS}</span>
        <span className="text-[0.6rem] font-bold uppercase">Bono de Competencia</span>
      </div>

      {/* Salvaciones */}
      <div className="border-2 border-black p-2 rounded bg-white shadow-inner">
        <p className="text-[0.6rem] font-bold uppercase text-center border-b mb-2">Salvaciones</p>
        <div className="space-y-1">
          {renderSave('fuerza', 'Fue')}
          {renderSave('destreza', 'Des')}
          {renderSave('constitucion', 'Con')}
          {renderSave('inteligencia', 'Int')}
          {renderSave('sabiduria', 'Sab')}
          {renderSave('carisma', 'Car')}
        </div>
      </div>

      {/* Habilidades */}
      <div className="border-2 border-black p-2 rounded bg-white shadow-inner">
        <p className="text-[0.6rem] font-bold uppercase text-center border-b mb-2">Habilidades</p>
        <div className="space-y-1">
          {SKILLS_LIST.map((skill) => (
            <div className="flex items-center gap-2 text-[0.7rem] py-1" key={skill.key}>
              <div
                className={`skill-dot ${proficiencies.skills[skill.key] ? 'active' : ''}`}
                onClick={() => onToggleSkill(skill.key)}
              />
              <span className="w-8 font-black text-center">
                {calculateSkill(stats, proficiencies, skill.stat, skill.key, PROF_BONUS) >= 0
                  ? '+'
                  : ''}
                {calculateSkill(stats, proficiencies, skill.stat, skill.key, PROF_BONUS)}
              </span>
              <span className="font-semibold text-gray-800">{skill.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Otras competencias */}
      <div className="border-2 border-black p-2 rounded bg-white shadow-inner min-h-[100px]">
        <p className="text-[0.6rem] font-bold uppercase text-center border-b mb-2">
          Otras Competencias e Idiomas
        </p>
        <textarea
          className="w-full h-24 text-[0.65rem] font-medium resize-none"
          defaultValue={`- Común, Primordial\n- Armaduras ligeras, medias, escudos\n- Armas simples y marciales`}
        />
      </div>
    </div>
  );
}
