import { useEffect, useRef } from 'react';
import { scrollReveal } from '../utils/animations';

/**
 * Custom hook for scroll-triggered animations
 * @param {Object} options - GSAP animation options
 */
export const useScrollAnimation = (options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const animation = scrollReveal(elementRef.current, options);

    return () => {
      animation.kill();
    };
  }, []);

  return elementRef;
};

export default useScrollAnimation;
