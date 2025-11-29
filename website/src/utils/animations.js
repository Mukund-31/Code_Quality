import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animation utility functions for GSAP
 */

// Fade in from bottom animation
export const fadeInUp = (element, options = {}) => {
  const defaults = {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  };

  return gsap.from(element, { ...defaults, ...options });
};

// Fade in from left
export const fadeInLeft = (element, options = {}) => {
  const defaults = {
    x: -60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  };

  return gsap.from(element, { ...defaults, ...options });
};

// Fade in from right
export const fadeInRight = (element, options = {}) => {
  const defaults = {
    x: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  };

  return gsap.from(element, { ...defaults, ...options });
};

// Scale in animation
export const scaleIn = (element, options = {}) => {
  const defaults = {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)',
  };

  return gsap.from(element, { ...defaults, ...options });
};

// Stagger animation for multiple elements
export const staggerFadeIn = (elements, options = {}) => {
  const defaults = {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
  };

  return gsap.from(elements, { ...defaults, ...options });
};

// Parallax effect
export const parallax = (element, options = {}) => {
  const defaults = {
    yPercent: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  };

  return gsap.to(element, { ...defaults, ...options });
};

// Reveal animation with ScrollTrigger
export const scrollReveal = (element, options = {}) => {
  const defaults = {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      end: 'top 50%',
      toggleActions: 'play none none reverse',
    },
  };

  return gsap.from(element, { ...defaults, ...options });
};

// Horizontal scroll animation
export const horizontalScroll = (container, options = {}) => {
  const sections = gsap.utils.toArray(container.children);
  
  return gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      snap: 1 / (sections.length - 1),
      end: () => '+=' + container.offsetWidth,
      ...options,
    },
  });
};

// Text reveal animation (split by characters)
export const textReveal = (element, options = {}) => {
  const text = element.textContent;
  element.innerHTML = text
    .split('')
    .map((char) => `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
    .join('');

  const chars = element.querySelectorAll('span');
  
  const defaults = {
    y: 50,
    opacity: 0,
    rotationX: -90,
    stagger: 0.02,
    duration: 0.8,
    ease: 'back.out(1.7)',
  };

  return gsap.from(chars, { ...defaults, ...options });
};

// Magnetic button effect
export const magneticEffect = (button, strength = 0.5) => {
  const handleMouseMove = (e) => {
    const { left, top, width, height } = button.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    gsap.to(button, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  button.addEventListener('mousemove', handleMouseMove);
  button.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    button.removeEventListener('mousemove', handleMouseMove);
    button.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// Counter animation
export const animateCounter = (element, endValue, options = {}) => {
  const defaults = {
    duration: 2,
    ease: 'power1.out',
  };

  const obj = { value: 0 };
  
  return gsap.to(obj, {
    value: endValue,
    ...defaults,
    ...options,
    onUpdate: () => {
      element.textContent = Math.round(obj.value);
    },
  });
};

// Gradient animation
export const animateGradient = (element, options = {}) => {
  const defaults = {
    backgroundPosition: '200% center',
    duration: 3,
    ease: 'none',
    repeat: -1,
    yoyo: true,
  };

  return gsap.to(element, { ...defaults, ...options });
};

// 3D card tilt effect
export const cardTilt = (card) => {
  const handleMouseMove = (e) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    const rotateX = (y - 0.5) * 20;
    const rotateY = (x - 0.5) * -20;

    gsap.to(card, {
      rotationX: rotateX,
      rotationY: rotateY,
      transformPerspective: 1000,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  card.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    card.removeEventListener('mousemove', handleMouseMove);
    card.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// Smooth scroll to element
export const scrollToElement = (target, options = {}) => {
  const defaults = {
    duration: 1,
    ease: 'power3.inOut',
  };

  gsap.to(window, {
    scrollTo: { y: target, offsetY: 80 },
    ...defaults,
    ...options,
  });
};

export default {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerFadeIn,
  parallax,
  scrollReveal,
  horizontalScroll,
  textReveal,
  magneticEffect,
  animateCounter,
  animateGradient,
  cardTilt,
  scrollToElement,
};
