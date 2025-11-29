import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from './ui/Dialog';
import { User, Mail, Shield, Clock, CheckCircle, XCircle, Trash2, UserPlus } from 'lucide-react';
import { Button } from './ui/Button';
import InviteMemberDialog from './InviteMemberDialog';

const TeamDetailsDialog = ({ team, members, owner, open, onOpenChange, onDeleteTeam, onInviteSent }) => {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showInviteDialog, setShowInviteDialog] = useState(false);

    if (!team) return null;

    const isOwner = owner?.id === team.owner_id;

    // Filter out the owner from the members list to avoid duplication
    const displayMembers = members.filter(m => m.user_id !== team.owner_id && m.email !== owner?.email);

    const handleDeleteClick = () => {
        setShowConfirmDelete(true);
    };

    const handleConfirmDelete = () => {
        onDeleteTeam(team.id);
        onOpenChange(false);
        setShowConfirmDelete(false);
    };

    const handleCancelDelete = () => {
        setShowConfirmDelete(false);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={(val) => {
                onOpenChange(val);
                if (!val) setShowConfirmDelete(false); // Reset on close
            }}>
                <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-dark-900 border-dark-700">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-2xl font-bold text-white">{team.name}</DialogTitle>
                            {isOwner && (
                                <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/20">
                                    You are Owner
                                </span>
                            )}
                        </div>
                        <DialogDescription className="text-dark-400 mt-2">
                            {team.description || 'No description provided.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 space-y-6">
                        {/* Manager Section */}
                        <div className="bg-dark-800/50 rounded-lg p-4 border border-dark-700">
                            <h3 className="text-sm font-medium text-dark-300 mb-3 uppercase tracking-wider">Team Manager</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                    <Shield size={18} className="text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">{owner?.name || 'Unknown'}</p>
                                    <p className="text-sm text-dark-400">{owner?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Members Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider">
                                    Team Members ({displayMembers.length})
                                </h3>
                                {isOwner && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 gap-2 text-primary-400 border-primary-500/20 hover:bg-primary-500/10"
                                        onClick={() => setShowInviteDialog(true)}
                                    >
                                        <UserPlus size={14} />
                                        Invite Member
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-3">
                                {displayMembers.length === 0 ? (
                                    <p className="text-dark-500 text-center py-4 italic">No other members yet.</p>
                                ) : (
                                    displayMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between p-3 rounded-lg bg-dark-800/30 border border-dark-700/50 hover:border-dark-600 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center flex-shrink-0">
                                                    <User size={14} className="text-dark-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-white text-sm font-medium truncate">
                                                        {member.email}
                                                    </p>
                                                    <div className="flex items-center GAP-2">
                                                        <span className="text-xs text-dark-400 capitalize">{member.role}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {member.status === 'accepted' ? (
                                                    <span className="flex items-center gap-1 text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20">
                                                        <CheckCircle size={10} /> Accepted
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-full border border-yellow-500/20">
                                                        <Clock size={10} /> Pending
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        {isOwner ? (
                            showConfirmDelete ? (
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="destructive"
                                        onClick={handleConfirmDelete}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        Confirm Delete
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={handleCancelDelete}
                                        className="text-dark-300 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteClick}
                                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete Team
                                </Button>
                            )
                        ) : (
                            <div></div> // Spacer
                        )}
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <InviteMemberDialog
                team={team}
                open={showInviteDialog}
                onOpenChange={setShowInviteDialog}
                onInviteSent={onInviteSent}
            />
        </>
    );
};

export default TeamDetailsDialog;
