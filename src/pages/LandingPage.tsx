import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Skull, Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import ThreeCanvas from '../components/ThreeCanvas';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { startDrone, playHoverClick, isMuted, toggleMute } = useSound();

  // Start background ambient drone on mount
  useEffect(() => {
    startDrone();
    return () => {
      // Keep drone running unless navigating away to quiet pages if desired
    };
  }, []);

  const handleHover = () => {
    playHoverClick();
  };

  const selectMode = (path: string) => {
    playHoverClick();
    navigate(path);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between items-center text-stone-200 select-none">
      {/* 3D Interactive Flashlight & Particles Background */}
      <ThreeCanvas />

      {/* Screen scanlines and vignette overlays */}
      <div className="crt-scanlines pointer-events-none absolute inset-0 z-10" />
      <div className="vignette-overlay opacity-80" />
      <div className="red-vignette opacity-20" />

      {/* Sound Toggle (Top Right) */}
      <header className="w-full z-20 px-8 py-6 flex justify-end">
        <motion.button
          onClick={toggleMute}
          onMouseEnter={handleHover}
          whileHover={{ scale: 1.1, color: '#991b1b' }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-zinc-950/70 border border-horror-darkred/60 rounded-full cursor-pointer text-stone-400 hover:text-horror-red transition-all duration-300"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>
      </header>

      {/* Main Title & Options Container */}
      <main className="z-20 flex flex-col items-center justify-center flex-1 max-w-5xl px-6 w-full text-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="mb-16"
        >
          <h1 className="font-cinzel text-5xl md:text-7xl font-bold tracking-[0.25em] text-horror-red glow-red-flicker uppercase">
            Night Scare
          </h1>
          <p className="font-special text-xs md:text-sm tracking-widest text-stone-500 mt-2 uppercase">
            A procedural sensory nightmare
          </p>
        </motion.div>

        {/* Modes Grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
          
          {/* Mode 1: Observe (Reading Mode) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 1.0 }}
            onMouseEnter={handleHover}
            onClick={() => selectMode('/read')}
            whileHover={{ scale: 1.03 }}
            className="group relative flex flex-col items-center justify-between p-8 rounded border border-horror-darkred/30 bg-zinc-950/70 backdrop-blur-sm shadow-2xl cursor-pointer hover:border-horror-red/80 transition-all duration-500 overflow-hidden"
          >
            {/* Hover top glow line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-horror-red/40 to-transparent group-hover:via-horror-red transition-all duration-500" />
            
            <div className="flex flex-col items-center">
              <div className="mb-6 p-4 rounded-full bg-horror-darkred/10 border border-horror-darkred/30 group-hover:bg-horror-red/10 group-hover:border-horror-red/50 text-stone-400 group-hover:text-horror-red transition-all duration-500">
                <BookOpen size={36} />
              </div>
              <h2 className="font-cinzel text-2xl font-semibold tracking-wider group-hover:text-horror-red transition-colors duration-500 mb-4">
                OBSERVE
              </h2>
              <p className="font-sans text-stone-400 text-sm leading-relaxed max-w-xs text-center">
                Read through chilling, slow-burn narratives. Text types out dynamically with spatialized horror elements. Just read... and wait.
              </p>
            </div>
            
            <span className="font-horror text-xl text-horror-red/60 group-hover:text-horror-red tracking-widest mt-8 transition-colors duration-500">
              READ STORIES &rarr;
            </span>
          </motion.div>

          {/* Mode 2: Enter the Woods (Interactive Mode) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 1.0 }}
            onMouseEnter={handleHover}
            onClick={() => selectMode('/play')}
            whileHover={{ scale: 1.03 }}
            className="group relative flex flex-col items-center justify-between p-8 rounded border border-horror-darkred/30 bg-zinc-950/70 backdrop-blur-sm shadow-2xl cursor-pointer hover:border-horror-red/80 transition-all duration-500 overflow-hidden"
          >
            {/* Hover top glow line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-horror-red/40 to-transparent group-hover:via-horror-red transition-all duration-500" />

            <div className="flex flex-col items-center">
              <div className="mb-6 p-4 rounded-full bg-horror-darkred/10 border border-horror-darkred/30 group-hover:bg-horror-red/10 group-hover:border-horror-red/50 text-stone-400 group-hover:text-horror-red transition-all duration-500">
                <Skull size={36} className="group-hover:animate-pulse" />
              </div>
              <h2 className="font-cinzel text-2xl font-semibold tracking-wider group-hover:text-horror-red transition-colors duration-500 mb-4">
                ENTER THE WOODS
              </h2>
              <p className="font-sans text-stone-400 text-sm leading-relaxed max-w-xs text-center">
                Take control of the path. Your actions decide your fate. Explore eerie branching scenarios filled with heavy heartbeats and high-fidelity jumpscares.
              </p>
            </div>

            <span className="font-horror text-xl text-horror-red/60 group-hover:text-horror-red tracking-widest mt-8 transition-colors duration-500 animate-pulse">
              PLAY SCENARIOS &rarr;
            </span>
          </motion.div>

        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="z-20 w-full py-6 text-center font-mono text-[10px] text-stone-600 tracking-wider">
        PRODUCED BY DEEPMIND AI &bull; BROWSER AUDIO COMPATIBILITY GUARANTEED
      </footer>
    </div>
  );
};
export default LandingPage;
