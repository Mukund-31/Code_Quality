import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Mail, Lock, AlertCircle, Github } from 'lucide-react';
import gsap from 'gsap';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithOAuth, user } = useAuth();
  const navigate = useNavigate();

  // Refs for animation targets
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const submitBtnRef = useRef(null);
  const dividerRef = useRef(null);
  const oauthRef = useRef(null);
  const signupLinkRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for entrance animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Animate heading
      tl.from(headingRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
      });

      // Animate subtitle
      tl.from(subtitleRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.6,
      }, '-=0.5');

      // Animate form container
      tl.from(formRef.current, {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
      }, '-=0.4');

      // Animate form inputs in sequence
      tl.from([emailInputRef.current, passwordInputRef.current], {
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
      }, '-=0.4');

      // Animate submit button
      tl.from(submitBtnRef.current, {
        y: 10,
        opacity: 0,
        duration: 0.5,
      }, '-=0.2');

      // Animate divider
      tl.from(dividerRef.current, {
        scaleX: 0,
        opacity: 0,
        duration: 0.6,
      }, '-=0.2');

      // Animate OAuth buttons
      tl.from(oauthRef.current.children, {
        y: 10,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
      }, '-=0.3');

      // Animate signup link
      tl.from(signupLinkRef.current, {
        opacity: 0,
        duration: 0.5,
      }, '-=0.2');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Input focus animations
  const handleInputFocus = (e) => {
    gsap.to(e.target, {
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    });
    gsap.to(e.target.parentElement, {
      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
      duration: 0.3,
    });
  };

  const handleInputBlur = (e) => {
    gsap.to(e.target, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
    gsap.to(e.target.parentElement, {
      boxShadow: '0 0 0 0px rgba(139, 92, 246, 0)',
      duration: 0.3,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Button click animation
    gsap.to(submitBtnRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });

    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError);
      setLoading(false);

      // Shake animation on error
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: 'power2.inOut',
      });
    } else {
      // Success animation
      gsap.to(formRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => navigate('/dashboard'),
      });
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setError('');
    setLoading(true);
    const { error: oauthError } = await signInWithOAuth(provider);
    if (oauthError) {
      setError(oauthError);
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-dark-950 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 ref={headingRef} className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p ref={subtitleRef} className="text-dark-400 text-base">
                Sign in to your account to continue
              </p>
            </div>

            <div
              ref={formRef}
              className="bg-dark-900/50 backdrop-blur-sm border border-dark-800 rounded-2xl p-8"
            >
              {error && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{typeof error === 'object' ? error.message : error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div ref={emailInputRef} className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative rounded-lg transition-shadow duration-300">
                    <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none z-10" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-dark-950 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div ref={passwordInputRef} className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                    Password
                  </label>
                  <div className="relative rounded-lg transition-shadow duration-300">
                    <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none z-10" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-dark-950 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right -mt-1 mb-1">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  ref={submitBtnRef}
                  type="submit"
                  variant="primary"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Divider */}
              <div ref={dividerRef} className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-dark-900 text-dark-400">Or continue with</span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div ref={oauthRef} className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthSignIn('github')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Github size={20} />
                  GitHub
                </Button>
              </div>

              {/* Sign Up Link */}
              <p ref={signupLinkRef} className="mt-6 text-center text-dark-400 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;