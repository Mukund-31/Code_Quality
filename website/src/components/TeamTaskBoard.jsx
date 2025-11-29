import { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { supabase } from '../lib/supabase';
import { Plus, MoreVertical, User, Calendar, AlertCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const TeamTaskBoard = ({ teamId, isOwner, currentUserId }) => {
    const [tasks, setTasks] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium',
        status: 'todo'
    });

    useEffect(() => {
        if (teamId) {
            fetchTasksAndMembers();
        }
    }, [teamId]);

    const fetchTasksAndMembers = async () => {
        try {
            setLoading(true);
            console.log('Fetching tasks and members for team:', teamId);

            // Fetch team info to get owner
            const { data: teamData, error: teamError } = await supabase
                .from('teams')
                .select('*')
                .eq('id', teamId)
                .single();

            if (teamError) {
                console.error('Error fetching team:', teamError);
            } else {
                console.log('Team data:', teamData);
            }

            // Fetch owner profile separately
            let ownerProfile = null;
            if (teamData?.owner_id) {
                const { data: ownerData } = await supabase
                    .from('profiles')
                    .select('id, name, email')
                    .eq('id', teamData.owner_id)
                    .single();
                ownerProfile = ownerData;
                console.log('Owner profile:', ownerProfile);
            }

            // Fetch team members
            const { data: membersData, error: membersError } = await supabase
                .from('team_members')
                .select('*')
                .eq('team_id', teamId)
                .eq('status', 'accepted');

            if (membersError) {
                console.error('Error fetching members:', membersError);
            }

            console.log('Fetched team members from DB:', membersData);
            console.log('Team members count:', membersData?.length || 0);

            // Fetch profiles for all members
            let membersWithProfiles = [];
            if (membersData && membersData.length > 0) {
                const userIds = membersData.map(m => m.user_id);
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, name, email')
                    .in('id', userIds);

                console.log('Fetched profiles:', profilesData);

                // Combine members with their profiles
                membersWithProfiles = membersData.map(member => ({
                    ...member,
                    profiles: profilesData?.find(p => p.id === member.user_id)
                }));
            }

            // Combine owner and members
            let allMembers = [...membersWithProfiles];

            // Add owner if not already in members list
            if (ownerProfile) {
                const ownerInMembers = allMembers.some(m => m.user_id === teamData.owner_id);
                if (!ownerInMembers) {
                    console.log('Adding owner to members list:', ownerProfile);
                    allMembers.unshift({
                        user_id: teamData.owner_id,
                        email: ownerProfile.email,
                        profiles: ownerProfile,
                        role: 'owner',
                        status: 'accepted'
                    });
                }
            }

            console.log('Final members list (with owner):', allMembers);
            setTeamMembers(allMembers);

            // Fetch tasks (without joins for now)
            const { data: tasksData, error: tasksError } = await supabase
                .from('team_tasks')
                .select('*')
                .eq('team_id', teamId)
                .order('created_at', { ascending: false });

            if (tasksError) {
                console.error('Error fetching tasks:', tasksError);
            } else {
                console.log('Fetched tasks:', tasksData?.length || 0);

                // Fetch assignee and creator profiles for tasks
                if (tasksData && tasksData.length > 0) {
                    const userIds = new Set();
                    tasksData.forEach(task => {
                        if (task.assigned_to) userIds.add(task.assigned_to);
                        if (task.created_by) userIds.add(task.created_by);
                    });

                    if (userIds.size > 0) {
                        const { data: taskProfilesData } = await supabase
                            .from('profiles')
                            .select('id, name, email')
                            .in('id', Array.from(userIds));

                        // Add profiles to tasks
                        const tasksWithProfiles = tasksData.map(task => ({
                            ...task,
                            assignee: taskProfilesData?.find(p => p.id === task.assigned_to),
                            creator: taskProfilesData?.find(p => p.id === task.created_by)
                        }));

                        setTasks(tasksWithProfiles);
                        return;
                    }
                }
            }

            setTasks(tasksData || []);
        } catch (error) {
            console.error('Error in fetchTasksAndMembers:', error);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async () => {
        if (!newTask.title.trim()) {
            alert('Please enter a task title');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('team_tasks')
                .insert([{
                    team_id: teamId,
                    title: newTask.title,
                    description: newTask.description,
                    assigned_to: newTask.assigned_to || null,
                    priority: newTask.priority,
                    status: newTask.status,
                    created_by: currentUserId
                }])
                .select()
                .single();

            if (error) throw error;

            // Fetch profiles for assignee and creator
            const userIds = [];
            if (data.assigned_to) userIds.push(data.assigned_to);
            if (data.created_by) userIds.push(data.created_by);

            let taskWithProfiles = { ...data };
            if (userIds.length > 0) {
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, name, email')
                    .in('id', userIds);

                taskWithProfiles.assignee = profilesData?.find(p => p.id === data.assigned_to);
                taskWithProfiles.creator = profilesData?.find(p => p.id === data.created_by);
            }

            setTasks([taskWithProfiles, ...tasks]);
            setNewTask({
                title: '',
                description: '',
                assigned_to: '',
                priority: 'medium',
                status: 'todo'
            });
            setShowCreateTask(false);
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task. Please try again.');
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            const { error } = await supabase
                .from('team_tasks')
                .update({ status: newStatus })
                .eq('id', taskId);

            if (error) throw error;

            setTasks(tasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            ));
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task status.');
        }
    };

    const deleteTask = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            const { error } = await supabase
                .from('team_tasks')
                .delete()
                .eq('id', taskId);

            if (error) throw error;

            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task.');
        }
    };

    const columns = [
        { id: 'todo', title: 'To Do', icon: Clock, color: 'text-gray-400', bgColor: 'bg-gray-500/10' },
        { id: 'in_progress', title: 'In Progress', icon: ArrowRight, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
        { id: 'review', title: 'Review', icon: AlertCircle, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
        { id: 'done', title: 'Done', icon: CheckCircle2, color: 'text-green-400', bgColor: 'bg-green-500/10' }
    ];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'medium':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'low':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white">Task Board</h3>
                    <p className="text-dark-400 mt-1">
                        {tasks.length} task{tasks.length !== 1 ? 's' : ''} • {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
                    </p>
                </div>
                {isOwner && (
                    <Button onClick={() => setShowCreateTask(!showCreateTask)} className="flex items-center gap-2">
                        <Plus size={20} />
                        Create Task
                    </Button>
                )}
            </div>

            {/* Create Task Form */}
            {showCreateTask && (
                <Card className="p-6 bg-dark-800/50 backdrop-blur-sm border-dark-700">
                    <h4 className="text-lg font-semibold text-white mb-4">Create New Task</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-dark-300 text-sm mb-2">Title *</label>
                            <input
                                type="text"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                placeholder="Enter task title"
                                className="w-full px-4 py-2 bg-dark-900/50 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-2">Description</label>
                            <textarea
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                placeholder="Enter task description"
                                rows={3}
                                className="w-full px-4 py-2 bg-dark-900/50 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-dark-300 text-sm mb-2">Assign To</label>
                                <select
                                    value={newTask.assigned_to}
                                    onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                                    className="w-full px-4 py-2 bg-dark-900/50 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                                >
                                    <option value="">Unassigned</option>
                                    {teamMembers.map((member) => (
                                        <option key={member.user_id} value={member.user_id}>
                                            {member.profiles?.name || member.profiles?.email || member.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-dark-300 text-sm mb-2">Priority</label>
                                <select
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    className="w-full px-4 py-2 bg-dark-900/50 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-dark-300 text-sm mb-2">Status</label>
                                <select
                                    value={newTask.status}
                                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                    className="w-full px-4 py-2 bg-dark-900/50 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                                >
                                    {columns.map((col) => (
                                        <option key={col.id} value={col.id}>{col.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setShowCreateTask(false)}>
                                Cancel
                            </Button>
                            <Button onClick={createTask}>
                                Create Task
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {columns.map((column) => {
                    const columnTasks = tasks.filter(task => task.status === column.id);
                    return (
                        <div key={column.id} className="flex flex-col">
                            <div className={`p-4 rounded-t-lg ${column.bgColor} border-b-2 border-dark-700`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <column.icon className={column.color} size={20} />
                                        <h4 className="font-semibold text-white">{column.title}</h4>
                                    </div>
                                    <span className="text-dark-400 text-sm">{columnTasks.length}</span>
                                </div>
                            </div>
                            <div className="flex-1 bg-dark-800/30 rounded-b-lg p-3 space-y-3 min-h-[400px]">
                                {columnTasks.map((task) => (
                                    <Card
                                        key={task.id}
                                        className="p-4 bg-dark-800/80 backdrop-blur-sm border-dark-700 hover:border-primary-500/50 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h5 className="text-white font-medium flex-1 pr-2">{task.title}</h5>
                                            {isOwner && (
                                                <div className="relative group/menu">
                                                    <button className="p-1 hover:bg-dark-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreVertical size={16} className="text-dark-400" />
                                                    </button>
                                                    <div className="absolute right-0 top-8 bg-dark-800 border border-dark-700 rounded-lg shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 min-w-[120px]">
                                                        <button
                                                            onClick={() => deleteTask(task.id)}
                                                            className="w-full px-4 py-2 text-left text-red-400 hover:bg-dark-700 rounded-lg text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {task.description && (
                                            <p className="text-dark-300 text-sm mb-3 line-clamp-2">{task.description}</p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                            {task.assignee && (
                                                <div className="flex items-center gap-1 text-dark-400 text-xs">
                                                    <User size={12} />
                                                    <span>{task.assignee.name || task.assignee.email?.split('@')[0]}</span>
                                                </div>
                                            )}
                                        </div>
                                        {task.due_date && (
                                            <div className="flex items-center gap-1 text-dark-400 text-xs mt-2">
                                                <Calendar size={12} />
                                                <span>{format(new Date(task.due_date), 'MMM dd')}</span>
                                            </div>
                                        )}
                                        {/* Status Change Buttons */}
                                        <div className="mt-3 pt-3 border-t border-dark-700 flex gap-2">
                                            {column.id !== 'todo' && (
                                                <button
                                                    onClick={() => {
                                                        const currentIndex = columns.findIndex(c => c.id === column.id);
                                                        if (currentIndex > 0) {
                                                            updateTaskStatus(task.id, columns[currentIndex - 1].id);
                                                        }
                                                    }}
                                                    className="flex-1 px-2 py-1 text-xs bg-dark-700 hover:bg-dark-600 text-dark-300 rounded transition-colors"
                                                >
                                                    ← Move Back
                                                </button>
                                            )}
                                            {column.id !== 'done' && (
                                                <button
                                                    onClick={() => {
                                                        const currentIndex = columns.findIndex(c => c.id === column.id);
                                                        if (currentIndex < columns.length - 1) {
                                                            updateTaskStatus(task.id, columns[currentIndex + 1].id);
                                                        }
                                                    }}
                                                    className="flex-1 px-2 py-1 text-xs bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded transition-colors"
                                                >
                                                    Move Forward →
                                                </button>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                                {columnTasks.length === 0 && (
                                    <div className="flex items-center justify-center h-32 text-dark-500 text-sm">
                                        No tasks
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamTaskBoard;
