import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { db } from '../firebase/firebase';

interface LeaderboardUser {
  id: string;
  username: string;
  photoURL?: string;
  xp: number;
  level: number;
  avatarId?: string;
}

const AVATARS: Record<string, string> = {
  '1': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  '2': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  '3': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  '4': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  '5': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
};

export const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(10));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const topUsers: LeaderboardUser[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        topUsers.push({
          id: doc.id,
          username: data.username || 'Anonymous',
          photoURL: data.photoURL,
          xp: data.xp || 0,
          level: data.level || 1,
          avatarId: data.preferences?.settings?.avatarId
        });
      });
      setUsers(topUsers);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
      // Let the developer know about the composite index via the console error
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
        return 'bg-white/5 border-white/10 hover:bg-white/10';
    }
  };

  if (loading) {
    return (
      <div className="bg-glass border border-white/20 rounded-3xl p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryLight"></div>
      </div>
    );
  }

  return (
    <div className="bg-glass border border-white/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-main flex items-center justify-center shadow-lg">
          <TrendingUp className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-textMain">Global Leaderboard</h2>
          <p className="text-sm text-textMuted">Top learners ranked by XP</p>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        <AnimatePresence>
          {users.map((user, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
              key={user.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-colors duration-300 ${getRowStyle(index)}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex justify-center items-center w-8">
                  {getRankIcon(index)}
                </div>
                
                <div className="relative">
                  <img
                    src={user.photoURL || AVATARS[user.avatarId || '1']}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover border border-white/10 bg-black/20"
                  />
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-background rounded-full flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : 'bg-amber-600'
                      }`} />
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-bold text-textMain text-lg leading-tight">{user.username}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-primaryLight">
                      Lvl {user.level}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 text-textMain font-bold text-xl">
                  {user.xp.toLocaleString()} <span className="text-sm font-medium text-textMuted">XP</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {users.length === 0 && (
          <div className="text-center py-10 text-textMuted">
            No learners found yet. Start learning to claim the top spot!
          </div>
        )}
      </div>
      
      {/* Background decoration */}
      <div className="absolute right-[-5%] top-[-5%] w-[30%] h-[50%] rounded-full bg-primaryLight/10 blur-[80px] pointer-events-none" />
    </div>
  );
};
