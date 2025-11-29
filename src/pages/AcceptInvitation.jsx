import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const AcceptInvitation = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading: authLoading } = useAuth();

    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verifying invitation...');

    useEffect(() => {
        // Wait for auth to load
        if (authLoading) return;

        // If not logged in, redirect to sign in, but save the return url
        if (!user) {
            // Store the current path to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            navigate('/signin?message=Please sign in to accept the invitation');
            return;
        }

        const acceptInvite = async () => {
            try {
                const { data, error } = await supabase.rpc('accept_team_invitation', {
                    token_str: token
                });

                if (error) throw error;

                if (data.success) {
                    setStatus('success');
                    setMessage('Invitation accepted successfully!');

                    // Redirect to dashboard after 2 seconds
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 2000);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Failed to accept invitation');
                }
            } catch (err) {
                console.error('Error accepting invitation:', err);
                setStatus('error');
                setMessage(err.message || 'An unexpected error occurred');
            }
        };

        acceptInvite();
    }, [token, user, authLoading, navigate, location]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-500" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 bg-dark-900 border-dark-700 text-center">
                {status === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin text-primary-500 mb-4" size={48} />
                        <h2 className="text-xl font-semibold text-white mb-2">Verifying Invitation</h2>
                        <p className="text-dark-400">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="text-green-500" size={32} />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">Welcome to the Team!</h2>
                        <p className="text-dark-400 mb-6">{message}</p>
                        <p className="text-sm text-dark-500">Redirecting to dashboard...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                            <XCircle className="text-red-500" size={32} />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">Invitation Failed</h2>
                        <p className="text-red-400 mb-6">{message}</p>
                        <Button onClick={() => navigate('/dashboard')} variant="outline" className="gap-2">
                            Go to Dashboard <ArrowRight size={16} />
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AcceptInvitation;
