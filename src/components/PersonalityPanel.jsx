export default function PersonalityPanel({ features }) {
  return (
    <div className="md:col-span-3 space-y-3">
      {/* Pistas silenciosas */}
      <div className="epic-border">
        <label className="text-[0.6rem] font-bold text-red-900 border-b border-red-900 block mb-1 uppercase">
          PISTAS SILENCIOSAS
        </label>
        <p className="text-[0.65rem] italic leading-tight">
          - Collar de Cuero Viejo (Apretado en la muñeca).<br />
          - Piedra de Afilar Grabada (Mordida).<br />
          - Retal de Estandarte Dorado (Huele a fieras).
        </p>
      </div>

      {/* Rasgos e ideales */}
      <div className="border-2 border-black p-2 rounded bg-white shadow-sm">
        <label className="text-[0.6rem] font-bold text-blue-900 border-b block mb-1">
          RASGOS, IDEALES Y VÍNCULOS
        </label>
        <textarea
          className="text-[0.65rem] h-24 w-full"
          defaultValue={`"Si me esfuerzo en recordar y no puedo, el hacha es la única que calma mi dolor".\n"La búsqueda. No importa qué busco, lo importante es no detenerse hasta que el vacío se llene".`}
        />
      </div>

      {/* Features / Atributos */}
      <div className="border-2 border-black p-2 rounded bg-white flex-grow shadow-inner h-[400px] overflow-y-auto">
        <label className="text-[0.6rem] font-bold uppercase border-b block mb-1">
          Rasgos y Atributos
        </label>
        <div className="space-y-2 mt-2">
          {features.map((feat, idx) => (
            <div key={idx} className="border-b border-gray-300 pb-1">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-xs">{feat.name}</span>
                <span className="text-[0.5rem] text-gray-500 uppercase">{feat.source}</span>
              </div>
              <p className="text-[0.6rem] leading-tight text-gray-800">{feat.desc}</p>
            </div>
          ))}
          <div className="text-center pt-2 opacity-50 text-[0.6rem] dashed-border cursor-pointer hover:opacity-100">
            + Añadir Rasgo
          </div>
        </div>
      </div>
    </div>
  );
}
