import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { Mail, Plus, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const InviteMemberDialog = ({ team, open, onOpenChange, onInviteSent }) => {
    const [emails, setEmails] = useState(['']);
    const [loading, setLoading] = useState(false);

    const handleAddEmail = () => {
        setEmails([...emails, '']);
    };

    const handleRemoveEmail = (index) => {
        const newEmails = [...emails];
        newEmails.splice(index, 1);
        setEmails(newEmails);
    };

    const handleEmailChange = (index, value) => {
        const newEmails = [...emails];
        newEmails[index] = value;
        setEmails(newEmails);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const validEmails = emails.filter(e => e.trim() !== '');
            if (validEmails.length === 0) return;

            const { data: { session } } = await supabase.auth.getSession();
            const { data: { user } } = await supabase.auth.getUser();

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
                console.error('Edge Function Error:', result);
                throw new Error(result.error || result.message || 'Failed to send invitations');
            }

            // Check for individual email failures
            const failures = result.results.filter(r => !r.success);
            if (failures.length > 0) {
                const errorMsg = failures.map(f => `${f.email}: ${f.error}`).join('\n');
                alert(`Some invitations failed:\n${errorMsg}`);
            } else {
                alert(`Invitations sent successfully to ${validEmails.length} recipient(s)!`);
            }

            // Notify parent to refresh members regardless of partial success
            if (onInviteSent) {
                onInviteSent();
            }

            onOpenChange(false);
            setEmails(['']);

        } catch (error) {
            console.error('Error sending invitations:', error);
            alert(`Failed to send invitations: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-dark-900 border-dark-700">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Invite Team Members</DialogTitle>
                    <DialogDescription className="text-dark-400">
                        Add email addresses to invite new members to <strong>{team?.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {emails.map((email, index) => (
                            <div key={index} className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                                    <input
                                        type="email"
                                        placeholder="colleague@company.com"
                                        value={email}
                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                        className="w-full bg-dark-800 border border-dark-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                                        required={index === 0}
                                    />
                                </div>
                                {emails.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveEmail(index)}
                                        className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleAddEmail}
                        className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
                    >
                        <Plus size={16} /> Add another email
                    </button>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={18} />
                                    Sending...
                                </>
                            ) : (
                                'Send Invitations'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default InviteMemberDialog;
