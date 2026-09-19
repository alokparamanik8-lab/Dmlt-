import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { AnimationIntensity } from '../types';

export function triggerTopicCompleteConfetti() {
  try {
    // Respect reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Subtle, elegant particle burst (not an overwhelming screen flood)
    confetti({
      particleCount: 40,
      spread: 55,
      origin: { y: 0.7 },
      colors: ['#0d9488', '#14b8a6', '#f59e0b', '#3b82f6', '#10b981'],
      ticks: 160,
      gravity: 1.1,
      scalar: 0.85,
      disableForReducedMotion: true,
    });
  } catch (err) {
    console.debug('Confetti animation suppressed', err);
  }
}

export function triggerLevelUpConfetti() {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#06b6d4', '#8b5cf6'],
      ticks: 200,
      scalar: 1,
      disableForReducedMotion: true,
    });
  } catch (err) {
    console.debug('Level up confetti suppressed', err);
  }
}

/**
 * Animated counter hook that smoothly animates a numeric value from start to end
 */
export function useCountUp(endValue: number, durationMs: number = 600, intensity: AnimationIntensity = 'high'): number {
  const [displayValue, setDisplayValue] = useState(endValue);

  useEffect(() => {
    if (intensity === 'off' || durationMs <= 0) {
      setDisplayValue(endValue);
      return;
    }

    // Adjust duration by intensity
    const effectiveDuration = intensity === 'low' ? 300 : intensity === 'medium' ? 450 : durationMs;

    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const change = endValue - startValue;

    if (change === 0) return;

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / effectiveDuration, 1);
      // Ease out quad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(startValue + change * easedProgress);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [endValue, durationMs, intensity]);

  return displayValue;
}

// Framer motion animation variants based on intensity
export function getMotionVariants(intensity: AnimationIntensity = 'high') {
  const isOff = intensity === 'off';
  const isLow = intensity === 'low';

  return {
    fadeIn: {
      initial: { opacity: isOff ? 1 : 0 },
      animate: { opacity: 1 },
      transition: { duration: isOff ? 0 : isLow ? 0.15 : 0.25 },
    },
    slideUp: {
      initial: { opacity: isOff ? 1 : 0, y: isOff ? 0 : isLow ? 6 : 14 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: isOff ? 0 : isLow ? 0.2 : 0.3, ease: 'easeOut' },
    },
    modalBackdrop: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: isOff ? 0 : 0.2 },
    },
    modalContent: {
      initial: { opacity: isOff ? 1 : 0, scale: isOff ? 1 : 0.96, y: isOff ? 0 : 10 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: isOff ? 1 : 0.96, y: isOff ? 0 : 10 },
      transition: { duration: isOff ? 0 : isLow ? 0.15 : 0.25, ease: 'easeOut' },
    },
    staggerItem: (index: number) => ({
      initial: { opacity: isOff ? 1 : 0, y: isOff ? 0 : isLow ? 6 : 12 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: isOff ? 0 : 0.25,
        delay: isOff ? 0 : Math.min(index * (isLow ? 0.03 : 0.05), 0.3),
        ease: 'easeOut',
      },
    }),
  };
}
