import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxSection = ({ 
  children, 
  speed = 0.5,
  className = ''
}) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const animation = gsap.to(section, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, [speed]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
};

export default ParallaxSection;
