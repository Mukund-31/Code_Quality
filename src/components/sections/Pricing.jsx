import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import Container from '../ui/Container';
import Card from '../ui/Card';
import Button from '../ui/Button';
import GradientText from '../ui/GradientText';
import Badge from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'forever',
      description: 'Perfect for individual developers',
      features: [
        { text: '5 PRs per month', included: true },
        { text: 'Basic code analysis', included: true },
        { text: 'Public repositories', included: true },
        { text: 'Community support', included: true },
        { text: 'Email support', included: false },
        { text: 'Private repositories', included: false },
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '1,199',
      period: 'month',
      description: 'For professional developers',
      features: [
        { text: 'Unlimited PRs', included: true },
        { text: 'Advanced code analysis', included: true },
        { text: 'Private repositories', included: true },
        { text: 'Priority support', included: true },
        { text: 'Team collaboration', included: true },
        { text: 'Custom rules (5)', included: true },
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Elite',
      price: '3,999',
      period: 'month',
      description: 'For growing teams',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Unlimited team members', included: true },
        { text: 'Advanced security', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'SLA guarantee', included: true },
      ],
      cta: 'Get Elite',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-dark-950">
      <Container className="relative z-10">
        <div className="text-center mb-16">
          <Badge variant="primary" className="mb-4">Pricing</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, <GradientText>Transparent Pricing</GradientText>
          </h2>
          <p className="text-lg text-dark-300 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All paid plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative ${plan.popular ? 'md:mt-[-1rem]' : ''}`}>
              <Card 
                className={`h-full flex flex-col ${
                  plan.popular 
                    ? 'border-2 border-primary-500 shadow-lg shadow-primary-500/20' 
                    : 'border border-dark-700 hover:border-dark-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="primary" className="shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="flex-1 p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-dark-400 text-sm mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center gap-2 mb-6">
                      <span className="text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                        ₹{plan.price}
                      </span>
                      <span className="text-dark-400">
                        {plan.period === 'forever' ? 'forever' : '/month'}
                      </span>
                    </div>

                    <Button
                      variant={plan.popular ? 'primary' : 'outline'}
                      className="w-full mb-6"
                      onClick={() => navigate(user ? '/dashboard' : '/signup')}
                    >
                      {plan.cta}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X size={18} className="text-dark-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-dark-200' : 'text-dark-600'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-dark-400">
            Have questions?{' '}
            <a href="#" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Check our FAQ
            </a>{' '}
            or{' '}
            <a href="#" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              contact us
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}