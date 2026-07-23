import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { readingStories } from '../data/stories';
import { TypewriterText } from '../components/TypewriterText';
import { JumpscareOverlay } from '../components/JumpscareOverlay';

export const ReadStory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    startDrone,
    stopDrone,
    startHeartbeat,
    setHeartbeatBpm,
    stopHeartbeat,
    playWhisper,
    playHoverClick,
  } = useSound();

  const story = readingStories.find((s) => s.id === id);

  const [blockIndex, setBlockIndex] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);
  const [jumpscareTriggered, setJumpscareTriggered] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  // Return to hub if story not found
  useEffect(() => {
    if (!story) {
      navigate('/read');
    }
  }, [story, navigate]);

  // Handle audio triggers when moving to a new text block
  useEffect(() => {
    if (!story || showWarning || isDead) return;

    const currentBlock = story.blocks[blockIndex];
    if (!currentBlock) return;

    // Start or adjust heartbeat if a BPM is provided
    if (currentBlock.bpm) {
      startHeartbeat(currentBlock.bpm);
    }

    // Process specific audio events
    if (currentBlock.audioEvent === 'whisperLeft') {
      playWhisper(true);
    } else if (currentBlock.audioEvent === 'whisperRight') {
      playWhisper(false);
    } else if (currentBlock.audioEvent === 'accelerateHeartbeat' && currentBlock.bpm) {
      setHeartbeatBpm(currentBlock.bpm);
    } else if (currentBlock.audioEvent === 'decelerateHeartbeat' && currentBlock.bpm) {
      setHeartbeatBpm(currentBlock.bpm);
    }

    return () => {
      // Cleanups when moving to next block
    };
  }, [blockIndex, story, showWarning, isDead]);

  // Clean up audio on unmount
  useEffect(() => {
    startDrone(); // Ensure drone is active
    return () => {
      stopHeartbeat();
    };
  }, []);

  if (!story) return null;

  const currentBlock = story.blocks[blockIndex];

  const handleTextComplete = () => {
    setTypingComplete(true);
  };

  const handleContinue = () => {
    playHoverClick();
    setTypingComplete(false);

    // If next block triggers jumpscare on transition
    const nextIndex = blockIndex + 1;
    if (nextIndex < story.blocks.length) {
      const nextBlock = story.blocks[nextIndex];
      if (nextBlock.audioEvent === 'jumpscare') {
        // Stop drone to build heavy silent tension before jumpscare triggers
        stopDrone();
        setBlockIndex(nextIndex);
      } else {
        setBlockIndex(nextIndex);
      }
    } else {
      // We reached the end. Trigger jumpscare!
      setJumpscareTriggered(true);
    }
  };

  const handleJumpscareEnd = () => {
    setIsDead(true);
  };

  const handleRestart = () => {
    playHoverClick();
    startDrone();
    setBlockIndex(0);
    setTypingComplete(false);
    setJumpscareTriggered(false);
    setIsDead(false);
  };

  const startStory = () => {
    playHoverClick();
    setShowWarning(false);
  };

  // Dynamic values to create an intense visual buildup as the user advances through the story blocks
  const progress = story.blocks.length > 1 ? blockIndex / (story.blocks.length - 1) : 0;
  const blurVal = 8 - progress * 6; // starts at 8px blur, clears down to 2px as threat nears
  const brightnessVal = 0.45 + progress * 0.20; // starts at 0.45 (45% brightness) and rises to 0.65 (65% brightness) for clear visibility
  const scaleVal = 1.03 + progress * 0.18; // slowly crawls closer from 1.03 to 1.21 zoom
  const redVignetteOpacity = 0.05 + progress * 0.70; // red peripheral dread closes in from 0.05 to 0.75

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-stone-200 flex flex-col justify-between select-none">
      {/* Dynamic Cinematic Backdrop: Blurred & Slowly Scaling */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-[3000ms] ease-out pointer-events-none"
        style={{
          backgroundImage: `url(${story.bgImage})`,
          filter: `blur(${blurVal}px) brightness(${brightnessVal})`,
          transform: `scale(${scaleVal}) rotate(${progress * 1.5}deg)`,
        }}
      />
      
      {/* Screen effects */}
      <div className="crt-scanlines pointer-events-none absolute inset-0 z-10" />
      <div className="vignette-overlay opacity-90 animate-vignettePulse" />
      <div
        className="red-vignette transition-all duration-[2000ms] ease-out"
        style={{ opacity: redVignetteOpacity }}
      />

      {/* Jumpscare Event Layer */}
      <JumpscareOverlay trigger={jumpscareTriggered} onEnd={handleJumpscareEnd} imagePath={story.jumpscareImage} />

      {/* Header */}
      <header className="relative z-20 w-full px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => {
            playHoverClick();
            stopHeartbeat();
            navigate('/read');
          }}
          className="flex items-center gap-2 text-stone-500 hover:text-horror-red font-mono text-sm uppercase cursor-pointer transition-colors duration-300"
        >
          <ArrowLeft size={16} />
          <span>Leave Story</span>
        </button>
        <span className="font-cinzel text-sm tracking-widest text-horror-red font-bold">
          {story.title}
        </span>
      </header>

      {/* Main Container */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto px-6 w-full text-center">
        <AnimatePresence mode="wait">
          {showWarning ? (
            /* Story specific disclaimer */
            <motion.div
              key="warning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="border border-horror-darkred/60 bg-zinc-950/80 p-8 rounded shadow-2xl backdrop-blur-md"
            >
              <AlertTriangle className="mx-auto text-horror-red mb-4 animate-bounce" size={40} />
              <h2 className="font-cinzel text-xl text-horror-red tracking-wider mb-3">SENSORY IMMERSION ACTIVE</h2>
              <p className="font-sans text-xs text-stone-400 leading-relaxed mb-6">
                This story uses spatial ambient audio and sudden tension jumps. For maximum terror, wear headphones and sit in a dark room.
              </p>
              <button
                onClick={startStory}
                className="px-6 py-2 border border-horror-red font-horror text-lg text-horror-red tracking-widest hover:bg-horror-red hover:text-black cursor-pointer transition-all duration-300"
              >
                BEGIN NARRATIVE
              </button>
            </motion.div>
          ) : isDead ? (
            /* Dead Screen (Game Over) */
            <motion.div
              key="dead"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0 }}
              className="flex flex-col items-center"
            >
              <h2 className="font-horror text-6xl text-horror-red tracking-widest glow-red mb-6 animate-pulse">
                SCARRED
              </h2>
              <p className="font-special text-xs text-stone-500 max-w-md mb-8 leading-relaxed">
                The Whispering Walls claimed your mind. You were found staring into the void, murmuring gibberish.
              </p>
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-6 py-3 border border-horror-darkred hover:border-horror-red text-stone-400 hover:text-horror-red font-mono text-sm tracking-widest rounded bg-zinc-950/50 cursor-pointer transition-all duration-300"
              >
                <RefreshCw size={14} />
                <span>TRY AGAIN</span>
              </button>
            </motion.div>
          ) : (
            /* Active Story Typewriter Panel */
            <motion.div
              key="story-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full"
            >
              {currentBlock && (
                <div className="min-h-[160px] flex items-center justify-center">
                  <TypewriterText
                    key={blockIndex}
                    text={currentBlock.text}
                    speed={32}
                    delay={400}
                    onComplete={handleTextComplete}
                    className="font-special text-lg md:text-xl text-stone-300 leading-relaxed tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                  />
                </div>
              )}

              {/* Continue button appears when typing completes */}
              <div className="h-16 mt-12">
                {typingComplete && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={handleContinue}
                    className="px-8 py-2 border border-horror-darkred hover:border-horror-red font-horror text-xl text-horror-red tracking-widest bg-zinc-950/60 rounded cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(69,10,10,0.4)]"
                  >
                    CONTINUE
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="relative z-20 w-full py-6 text-center font-mono text-[9px] text-stone-600 tracking-wider">
        {!showWarning && !isDead && `BLOCK ${blockIndex + 1} OF ${story.blocks.length}`}
      </footer>
    </div>
  );
};
export default ReadStory;
