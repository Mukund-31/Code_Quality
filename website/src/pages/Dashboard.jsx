import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Container from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LogOut, User, Code, GitPullRequest, CheckCircle, Clock, Sparkles, Zap, TrendingUp, Users as UsersIcon, BarChart3, ListTodo } from 'lucide-react';
import PaymentButton from '../components/PaymentButton';
import CreateTeamDialog from '../components/CreateTeamDialog';
import TeamDetailsDialog from '../components/TeamDetailsDialog';
import PaymentDialog from '../components/PaymentDialog';
import PersonalReviewDashboard from '../components/PersonalReviewDashboard';
import TeamTaskBoard from '../components/TeamTaskBoard';
import { supabase } from '../lib/supabase';
import gsap from 'gsap';

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  console.log('Dashboard rendered. User:', user, 'Loading:', authLoading);
  const navigate = useNavigate();
  const location = useLocation();

  // Refs for animations
  const headerRef = useRef(null);
  const statsRef = useRef([]);
  const userCardRef = useRef(null);
  const actionsRef = useRef([]);
  const gettingStartedRef = useRef(null);
  const containerRef = useRef(null);

  // Dashboard tab state
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'team'
  const [selectedTeamForBoard, setSelectedTeamForBoard] = useState(null);

  // Team state
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamOwners, setTeamOwners] = useState({}); // Map of owner_id -> profile
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null); // For details dialog
  const [userPlan, setUserPlan] = useState('free'); // Default to free

  // Payment state
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Check for payment intent from navigation
  useEffect(() => {
    console.log('Dashboard Location State:', location.state);
    if (location.state?.paymentIntent) {
      setPaymentDetails(location.state.paymentIntent);
      setShowPaymentDialog(true);
      // Clear state so it doesn't reopen on refresh (optional, but good UX)
      // window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Fetch teams, members, and user plan
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
      return;
    }
    if (!user) return;

    const fetchData = async () => {
      try {
        // 1. Fetch User Plan
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();

        if (!profileError && profileData) {
          setUserPlan(profileData.plan || 'free');
        }

        // 2. Fetch teams where user is owner OR member (handled by RLS)
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('*')
          .order('created_at', { ascending: false });

        if (teamsError) throw teamsError;

        setTeams(teamsData || []);

        if (teamsData && teamsData.length > 0) {
          // 3. Fetch team members
          const teamIds = teamsData.map(t => t.id);
          const { data: membersData, error: membersError } = await supabase
            .from('team_members')
            .select('*')
            .in('team_id', teamIds)
            .order('created_at', { ascending: false });

          if (!membersError) {
            setTeamMembers(membersData || []);
          }

          // 4. Fetch team owners details
          const ownerIds = [...new Set(teamsData.map(t => t.owner_id))];
          const { data: ownersData, error: ownersError } = await supabase
            .from('profiles')
            .select('id, name, email')
            .in('id', ownerIds);

          if (!ownersError && ownersData) {
            const ownersMap = ownersData.reduce((acc, owner) => {
              acc[owner.id] = owner;
              return acc;
            }, {});
            setTeamOwners(ownersMap);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchData();
  }, [user]);

  // Handle team creation
  const handleTeamCreated = (newTeam) => {
    setTeams([newTeam, ...teams]);
    // Also add current user as owner/member locally
    const newMember = {
      id: crypto.randomUUID(), // temp id
      team_id: newTeam.id,
      user_id: user.id,
      email: user.email,
      role: 'owner',
      status: 'accepted',
      created_at: new Date().toISOString()
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  // Handle team deletion
  const handleDeleteTeam = async (teamId) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;

      // Update local state
      setTeams(teams.filter(t => t.id !== teamId));
      setTeamMembers(teamMembers.filter(m => m.team_id !== teamId));
      setSelectedTeam(null); // Close dialog if open
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Failed to delete team. Please try again.');
    }
  };

  // useEffect(() => {
  //   if (!authLoading && !user) {
  //     navigate('/signin');
  //   }
  // }, [user, authLoading, navigate]);

  useEffect(() => {
    if (authLoading) return;

    // Small delay to ensure refs are set
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Create timeline for entrance animations
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Animate header
        if (headerRef.current) {
          tl.fromTo(headerRef.current,
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4 }
          );
        }

        // Animate stats cards with stagger
        const statsCards = statsRef.current.filter(Boolean);
        if (statsCards.length > 0) {
          tl.fromTo(statsCards,
            { y: 50, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.3, stagger: 0.08 },
            '-=0.2'
          );
        }

        // Animate user card
        if (userCardRef.current) {
          tl.fromTo(userCardRef.current,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3 },
            '-=0.2'
          );
        }

        // Animate action cards
        const actionCards = actionsRef.current.filter(Boolean);
        if (actionCards.length > 0) {
          tl.fromTo(actionCards,
            { y: 30, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.3, stagger: 0.08 },
            '-=0.2'
          );
        }

        // Animate getting started card
        if (gettingStartedRef.current) {
          tl.fromTo(gettingStartedRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4 },
            '-=0.15'
          );
        }

        // Floating animation for background elements
        const orbs = document.querySelectorAll('.floating-orb');
        if (orbs.length > 0) {
          gsap.to(orbs, {
            y: -20,
            duration: 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            stagger: 0.5,
          });
        }

        // Pulse animation for stat icons
        const icons = document.querySelectorAll('.stat-icon');
        if (icons.length > 0) {
          gsap.to(icons, {
            scale: 1.1,
            duration: 2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            stagger: 0.3,
          });
        }

      }, containerRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, [authLoading]);

  // Hover animations for action cards
  const handleActionHover = (index, isEntering) => {
    const card = actionsRef.current[index];
    if (!card) return;

    if (isEntering) {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 0 0 rgba(139, 92, 246, 0)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

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

  // Mock user for UI development if not logged in
  const currentUser = user || {
    email: 'demo@example.com',
    user_metadata: {
      name: 'Demo User'
    }
  };

  // Mock stats for now
  const stats = [
    { label: 'Total Reviews', value: '0', icon: Code, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Pull Requests', value: '0', icon: GitPullRequest, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { label: 'Completed', value: '0', icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { label: 'Pending', value: '0', icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-dark-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb absolute top-20 left-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="floating-orb absolute top-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="floating-orb absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <Container className="pt-32 pb-16 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-primary-200 to-purple-200 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <Sparkles className="text-primary-400 animate-pulse" size={24} />
            </div>
            <p className="text-dark-400 text-lg">Welcome back, {currentUser?.user_metadata?.username || currentUser?.user_metadata?.name || currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'User'}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="hover:scale-105 transition-transform">
            <LogOut size={20} className="mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6 border-b border-dark-700">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-3 font-semibold transition-all relative ${activeTab === 'personal'
                ? 'text-primary-400'
                : 'text-dark-400 hover:text-dark-200'
                }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 size={20} />
                <span>Personal Reviews</span>
              </div>
              {activeTab === 'personal' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-6 py-3 font-semibold transition-all relative ${activeTab === 'team'
                ? 'text-primary-400'
                : 'text-dark-400 hover:text-dark-200'
                }`}
            >
              <div className="flex items-center gap-2">
                <ListTodo size={20} />
                <span>Team Tasks</span>
              </div>
              {activeTab === 'team' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'personal' ? (
            <PersonalReviewDashboard userId={user?.id} />
          ) : (
            <div className="space-y-6">
              {/* Team Selection */}
              {teams.length === 0 ? (
                <Card className="p-8 text-center bg-dark-800/50 backdrop-blur-sm border-dark-700">
                  <UsersIcon size={48} className="text-dark-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No teams yet</h3>
                  <p className="text-dark-400 mb-4">
                    {userPlan === 'elite'
                      ? 'Create your first team to start collaborating'
                      : 'Upgrade to Elite plan to create teams or wait for an invitation'}
                  </p>
                  {userPlan === 'elite' && (
                    <CreateTeamDialog onTeamCreated={handleTeamCreated} />
                  )}
                </Card>
              ) : (
                <>
                  {!selectedTeamForBoard ? (
                    <Card className="p-6 bg-dark-800/50 backdrop-blur-sm border-dark-700">
                      <h3 className="text-xl font-semibold text-white mb-4">Select a Team</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teams.map((team) => {
                          const isOwner = team.owner_id === user?.id;
                          const members = teamMembers.filter(m => m.team_id === team.id);
                          return (
                            <Card
                              key={team.id}
                              onClick={() => setSelectedTeamForBoard(team)}
                              className="p-4 bg-dark-900/50 border-dark-700 hover:border-primary-500/50 transition-all cursor-pointer group"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-white font-medium group-hover:text-primary-400 transition-colors">
                                  {team.name}
                                </h4>
                                {isOwner && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                    Owner
                                  </span>
                                )}
                              </div>
                              <p className="text-dark-400 text-sm">{members.length} members</p>
                            </Card>
                          );
                        })}
                      </div>
                    </Card>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-white">{selectedTeamForBoard.name}</h3>
                          <p className="text-dark-400 mt-1">{selectedTeamForBoard.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedTeamForBoard(null)}
                        >
                          Change Team
                        </Button>
                      </div>
                      <TeamTaskBoard
                        teamId={selectedTeamForBoard.id}
                        isOwner={selectedTeamForBoard.owner_id === user?.id}
                        currentUserId={user?.id}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions - Moved below tabs
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400" size={24} />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              ref={el => actionsRef.current[0] = el}
              onMouseEnter={() => handleActionHover(0, true)}
              onMouseLeave={() => handleActionHover(0, false)}
              className="p-6 cursor-pointer bg-dark-800/50 backdrop-blur-sm border-dark-700 transition-all duration-300"
            >
              <div className="p-3 rounded-lg bg-blue-500/10 w-fit mb-3">
                <Code size={32} className="text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                New Code Review
              </h3>
              <p className="text-dark-400 text-sm">
                Start a new AI-powered code review
              </p>
            </Card>

            <Card
              ref={el => actionsRef.current[1] = el}
              onMouseEnter={() => handleActionHover(1, true)}
              onMouseLeave={() => handleActionHover(1, false)}
              className="p-6 cursor-pointer bg-dark-800/50 backdrop-blur-sm border-dark-700 transition-all duration-300"
            >
              <div className="p-3 rounded-lg bg-purple-500/10 w-fit mb-3">
                <GitPullRequest size={32} className="text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Connect Repository
              </h3>
              <p className="text-dark-400 text-sm">
                Link your GitHub or GitLab repository
              </p>
            </Card>

            <Card
              ref={el => actionsRef.current[2] = el}
              onMouseEnter={() => handleActionHover(2, true)}
              onMouseLeave={() => handleActionHover(2, false)}
              className="p-6 cursor-pointer bg-dark-800/50 backdrop-blur-sm border-dark-700 transition-all duration-300"
            >
              <div className="p-3 rounded-lg bg-green-500/10 w-fit mb-3">
                <User size={32} className="text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Team Settings
              </h3>
              <p className="text-dark-400 text-sm">
                Manage your team and permissions
              </p>
            </Card>

            <Card
              ref={el => actionsRef.current[3] = el}
              onMouseEnter={() => handleActionHover(3, true)}
              onMouseLeave={() => handleActionHover(3, false)}
              className="p-6 cursor-pointer bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border-yellow-500/20 transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="p-3 rounded-lg bg-yellow-500/10 w-fit mb-3">
                    <Sparkles size={32} className="text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Upgrade to Pro
                  </h3>
                  <p className="text-dark-400 text-sm mb-4">
                    Unlock advanced features and unlimited reviews.
                  </p>
                </div>
                <PaymentButton />
              </div>
            </Card>
          </div>
        </div> */}

        {/* Teams Section - Only for Pro and Elite */}
        {userPlan !== 'free' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <UsersIcon className="text-blue-400" size={24} />
                Your Teams
              </h2>
              {userPlan === 'elite' && (
                <CreateTeamDialog onTeamCreated={handleTeamCreated} />
              )}
            </div>

            {loadingTeams ? (
              <Card className="p-8 text-center bg-dark-800/50 backdrop-blur-sm border-dark-700">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-dark-400">Loading teams...</p>
              </Card>
            ) : teams.length === 0 ? (
              <Card className="p-8 text-center bg-dark-800/50 backdrop-blur-sm border-dark-700">
                <UsersIcon size={48} className="text-dark-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No teams yet</h3>
                <p className="text-dark-400 mb-4">
                  {userPlan === 'elite'
                    ? 'Create your first team to start collaborating'
                    : 'You haven\'t been invited to any teams yet'}
                </p>
                {userPlan === 'elite' && (
                  <CreateTeamDialog onTeamCreated={handleTeamCreated} />
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map((team) => {
                  // Filter members to exclude the owner
                  const members = teamMembers.filter(m => m.team_id === team.id && m.user_id !== team.owner_id);
                  const acceptedCount = members.filter(m => m.status === 'accepted').length;
                  const pendingCount = members.filter(m => m.status === 'pending').length;
                  const isOwner = team.owner_id === user.id;
                  const owner = teamOwners[team.owner_id];

                  return (
                    <Card
                      key={team.id}
                      onClick={() => setSelectedTeam(team)}
                      className="p-6 bg-dark-800/50 backdrop-blur-sm border-dark-700 hover:border-primary-500/30 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">{team.name}</h3>
                            {!isOwner && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                Member
                              </span>
                            )}
                            {isOwner && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                Owner
                              </span>
                            )}
                          </div>

                          {team.description && (
                            <p className="text-dark-400 text-sm mb-2 line-clamp-2">{team.description}</p>
                          )}

                          {!isOwner && owner && (
                            <p className="text-xs text-dark-500 flex items-center gap-1">
                              <User size={12} />
                              Managed by <span className="text-dark-300">{owner.name || owner.email}</span>
                            </p>
                          )}
                        </div>
                        <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                          <UsersIcon size={20} className="text-blue-400" />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-dark-300">{acceptedCount + 1} members</span>
                        </div>
                        {pendingCount > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span className="text-dark-300">{pendingCount} pending</span>
                          </div>
                        )}
                      </div>

                      {members.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-dark-700">
                          <p className="text-xs text-dark-500 mb-2">Recent Members</p>
                          <div className="space-y-2">
                            {members.slice(0, 3).map((member) => (
                              <div key={member.id} className="flex items-center justify-between text-sm">
                                <span className="text-dark-300 truncate">{member.email}</span>
                                <span className={`text-xs px-2 py-1 rounded ${member.status === 'accepted'
                                  ? 'bg-green-500/10 text-green-400'
                                  : 'bg-yellow-500/10 text-yellow-400'
                                  }`}>
                                  {member.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Team Details Dialog */}
            <TeamDetailsDialog
              team={selectedTeam}
              members={selectedTeam ? teamMembers.filter(m => m.team_id === selectedTeam.id) : []}
              owner={selectedTeam ? teamOwners[selectedTeam.owner_id] : null}
              open={!!selectedTeam}
              onOpenChange={(open) => !open && setSelectedTeam(null)}
              onDeleteTeam={handleDeleteTeam}
              onInviteSent={async () => {
                // Refresh members list
                if (selectedTeam) {
                  const { data: membersData, error: membersError } = await supabase
                    .from('team_members')
                    .select('*')
                    .eq('team_id', selectedTeam.id)
                    .order('created_at', { ascending: false });

                  if (!membersError && membersData) {
                    // Update local state by merging new members
                    const otherMembers = teamMembers.filter(m => m.team_id !== selectedTeam.id);
                    setTeamMembers([...otherMembers, ...membersData]);
                  }
                }
              }}
            />
          </div>
        )}

        {/* Getting Started */}
        <Card
          ref={gettingStartedRef}
          className="bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 border-primary-500/30 backdrop-blur-sm relative overflow-hidden"
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>

          <div className="p-6 relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <CheckCircle className="text-primary-400" size={28} />
              Getting Started
            </h2>
            <p className="text-dark-300 mb-4">
              Welcome to Code Quality! Here's how to get started with AI-powered code reviews.
            </p>
            <div className="space-y-3">
              {[
                { title: 'Connect your repository', desc: 'Link your GitHub or GitLab account' },
                { title: 'Configure review settings', desc: 'Set up your code review preferences' },
                { title: 'Start reviewing', desc: 'Get instant AI feedback on your code' }
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{step.title}</p>
                    <p className="text-dark-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="primary" className="mt-6 hover:scale-105 transition-transform">
              Start Setup
            </Button>
          </div>
        </Card>
      </Container>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

