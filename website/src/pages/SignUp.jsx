import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Container from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import PricingStrip from '../components/sections/PricingStrip';
import { Mail, Lock, User, AlertCircle, CheckCircle, Github } from 'lucide-react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithOAuth } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      console.log('Starting signup process...', { email: formData.email });

      const { data, error: signUpError } = await signUp(
        formData.email,
        formData.password,
        {
          name: formData.name,
          full_name: formData.name,
          username: formData.username,
          email: formData.email
        }
      );

      console.log('Signup response:', { data, error: signUpError });

      if (signUpError) {
        const errorMessage = typeof signUpError === 'object'
          ? signUpError.message || JSON.stringify(signUpError)
          : signUpError;
        console.error('Signup error:', errorMessage);
        setError(errorMessage);
        setLoading(false);
      } else {
        console.log('Signup successful!', data);

        // Check if email confirmation is required
        if (data?.user && !data?.session) {
          console.log('Email confirmation required - but emails may not be working');
          console.log('User created with ID:', data.user.id);

          // Show a message that account is created but they should try signing in
          setSuccess(true);
          setConfirmationRequired(true);
          setLoading(false);

          // Auto-redirect to sign in after 5 seconds
          setTimeout(() => {
            console.log('Redirecting to sign in...');
            navigate('/signin');
          }, 5000);
        } else if (data?.session) {
          // User is automatically signed in (email confirmation disabled)
          console.log('User automatically signed in - email confirmation is disabled');
          setSuccess(true);
          setConfirmationRequired(false);
          setLoading(false);
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          // Fallback - just show success
          setSuccess(true);
          setConfirmationRequired(false);
          setLoading(false);
        }
      }
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
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

  const [confirmationRequired, setConfirmationRequired] = useState(false);

  if (success) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center py-12 px-4">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="bg-dark-900/50 backdrop-blur-sm border border-dark-800 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {confirmationRequired ? 'Account Created!' : 'Welcome to Code Quality!'}
              </h2>
              <p className="text-dark-400 mb-4">
                {confirmationRequired
                  ? `Your account has been created successfully! We've attempted to send a confirmation email to ${formData.email}.`
                  : 'Your account has been created successfully.'
                }
              </p>
              {confirmationRequired ? (
                <>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                    <p className="text-yellow-400 text-sm mb-2">
                      <strong>Note:</strong> Email delivery may be experiencing issues.
                    </p>
                    <p className="text-dark-400 text-sm">
                      If you don't receive the confirmation email, please contact support or try signing in directly - your account may already be active.
                    </p>
                  </div>
                  <p className="text-dark-500 text-sm mb-4">
                    Redirecting to sign in page in 5 seconds...
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/signin')}
                    className="w-full"
                  >
                    Go to Sign In Now
                  </Button>
                </>
              ) : (
                <p className="text-dark-500 text-sm">
                  Redirecting to dashboard...
                </p>
              )}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center pt-24 pb-16 px-4">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-dark-400">Start your free trial today</p>
          </div>

          <div className="bg-dark-900/50 backdrop-blur-sm border border-dark-800 rounded-2xl p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{typeof error === 'object' ? error.message || JSON.stringify(error) : error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-dark-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-dark-950 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Username Input */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-dark-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-dark-950 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="yourname"
                  />
                </div>
                <p className="mt-1 text-xs text-dark-500">Usernames are unique and can be used for your profile URL later.</p>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-dark-950 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-dark-950 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-1 text-xs text-dark-500">Must be at least 6 characters</p>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-dark-950 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-dark-900 text-dark-400">Or continue with</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
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

            {/* Sign In Link */}
            <p className="mt-6 text-center text-dark-400 text-sm">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SignUp;
