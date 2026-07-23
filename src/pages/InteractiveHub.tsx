import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Skull } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { interactiveStories } from '../data/stories';

export const InteractiveHub: React.FC = () => {
  const navigate = useNavigate();
  const { playHoverClick } = useSound();

  const handleHover = () => {
    playHoverClick();
  };

  const handleSelectStory = (storyId: string) => {
    playHoverClick();
    navigate(`/play/${storyId}`);
  };

  return (
    <div className="relative min-h-screen bg-black text-stone-200 px-6 py-12 flex flex-col items-center select-none">
      {/* Visual background overlays */}
      <div className="crt-scanlines pointer-events-none absolute inset-0 z-10" />
      <div className="vignette-overlay opacity-80" />
      <div className="red-vignette opacity-25 animate-pulse" />

      <div className="max-w-4xl w-full z-20 flex flex-col">
        {/* Back button */}
        <header className="mb-12">
          <motion.button
            onClick={() => { playHoverClick(); navigate('/'); }}
            onMouseEnter={handleHover}
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-stone-400 hover:text-horror-red font-mono text-sm uppercase cursor-pointer transition-colors duration-300"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </motion.button>
        </header>

        {/* Heading */}
        <div className="mb-12">
          <h1 className="font-cinzel text-4xl font-bold tracking-widest text-horror-red glow-red-flicker uppercase">
            Interactive Scenarios
          </h1>
          <p className="font-special text-xs text-stone-500 tracking-wider mt-2 uppercase">
            Choose a path. Make decisions. Try to survive.
          </p>
        </div>

        {/* Story List Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {interactiveStories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              onMouseEnter={handleHover}
              onClick={() => handleSelectStory(story.id)}
              whileHover={{ scale: 1.02 }}
              className="group relative h-80 rounded overflow-hidden border border-horror-darkred/20 shadow-2xl cursor-pointer hover:border-horror-red/70 transition-all duration-500 flex flex-col justify-end p-6"
            >
              {/* Backdrop image */}
              <div
                className="absolute inset-0 bg-cover bg-center filter brightness-[0.42] group-hover:brightness-[0.58] group-hover:scale-105 transition-all duration-700"
                style={{ backgroundImage: `url(${story.bgImage})` }}
              />

              {/* Shading gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-1" />

              {/* Top border light highlight */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-horror-red/30 to-transparent group-hover:via-horror-red transition-all duration-500 z-10" />

              {/* Story Content */}
              <div className="relative z-10 flex flex-col">
                <Skull size={24} className="text-horror-red mb-3 filter drop-shadow-[0_0_5px_rgba(153,27,27,0.5)] group-hover:animate-pulse" />
                <h2 className="font-cinzel text-xl font-semibold text-stone-100 group-hover:text-horror-red transition-colors duration-500 mb-2">
                  {story.title}
                </h2>
                <p className="font-sans text-stone-400 text-xs leading-relaxed max-w-sm">
                  {story.description}
                </p>
                <span className="font-horror text-sm text-horror-red/70 group-hover:text-horror-red tracking-widest mt-4">
                  ENTER PLAYGROUND &rarr;
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default InteractiveHub;
