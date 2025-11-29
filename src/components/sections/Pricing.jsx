import React, { useRef, useState, useEffect } from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState(null);

  React.useEffect(() => {
    // Simple fade-in animations
    const title = titleRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (title) {
      title.style.opacity = '0';
      title.style.transform = 'translateY(30px)';

      setTimeout(() => {
        title.style.transition = 'all 0.8s ease-out';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
      }, 100);
    }

    cards.forEach((card, index) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';

        setTimeout(() => {
          card.style.transition = 'all 0.8s ease-out';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 300 + index * 150);
      }
    });
  }, []);

  // Fetch user plan
  useEffect(() => {
    if (!user) {
      setUserPlan(null);
      return;
    }

    const fetchPlan = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setUserPlan(data.plan || 'free');
      }
    };

    fetchPlan();
  }, [user]);

  const plans = [
    {
      id: 'free',
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
      id: 'pro',
      name: 'Pro',
      price: '599',
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
      id: 'elite',
      name: 'Elite',
      price: '1299',
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

  // Load Cashfree SDK
  useEffect(() => {
    const loadSdk = async () => {
      if (!document.getElementById('cashfree-js')) {
        const script = document.createElement('script');
        script.id = 'cashfree-js';
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.onload = () => {
          console.log('Cashfree SDK loaded');
        };
        document.body.appendChild(script);
      }
    };
    loadSdk();
  }, []);

  const getPlanPrice = (planId) => {
    switch (planId) {
      case 'pro': return 599;
      case 'elite': return 1299;
      default: return 0;
    }
  };

  const handlePlanClick = (targetPlanId) => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const planPrices = {
      free: 0,
      pro: 599,
      elite: 1299
    };

    const currentPrice = planPrices[userPlan] || 0;
    const targetPrice = planPrices[targetPlanId] || 0;

    // Don't allow "upgrading" to free or same plan
    if (targetPlanId === 'free' || targetPlanId === userPlan) return;

    // Calculate amount to pay
    let amountToPay = targetPrice;

    // If upgrading from Pro to Elite, pay the difference
    if (userPlan === 'pro' && targetPlanId === 'elite') {
      amountToPay = targetPrice - currentPrice;
    }

    console.log('Pricing Debug:', { userPlan, targetPlanId, currentPrice, targetPrice, amountToPay });

    if (!amountToPay || isNaN(amountToPay) || amountToPay <= 0) {
      console.error('Invalid amount calculated:', amountToPay);
      alert('Error calculating price. Please try again.');
      return;
    }

    // If downgrading (Elite -> Pro), handle differently
    if (targetPrice < currentPrice) {
      alert('Please contact support to downgrade your plan.');
      return;
    }

    // Navigate to dashboard with payment intent
    navigate('/dashboard', {
      state: {
        paymentIntent: {
          plan: targetPlanId,
          amount: amountToPay,
          isUpgrade: currentPrice > 0
        }
      }
    });
  };


  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Pricing</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple,{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All paid plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isCurrentPlan = userPlan === plan.id;

            return (
              <div
                key={plan.name}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`relative bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl ${plan.popular
                  ? 'border-blue-500/50 shadow-blue-500/10 scale-105 z-10'
                  : 'border-slate-800 hover:border-slate-700'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Sparkles size={14} />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 mb-6">{plan.description}</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                    <span className="text-slate-500 ml-2">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="text-green-400 shrink-0 mt-1" size={18} />
                      ) : (
                        <X className="text-slate-600 shrink-0 mt-1" size={18} />
                      )}
                      <span className={feature.included ? 'text-slate-300' : 'text-slate-600'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => !isCurrentPlan && handlePlanClick(plan.id)}
                  disabled={isCurrentPlan}
                  className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${isCurrentPlan
                    ? 'bg-green-500/20 text-green-400 cursor-default border border-green-500/30'
                    : plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                >
                  {isCurrentPlan ? (
                    <>
                      <Check size={18} />
                      Current Plan
                    </>
                  ) : (
                    `Get ${plan.name}`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-slate-400">
            Have questions?{' '}
            <a href="/faq" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Check our FAQ
            </a>{' '}
            or{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              contact us
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section >
  );
}