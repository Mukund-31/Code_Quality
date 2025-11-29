import { useRef, useEffect } from 'react';
import {
  Code2,
  Zap,
  Shield,
  GitPullRequest,
  Brain,
  TrendingUp,
  Lock,
  Users,
  BarChart3
} from 'lucide-react';

// Mock components for demonstration
const Container = ({ children }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
);

const Card = ({ children, className, hover }) => (
  <div className={className}>{children}</div>
);

const GradientText = ({ children }) => (
  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
    {children}
  </span>
);

const Badge = ({ children, variant, size, className }) => (
  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variant === 'primary' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-300'
    } ${size === 'sm' ? 'text-xs px-2 py-0.5' : ''} ${className || ''}`}>
    {children}
  </span>
);

const Features = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Dynamically import GSAP and ScrollTrigger
    const loadGSAP = async () => {
      const gsap = (await import('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js')).default;
      const ScrollTrigger = (await import('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js')).default;

      gsap.registerPlugin(ScrollTrigger);

      // Animate section title
      gsap.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
        },
      });

      // Staggered animation for cards
      gsap.fromTo(cardsRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'bottom 85%',
          },
        }
      );

      // Add hover animations for cards
      cardsRef.current.forEach((card) => {
        if (!card) return;

        const icon = card.querySelector('.feature-icon');
        const hoverGradient = card.querySelector('.hover-gradient');
        const glowEffect = card.querySelector('.glow-effect');

        card.addEventListener('mouseenter', () => {
          // Jump animation with bounce
          gsap.to(icon, {
            y: -15,
            scale: 1.2,
            rotation: 5,
            duration: 0.4,
            ease: 'back.out(2)',
          });

          // Quick bounce back down
          gsap.to(icon, {
            y: 0,
            duration: 0.3,
            delay: 0.4,
            ease: 'bounce.out',
          });

          gsap.to(hoverGradient, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
          });

          gsap.to(glowEffect, {
            opacity: 0.6,
            scale: 1.05,
            duration: 0.5,
            ease: 'power2.out',
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(icon, {
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'power2.out',
          });

          gsap.to(hoverGradient, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
          });

          gsap.to(glowEffect, {
            opacity: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
          });
        });
      });
    };

    loadGSAP();
  }, []);

  const features = [
    {
      icon: Code2,
      title: 'Automated Code Reviews',
      description: 'Get instant, line-by-line feedback on every pull request with AI-powered suggestions.',
      badge: 'Core',
      color: 'text-blue-500',
    },
    {
      icon: Brain,
      title: 'Context-Aware AI',
      description: 'Our AI understands your codebase context to provide relevant and accurate recommendations.',
      badge: 'AI',
      color: 'text-purple-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Reviews complete in seconds, not hours. Keep your development velocity high.',
      badge: 'Performance',
      color: 'text-yellow-500',
    },
    {
      icon: Shield,
      title: 'Security Scanning',
      description: 'Automatically detect vulnerabilities and security issues before they reach production.',
      badge: 'Security',
      color: 'text-red-500',
    },
    {
      icon: GitPullRequest,
      title: 'PR Summaries',
      description: 'Auto-generated summaries help reviewers understand changes at a glance.',
      badge: 'Productivity',
      color: 'text-green-500',
    },
    {
      icon: TrendingUp,
      title: 'Code Quality Metrics',
      description: 'Track improvements over time with detailed analytics and insights.',
      badge: 'Analytics',
      color: 'text-blue-500',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Foster better collaboration with shared standards and automated workflows.',
      badge: 'Team',
      color: 'text-pink-500',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your code never leaves your infrastructure. Complete data privacy guaranteed.',
      badge: 'Privacy',
      color: 'text-indigo-500',
    },
    {
      icon: BarChart3,
      title: 'Custom Rules',
      description: 'Configure custom coding standards and rules tailored to your team.',
      badge: 'Flexible',
      color: 'text-orange-500',
    },
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-24 bg-gray-950 relative overflow-hidden isolate"
    >
      {/* Background Elements - Fixed z-index */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 via-transparent to-transparent pointer-events-none -z-10" />

      <Container>
        {/* Section Header - Fixed spacing */}
        <div ref={titleRef} className="features-title text-center mb-20">
          <Badge variant="primary" className="mb-6">Features</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Everything You Need for{' '}
            <GradientText>Better Code</GradientText>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Powerful features designed to help your team ship higher quality code faster
          </p>
        </div>

        {/* Features Grid - Fixed gaps and spacing */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="feature-card group relative overflow-hidden cursor-pointer rounded-xl p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
            >
              {/* Glow Effect on Hover */}
              <div className="glow-effect absolute inset-0 opacity-0 blur-2xl bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 -z-10" />

              <div className="relative z-20">
                <div className={`feature-icon ${feature.color} mb-6 inline-block`}>
                  <feature.icon size={40} strokeWidth={1.5} />
                </div>

                <div className="flex items-start gap-3 mb-4 flex-wrap">
                  <h3 className="text-xl font-semibold text-white flex-1 min-w-0">
                    {feature.title}
                  </h3>
                  <Badge variant="primary" size="sm">
                    {feature.badge}
                  </Badge>
                </div>

                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Gradient - Fixed z-index */}
              <div className="hover-gradient absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 -z-10" />

              {/* Animated Border Shine */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-shimmer" style={{
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s infinite'
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA - Fixed spacing */}
        <div className="text-center mt-16 pt-8 border-t border-gray-800">
          <p className="text-gray-400 mb-4">
            Want to see all features in action?
          </p>
          <a
            href="#"
            className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-2 group transition-colors"
          >
            View Full Feature List
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </a>
        </div>
      </Container>
    </section>
  );
};

// Add shimmer animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;
document.head.appendChild(style);

export default Features;