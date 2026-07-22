import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Volume2, Flame } from 'lucide-react';
import { useSound } from '../context/SoundContext';

interface WarningScreenProps {
  onAccept: () => void;
}

export const WarningScreen: React.FC<WarningScreenProps> = ({ onAccept }) => {
  const { initAudio, playHoverClick } = useSound();
  const [isFading, setIsFading] = useState(false);

  const handleAccept = async () => {
    setIsFading(true);
    await initAudio();
    playHoverClick();
    setTimeout(() => {
      onAccept();
    }, 1200);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6 text-center select-none"
      animate={{ opacity: isFading ? 0 : 1 }}
      transition={{ duration: 1.0, ease: 'easeInOut' }}
    >
      {/* CRT Scanline effect layer */}
      <div className="crt-scanlines pointer-events-none absolute inset-0 z-10" />

      {/* Red Ambient Vignette */}
      <div className="red-vignette opacity-80" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="max-w-xl rounded border border-horror-darkred bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-md relative overflow-hidden"
      >
        {/* Creepy glowing border */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-horror-red to-transparent" />

        <div className="mb-6 flex justify-center text-horror-red animate-pulse">
          <ShieldAlert size={56} className="filter drop-shadow-[0_0_10px_rgba(153,27,27,0.8)]" />
        </div>

        <h1 className="font-cinzel text-3xl font-bold tracking-widest text-horror-red glow-red-flicker mb-4">
          WARNING
        </h1>

        <div className="space-y-4 font-sans text-stone-400 text-sm leading-relaxed mb-8">
          <p className="text-stone-200 font-semibold uppercase tracking-wider">
            This experience contains graphic horror themes, flashing lights, and intense jumpscares.
          </p>
          <p>
            It is not recommended for individuals with photosensitive epilepsy, heart conditions, or severe anxiety.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-xs font-mono text-horror-red border border-horror-darkred/40 py-2 px-3 rounded bg-horror-darkred/10">
            <Volume2 size={16} />
            <span>HEADPHONES RECOMMENDED & VOLUME TURNED UP</span>
          </div>
        </div>

        <motion.button
          onClick={handleAccept}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 0 20px rgba(153, 27, 27, 0.6)',
          }}
          whileTap={{ scale: 0.95 }}
          className="relative inline-flex items-center justify-center gap-2 px-8 py-3 bg-horror-red text-black font-horror text-2xl tracking-widest rounded cursor-pointer transition-colors duration-300 hover:bg-red-700"
        >
          <Flame size={20} className="fill-black" />
          <span>I ACCEPT. ENTER</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
