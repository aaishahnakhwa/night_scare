import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../context/SoundContext';

interface TypewriterTextProps {
  text: string;
  speed?: number; // average speed per character in milliseconds
  delay?: number; // delay before starting to type in milliseconds
  onComplete?: () => void;
  className?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 30,
  delay = 100,
  onComplete,
  className = '',
}) => {
  const { playTypewriterClick } = useSound();
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<any>(null);

  // Reset state if text changes
  useEffect(() => {
    setDisplayedText('');
    setIndex(0);
    setStarted(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, [text]);

  // Initial delay trigger
  useEffect(() => {
    if (!started) {
      const delayTimer = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimeout(delayTimer);
    }
  }, [started, delay]);

  // Keystroke loop
  useEffect(() => {
    if (!started) return;

    if (index < text.length) {
      const char = text[index];
      // Randomize speed slightly (between 60% and 140% of target speed)
      const randomSpeed = speed * (0.6 + Math.random() * 0.8);

      timerRef.current = setTimeout(() => {
        setDisplayedText((prev) => prev + char);
        setIndex((prev) => prev + 1);

        // Synthesize click sound for typewriter keypress (skipping spaces for realistic pacing)
        if (char !== ' ' && char !== '\n' && char !== '\r') {
          playTypewriterClick();
        }
      }, randomSpeed);

      return () => clearTimeout(timerRef.current);
    } else {
      if (onComplete) {
        // Trigger completion callback
        onComplete();
      }
    }
  }, [index, started, text, speed, onComplete]);

  return <span className={className}>{displayedText}</span>;
};
