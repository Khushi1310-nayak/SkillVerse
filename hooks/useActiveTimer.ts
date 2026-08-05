import { useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';

export const useActiveTimer = () => {
  const accumulatedSecondsRef = useRef<number>(0);
  const isTrackingRef = useRef<boolean>(true);
  const lastActiveTimeRef = useRef<number>(Date.now());

  // Helper to persist current accumulated time
  const flushTime = () => {
    if (accumulatedSecondsRef.current > 0) {
      // Save full integer seconds
      const secondsToSave = Math.floor(accumulatedSecondsRef.current);
      if (secondsToSave > 0) {
        storageService.saveStudyTime(secondsToSave);
        accumulatedSecondsRef.current -= secondsToSave;
      }
    }
    lastActiveTimeRef.current = Date.now();
  };

  useEffect(() => {
    // Reset baseline when hook starts
    lastActiveTimeRef.current = Date.now();
    accumulatedSecondsRef.current = 0;
    isTrackingRef.current = document.visibilityState === 'visible' && document.hasFocus();

    const interval = setInterval(() => {
      if (isTrackingRef.current) {
        const now = Date.now();
        const deltaMs = now - lastActiveTimeRef.current;
        // Convert to seconds and add
        const deltaSec = deltaMs / 1000;
        accumulatedSecondsRef.current += deltaSec;
        lastActiveTimeRef.current = now;

        // Auto-save every 10 seconds
        if (accumulatedSecondsRef.current >= 10) {
          const secondsToSave = Math.floor(accumulatedSecondsRef.current);
          if (secondsToSave > 0) {
            storageService.saveStudyTime(secondsToSave);
            accumulatedSecondsRef.current -= secondsToSave;
          }
        }
      } else {
        // Keep baseline updated even when paused
        lastActiveTimeRef.current = Date.now();
      }
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (document.hasFocus()) {
          isTrackingRef.current = true;
          lastActiveTimeRef.current = Date.now();
        }
      } else {
        isTrackingRef.current = false;
        flushTime();
      }
    };

    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        isTrackingRef.current = true;
        lastActiveTimeRef.current = Date.now();
      }
    };

    const handleBlur = () => {
      isTrackingRef.current = false;
      flushTime();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Flush on page unload/hide to ensure no seconds are lost
    const handleBeforeUnload = () => {
      flushTime();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      flushTime();
    };
  }, []);
};
