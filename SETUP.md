# Code Quality Website - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
Code_Quality/
├── public/                 # Static assets
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── animations/    # Reusable animation components
│   │   │   ├── AnimatedCard.jsx
│   │   │   ├── ParallaxSection.jsx
│   │   │   └── ScrollReveal.jsx
│   │   ├── layout/        # Layout components
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── sections/      # Main page sections
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   └── Pricing.jsx
│   │   └── ui/            # Reusable UI components
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Container.jsx
│   │       └── GradientText.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useGSAP.js
│   │   ├── useMagneticEffect.js
│   │   └── useScrollAnimation.js
│   ├── utils/             # Utility functions
│   │   └── animations.js  # GSAP animation utilities
│   ├── styles/            # Global styles
│   │   └── index.css
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🎨 Key Features Implemented

### Animation System
- **GSAP Integration**: Full GSAP 3 with ScrollTrigger plugin
- **Custom Hooks**: `useGSAP`, `useScrollAnimation`, `useMagneticEffect`
- **Animation Utilities**: Pre-built animation functions for common patterns
- **Reusable Components**: ScrollReveal, ParallaxSection, AnimatedCard

### UI Components
- **Button**: Multiple variants (primary, secondary, outline, ghost) with magnetic effect support
- **Card**: Hover effects, gradient backgrounds, glass morphism
- **GradientText**: Animated gradient text with customizable colors
- **Badge**: Status indicators with multiple variants
- **Container**: Responsive container with size variants

### Sections
1. **Hero**: 
   - Staggered text animations
   - Floating background elements
   - Magnetic button effects
   - Animated statistics

2. **Features**:
   - 9 feature cards with icons
   - Scroll-triggered reveals
   - Hover effects with 3D transforms
   - Gradient borders on hover

3. **How It Works**:
   - 4-step process visualization
   - Alternating layout
   - Connecting line animation
   - Icon glow effects

4. **Pricing**:
   - 3 pricing tiers
   - Feature comparison
   - Popular plan highlighting
   - Staggered card animations

### Layout
- **Header**: 
  - Sticky navigation with blur effect
  - Smooth scroll to sections
  - Mobile responsive menu
  - Logo with hover animation

- **Footer**:
  - Multi-column layout
  - Social media links
  - Newsletter signup ready
  - Organized link sections

## 🎯 Animation Patterns Available

### Scroll Animations
```javascript
import { scrollReveal } from './utils/animations';

scrollReveal(element, {
  y: 100,
  opacity: 0,
  duration: 1,
});
```

### Magnetic Effect
```javascript
import { useMagneticEffect } from './hooks/useMagneticEffect';

const buttonRef = useMagneticEffect(0.3);
<Button ref={buttonRef} magnetic>Click Me</Button>
```

### Card Tilt Effect
```javascript
import AnimatedCard from './components/animations/AnimatedCard';

<AnimatedCard enableTilt>
  {/* Your content */}
</AnimatedCard>
```

### Parallax Scrolling
```javascript
import ParallaxSection from './components/animations/ParallaxSection';

<ParallaxSection speed={0.5}>
  {/* Your content */}
</ParallaxSection>
```

### Stagger Animations
```javascript
import { staggerFadeIn } from './utils/animations';

staggerFadeIn('.item', {
  stagger: 0.15,
  y: 40,
});
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: { /* Your colors */ },
  dark: { /* Your colors */ },
}
```

### Animations
Modify animation timings in `tailwind.config.js`:

```javascript
animation: {
  'gradient': 'gradient 8s linear infinite',
  'float': 'float 6s ease-in-out infinite',
}
```

### Typography
Update fonts in `index.html` and `tailwind.config.js`:

```javascript
fontFamily: {
  sans: ['Your Font', 'system-ui'],
}
```

## 🔧 Advanced Features

### Adding New Sections
1. Create component in `src/components/sections/`
2. Import and add to `App.jsx`
3. Add navigation link in `Header.jsx`

### Custom Animations
Add new animation utilities in `src/utils/animations.js`:

```javascript
export const myCustomAnimation = (element, options = {}) => {
  return gsap.from(element, {
    // Your animation properties
    ...options
  });
};
```

### Performance Optimization
- Animations use `transform-gpu` for hardware acceleration
- ScrollTrigger automatically manages animation lifecycle
- Lazy loading ready for images and components

## 📱 Responsive Design

All components are mobile-first and fully responsive:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎭 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Troubleshooting

### Animations not working?
- Check if GSAP is properly imported
- Verify ScrollTrigger is registered
- Check browser console for errors

### Styles not applying?
- Run `npm run dev` to restart dev server
- Clear browser cache
- Check if Tailwind is processing correctly

### Build errors?
- Delete `node_modules` and run `npm install` again
- Check Node.js version (v16+ recommended)
- Verify all imports are correct

## 📚 Resources

- [GSAP Documentation](https://gsap.com/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Guide](https://vitejs.dev/guide/)

## 🎉 Next Steps

1. **Add More Sections**: Testimonials, Blog, Case Studies
2. **Implement Dark Mode Toggle**: Use React Context
3. **Add Page Transitions**: Use GSAP for route changes
4. **Integrate Backend**: Connect to API for dynamic content
5. **Add Analytics**: Google Analytics, Mixpanel, etc.
6. **SEO Optimization**: Meta tags, sitemap, robots.txt
7. **Performance**: Image optimization, code splitting

## 💡 Tips

- Use `useGSAP` hook for automatic cleanup
- Keep animations subtle for better UX
- Test on multiple devices and browsers
- Monitor performance with Chrome DevTools
- Use semantic HTML for accessibility

Happy coding! 🚀
