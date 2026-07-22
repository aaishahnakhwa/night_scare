import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundSynth } from '../utils/soundSynth';

interface SoundContextType {
  isInitialized: boolean;
  isMuted: boolean;
  initAudio: () => Promise<void>;
  toggleMute: () => void;
  startDrone: () => void;
  stopDrone: () => void;
  startHeartbeat: (bpm?: number) => void;
  setHeartbeatBpm: (bpm: number) => void;
  stopHeartbeat: () => void;
  playTypewriterClick: () => void;
  playHoverClick: () => void;
  playJumpscare: () => void;
  playWhisper: (leftSide?: boolean) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  // Initialize and unlock audio context
  const initAudio = async () => {
    if (isInitialized) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      soundSynth.init(ctx);
      setAudioCtx(ctx);
      setIsInitialized(true);
      console.log('Audio Engine initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
    }
  };

  // Mute / Unmute
  const toggleMute = () => {
    if (!audioCtx) return;

    if (isMuted) {
      // Unmute
      audioCtx.resume();
      setIsMuted(false);
    } else {
      // Mute by suspending context
      audioCtx.suspend();
      setIsMuted(true);
    }
  };

  // Synth wrapper functions
  const startDrone = () => {
    if (!isInitialized || isMuted) return;
    soundSynth.startDrone();
  };

  const stopDrone = () => {
    soundSynth.stopDrone();
  };

  const startHeartbeat = (bpm: number = 60) => {
    if (!isInitialized || isMuted) return;
    soundSynth.startHeartbeat(bpm);
  };

  const setHeartbeatBpm = (bpm: number) => {
    if (!isInitialized || isMuted) return;
    soundSynth.setHeartbeatBpm(bpm);
  };

  const stopHeartbeat = () => {
    soundSynth.stopHeartbeat();
  };

  const playTypewriterClick = () => {
    if (!isInitialized || isMuted) return;
    soundSynth.playTypewriterClick();
  };

  const playHoverClick = () => {
    if (!isInitialized || isMuted) return;
    soundSynth.playHoverClick();
  };

  const playJumpscare = () => {
    if (!isInitialized || isMuted) return;
    // Jumpscares bypass mute if user enables audio (must be intense!)
    soundSynth.playJumpscare();
  };

  const playWhisper = (leftSide: boolean = true) => {
    if (!isInitialized || isMuted) return;
    soundSynth.playWhisper(leftSide);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundSynth.stopDrone();
      soundSynth.stopHeartbeat();
    };
  }, []);

  return (
    <SoundContext.Provider
      value={{
        isInitialized,
        isMuted,
        initAudio,
        toggleMute,
        startDrone,
        stopDrone,
        startHeartbeat,
        setHeartbeatBpm,
        stopHeartbeat,
        playTypewriterClick,
        playHoverClick,
        playJumpscare,
        playWhisper,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
