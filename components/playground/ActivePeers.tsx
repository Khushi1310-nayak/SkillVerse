import React from 'react';
import { PairSessionParticipant } from '../../types';

// Same AVATARS mapping used across LessonDiscussion, Leaderboard, Layout, etc.
const AVATARS: Record<string, string> = {
  '1': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  '2': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
  '3': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
  '4': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
  '5': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
};

// Mirrors the getAvatar pattern from LessonDiscussion.tsx and CourseReview.tsx.
// PairSessionParticipant has no avatarId, so fall back directly to AVATARS['1'].
const getAvatar = (participant: PairSessionParticipant): string => {
  if (participant.photoURL) return participant.photoURL;
  return AVATARS['1'];
};

interface ActivePeersProps {
  participants: PairSessionParticipant[];
  currentUserId: string;
}

export const ActivePeers: React.FC<ActivePeersProps> = ({
  participants,
  currentUserId,
}) => {
  if (participants.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider select-none">
        In session:
      </span>
      <div className="flex items-center -space-x-2">
        {participants.map((participant) => {
          const isCurrentUser = participant.userId === currentUserId;
          return (
            <div
              key={participant.userId}
              className="relative group"
              title={`${participant.username}${isCurrentUser ? ' (you)' : ''}`}
            >
              <img
                src={getAvatar(participant)}
                alt={participant.username}
                className={`w-7 h-7 rounded-full border-2 object-cover bg-[#1e1e1e] transition-transform group-hover:scale-110 group-hover:z-10 relative ${
                  isCurrentUser
                    ? 'border-primaryLight'
                    : 'border-black/30 dark:border-white/20'
                }`}
              />
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-lg bg-[#0f1623] border border-white/10 text-[10px] font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-20">
                {participant.username}
                {isCurrentUser && (
                  <span className="ml-1 text-primaryLight">(you)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Participant count badge when more than one */}
      {participants.length > 1 && (
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 select-none">
          {participants.length} online
        </span>
      )}
    </div>
  );
};
