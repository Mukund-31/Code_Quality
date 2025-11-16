# GSAP Animations Guide

Complete reference for all animation utilities and patterns in this project.

## 🎬 Animation Utilities

### Basic Animations

#### fadeInUp
Fade in element from bottom to top.

```javascript
import { fadeInUp } from './utils/animations';

fadeInUp('.element', {
  y: 60,           // Distance to travel
  opacity: 0,      // Starting opacity
  duration: 1,     // Animation duration
  delay: 0.2,      // Delay before starting
});
```

#### fadeInLeft / fadeInRight
Fade in from left or right side.

```javascript
import { fadeInLeft, fadeInRight } from './utils/animations';

fadeInLeft('.element');
fadeInRight('.element');
```

#### scaleIn
Scale up element with bounce effect.

```javascript
import { scaleIn } from './utils/animations';

scaleIn('.element', {
  scale: 0.8,
  duration: 0.8,
  ease: 'back.out(1.7)',
});
```

### Scroll-Triggered Animations

#### scrollReveal
Reveal element when scrolling into view.

```javascript
import { scrollReveal } from './utils/animations';

scrollReveal('.element', {
  y: 100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: '.element',
    start: 'top 80%',
    end: 'top 50%',
    toggleActions: 'play none none reverse',
  },
});
```

#### parallax
Create parallax scrolling effect.

```javascript
import { parallax } from './utils/animations';

parallax('.background', {
  yPercent: -50,
  scrollTrigger: {
    scrub: true,
  },
});
```

### Stagger Animations

#### staggerFadeIn
Animate multiple elements with delay between each.

```javascript
import { staggerFadeIn } from './utils/animations';

staggerFadeIn('.items', {
  y: 40,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,  // Delay between each item
});
```

### Interactive Animations

#### magneticEffect
Create magnetic hover effect on buttons.

```javascript
import { magneticEffect } from './utils/animations';

const cleanup = magneticEffect(buttonElement, 0.5);

// Don't forget to cleanup
return cleanup;
```

#### cardTilt
3D tilt effect on mouse move.

```javascript
import { cardTilt } from './utils/animations';

const cleanup = cardTilt(cardElement);

// Cleanup when component unmounts
return cleanup;
```

### Text Animations

#### textReveal
Reveal text character by character.

```javascript
import { textReveal } from './utils/animations';

textReveal('.heading', {
  y: 50,
  opacity: 0,
  stagger: 0.02,
  duration: 0.8,
});
```

### Counter Animations

#### animateCounter
Animate numbers counting up.

```javascript
import { animateCounter } from './utils/animations';

animateCounter(element, 1000, {
  duration: 2,
  ease: 'power1.out',
});
```

### Gradient Animations

#### animateGradient
Animate gradient background position.

```javascript
import { animateGradient } from './utils/animations';

animateGradient('.gradient-bg', {
  backgroundPosition: '200% center',
  duration: 3,
  repeat: -1,
  yoyo: true,
});
```

## 🎣 Custom Hooks

### useGSAP
Automatic cleanup for GSAP animations.

```javascript
import { useGSAP } from './hooks/useGSAP';

function Component() {
  useGSAP(() => {
    gsap.from('.element', { y: 50, opacity: 0 });
  }, []); // Dependencies array
  
  return <div className="element">Content</div>;
}
```

### useScrollAnimation
Quick scroll-triggered animation hook.

```javascript
import { useScrollAnimation } from './hooks/useScrollAnimation';

function Component() {
  const ref = useScrollAnimation({
    y: 100,
    opacity: 0,
    duration: 1,
  });
  
  return <div ref={ref}>Content</div>;
}
```

### useMagneticEffect
Magnetic hover effect hook.

```javascript
import { useMagneticEffect } from './hooks/useMagneticEffect';

function Component() {
  const ref = useMagneticEffect(0.3); // strength
  
  return <button ref={ref}>Hover Me</button>;
}
```

## 🎨 Animation Components

### ScrollReveal Component
Wrapper component for scroll animations.

```javascript
import ScrollReveal from './components/animations/ScrollReveal';

<ScrollReveal direction="up" delay={0.2}>
  <div>Content</div>
</ScrollReveal>
```

**Props:**
- `direction`: 'up' | 'down' | 'left' | 'right'
- `delay`: number (seconds)
- `duration`: number (seconds)

### ParallaxSection Component
Parallax scrolling wrapper.

```javascript
import ParallaxSection from './components/animations/ParallaxSection';

<ParallaxSection speed={0.5}>
  <div>Background Content</div>
</ParallaxSection>
```

**Props:**
- `speed`: number (0-1, higher = faster)

### AnimatedCard Component
Card with 3D tilt effect.

```javascript
import AnimatedCard from './components/animations/AnimatedCard';

<AnimatedCard enableTilt>
  <div>Card Content</div>
</AnimatedCard>
```

**Props:**
- `enableTilt`: boolean

## 📋 Common Patterns

### Timeline Animations
Sequential animations with precise timing.

```javascript
import { useGSAP } from './hooks/useGSAP';
import gsap from 'gsap';

useGSAP(() => {
  const tl = gsap.timeline();
  
  tl.from('.title', { y: 50, opacity: 0 })
    .from('.subtitle', { y: 30, opacity: 0 }, '-=0.3')
    .from('.button', { scale: 0, opacity: 0 }, '-=0.2');
}, []);
```

### Scroll-Triggered Timeline
Complex animations triggered by scroll.

```javascript
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.section',
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
    }
  });
  
  tl.to('.element1', { x: 100 })
    .to('.element2', { y: 100 }, '<')
    .to('.element3', { scale: 1.5 });
}, []);
```

### Hover Animations
Interactive hover effects.

```javascript
const handleMouseEnter = (e) => {
  gsap.to(e.currentTarget, {
    scale: 1.05,
    duration: 0.3,
    ease: 'power2.out',
  });
};

const handleMouseLeave = (e) => {
  gsap.to(e.currentTarget, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out',
  });
};

<div 
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
  Hover Me
</div>
```

### Infinite Animations
Looping animations.

```javascript
gsap.to('.floating', {
  y: -20,
  duration: 2,
  ease: 'power1.inOut',
  yoyo: true,
  repeat: -1,
});
```

## 🎯 ScrollTrigger Options

### Common ScrollTrigger Properties

```javascript
scrollTrigger: {
  trigger: '.element',        // Element to watch
  start: 'top 80%',          // When to start (trigger viewport)
  end: 'bottom 20%',         // When to end
  scrub: true,               // Smooth scrubbing (true/false/number)
  pin: true,                 // Pin element during animation
  markers: true,             // Show debug markers (dev only)
  toggleActions: 'play none none reverse',
  // onEnter onLeave onEnterBack onLeaveBack
}
```

### Toggle Actions
Format: `onEnter onLeave onEnterBack onLeaveBack`

Options: `play`, `pause`, `resume`, `reset`, `restart`, `complete`, `reverse`, `none`

Examples:
- `'play none none reverse'` - Play on enter, reverse on leave back
- `'play pause resume reset'` - Full control
- `'restart pause resume none'` - Restart each time

## ⚡ Performance Tips

1. **Use `transform` and `opacity`** - Hardware accelerated
2. **Add `will-change`** - For frequently animated elements
3. **Use `transform-gpu`** - Force GPU acceleration
4. **Batch animations** - Use timelines instead of multiple tweens
5. **Kill animations** - Always cleanup in useEffect return
6. **Use `scrub`** - For smooth scroll-linked animations
7. **Debounce resize** - When using responsive animations

## 🎨 Easing Functions

Common easing options:
- `'power1.out'` - Gentle deceleration
- `'power2.out'` - Medium deceleration
- `'power3.out'` - Strong deceleration
- `'back.out(1.7)'` - Overshoot effect
- `'elastic.out(1, 0.3)'` - Bouncy effect
- `'bounce.out'` - Bounce at end
- `'none'` - Linear (for scrub animations)

## 🔧 Debugging

### Show ScrollTrigger Markers
```javascript
scrollTrigger: {
  markers: true, // Shows start/end points
}
```

### Log Animation Progress
```javascript
gsap.to('.element', {
  x: 100,
  onUpdate: function() {
    console.log('Progress:', this.progress());
  }
});
```

### Check Active Animations
```javascript
console.log(gsap.getProperty('.element', 'x'));
console.log(ScrollTrigger.getAll());
```

## 📚 Additional Resources

- [GSAP Docs](https://gsap.com/docs/)
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP Easing Visualizer](https://gsap.com/docs/v3/Eases)
- [CodePen Examples](https://codepen.io/collection/AEbkkJ)

## 💡 Pro Tips

1. **Start simple** - Master basic animations first
2. **Use timelines** - Better control and sequencing
3. **Think in layers** - Separate background, content, and foreground animations
4. **Test performance** - Use Chrome DevTools Performance tab
5. **Mobile first** - Reduce animations on mobile if needed
6. **Accessibility** - Respect `prefers-reduced-motion`
7. **Subtle is better** - Don't overdo animations

## 🎭 Animation Checklist

Before deploying:
- [ ] All animations have cleanup functions
- [ ] ScrollTrigger markers removed
- [ ] Performance tested on mobile
- [ ] Reduced motion preference respected
- [ ] No animation jank or stuttering
- [ ] Animations enhance, not distract
- [ ] Loading states animated
- [ ] Error states handled

Happy animating! ✨
