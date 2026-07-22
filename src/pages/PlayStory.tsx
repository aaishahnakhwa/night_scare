import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Skull } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { interactiveStories } from '../data/stories';
import { TypewriterText } from '../components/TypewriterText';
import { JumpscareOverlay } from '../components/JumpscareOverlay';

export const PlayStory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    startDrone,
    stopDrone,
    startHeartbeat,
    stopHeartbeat,
    playWhisper,
    playHoverClick,
  } = useSound();

  const story = interactiveStories.find((s) => s.id === id);

  const [currentNodeId, setCurrentNodeId] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [jumpscareTriggered, setJumpscareTriggered] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  // For 2D flashlight cursor tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 }); // Offscreen default

  // Set initial node
  useEffect(() => {
    if (story) {
      setCurrentNodeId(story.startNodeId);
    } else {
      navigate('/play');
    }
  }, [story, navigate]);

  const currentNode = story?.nodes[currentNodeId];

  // Coordinate sound effects when nodes change
  useEffect(() => {
    if (!currentNode || showGameOver) return;

    // Adjust heartbeat rate based on tension of the node
    startHeartbeat(currentNode.bpm);

    // Play sound cues if specified
    if (currentNode.audioEvent === 'whisperLeft') {
      playWhisper(true);
    } else if (currentNode.audioEvent === 'whisperRight') {
      playWhisper(false);
    }

    return () => {
      // Cleanups
    };
  }, [currentNodeId, currentNode, showGameOver]);

  // Clean up audio on unmount
  useEffect(() => {
    startDrone(); // Ensure background ambient drone is playing
    return () => {
      stopHeartbeat();
    };
  }, []);

  if (!story || !currentNode) return null;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleTextComplete = () => {
    setTypingComplete(true);
  };

  const handleChoiceSelect = (nextNodeId: string) => {
    playHoverClick();
    setTypingComplete(false);

    const nextNode = story.nodes[nextNodeId];
    if (nextNode && nextNode.isJumpscare) {
      // Turn off ambient drone to build deafening silence, then trigger jumpscare
      stopDrone();
      setCurrentNodeId(nextNodeId);
      setJumpscareTriggered(true);
    } else {
      setCurrentNodeId(nextNodeId);
    }
  };

  const handleJumpscareEnd = () => {
    setShowGameOver(true);
  };

  const handleRestart = () => {
    playHoverClick();
    startDrone();
    setShowGameOver(false);
    setJumpscareTriggered(false);
    setTypingComplete(false);
    setCurrentNodeId(story.startNodeId);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen overflow-hidden bg-black text-stone-200 flex flex-col justify-between select-none cursor-none"
    >
      {/* 2D Flashlight background renderer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${currentNode.bgImage})` }}
      />

      {/* Dark overlay with flashlight radial transparency cutout */}
      {!showGameOver && !jumpscareTriggered && (
        <div
          className="absolute inset-0 z-10 pointer-events-none transition-all duration-300"
          style={{
            background: `radial-gradient(circle 140px at ${mousePos.x}px ${mousePos.y}px, transparent 20%, rgba(5, 5, 5, 0.98) 100%)`,
          }}
        />
      )}

      {/* Flashlight beam highlight ring */}
      {!showGameOver && !jumpscareTriggered && (
        <div
          className="absolute z-11 pointer-events-none border border-yellow-100/10 rounded-full w-[280px] h-[280px] filter blur-[2px]"
          style={{
            left: `${mousePos.x - 140}px`,
            top: `${mousePos.y - 140}px`,
          }}
        />
      )}

      {/* Horror static scanlines */}
      <div className="crt-scanlines pointer-events-none absolute inset-0 z-20" />
      <div className="vignette-overlay opacity-80 pointer-events-none" />
      <div className="red-vignette opacity-20 pointer-events-none" />

      {/* Custom flashlight cursor pointer */}
      {!showGameOver && !jumpscareTriggered && (
        <div
          className="absolute z-30 pointer-events-none bg-yellow-100/20 w-3 h-3 rounded-full border border-yellow-200/50 shadow-[0_0_8px_rgba(254,240,138,0.5)]"
          style={{
            left: `${mousePos.x - 6}px`,
            top: `${mousePos.y - 6}px`,
          }}
        />
      )}

      {/* Jumpscare overlay */}
      <JumpscareOverlay trigger={jumpscareTriggered} onEnd={handleJumpscareEnd} />

      {/* Header */}
      <header className="relative z-20 w-full px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
        <button
          onClick={() => {
            playHoverClick();
            stopHeartbeat();
            navigate('/play');
          }}
          className="flex items-center gap-2 text-stone-500 hover:text-horror-red font-mono text-sm uppercase cursor-pointer transition-colors duration-300"
        >
          <ArrowLeft size={16} />
          <span>Exit Game</span>
        </button>
        <span className="font-cinzel text-sm tracking-widest text-horror-red font-bold">
          {story.title}
        </span>
      </header>

      {/* Center panel */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto px-6 w-full text-center">
        <AnimatePresence mode="wait">
          {showGameOver ? (
            /* GAME OVER DIED / SURVIVED SCREEN */
            <motion.div
              key="gameover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center border border-horror-darkred/60 bg-zinc-950/90 p-8 rounded shadow-2xl backdrop-blur-md max-w-md"
            >
              {currentNode.endingType === 'escape' ? (
                <>
                  <h2 className="font-cinzel text-4xl font-bold tracking-widest text-green-700 glow-red-flicker mb-4 uppercase">
                    SURVIVED
                  </h2>
                  <p className="font-sans text-xs text-stone-400 leading-relaxed mb-8">
                    {currentNode.endingText || 'You escaped with your life.'}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-horror-red mb-4 animate-bounce">
                    <Skull size={44} />
                  </div>
                  <h2 className="font-horror text-5xl text-horror-red tracking-widest glow-red mb-4 uppercase">
                    WASTED
                  </h2>
                  <p className="font-sans text-xs text-stone-400 leading-relaxed mb-8">
                    {currentNode.endingText || 'You did not survive the nightmare.'}
                  </p>
                </>
              )}

              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-6 py-2 border border-horror-darkred hover:border-horror-red text-stone-400 hover:text-horror-red font-mono text-xs tracking-wider rounded cursor-pointer transition-all duration-300"
              >
                <RefreshCw size={12} />
                <span>RESTART SCENARIO</span>
              </button>
            </motion.div>
          ) : (
            /* ACTIVE BRANCH NARRATIVE PANEL */
            <motion.div
              key="active-node"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center bg-zinc-950/70 p-8 rounded border border-horror-darkred/20 backdrop-blur-sm shadow-2xl"
            >
              {/* Typewritten description */}
              <div className="min-h-[140px] flex items-center justify-center">
                <TypewriterText
                  key={currentNodeId}
                  text={currentNode.text}
                  speed={28}
                  delay={200}
                  onComplete={handleTextComplete}
                  className="font-special text-base md:text-lg text-stone-300 leading-relaxed tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                />
              </div>

              {/* Action branch decisions */}
              <div className="w-full flex flex-col gap-3 mt-8">
                {typingComplete &&
                  currentNode.choices.map((choice, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15, duration: 0.4 }}
                      whileHover={{ scale: 1.02, x: 4, borderColor: '#991b1b' }}
                      onMouseEnter={() => playHoverClick()}
                      onClick={() => handleChoiceSelect(choice.nextNodeId)}
                      className="w-full py-3 px-4 border border-horror-darkred/40 hover:border-horror-red/80 bg-zinc-900/60 rounded text-stone-300 hover:text-horror-red font-mono text-xs text-left cursor-pointer transition-all duration-300"
                    >
                      &gt; {choice.text}
                    </motion.button>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="relative z-20 w-full py-6 flex justify-center items-center gap-4 text-[10px] text-stone-600 font-mono tracking-wider bg-gradient-to-t from-black/80 to-transparent">
        <span>TENSION MONITOR</span>
        <div className="w-24 h-1.5 bg-zinc-900 rounded overflow-hidden relative">
          <motion.div
            animate={{ width: `${((currentNode.bpm - 60) / 90) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-horror-red"
          />
        </div>
        <span>{currentNode.bpm} BPM</span>
      </footer>
    </div>
  );
};
export default PlayStory;
