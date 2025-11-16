# Component Index

Quick reference guide for all components in the project.

## 🎨 UI Components (`src/components/ui/`)

### Button
Versatile button component with multiple variants and magnetic effect support.

```jsx
import Button from './components/ui/Button';

<Button variant="primary" size="md" magnetic>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `magnetic`: boolean (enables magnetic hover effect)
- `className`: string (additional classes)

---

### Card
Container component with hover effects and gradient options.

```jsx
import Card from './components/ui/Card';

<Card hover gradient>
  Content here
</Card>
```

**Props:**
- `hover`: boolean (enables hover animation)
- `gradient`: boolean (gradient background)
- `className`: string

---

### GradientText
Text with animated gradient effect.

```jsx
import GradientText from './components/ui/GradientText';

<GradientText 
  from="from-primary-400"
  via="via-purple-400"
  to="to-pink-400"
  animate
>
  Beautiful Text
</GradientText>
```

**Props:**
- `from`: string (Tailwind gradient start)
- `via`: string (Tailwind gradient middle)
- `to`: string (Tailwind gradient end)
- `animate`: boolean (enables animation)

---

### Container
Responsive container with max-width control.

```jsx
import Container from './components/ui/Container';

<Container size="default">
  Content here
</Container>
```

**Props:**
- `size`: 'sm' | 'default' | 'lg' | 'full'
- `className`: string

---

### Badge
Status indicator with multiple variants.

```jsx
import Badge from './components/ui/Badge';

<Badge variant="primary" size="md">
  New
</Badge>
```

**Props:**
- `variant`: 'primary' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `className`: string

---

## 🏗️ Layout Components (`src/components/layout/`)

### Header
Sticky navigation header with smooth scroll and mobile menu.

```jsx
import Header from './components/layout/Header';

<Header />
```

**Features:**
- Sticky positioning with blur effect on scroll
- Mobile responsive menu
- Smooth scroll to sections
- Logo with hover animation

---

### Footer
Multi-column footer with links and social media.

```jsx
import Footer from './components/layout/Footer';

<Footer />
```

**Features:**
- Organized link sections
- Social media icons
- Responsive grid layout
- Copyright information

---

## 📄 Section Components (`src/components/sections/`)

### Hero
Main hero section with animated elements.

```jsx
import Hero from './components/sections/Hero';

<Hero />
```

**Features:**
- Staggered text animations
- Floating background elements
- Magnetic button effects
- Animated statistics
- Gradient background

---

### Features
Feature showcase with cards and icons.

```jsx
import Features from './components/sections/Features';

<Features />
```

**Features:**
- 9 feature cards
- Scroll-triggered reveals
- Hover effects with 3D transforms
- Icon animations
- Gradient borders on hover

---

### HowItWorks
Step-by-step process visualization.

```jsx
import HowItWorks from './components/sections/HowItWorks';

<HowItWorks />
```

**Features:**
- 4-step process
- Alternating layout
- Connecting line animation
- Icon glow effects
- Responsive design

---

### Pricing
Pricing table with feature comparison.

```jsx
import Pricing from './components/sections/Pricing';

<Pricing />
```

**Features:**
- 3 pricing tiers
- Feature comparison with checkmarks
- Popular plan highlighting
- Staggered card animations
- Responsive grid

---

## 🎬 Animation Components (`src/components/animations/`)

### ScrollReveal
Wrapper for scroll-triggered animations.

```jsx
import ScrollReveal from './components/animations/ScrollReveal';

<ScrollReveal 
  direction="up" 
  delay={0.2} 
  duration={1}
>
  <div>Content</div>
</ScrollReveal>
```

**Props:**
- `direction`: 'up' | 'down' | 'left' | 'right'
- `delay`: number (seconds)
- `duration`: number (seconds)
- `className`: string

---

### ParallaxSection
Parallax scrolling effect wrapper.

```jsx
import ParallaxSection from './components/animations/ParallaxSection';

<ParallaxSection speed={0.5}>
  <div>Background</div>
</ParallaxSection>
```

**Props:**
- `speed`: number (0-1, higher = faster parallax)
- `className`: string

---

### AnimatedCard
Card with 3D tilt effect on mouse move.

```jsx
import AnimatedCard from './components/animations/AnimatedCard';

<AnimatedCard enableTilt>
  <div>Card Content</div>
</AnimatedCard>
```

**Props:**
- `enableTilt`: boolean
- `className`: string

---

## 🎣 Custom Hooks (`src/hooks/`)

### useGSAP
Automatic cleanup for GSAP animations.

```jsx
import { useGSAP } from './hooks/useGSAP';
import gsap from 'gsap';

function Component() {
  useGSAP(() => {
    gsap.from('.element', { y: 50, opacity: 0 });
  }, []); // dependencies
  
  return <div className="element">Content</div>;
}
```

**Parameters:**
- `animationFn`: Function containing GSAP animations
- `dependencies`: Array (like useEffect)

---

### useScrollAnimation
Quick scroll-triggered animation hook.

```jsx
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

**Parameters:**
- `options`: Object (GSAP animation options)

**Returns:**
- `ref`: React ref to attach to element

---

### useMagneticEffect
Magnetic hover effect hook.

```jsx
import { useMagneticEffect } from './hooks/useMagneticEffect';

function Component() {
  const ref = useMagneticEffect(0.3);
  
  return <button ref={ref}>Hover Me</button>;
}
```

**Parameters:**
- `strength`: number (0-1, magnetic strength)

**Returns:**
- `ref`: React ref to attach to element

---

## 🛠️ Utility Functions (`src/utils/animations.js`)

### fadeInUp
```javascript
fadeInUp(element, { y: 60, duration: 1 })
```

### fadeInLeft / fadeInRight
```javascript
fadeInLeft(element, { x: -60, duration: 1 })
fadeInRight(element, { x: 60, duration: 1 })
```

### scaleIn
```javascript
scaleIn(element, { scale: 0.8, duration: 0.8 })
```

### staggerFadeIn
```javascript
staggerFadeIn(elements, { stagger: 0.15 })
```

### parallax
```javascript
parallax(element, { yPercent: -50 })
```

### scrollReveal
```javascript
scrollReveal(element, { 
  y: 100, 
  scrollTrigger: { trigger: element } 
})
```

### magneticEffect
```javascript
const cleanup = magneticEffect(button, 0.5)
```

### cardTilt
```javascript
const cleanup = cardTilt(card)
```

### textReveal
```javascript
textReveal(element, { stagger: 0.02 })
```

### animateCounter
```javascript
animateCounter(element, 1000, { duration: 2 })
```

### animateGradient
```javascript
animateGradient(element, { 
  backgroundPosition: '200% center',
  repeat: -1 
})
```

### scrollToElement
```javascript
scrollToElement(target, { duration: 1 })
```

---

## 🎨 Usage Examples

### Creating a New Animated Section

```jsx
import { useRef } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import Container from '../ui/Container';
import Card from '../ui/Card';
import GradientText from '../ui/GradientText';

function MySection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from('.my-element', {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-dark-950">
      <Container>
        <h2 className="text-4xl font-bold mb-8">
          My <GradientText>Awesome</GradientText> Section
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="my-element" hover>
            Card 1
          </Card>
          <Card className="my-element" hover>
            Card 2
          </Card>
          <Card className="my-element" hover>
            Card 3
          </Card>
        </div>
      </Container>
    </section>
  );
}

export default MySection;
```

### Creating a Magnetic Button

```jsx
import Button from '../ui/Button';
import { useMagneticEffect } from '../hooks/useMagneticEffect';

function MyComponent() {
  const buttonRef = useMagneticEffect(0.3);

  return (
    <Button 
      ref={buttonRef}
      variant="primary"
      magnetic
    >
      Hover Me!
    </Button>
  );
}
```

### Creating a Parallax Background

```jsx
import ParallaxSection from '../animations/ParallaxSection';

function MyComponent() {
  return (
    <div className="relative">
      <ParallaxSection speed={0.5} className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-primary-900/20 to-purple-900/20" />
      </ParallaxSection>
      
      <div className="relative z-10">
        {/* Your content */}
      </div>
    </div>
  );
}
```

---

## 📋 Component Checklist

When creating new components:

- [ ] Import necessary dependencies
- [ ] Add proper TypeScript/PropTypes if needed
- [ ] Use `forwardRef` if ref is needed
- [ ] Add proper cleanup in useEffect
- [ ] Make it responsive (mobile-first)
- [ ] Add proper accessibility attributes
- [ ] Use semantic HTML
- [ ] Follow existing naming conventions
- [ ] Add to this index file
- [ ] Test on multiple devices

---

## 🎯 Best Practices

1. **Always cleanup animations** - Use useGSAP hook or cleanup functions
2. **Use refs for direct DOM manipulation** - Avoid querySelector when possible
3. **Keep components small** - Single responsibility principle
4. **Reuse existing components** - Don't recreate similar components
5. **Follow naming conventions** - PascalCase for components, camelCase for functions
6. **Add proper props validation** - Use PropTypes or TypeScript
7. **Make it accessible** - Add ARIA labels, keyboard navigation
8. **Test responsiveness** - Mobile, tablet, desktop
9. **Optimize performance** - Use React.memo when needed
10. **Document complex logic** - Add comments for future reference

---

## 🔗 Quick Links

- [Animation Guide](./ANIMATIONS_GUIDE.md)
- [Setup Guide](./SETUP.md)
- [README](./README.md)

---

Need help? Check the guides above or refer to the component source code! 🚀
