import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        // Wait for auth to finish loading
        if (loading) return;

        // If user is authenticated, redirect to dashboard
        if (user) {
            console.log('OAuth callback: User authenticated, redirecting to dashboard');
            navigate('/dashboard', { replace: true });
        } else {
            // If not authenticated, redirect to sign in
            console.log('OAuth callback: No user found, redirecting to sign in');
            navigate('/signin', { replace: true });
        }
    }, [user, loading, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-dark-400">Completing sign in...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
