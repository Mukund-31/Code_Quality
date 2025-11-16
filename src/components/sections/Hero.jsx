import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Sparkles, Code2, Zap } from 'lucide-react';
import Container from '../ui/Container';
import Button from '../ui/Button';
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
      <div className="absolute inset-0 gradient-bg bg-gradient-to-br from-primary-900/20 via-purple-900/20 to-pink-900/20" 
           style={{ backgroundSize: '200% 200%' }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

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

      {/* Floating Icons */}
      <div className="absolute top-32 right-1/4 floating-element opacity-20">
        <Code2 size={48} className="text-primary-500" />
      </div>
      <div className="absolute bottom-32 left-1/3 floating-element opacity-20">
        <Zap size={40} className="text-purple-500" />
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
