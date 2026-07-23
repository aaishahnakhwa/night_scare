import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

interface JumpscareOverlayProps {
  trigger: boolean;
  onEnd: () => void;
  imagePath?: string;
}

export const JumpscareOverlay: React.FC<JumpscareOverlayProps> = ({ trigger, onEnd, imagePath }) => {
  const { playJumpscare, startHeartbeat, stopHeartbeat, setHeartbeatBpm } = useSound();
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState<'scare' | 'fade' | 'none'>('none');

  useEffect(() => {
    if (trigger) {
      setShow(true);
      setStage('scare');
      
      // Play synthesis screech impact
      playJumpscare();
      
      // Accelerate heartbeat to mimic adrenaline
      startHeartbeat(150);

      // Step 1: Intense scare with flashing, shaking, and face (1.8s)
      const scareTimeout = setTimeout(() => {
        setStage('fade');
        setHeartbeatBpm(90); // Reduce heartbeat speed slowly
      }, 1800);

      // Step 2: Fade to pitch black (3.5s total duration)
      const endTimeout = setTimeout(() => {
        setStage('none');
        setShow(false);
        stopHeartbeat();
        onEnd(); // Invoke callback (e.g. show GameOver or load restart option)
      }, 3500);

      return () => {
        clearTimeout(scareTimeout);
        clearTimeout(endTimeout);
      };
    }
  }, [trigger]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black flex items-center justify-center select-none">
      {/* Glitch Strobe Flash */}
      {stage === 'scare' && (
        <motion.div
          animate={{
            backgroundColor: ['#ffffff', '#000000', '#991b1b', '#000000', '#ffffff', '#000000'],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.12,
            ease: 'linear',
          }}
          className="absolute inset-0 z-10 opacity-30 pointer-events-none"
        />
      )}

      {/* Screen Shake & Scaling Container */}
      <motion.div
        animate={
          stage === 'scare'
            ? {
                x: [0, -20, 20, -15, 15, -8, 8, -20, 20, 0],
                y: [0, 15, -15, 10, -10, 18, -18, -12, 12, 0],
                scale: [1.0, 1.35, 1.15, 1.45, 1.25, 1.5, 1.3, 1.15, 1.35, 1.0],
              }
            : { opacity: 0 }
        }
        transition={
          stage === 'scare'
            ? {
                repeat: Infinity,
                duration: 0.22,
                ease: 'linear',
              }
            : { duration: 1.4, ease: 'easeOut' }
        }
        className="w-full h-full flex items-center justify-center relative"
      >
        {/* Scary Face Image */}
        <img
          src={imagePath || "/assets/screaming_ghost.png"}
          alt="Screaming Apparition"
          className="w-full h-full object-cover max-w-4xl max-h-[85vh] filter brightness-125 contrast-125 select-none pointer-events-none"
        />
      </motion.div>

      {/* Cinematic Overlays */}
      <div className="vignette-overlay opacity-90" />
      <div className="red-vignette opacity-60" />
    </div>
  );
};
