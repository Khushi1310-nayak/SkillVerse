import React, { useEffect, useState } from 'react';
import { firestoreService } from '../services/firestoreService';
import { ThumbsUp, Award, BookOpen, Flame, Users, Sparkles, Clock, AlertTriangle } from 'lucide-react';

export interface ActivityFeedItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'badge' | 'course' | 'streak';
  details: string;
  kudosCount: number;
  kudosUsers: string[];
  createdAt?: any;
}

interface ActivityFeedWidgetProps {
  currentUserId?: string;
  followingIds?: string[];
}

export const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ currentUserId, followingIds = [] }) => {
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [kudosLoadingId, setKudosLoadingId] = useState<string | null>(null);

  // The effect depends on the *contents* of followingIds, not its identity. The
  // Dashboard used to pass `user.following || []`, a fresh array on every
  // render, which re-ran this effect and called setActivities([]) each time —
  // a new array, so React never bailed out and the render loop kept spinning.
  const followingKey = followingIds.join(',');

  useEffect(() => {
    let isMounted = true;
    const ids = followingKey ? followingKey.split(',') : [];

    const fetchFeed = async () => {
      if (ids.length === 0) {
        setActivities([]);
        setLoadFailed(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadFailed(false);
      try {
        const data = await firestoreService.getFriendActivityFeed(ids);
        if (isMounted) {
          setActivities(data as ActivityFeedItem[]);
        }
      } catch (err) {
        // "Nothing happened today" and "we could not read the feed" looked
        // identical before — both rendered the empty state.
        console.error('Error fetching activity feed:', err);
        if (isMounted) {
          setActivities([]);
          setLoadFailed(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeed();
    return () => { isMounted = false; };
  }, [followingKey]);

  const handleSendKudos = async (activityId: string) => {
    if (!currentUserId || kudosLoadingId) return;
    setKudosLoadingId(activityId);
    try {
      await firestoreService.sendKudos(activityId, currentUserId);
      setActivities(prev =>
        prev.map(act => {
          if (act.id === activityId) {
            const hasKudos = act.kudosUsers?.includes(currentUserId);
            return {
              ...act,
              kudosCount: hasKudos ? act.kudosCount : (act.kudosCount || 0) + 1,
              kudosUsers: hasKudos ? act.kudosUsers : [...(act.kudosUsers || []), currentUserId]
            };
          }
          return act;
        })
      );
    } catch (err) {
      console.error('Error sending kudos:', err);
    } finally {
      setKudosLoadingId(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'badge': return <Award className="text-amber-400" size={16} />;
      case 'course': return <BookOpen className="text-primaryLight" size={16} />;
      case 'streak': return <Flame className="text-orange-400" size={16} />;
      default: return <Sparkles className="text-emerald-400" size={16} />;
    }
  };

  return (
    <div className="bg-glass border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/20 border border-primary/30 text-primaryLight">
            <Users size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Peer Activity Feed</h2>
            <p className="text-xs text-textMuted">See achievements and progress from people you follow</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-textMuted">
          {followingIds.length} Following
        </span>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-primaryLight border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-textMuted">Loading activity updates...</p>
        </div>
      ) : followingIds.length === 0 ? (
        <div className="py-10 text-center bg-[#0f1623]/60 rounded-2xl border border-white/5 p-6">
          <Users size={36} className="mx-auto text-textMuted mb-3 opacity-40" />
          <h3 className="text-sm font-bold text-white mb-1">Not following anyone yet</h3>
          <p className="text-xs text-textMuted max-w-sm mx-auto mb-4">
            Follow top learners on the Leaderboard to see their learning streaks, badges, and completed courses in your live feed!
          </p>
        </div>
      ) : loadFailed ? (
        <div className="py-10 text-center bg-[#0f1623]/60 rounded-2xl border border-white/5 p-6">
          <AlertTriangle size={36} className="mx-auto text-orange-400 mb-3 opacity-70" />
          <h3 className="text-sm font-bold text-white mb-1">Couldn't load the feed</h3>
          <p className="text-xs text-textMuted">
            We couldn't reach the activity feed just now. Check your connection and try again.
          </p>
        </div>
      ) : activities.length === 0 ? (
        <div className="py-10 text-center bg-[#0f1623]/60 rounded-2xl border border-white/5 p-6">
          <Clock size={36} className="mx-auto text-textMuted mb-3 opacity-40" />
          <h3 className="text-sm font-bold text-white mb-1">No recent activity</h3>
          <p className="text-xs text-textMuted">
            The peers you follow haven't posted any recent updates today.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((act) => {
            const hasGivenKudos = currentUserId && act.kudosUsers?.includes(currentUserId);
            return (
              <div
                key={act.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#0f1623]/80 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={act.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                    alt={act.userName}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 bg-white/5"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-white text-sm">{act.userName}</span>
                      <span className="p-1 rounded-lg bg-white/5 border border-white/10">
                        {getTypeIcon(act.type)}
                      </span>
                    </div>
                    <p className="text-xs text-textMuted">{act.details}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleSendKudos(act.id)}
                  disabled={!currentUserId || !!hasGivenKudos || kudosLoadingId === act.id}
                  aria-label={hasGivenKudos
                    ? `You gave kudos to ${act.userName}`
                    : `Give kudos to ${act.userName}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    hasGivenKudos
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-white/5 text-textMuted hover:text-white hover:bg-white/10 border-white/10'
                  }`}
                >
                  <ThumbsUp size={13} className={hasGivenKudos ? 'fill-emerald-400' : ''} />
                  <span>{act.kudosCount || 0}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
