import { getMod } from '../utils/modifiers';

export default function BioTab({ stats, equipment, coins, onCoinsChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Intro */}
      <div className="md:col-span-12 border-b border-black pb-4">
        <h2 className="header-font text-2xl text-red-900 mb-2">Iteración: El Pacto Silencioso</h2>
        <p className="text-sm italic leading-relaxed">
          Despertó en el centro de un cráter sin saber quién era. Solo la palabra "Iteración"
          resonaba en su mente como un eco constante. Siente una conexión latente con una fiera que
          solo aparece en sus sueños, una sensación de calidez y rugidos que no logra procesar. Su
          hacha parece moverse sola, dictada por una memoria muscular que su mente consciente ha
          perdido.
        </p>
      </div>

      {/* Columna izquierda */}
      <div className="md:col-span-6 space-y-4">
        {/* Pacto Silencioso */}
        <div className="border-2 border-red-900 p-4 rounded bg-white shadow-xl">
          <p className="text-xs font-bold uppercase text-red-900 border-b border-red-900 mb-2">
            Escalamiento de la Memoria (Serosh)
          </p>
          <div className="text-[0.7rem] leading-loose">
            <p>
              <strong>Estado Actual:</strong> Latente / Recuerdo Fragmentado.
            </p>
            <p>
              <strong>Fuerza:</strong> Igual a Iteración (Actual: <span>{stats.fuerza}</span>)
            </p>
            <p>
              <strong>Vida:</strong> 5 x Nivel + Con (Actual:{' '}
              <span>{5 * 1 + getMod(stats.constitucion)}</span>)
            </p>
            <p className="mt-2 text-red-800 font-bold italic">
              "🛡️ Pacto Silencioso: Se manifestará físicamente cuando el Rugido del Yermo resuene
              en un momento crítico."
            </p>
          </div>
        </div>

        {/* Monedas */}
        <div className="border-2 border-black p-4 rounded bg-white shadow-md">
          <p className="text-[0.6rem] font-bold uppercase border-b mb-2">Monedas y Riqueza</p>
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: 'PC', key: 'cp' },
              { label: 'PP', key: 'sp' },
              { label: 'PE', key: 'ep' },
              { label: 'PO', key: 'gp', highlight: true },
              { label: 'PL', key: 'pp' },
            ].map(({ label, key, highlight }) => (
              <div key={key} className={`coin-box${highlight ? ' bg-yellow-50' : ''}`}>
                <label
                  className={`text-[0.5rem] block text-center${highlight ? ' font-bold text-yellow-800' : ''}`}
                >
                  {label}
                </label>
                <input
                  type="number"
                  className="text-center font-bold"
                  value={coins[key]}
                  onChange={(e) => onCoinsChange({ ...coins, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="md:col-span-6 space-y-4">
        <div className="border-2 border-black p-4 rounded bg-white shadow-inner">
          <p className="text-[0.7rem] font-bold uppercase border-b mb-2">Equipo y Pertenencias</p>
          <table className="w-full text-left text-xs mb-4">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="font-bold py-1 w-2/3">Objeto</th>
                <th className="font-bold py-1 text-center">Cant.</th>
                <th className="font-bold py-1 text-right">Peso</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-1">{item.name}</td>
                  <td className="py-1 text-center">{item.qty}</td>
                  <td className="py-1 text-right text-gray-500 text-[0.6rem]">{item.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-[0.7rem] font-bold uppercase border-b mb-2 mt-6">Anclas de Memoria</p>
          <textarea
            className="text-xs h-32 leading-relaxed font-semibold w-full resize-none"
            defaultValue={`- Collar de Cuero Viejo: Inusualmente grande. Atado a la muñeca izquierda.\n- Piedra de Afilar Grabada: Con marcas de colmillos profundas.\n- Retal de Estandarte Dorado: Sucio, con olor a fieras y ozono.`}
          />
        </div>
      </div>
    </div>
  );
}
