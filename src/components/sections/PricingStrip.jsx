import Card from '../ui/Card';
import Button from '../ui/Button';

const plans = [
  {
    name: 'Free',
    price: '$0',
    blurb: 'Get started with AI summaries',
    cta: 'Sign up free',
    features: [
      'Up to 10 PRs/month',
      'Basic analysis',
      'Community support',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    price: '$24',
    blurb: 'Comprehensive reviews & insights',
    sub: '/month per dev',
    cta: 'Start free trial',
    features: [
      'Unlimited PR reviews',
      'Advanced AI checks',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Elite',
    price: '$49',
    blurb: 'For growing teams that need more',
    sub: '/month per dev',
    cta: 'Get started',
    features: [
      'Everything in Pro',
      'Team features',
      'SLA support',
    ],
    popular: false,
  },
];

export default function PricingStrip({ onCTAClick }) {
  return (
    <div className="mt-12">
      <h3 className="text-center text-white text-xl font-semibold mb-4">Choose a plan</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.name} className={`p-6 relative ${plan.popular ? 'border-primary-500/40' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold">
                Recommended
              </div>
            )}
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <h4 className="text-white text-lg font-bold">{plan.name}</h4>
              </div>
              <div className="text-3xl font-extrabold text-white mt-2">{plan.price} {plan.sub && <span className="text-sm text-dark-400 font-normal">{plan.sub}</span>}</div>
              <p className="text-dark-400 text-sm mt-1">{plan.blurb}</p>
            </div>
            <Button
              variant={plan.popular ? 'primary' : 'outline'}
              className="w-full mb-4"
              onClick={onCTAClick}
            >
              {plan.cta}
            </Button>
            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="text-sm text-dark-300">• {f}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
