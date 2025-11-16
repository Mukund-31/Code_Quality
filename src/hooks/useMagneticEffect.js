import { useEffect, useRef } from 'react';
import { magneticEffect } from '../utils/animations';

/**
 * Custom hook for magnetic hover effect
 * @param {Number} strength - Strength of the magnetic effect (0-1)
 */
export const useMagneticEffect = (strength = 0.5) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const cleanup = magneticEffect(elementRef.current, strength);

    return cleanup;
  }, [strength]);

  return elementRef;
};

export default useMagneticEffect;
