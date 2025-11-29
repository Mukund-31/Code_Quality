import { useRef } from 'react';
import { GitBranch, MessageSquare, CheckCircle, Rocket } from 'lucide-react';
import Container from '../ui/Container';
import GradientText from '../ui/GradientText';
import { Badge } from '../ui/Badge';
import { useGSAP } from '../../hooks/useGSAP';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const steps = gsap.utils.toArray('.step-card');

    steps.forEach((step, index) => {
      gsap.from(step, {
        x: index % 2 === 0 ? -100 : 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    // Animate connecting lines
    gsap.from('.connecting-line', {
      scaleY: 0,
      duration: 1,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.steps-container',
        start: 'top 60%',
      },
    });
  }, []);

  const steps = [
    {
      number: '01',
      icon: GitBranch,
      title: 'Create Pull Request',
      description: 'Open a pull request in your repository as you normally would. Our AI automatically detects new PRs.',
      color: 'from-primary-500 to-primary-600',
    },
    {
      number: '02',
      icon: MessageSquare,
      title: 'AI Analysis',
      description: 'Our AI analyzes your code changes, understanding context and identifying potential issues instantly.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      number: '03',
      icon: CheckCircle,
      title: 'Get Feedback',
      description: 'Receive detailed, actionable feedback with suggestions for improvements and best practices.',
      color: 'from-pink-500 to-pink-600',
    },
    {
      number: '04',
      icon: Rocket,
      title: 'Ship with Confidence',
      description: 'Merge your code knowing it meets quality standards and is ready for production.',
      color: 'from-green-500 to-green-600',
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 bg-dark-900 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge variant="primary" className="mb-4">How It Works</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get Started in <GradientText>4 Simple Steps</GradientText>
          </h2>
          <p className="text-xl text-dark-300 max-w-3xl mx-auto">
            Integrate seamlessly with your existing workflow. No complex setup required.
          </p>
        </div>

        {/* Steps */}
        <div className="steps-container max-w-4xl mx-auto relative">
          {/* Connecting Line */}
          <div className="connecting-line absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-purple-500 to-green-500 transform -translate-x-1/2 hidden md:block"
            style={{ transformOrigin: 'top' }} />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`step-card flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`inline-block mb-4 ${index % 2 === 0 ? 'md:float-right md:ml-4' : 'md:float-left md:mr-4'}`}>
                    <span className={`text-6xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent opacity-50`}>
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-dark-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300`}>
                    <step.icon size={36} className="text-white" strokeWidth={2} />
                  </div>
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} blur-xl opacity-50 -z-10`} />
                </div>

                {/* Spacer for alignment */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-block bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8 max-w-2xl hover:border-primary-500/30 transition-colors duration-300">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to transform your code review process?
            </h3>
            <p className="text-dark-300 mb-6">
              Join thousands of teams already shipping better code with AI-powered reviews.
            </p>
            <button className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
              Start Free Trial
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
