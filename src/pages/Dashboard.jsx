import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { LogOut, User, Code, GitPullRequest, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Mock stats for now
  const stats = [
    { label: 'Total Reviews', value: '0', icon: Code, color: 'text-blue-500' },
    { label: 'Pull Requests', value: '0', icon: GitPullRequest, color: 'text-purple-500' },
    { label: 'Completed', value: '0', icon: CheckCircle, color: 'text-green-500' },
    { label: 'Pending', value: '0', icon: Clock, color: 'text-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-dark-950 py-24">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-dark-400">Welcome back, {user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut size={20} className="mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-dark-800 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center">
              <User size={32} className="text-primary-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white">
                {user?.user_metadata?.name || user?.user_metadata?.full_name || 'User'}
              </h2>
              <p className="text-dark-400">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/settings')}>
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card hover className="p-6 cursor-pointer group">
              <Code size={32} className="text-primary-500 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                New Code Review
              </h3>
              <p className="text-dark-400 text-sm">
                Start a new AI-powered code review
              </p>
            </Card>
            <Card hover className="p-6 cursor-pointer group">
              <GitPullRequest size={32} className="text-purple-500 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                Connect Repository
              </h3>
              <p className="text-dark-400 text-sm">
                Link your GitHub or GitLab repository
              </p>
            </Card>
            <Card hover className="p-6 cursor-pointer group">
              <User size={32} className="text-green-500 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                Team Settings
              </h3>
              <p className="text-dark-400 text-sm">
                Manage your team and permissions
              </p>
            </Card>
          </div>
        </div>

        {/* Getting Started */}
        <Card className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 border-primary-500/20">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Getting Started</h2>
            <p className="text-dark-300 mb-4">
              Welcome to Code Quality! Here's how to get started with AI-powered code reviews.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">Connect your repository</p>
                  <p className="text-dark-400 text-sm">Link your GitHub or GitLab account</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">Configure review settings</p>
                  <p className="text-dark-400 text-sm">Set up your code review preferences</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="text-white font-medium">Start reviewing</p>
                  <p className="text-dark-400 text-sm">Get instant AI feedback on your code</p>
                </div>
              </div>
            </div>
            <Button variant="primary" className="mt-6">
              Start Setup
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Dashboard;
