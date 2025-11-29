import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for GSAP animations with automatic cleanup
 * @param {Function} animationFn - Function that contains GSAP animations
 * @param {Array} dependencies - Dependencies array for useEffect
 */
export const useGSAP = (animationFn, dependencies = []) => {
  const contextRef = useRef();

  useEffect(() => {
    // Create GSAP context for automatic cleanup
    contextRef.current = gsap.context(() => {
      animationFn();
    });

    // Cleanup function
    return () => {
      contextRef.current?.revert();
    };
  }, dependencies);

  return contextRef;
};

export default useGSAP;
