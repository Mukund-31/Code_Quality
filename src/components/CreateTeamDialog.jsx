import { useState } from 'react';
import { Plus, X, Mail, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/Dialog';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const CreateTeamDialog = ({ onTeamCreated }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [description, setDescription] = useState('');
    const [emails, setEmails] = useState(['']);
    const [error, setError] = useState('');
    const { user } = useAuth();

    const addEmailField = () => {
        setEmails([...emails, '']);
    };

    const removeEmailField = (index) => {
        const newEmails = emails.filter((_, i) => i !== index);
        setEmails(newEmails.length > 0 ? newEmails : ['']);
    };

    const updateEmail = (index, value) => {
        const newEmails = [...emails];
        newEmails[index] = value;
        setEmails(newEmails);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate
            if (!teamName.trim()) {
                throw new Error('Team name is required');
            }

            // Filter out empty emails
            const validEmails = emails.filter(email => email.trim() !== '');

            // Validate emails
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const invalidEmails = validEmails.filter(email => !emailRegex.test(email));
            if (invalidEmails.length > 0) {
                throw new Error(`Invalid email(s): ${invalidEmails.join(', ')}`);
            }

            // Create team
            const { data: team, error: teamError } = await supabase
                .from('teams')
                .insert({
                    name: teamName.trim(),
                    description: description.trim(),
                    owner_id: user.id,
                })
                .select()
                .single();

            if (teamError) throw teamError;

            // Send invitations if there are emails
            if (validEmails.length > 0) {
                const { data: { session } } = await supabase.auth.getSession();

                const response = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-team-invitation`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${session.access_token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            teamId: team.id,
                            teamName: team.name,
                            emails: validEmails,
                            inviterName: user.user_metadata?.name || user.email,
                        }),
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    console.error('Failed to send invitations:', result);
                    // Don't throw here, just warn, since team was created
                } else if (result.results) {
                    // Check for individual failures
                    const failures = result.results.filter(r => !r.success);
                    if (failures.length > 0) {
                        alert(`Team created, but some invitations failed to send:\n${failures.map(f => `${f.email}: ${f.error}`).join('\n')}`);
                    }
                }
            }

            // Reset form
            setTeamName('');
            setDescription('');
            setEmails(['']);
            setOpen(false);

            // Notify parent
            if (onTeamCreated) {
                onTeamCreated(team);
            }

        } catch (err) {
            console.error('Error creating team:', err);
            setError(err.message || 'Failed to create team');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="primary" className="gap-2">
                    <Plus size={20} />
                    Create Team
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                    <DialogDescription>
                        Create a team and invite members to collaborate on code reviews.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Team Name */}
                    <div className="space-y-2">
                        <label htmlFor="teamName" className="block text-sm font-medium text-white">
                            Team Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="teamName"
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="e.g., Frontend Team"
                            required
                            className="w-full px-4 py-2.5 bg-dark-950 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-white">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this team for?"
                            rows={3}
                            className="w-full px-4 py-2.5 bg-dark-950 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Invite Members */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                            Invite Members (Optional)
                        </label>
                        <p className="text-xs text-dark-400 mb-3">
                            Enter email addresses to send invitations
                        </p>

                        <div className="space-y-2">
                            {emails.map((email, index) => (
                                <div key={index} className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => updateEmail(index, e.target.value)}
                                            placeholder="member@example.com"
                                            className="w-full pl-10 pr-4 py-2.5 bg-dark-950 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    {emails.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeEmailField(index)}
                                            className="flex-shrink-0"
                                        >
                                            <X size={16} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addEmailField}
                            className="mt-2 gap-2"
                        >
                            <Plus size={16} />
                            Add Another Email
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={loading} className="gap-2">
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {loading ? 'Creating...' : 'Create Team'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTeamDialog;
