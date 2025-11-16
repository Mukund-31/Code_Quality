import { useRef } from 'react';
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
import Container from '../ui/Container';
import Card from '../ui/Card';
import GradientText from '../ui/GradientText';
import Badge from '../ui/Badge';
import { useGSAP } from '../../hooks/useGSAP';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray('.feature-card');
    
    cards.forEach((card, index) => {
      gsap.from(card, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    // Animate section title
    gsap.from('.features-title', {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '.features-title',
        start: 'top 80%',
      },
    });
  }, []);

  const features = [
    {
      icon: Code2,
      title: 'Automated Code Reviews',
      description: 'Get instant, line-by-line feedback on every pull request with AI-powered suggestions.',
      badge: 'Core',
      color: 'text-primary-500',
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
      className="py-24 bg-dark-950 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/10 via-transparent to-transparent" />
      
      <Container>
        {/* Section Header */}
        <div className="features-title text-center mb-16">
          <Badge variant="primary" className="mb-4">Features</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need for{' '}
            <GradientText>Better Code</GradientText>
          </h2>
          <p className="text-xl text-dark-300 max-w-3xl mx-auto">
            Powerful features designed to help your team ship higher quality code faster
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="feature-card group cursor-pointer transform-gpu"
              hover
            >
              <div className={`${feature.color} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={40} strokeWidth={1.5} />
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <Badge variant="primary" size="sm">
                  {feature.badge}
                </Badge>
              </div>
              
              <p className="text-dark-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500 -z-10" />
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-dark-400 mb-4">
            Want to see all features in action?
          </p>
          <a 
            href="#" 
            className="text-primary-400 hover:text-primary-300 font-semibold inline-flex items-center gap-2 group"
          >
            View Full Feature List
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </Container>
    </section>
  );
};

export default Features;
