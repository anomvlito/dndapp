<script setup>
defineProps({
  features: { type: Array, required: true },
})
</script>

<template>
  <div class="md:col-span-3 space-y-4">
    <!-- Pistas silenciosas -->
    <div class="epic-border rounded-xl">
      <label class="text-[0.6rem] font-black text-dnd-red border-b border-dnd-red/20 block mb-1 uppercase tracking-widest leading-none pb-1">
        Pistas Silenciosas
      </label>
      <p class="text-[0.65rem] italic leading-tight text-dnd-dark">
        - Collar de Cuero Viejo (Apretado en la muñeca).<br />
        - Piedra de Afilar Grabada (Mordida).<br />
        - Retal de Estandarte Dorado (Huele a fieras).
      </p>
    </div>

    <!-- Rasgos e ideales -->
    <div class="border-2 border-black rounded-xl bg-white shadow-sm overflow-hidden">
      <div class="section-banner w-full text-center py-1 text-[0.6rem]">Personalidad e Ideales</div>
      <div class="p-2">
        <textarea class="text-[0.65rem] h-24 w-full bg-transparent border-none focus:ring-0 resize-none font-medium leading-relaxed">"Si me esfuerzo en recordar y no puedo, el hacha es la única que calma mi dolor".
"La búsqueda. No importa qué busco, lo importante es no detenerse hasta que el vacío se llene".</textarea>
      </div>
    </div>

    <!-- Features / Atributos -->
    <div class="border-2 border-black rounded-xl bg-white flex-grow shadow-inner min-h-[400px] overflow-hidden">
      <div class="section-banner w-full text-center py-1 text-[0.6rem]">Rasgos y Características</div>
      <div class="p-3 space-y-3 mt-1 overflow-y-auto max-h-[500px]">
        <div
          v-for="(feat, idx) in features"
          :key="idx"
          class="border-l-[3px] border-dnd-red pl-3 py-1 bg-gray-50/50 rounded-r shadow-sm"
        >
          <div class="flex justify-between items-baseline mb-0.5">
            <span class="font-black text-xs text-dnd-dark leading-tight">{{ feat.name }}</span>
            <span class="text-[0.55rem] font-bold text-gray-400 uppercase tracking-tighter">{{ feat.source }}</span>
          </div>
          <p class="text-[0.65rem] leading-snug text-gray-700">{{ feat.desc }}</p>
        </div>
        
        <button class="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-[0.6rem] font-bold uppercase text-gray-300 hover:border-dnd-red hover:text-dnd-red transition-all mt-4">
          + Añadir Nuevo Rasgo
        </button>
      </div>
    </div>
  </div>
</template>
