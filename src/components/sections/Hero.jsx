import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Sparkles, Code2, Zap, GitBranch, Terminal } from 'lucide-react';
import Container from '../ui/Container';
import { Button } from '../ui/Button';
import GradientText from '../ui/GradientText';
import { useGSAP } from '../../hooks/useGSAP';
import { useMagneticEffect } from '../../hooks/useMagneticEffect';
import { useAuth } from '../../contexts/AuthContext';

const Hero = () => {
  const heroRef = useRef(null);
  const primaryBtnRef = useMagneticEffect(0.3);
  const secondaryBtnRef = useMagneticEffect(0.2);
  const { user } = useAuth();
  const navigate = useNavigate();

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animate hero elements
    tl.from('.hero-badge', {
      y: 30,
      opacity: 0,
      duration: 0.8,
    })
      .from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
      }, '-=0.4')
      .from('.hero-description', {
        y: 30,
        opacity: 0,
        duration: 0.8,
      }, '-=0.6')
      .from('.hero-buttons', {
        y: 30,
        opacity: 0,
        duration: 0.8,
      }, '-=0.4')
      .from('.hero-stats', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      }, '-=0.6')
      .from('.floating-element', {
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'back.out(1.7)',
      }, '-=0.8');

    // Floating animation for decorative elements
    gsap.to('.floating-element', {
      y: -20,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      stagger: {
        each: 0.3,
        from: 'random',
      },
    });

    // Gradient animation
    gsap.to('.gradient-bg', {
      backgroundPosition: '200% center',
      duration: 8,
      ease: 'none',
      repeat: -1,
    });

    // Animated orbs
    gsap.to('.animated-orb-1', {
      x: 100,
      y: -50,
      scale: 1.2,
      duration: 8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    gsap.to('.animated-orb-2', {
      x: -80,
      y: 60,
      scale: 0.8,
      duration: 10,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    gsap.to('.animated-orb-3', {
      x: -60,
      y: -40,
      scale: 1.1,
      duration: 7,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Particle animation
    gsap.to('.particle', {
      y: -100,
      opacity: 0,
      duration: 3,
      ease: 'power1.out',
      stagger: {
        each: 0.2,
        repeat: -1,
        repeatDelay: 1,
      },
    });

    // Rotating icons
    gsap.to('.rotating-icon', {
      rotation: 360,
      duration: 20,
      ease: 'none',
      repeat: -1,
    });

    // Pulsing glow effect
    gsap.to('.pulse-glow', {
      scale: 1.5,
      opacity: 0,
      duration: 2,
      ease: 'power2.out',
      stagger: {
        each: 0.5,
        repeat: -1,
      },
    });

    // Grid animation
    gsap.to('.grid-line', {
      opacity: 0.3,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      stagger: {
        each: 0.1,
        from: 'random',
      },
    });
  }, []);

  const stats = [
    { label: 'Pull Requests', value: '10M+' },
    { label: 'Lines Reviewed', value: '500M+' },
    { label: 'Teams', value: '5K+' },
    { label: 'Time Saved', value: '50%' },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950 pt-20"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-bg bg-gradient-to-br from-primary-900/10 via-dark-950 to-purple-900/10"
        style={{ backgroundSize: '200% 200%' }} />

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={`grid-h-${i}`}
            className="grid-line absolute w-full h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent"
            style={{ top: `${i * 5}%` }}
          />
        ))}
        {[...Array(20)].map((_, i) => (
          <div
            key={`grid-v-${i}`}
            className="grid-line absolute h-full w-px bg-gradient-to-b from-transparent via-primary-500/20 to-transparent"
            style={{ left: `${i * 5}%` }}
          />
        ))}
      </div>

      {/* Large Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 animated-orb-1">
        <div className="w-96 h-96 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-3xl" />
      </div>
      <div className="absolute top-1/3 right-1/4 animated-orb-2">
        <div className="w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-1/4 left-1/3 animated-orb-3">
        <div className="w-72 h-72 bg-gradient-to-br from-pink-500/20 to-primary-500/20 rounded-full blur-3xl" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 floating-element">
        <div className="w-16 h-16 bg-primary-500/10 rounded-full blur-xl" />
      </div>
      <div className="absolute top-40 right-20 floating-element">
        <div className="w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
      </div>
      <div className="absolute bottom-40 left-1/4 floating-element">
        <div className="w-20 h-20 bg-pink-500/10 rounded-full blur-xl" />
      </div>

      {/* Pulsing Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="pulse-glow absolute w-32 h-32 bg-primary-500/30 rounded-full blur-2xl" />
        <div className="pulse-glow absolute w-32 h-32 bg-purple-500/30 rounded-full blur-2xl" />
        <div className="pulse-glow absolute w-32 h-32 bg-pink-500/30 rounded-full blur-2xl" />
      </div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="particle absolute w-1 h-1 bg-primary-400/50 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Rotating Icons */}
      <div className="absolute top-32 right-1/4 rotating-icon floating-element opacity-10">
        <Code2 size={48} className="text-primary-500" />
      </div>
      <div className="absolute bottom-32 left-1/3 rotating-icon floating-element opacity-10" style={{ animationDelay: '5s' }}>
        <Zap size={40} className="text-purple-500" />
      </div>
      <div className="absolute top-1/2 right-20 rotating-icon floating-element opacity-10" style={{ animationDelay: '10s' }}>
        <GitBranch size={36} className="text-pink-500" />
      </div>
      <div className="absolute bottom-1/4 left-20 rotating-icon floating-element opacity-10" style={{ animationDelay: '15s' }}>
        <Terminal size={44} className="text-primary-400" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-8">
            <Sparkles size={16} className="text-primary-400" />
            <span className="text-primary-400 text-sm font-medium">
              AI-Powered Code Reviews
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="hero-title block">Ship Better Code</span>
            <span className="hero-title block">
              with <GradientText animate>AI Reviews</GradientText>
            </span>
          </h1>

          {/* Description */}
          <p className="hero-description text-xl md:text-2xl text-dark-300 mb-10 max-w-3xl mx-auto">
            Automated code reviews that catch bugs, improve quality, and accelerate
            your development workflow. Get instant feedback on every pull request.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              ref={primaryBtnRef}
              variant="primary"
              size="lg"
              magnetic
              className="group"
              onClick={() => navigate(user ? '/dashboard' : '/signup')}
            >
              {user ? 'Go to Dashboard' : 'Start Free Trial'}
              <ArrowRight
                size={20}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Button>
            <Button
              ref={secondaryBtnRef}
              variant="outline"
              size="lg"
              magnetic
              onClick={() => {
                const element = document.querySelector('#how-it-works');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="hero-stats">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-dark-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent" />
    </section>
  );
};

export default Hero;