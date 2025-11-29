import { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { supabase } from '../lib/supabase';
import { Code, GitPullRequest, FileText, Calendar, Clock, Sparkles, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const PersonalReviewDashboard = ({ userId }) => {
    const [sessions, setSessions] = useState([]);
    const [reviewEvents, setReviewEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState(null);
    const [expandedSummaries, setExpandedSummaries] = useState(new Set()); // Track which summaries are expanded
    const [aiQuery, setAiQuery] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [askingAI, setAskingAI] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchReviewData();
        }
    }, [userId]);

    const fetchReviewData = async () => {
        try {
            setLoading(true);

            // Fetch work sessions
            const { data: sessionsData, error: sessionsError } = await supabase
                .from('work_sessions')
                .select('*')
                .eq('user_id', userId)
                .order('session_date', { ascending: false })
                .limit(30);

            if (sessionsError) {
                console.error('Error fetching sessions:', sessionsError);
                throw sessionsError;
            }

            console.log('Fetched sessions:', sessionsData?.length || 0);
            setSessions(sessionsData || []);

            // Fetch all review events for these sessions
            if (sessionsData && sessionsData.length > 0) {
                const sessionIds = sessionsData.map(s => s.id);
                const { data: eventsData, error: eventsError } = await supabase
                    .from('review_events')
                    .select('*')
                    .in('session_id', sessionIds)
                    .order('created_at', { ascending: false });

                if (eventsError) {
                    console.error('Error fetching events:', eventsError);
                    throw eventsError;
                }

                console.log('Fetched review events:', eventsData?.length || 0);
                console.log('Sample event:', eventsData?.[0]);
                setReviewEvents(eventsData || []);
            }
        } catch (error) {
            console.error('Error fetching review data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getEventIcon = (eventType) => {
        switch (eventType) {
            case 'local_review':
            case 'reviewLocalFolder':
            case 'reviewLocalFile':
                return <Code className="text-blue-400" size={20} />;
            case 'github_review':
            case 'pr_review':
            case 'reviewGitHubRepo':
            case 'reviewGitHubPR':
                return <GitPullRequest className="text-purple-400" size={20} />;
            case 'review':
                return <FileText className="text-green-400" size={20} />;
            default:
                return <FileText className="text-gray-400" size={20} />;
        }
    };

    const toggleSummary = (eventId, e) => {
        e.stopPropagation(); // Prevent session collapse when clicking summary
        setExpandedSummaries(prev => {
            const newSet = new Set(prev);
            if (newSet.has(eventId)) {
                newSet.delete(eventId);
            } else {
                newSet.add(eventId);
            }
            return newSet;
        });
    };

    const isSummaryExpanded = (eventId) => expandedSummaries.has(eventId);

    const formatReviewDataForAI = () => {
        // Format all review data for AI analysis
        const formattedData = {
            totalSessions: sessions.length,
            totalReviews: reviewEvents.length,
            sessions: sessions.map(session => ({
                date: session.session_date,
                startedAt: session.started_at,
                endedAt: session.ended_at,
                events: reviewEvents
                    .filter(e => e.session_id === session.id)
                    .map(event => ({
                        type: event.event_type,
                        timestamp: event.created_at,
                        payload: event.payload,
                        summary: event.result_summary
                    }))
            })),
            recentEvents: reviewEvents.slice(0, 20).map(event => ({
                type: event.event_type,
                timestamp: event.created_at,
                payload: event.payload,
                summary: event.result_summary
            }))
        };

        return JSON.stringify(formattedData, null, 2);
    };

    const askAI = async () => {
        if (!aiQuery.trim()) return;

        setAskingAI(true);
        setAiResponse(''); // Clear previous response

        try {
            // Check if there's any data to analyze
            if (reviewEvents.length === 0) {
                setAiResponse('No review data available yet. Start reviewing code to see analytics!');
                setAskingAI(false);
                return;
            }

            const reviewData = formatReviewDataForAI();
            console.log('Sending AI query with data length:', reviewData.length);

            const response = await fetch('https://sarvi.hi-codequality.workers.dev/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gemini-2.5-flash',
                    messages: [
                        {
                            role: 'user',
                            content: `You are a code review analytics assistant. Here is the user's review data:\n\n${reviewData}\n\nUser Question: ${aiQuery}\n\nProvide a helpful, concise answer based on the data.`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                setAiResponse(`Error: Unable to process your question. API returned status ${response.status}. Please try again.`);
                return;
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data.success && data.message && data.message.content) {
                setAiResponse(data.message.content);
            } else if (data.data && data.data.candidates && data.data.candidates[0]) {
                // Handle Google Gemini format
                const content = data.data.candidates[0].content?.parts?.[0]?.text;
                if (content) {
                    setAiResponse(content);
                } else {
                    setAiResponse('Sorry, I could not process your question. The response format was unexpected.');
                }
            } else {
                console.error('Unexpected response format:', data);
                setAiResponse('Sorry, I could not process your question. Please try again or rephrase your question.');
            }
        } catch (error) {
            console.error('Error asking AI:', error);
            setAiResponse(`An error occurred: ${error.message}. Please check your internet connection and try again.`);
        } finally {
            setAskingAI(false);
        }
    };

    if (loading) {
        return (
            <Card className="p-8 bg-dark-800/50 backdrop-blur-sm border-dark-700">
                <div className="flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </Card>
        );
    }

    const stats = [
        {
            label: 'Total Sessions',
            value: sessions.length,
            icon: Calendar,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10'
        },
        {
            label: 'Total Reviews',
            value: reviewEvents.length,
            icon: Code,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10'
        },
        {
            label: 'Local Reviews',
            value: reviewEvents.filter(e =>
                e.event_type === 'local_review' ||
                e.event_type === 'reviewLocalFolder' ||
                e.event_type === 'reviewLocalFile'
            ).length,
            icon: FileText,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10'
        },
        {
            label: 'GitHub Reviews',
            value: reviewEvents.filter(e =>
                e.event_type === 'github_review' ||
                e.event_type === 'pr_review' ||
                e.event_type === 'reviewGitHubRepo' ||
                e.event_type === 'reviewGitHubPR'
            ).length,
            icon: GitPullRequest,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className="p-6 bg-dark-800/50 backdrop-blur-sm border-dark-700 hover:border-primary-500/50 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-dark-400 text-sm mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* AI Query Section */}
            <Card className="p-6 bg-gradient-to-br from-primary-500/10 to-purple-500/10 border-primary-500/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-primary-400" size={24} />
                    <h3 className="text-xl font-semibold text-white">Ask AI About Your Reviews</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && askAI()}
                            placeholder="e.g., What are my most common code issues?"
                            className="flex-1 px-4 py-3 bg-dark-800/50 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
                        />
                        <Button
                            onClick={askAI}
                            disabled={askingAI || !aiQuery.trim()}
                            className="px-6"
                        >
                            {askingAI ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <MessageSquare size={20} />
                            )}
                        </Button>
                    </div>
                    {aiResponse && (
                        <div className="p-4 bg-dark-800/50 rounded-lg border border-dark-600">
                            <p className="text-white whitespace-pre-wrap">{aiResponse}</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Recent Sessions */}
            <Card className="p-6 bg-dark-800/50 backdrop-blur-sm border-dark-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="text-primary-400" size={24} />
                    Recent Review Sessions
                </h3>
                {sessions.length === 0 ? (
                    <div className="text-center py-8">
                        <Code size={48} className="text-dark-600 mx-auto mb-4" />
                        <p className="text-dark-400">No review sessions yet. Start reviewing code to see your activity here!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sessions.slice(0, 10).map((session) => {
                            const sessionEvents = reviewEvents.filter(e => e.session_id === session.id);
                            const isExpanded = selectedSession?.id === session.id;

                            return (
                                <div
                                    key={session.id}
                                    onClick={() => setSelectedSession(isExpanded ? null : session)}
                                    className={`p-4 bg-dark-900/50 rounded-lg border transition-all cursor-pointer ${isExpanded
                                        ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                                        : 'border-dark-700 hover:border-primary-500/50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="text-primary-400" size={20} />
                                            <div>
                                                <p className="text-white font-medium">
                                                    {format(new Date(session.session_date), 'MMMM dd, yyyy')}
                                                </p>
                                                <p className="text-dark-400 text-sm">
                                                    {sessionEvents.length} review{sessionEvents.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-dark-400 text-sm">
                                                {format(new Date(session.started_at), 'h:mm a')}
                                            </div>
                                            <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Session Details */}
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t border-dark-700 space-y-3">

                                            {sessionEvents.length === 0 ? (
                                                <div className="text-center py-4 text-dark-500">
                                                    <p className="text-sm">No review events found for this session</p>
                                                </div>
                                            ) : (
                                                sessionEvents.map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className="p-3 bg-dark-800/50 rounded-lg border border-dark-600"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="p-2 rounded-lg bg-dark-700">
                                                                {getEventIcon(event.event_type)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <p className="text-white font-medium capitalize">
                                                                        {event.event_type.replace('_', ' ')}
                                                                    </p>
                                                                    <p className="text-dark-400 text-xs">
                                                                        {format(new Date(event.created_at), 'h:mm a')}
                                                                    </p>
                                                                </div>
                                                                {event.payload && (
                                                                    <div className="text-dark-300 text-sm mb-2 space-y-1">
                                                                        {event.payload.repo && (
                                                                            <p className="truncate">📦 {event.payload.repo}</p>
                                                                        )}
                                                                        {event.payload.branch && (
                                                                            <p className="truncate">🌿 {event.payload.branch}</p>
                                                                        )}
                                                                        {event.payload.model && (
                                                                            <p className="truncate">🤖 {event.payload.model}</p>
                                                                        )}
                                                                        {event.payload.fileName && (
                                                                            <p className="truncate">📄 {event.payload.fileName}</p>
                                                                        )}
                                                                        {event.payload.folderPath && (
                                                                            <p className="truncate">📁 {event.payload.folderPath}</p>
                                                                        )}
                                                                        {event.payload.prUrl && (
                                                                            <p className="truncate">🔗 {event.payload.prUrl}</p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {/* Review Summary Section */}
                                                                {event.result_summary && event.result_summary.trim() ? (
                                                                    <div className="mt-2">
                                                                        <button
                                                                            onClick={(e) => toggleSummary(event.id, e)}
                                                                            className="text-primary-400 text-sm cursor-pointer hover:text-primary-300 flex items-center gap-2 w-full text-left"
                                                                        >
                                                                            <svg
                                                                                className={`w-4 h-4 transition-transform ${isSummaryExpanded(event.id) ? 'rotate-90' : ''}`}
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                            </svg>
                                                                            <span>View Review Summary</span>
                                                                            <span className="text-xs text-dark-500">({event.result_summary.length} chars)</span>
                                                                        </button>
                                                                        {isSummaryExpanded(event.id) && (
                                                                            <div className="mt-2 p-3 bg-dark-900/50 rounded text-dark-200 text-sm max-h-64 overflow-y-auto border border-dark-600">
                                                                                <pre className="whitespace-pre-wrap font-mono text-xs">
                                                                                    {event.result_summary}
                                                                                </pre>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="mt-2 text-dark-500 text-xs italic">
                                                                        No review summary available for this event
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default PersonalReviewDashboard;
