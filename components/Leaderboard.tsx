import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, TrendingUp, Calendar, Clock, Award, UserPlus, UserCheck } from 'lucide-react';
import { db } from '../firebase/firebase';
import { XP_STORE_FRAMES } from '../constants';
import { PublicProfileModal } from './PublicProfileModal';
import { firestoreService } from '../services/firestoreService';

interface LeaderboardUser {
  id: string;
  username: string;
  photoURL?: string;
  xp: number;
  weeklyXP: number;
  monthlyXP: number;
  level: number;
  avatarId?: string;
  activeFrame?: string;
}

interface LeaderboardProps {
  currentUserId?: string;
  currentUsername?: string;
  followingIds?: string[];
  onFollowChange?: (targetUserId: string, isNowFollowing: boolean) => void;
}

const AVATARS: Record<string, string> = {
  '1': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  '2': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  '3': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  '4': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  '5': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
};

const EMPTY_FOLLOWING_IDS: string[] = [];

export const Leaderboard: React.FC<LeaderboardProps> = ({
  currentUserId,
  currentUsername,
  followingIds = EMPTY_FOLLOWING_IDS,
  onFollowChange
}) => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRankIndex, setSelectedRankIndex] = useState<number | undefined>(undefined);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const map: Record<string, boolean> = {};
    followingIds.forEach(id => {
      map[id] = true;
    });
    setFollowingMap(map);
  }, [followingIds]);

  useEffect(() => {
    setLoading(true);

    // Determine which field to order by based on selected timeframe
    let orderField = 'weeklyXP';
    if (timeframe === 'month') orderField = 'monthlyXP';
    if (timeframe === 'all') orderField = 'xp';

    // Fetch a larger batch than we actually display — some of these may have
    // opted out of the leaderboard, and Firestore can't combine an inequality
    // filter on a nested field with an orderBy on a different field, so the
    // opt-out is applied client-side before trimming to the top 10.
    const q = query(
      collection(db, 'users'),
      orderBy(orderField, 'desc'),
      limit(25)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const topUsers: LeaderboardUser[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.preferences?.settings?.hideFromLeaderboard) return;

        topUsers.push({
          id: doc.id,
          username: data.username || 'Anonymous',
          photoURL: data.photoURL,
          xp: data.xp || 0,
          weeklyXP: data.weeklyXP || 0,
          monthlyXP: data.monthlyXP || 0,
          level: data.level || 1,
          avatarId: data.preferences?.settings?.avatarId,
          activeFrame: data.preferences?.settings?.activeFrame || 'none'
        });
      });
      setUsers(topUsers.slice(0, 10));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [timeframe]);

  const handleFollowToggle = async (e: React.MouseEvent, targetUserId: string) => {
    e.stopPropagation(); // Prevent opening public profile modal
    if (!currentUserId || currentUserId === targetUserId || actionLoadingId) return;

    const isCurrentlyFollowing = !!followingMap[targetUserId];
    setActionLoadingId(targetUserId);

    try {
      await firestoreService.toggleFollowUser(currentUserId, targetUserId, isCurrentlyFollowing, currentUsername);
      setFollowingMap(prev => ({
        ...prev,
        [targetUserId]: !isCurrentlyFollowing
      }));
      if (onFollowChange) {
        onFollowChange(targetUserId, !isCurrentlyFollowing);
      }
    } catch (error) {
      console.error("Error toggling follow state:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getDisplayXP = (user: LeaderboardUser): number => {
    if (timeframe === 'week') return user.weeklyXP;
    if (timeframe === 'month') return user.monthlyXP;
    return user.xp;
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-400" size={24} />;
      case 1:
        return <Medal className="text-gray-300" size={24} />;
      case 2:
        return <Medal className="text-amber-600" size={24} />;
      default:
        return <span className="font-bold text-textMuted w-6 text-center">{index + 1}</span>;
    }
  };

  const getRowStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.15)]';
      case 1:
        return 'bg-gradient-to-r from-gray-300/20 to-transparent border-gray-300/50';
      case 2:
        return 'bg-gradient-to-r from-amber-600/20 to-transparent border-amber-600/50';
      default:
        return 'bg-white/5 border-black/20 dark:border-white/10 hover:bg-white/10';
    }
  };

  if (loading) {
    return (
      <div className="bg-glass border border-black/20 dark:border-white/20 rounded-3xl p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryLight"></div>
      </div>
    );
  }

  return (
    <div className="bg-glass border border-black/20 dark:border-white/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-main flex items-center justify-center shadow-lg">
          <TrendingUp className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-textMain">Global Leaderboard</h2>
          <p className="text-sm text-textMuted">Top learners ranked by XP</p>
        </div>
      </div>

      {/* Time Frame Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTimeframe('week')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${timeframe === 'week'
            ? 'bg-gradient-main text-white shadow-lg scale-105'
            : 'bg-white/10 text-textMain hover:bg-white/20'
            }`}
        >
          <Clock size={16} />
          <span>This Week</span>
        </button>
        <button
          onClick={() => setTimeframe('month')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${timeframe === 'month'
            ? 'bg-gradient-main text-white shadow-lg scale-105'
            : 'bg-white/10 text-textMain hover:bg-white/20'
            }`}
        >
          <Calendar size={16} />
          <span>This Month</span>
        </button>
        <button
          onClick={() => setTimeframe('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${timeframe === 'all'
            ? 'bg-gradient-main text-white shadow-lg scale-105'
            : 'bg-white/10 text-textMain hover:bg-white/20'
            }`}
        >
          <Award size={16} />
          <span>All Time</span>
        </button>
      </div>

      <div className="space-y-3 relative z-10">
        <AnimatePresence>
          {users.map((user, index) => {
            const isSelf = currentUserId === user.id;
            const isFollowing = !!followingMap[user.id];
            const isLoadingThis = actionLoadingId === user.id;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                key={user.id}
                onClick={() => {
                  setSelectedUserId(user.id);
                  setSelectedRankIndex(index);
                }}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer group ${getRowStyle(index)}`}
                title="Click to view public profile"
              >
                <div className="flex items-center gap-4">
                  <div className="flex justify-center items-center w-8">
                    {getRankIcon(index)}
                  </div>

                  <div className="relative group-hover:scale-105 transition-transform">
                    <img
                      src={user.photoURL || AVATARS[user.avatarId || '1']}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover border border-black/20 dark:border-white/10 bg-black/20"
                      loading="lazy"
                      width={48}
                      height={48}
                    />
                    {user.activeFrame && user.activeFrame !== 'none' && (
                      <div className={`absolute inset-0 rounded-full pointer-events-none ${XP_STORE_FRAMES.find(f => f.id === user.activeFrame)?.frameClass || ''
                        }`} />
                    )}
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-background rounded-full flex items-center justify-center">
                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : 'bg-amber-600'
                          }`} />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-textMain text-lg leading-tight group-hover:underline group-hover:text-primaryLight transition-colors">
                      {user.username}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-primaryLight">
                        Lvl {user.level}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-textMain font-bold text-xl">
                      {getDisplayXP(user).toLocaleString()} <span className="text-sm font-medium text-textMuted">XP</span>
                    </div>
                  </div>

                  {!isSelf && currentUserId && (
                    <button
                      onClick={(e) => handleFollowToggle(e, user.id)}
                      disabled={isLoadingThis}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${isFollowing
                        ? 'bg-white/10 text-textMain hover:bg-red-500/20 hover:text-red-400 border border-white/10'
                        : 'bg-gradient-main text-white hover:opacity-90 shadow-primary/20'
                        }`}
                    >
                      {isLoadingThis ? (
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : isFollowing ? (
                        <>
                          <UserCheck size={14} />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={14} />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {users.length === 0 && (
          <div className="text-center py-10 text-textMuted">
            No learners found yet. Start learning to claim the top spot!
          </div>
        )}
      </div>

      {/* Background decoration */}
      <div className="absolute right-[-5%] top-[-5%] w-[30%] h-[50%] rounded-full bg-primaryLight/10 blur-[80px] pointer-events-none" />

      {/* Public Profile Modal */}
      <PublicProfileModal
        userId={selectedUserId}
        rankIndex={selectedRankIndex}
        onClose={() => {
          setSelectedUserId(null);
          setSelectedRankIndex(undefined);
        }}
      />
    </div>
  );
};
