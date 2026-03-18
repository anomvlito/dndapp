import { motion, AnimatePresence } from 'framer-motion';
import {
  GiRollingDices,
  GiD4,
  GiDiceSixFacesThree,
  GiDiceEightFacesEight,
  GiD10,
  GiD12,
  GiDiceTwentyFacesTwenty,
} from 'react-icons/gi';
import { useState } from 'react';

const DICE_ICONS = {
  4: <GiD4 size={24} />,
  6: <GiDiceSixFacesThree size={24} />,
  8: <GiDiceEightFacesEight size={24} />,
  10: <GiD10 size={24} />,
  12: <GiD12 size={24} />,
  20: <GiDiceTwentyFacesTwenty size={24} />,
};

export default function DiceTray() {
  const [lastRoll, setLastRoll] = useState(null);
  const [rolling, setRolling] = useState(false);

  const roll = (sides) => {
    setRolling(true);
    setLastRoll(null);
    setTimeout(() => {
      const result = Math.floor(Math.random() * sides) + 1;
      setLastRoll({ sides, result });
      setRolling(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur border-2 border-black p-3 rounded-xl shadow-2xl no-print z-50 flex flex-col items-center gap-2">
      <div className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-500 mb-1">
        Lanzador
      </div>

      <div className="flex gap-2">
        {Object.entries(DICE_ICONS).map(([sides, icon]) => (
          <motion.button
            key={sides}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => roll(Number(sides))}
            className="p-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-red-50 hover:border-red-300 transition-colors"
            title={`Lanzar d${sides}`}
          >
            {icon}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {(rolling || lastRoll) && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="mt-2 text-center"
          >
            {rolling ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.5, ease: 'linear' }}
                className="text-2xl text-gray-400"
              >
                <GiRollingDices />
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <span className="text-4xl font-black text-red-900 drop-shadow-sm">
                  {lastRoll.result}
                </span>
                <span className="text-[0.6rem] font-bold text-gray-400 uppercase">
                  Resultado d{lastRoll.sides}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
