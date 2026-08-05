import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { X, Trophy, Flame, BookOpen, Award, Shield, Calendar, Lock, Footprints, Briefcase, Loader2 } from 'lucide-react';
import { db } from '../firebase/firebase';
import { BADGE_DEFINITIONS, XP_STORE_FRAMES } from '../constants';
import { User } from '../types';

interface PublicProfileModalProps {
  userId: string | null;
  rankIndex?: number;
  onClose: () => void;
}

const AVATARS: Record<string, string> = {
  '1': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  '2': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  '3': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  '4': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  '5': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
};

const BADGE_ICONS: Record<string, any> = {
  Footprints, Award, Flame, Briefcase, Trophy
};

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({ userId, rankIndex, onClose }) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const fetchUserProfile = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as any;
          setProfile({
            username: data.username || 'Learner',
            email: data.email || '',
            enrolledDate: data.enrolledDate || 'Recent',
            settings: data.preferences?.settings || data.settings || { avatarId: '1', activeFrame: 'none' },
            xp: data.xp || 0,
            level: data.level || 1,
            courses: data.courses || [],
            photoURL: data.photoURL,
            streak: data.streak || 0,
            lastActiveDate: data.lastActiveDate || '',
            badges: data.badges || ['first_step'],
            role: data.role || 'user',
          });
        }
      } catch (err) {
        console.error('Error fetching public profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-glass border border-black/20 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-textMuted hover:text-textMain rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          title="Close profile"
          aria-label="Close profile"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-textMuted">
            <Loader2 size={32} className="animate-spin text-primaryLight" />
            <p className="text-sm font-medium">Loading Public Profile...</p>
          </div>
        ) : profile ? (
          <div className="space-y-8">
            {/* Header / Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative">
                <img
                  src={profile.photoURL || AVATARS[profile.settings?.avatarId || '1'] || AVATARS['1']}
                  alt={profile.username}
                  className="w-24 h-24 rounded-full object-cover border-2 border-primaryLight/50 bg-black/20 shadow-xl"
                />
                {profile.settings?.activeFrame && profile.settings.activeFrame !== 'none' && (
                  <div className={`absolute inset-0 rounded-full pointer-events-none ${
                    XP_STORE_FRAMES.find(f => f.id === profile.settings.activeFrame)?.frameClass || ''
                  }`} />
                )}
                <div className="absolute -bottom-2 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-0 px-2.5 py-0.5 rounded-full bg-gradient-main text-white font-bold text-xs shadow-md">
                  Lvl {profile.level}
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <h2 className="text-2xl font-display font-bold text-textMain">{profile.username}</h2>
                  {profile.role === 'admin' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                      Admin
                    </span>
                  )}
                </div>

                <p className="text-xs text-textMuted flex items-center justify-center sm:justify-start gap-1.5">
                  <Calendar size={14} className="text-primaryLight" />
                  <span>Enrolled: {profile.enrolledDate}</span>
                </p>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-black/10 dark:border-white/10 text-xs font-semibold text-textMain">
                  <Shield size={14} className="text-primaryLight" />
                  <span>Public Learner Profile</span>
                </div>
              </div>
            </div>

            {/* Read-Only Stats Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {rankIndex !== undefined && (
                <div className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 text-center">
                  <div className="text-xs text-textMuted font-bold uppercase tracking-wider mb-1">Rank</div>
                  <div className="text-xl font-bold text-yellow-400">#{rankIndex + 1}</div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 text-center">
                <div className="text-xs text-textMuted font-bold uppercase tracking-wider mb-1">Total XP</div>
                <div className="text-xl font-bold text-textMain flex items-center justify-center gap-1">
                  <Trophy size={18} className="text-primaryLight" />
                  <span>{profile.xp.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 text-center">
                <div className="text-xs text-textMuted font-bold uppercase tracking-wider mb-1">Streak</div>
                <div className="text-xl font-bold text-orange-400 flex items-center justify-center gap-1">
                  <Flame size={18} className="text-orange-500 fill-orange-500" />
                  <span>{profile.streak}d</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 text-center">
                <div className="text-xs text-textMuted font-bold uppercase tracking-wider mb-1">Courses</div>
                <div className="text-xl font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <BookOpen size={18} className="text-emerald-400" />
                  <span>{profile.courses.length}</span>
                </div>
              </div>
            </div>

            {/* Achievements Showcase */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-textMain flex items-center gap-2">
                <Award className="text-primaryLight" size={20} />
                <span>Unlocked Achievements</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BADGE_DEFINITIONS.map(badge => {
                  const earned = (profile.badges || []).includes(badge.id);
                  const BadgeIcon = BADGE_ICONS[badge.icon] || Trophy;

                  return (
                    <div
                      key={badge.id}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                        earned
                          ? 'bg-primary/10 border-primary/20'
                          : 'bg-white/5 border-black/10 dark:border-white/5 opacity-40'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        earned ? 'bg-gradient-main text-white shadow-md' : 'bg-black/10 dark:bg-white/10 text-textMuted'
                      }`}>
                        {earned ? <BadgeIcon size={20} /> : <Lock size={18} />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-textMain">{badge.name}</div>
                        <div className="text-xs text-textMuted">{badge.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10 text-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-black/20 dark:border-white/10 text-textMain font-medium text-sm transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-textMuted space-y-3">
            <p>Profile details could not be loaded.</p>
            <button onClick={onClose} className="px-4 py-2 bg-white/10 text-textMain rounded-xl font-bold text-xs">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};
