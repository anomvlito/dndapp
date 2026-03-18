export default function CombatPanel({
  armorClass,
  initiative,
  speed,
  onSpeedChange,
  charInfo,
  onCharInfoChange,
  hitDice,
  onHitDiceChange,
  deathSaves,
  onToggleDeathSave,
  attacks,
}) {
  return (
    <div className="md:col-span-4 space-y-4">
      {/* CA / Iniciativa / Velocidad */}
      <div className="grid grid-cols-3 gap-2">
        <div className="combat-main-box border border-black p-2 bg-white text-center rounded relative overflow-hidden">
          <span className="text-[0.5rem] font-bold uppercase absolute top-1 inset-x-0">
            Clase Armad.
          </span>
          <input
            type="number"
            className="text-3xl font-black text-center w-full mt-3 h-10 bg-transparent"
            value={armorClass}
            readOnly
          />
        </div>
        <div className="combat-main-box border border-black p-2 bg-white text-center rounded relative overflow-hidden">
          <span className="text-[0.5rem] font-bold uppercase absolute top-1 inset-x-0">
            Iniciativa
          </span>
          <div className="text-3xl font-black mt-3 h-10 flex items-center justify-center">
            {initiative >= 0 ? '+' : ''}
            {initiative}
          </div>
        </div>
        <div className="combat-main-box border border-black p-2 bg-white text-center rounded relative overflow-hidden">
          <span className="text-[0.5rem] font-bold uppercase absolute top-1 inset-x-0">
            Velocidad
          </span>
          <div className="mt-3 flex items-center justify-center">
            <input
              type="number"
              className="text-3xl font-black text-center w-full h-10 bg-transparent"
              value={speed}
              onChange={(e) => onSpeedChange(e.target.value)}
            />
            <span className="text-[0.6rem] font-bold absolute bottom-1">pies</span>
          </div>
        </div>
      </div>

      {/* HP */}
      <div className="border-2 border-black p-2 rounded bg-white shadow-md">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-1 px-2">
          <label className="font-bold">Puntos de Golpe Máximos</label>
          <input
            type="number"
            value={charInfo.maxHp}
            onChange={(e) => onCharInfoChange({ maxHp: parseInt(e.target.value) })}
            className="w-12 text-right border-b border-gray-300"
          />
        </div>
        <input
          type="number"
          className="text-5xl font-black text-center w-full py-2"
          value={charInfo.currentHp}
          onChange={(e) => onCharInfoChange({ currentHp: parseInt(e.target.value) })}
        />
        <div className="text-center">
          <span className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-700">
            Puntos de Golpe Actuales
          </span>
        </div>
      </div>

      {/* Temp HP */}
      <div className="border-2 border-black p-2 rounded bg-white shadow-sm text-center">
        <input
          type="number"
          className="text-3xl font-black text-center w-full text-gray-400 focus:text-black"
          placeholder="0"
        />
        <span className="text-[0.6rem] font-bold uppercase">Puntos de Golpe Temporales</span>
      </div>

      {/* Hit Dice & Death Saves */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-black p-2 rounded bg-white">
          <div className="flex justify-between text-[0.6rem] font-bold mb-1 border-b">
            <span>Total:</span>
            <input
              type="text"
              value={hitDice.total}
              onChange={(e) => onHitDiceChange({ total: e.target.value })}
              className="w-12 text-right"
            />
          </div>
          <input
            type="number"
            value={hitDice.current}
            onChange={(e) => onHitDiceChange({ current: e.target.value })}
            className="text-3xl font-black text-center w-full"
          />
          <div className="text-center text-[0.6rem] font-bold uppercase">Dados de Golpe</div>
        </div>

        <div className="border-2 border-black p-2 rounded bg-white">
          <div className="space-y-2 py-1">
            {['successes', 'failures'].map((type) => (
              <div className="flex items-center justify-between" key={type}>
                <span className="text-[0.5rem] font-bold uppercase w-12 text-right mr-1">
                  {type === 'successes' ? 'Éxitos' : 'Fallos'}
                </span>
                <div className="flex gap-2">
                  {deathSaves[type].map((val, i) => (
                    <div
                      key={i}
                      onClick={() => onToggleDeathSave(type, i)}
                      className={`w-4 h-4 rounded-full border border-black cursor-pointer ${
                        val
                          ? type === 'successes'
                            ? 'bg-black'
                            : 'bg-red-600'
                          : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-[0.6rem] font-bold uppercase mt-1">
            Salvaciones de Muerte
          </div>
        </div>
      </div>

      {/* Ataques */}
      <div className="border-2 border-black p-2 rounded bg-white shadow-inner">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b-2 border-gray-400">
              <th className="font-bold py-1 text-gray-500 uppercase text-[0.6rem] w-1/3">
                Nombre
              </th>
              <th className="font-bold py-1 text-gray-500 uppercase text-[0.6rem] text-center">
                Bono
              </th>
              <th className="font-bold py-1 text-gray-500 uppercase text-[0.6rem]">
                Daño / Tipo
              </th>
            </tr>
          </thead>
          <tbody>
            {attacks.map((atk, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-2 font-bold bg-gray-50 px-1 border-r">{atk.name}</td>
                <td className="py-2 text-center font-bold border-r">{atk.bonus}</td>
                <td className="py-2 px-1 text-[0.7rem]">
                  {atk.damage}{' '}
                  <span className="text-gray-500 text-[0.6rem] block">{atk.type}</span>
                </td>
              </tr>
            ))}
            <tr>
              <td className="py-3 px-1 border-r bg-gray-50">
                <input type="text" className="w-full bg-transparent" placeholder="..." />
              </td>
              <td className="py-3 border-r">
                <input type="text" className="w-full text-center bg-transparent" />
              </td>
              <td className="py-3 px-1">
                <input type="text" className="w-full bg-transparent" />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-2 border-t pt-1">
          <textarea
            className="w-full h-20 text-[0.65rem] resize-none p-1"
            placeholder="Ataques adicionales, munición, notas..."
            defaultValue={`Ira Frustrada (Furia): +2 daño cuerpo a cuerpo.\nLanzar jabalina: 30/120 pies.`}
          />
        </div>
      </div>
    </div>
  );
}
