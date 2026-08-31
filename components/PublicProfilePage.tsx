import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Trophy, Flame, BookOpen, Award, Shield, Calendar, Lock,
    Footprints, Briefcase, Loader2, UserX, Link2, Check, EyeOff
} from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import { BADGE_DEFINITIONS, XP_STORE_FRAMES } from '../constants';
import { User } from '../types';
import { useAuth } from '../hooks/useAuth';

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

export const PublicProfilePage: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { user, appUser } = useAuth();
    const [profile, setProfile] = useState<(User & { uid: string }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!username) return;
        setLoading(true);
        firestoreService.getUserByUsername(username)
            .then(setProfile)
            .catch((err) => {
                console.error('Error fetching public profile:', err);
                setProfile(null);
            })
            .finally(() => setLoading(false));
    }, [username]);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy profile link:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 text-textMuted">
                <Loader2 size={32} className="animate-spin text-primaryLight" />
                <p className="text-sm font-medium">Loading Public Profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <UserX size={64} className="text-red-500 mb-6 opacity-50" />
                <h1 className="text-3xl font-bold text-textMain mb-4">Profile Not Found</h1>
                <p className="text-textMuted max-w-md mb-8">
                    We couldn't find a SkillVerse learner with that username. The link may be mistyped or the account may no longer exist.
                </p>
                <button onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-main text-white font-bold rounded-xl">
                    Return to SkillVerse
                </button>
            </div>
        );
    }

    const isOwner = Boolean(
        user && (user.uid === profile.uid || (appUser?.username && appUser.username.toLowerCase() === profile.username.toLowerCase()))
    );
    const isProfilePrivate = profile.settings?.publicProfileEnabled === false;

    if (isProfilePrivate && !isOwner) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 shadow-xl">
                    <Lock size={32} />
                </div>
                <h1 className="text-3xl font-bold text-textMain mb-4">This Profile is Private</h1>
                <p className="text-textMuted max-w-md mb-8">
                    {profile.username} has set their SkillVerse learner profile to private. Their achievements and learning progress are not publicly visible.
                </p>
                <button onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-main text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity">
                    Return to SkillVerse
                </button>
            </div>
        );
    }

    const hiddenBadges = profile.settings?.publicProfileHiddenBadges || [];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center px-4 py-10 sm:py-16">
            <div className="w-full max-w-2xl mb-6 flex justify-between items-center bg-white/5 backdrop-blur-md border border-black/20 dark:border-white/10 p-4 rounded-2xl shadow-xl">
                <Link to="/" className="flex items-center text-textMuted hover:text-textMain transition-colors font-medium">
                    <ArrowLeft size={20} className="mr-2" /> SkillVerse
                </Link>
                <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-lg bg-primary/10 text-primaryLight border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                    {copied ? <Check size={16} /> : <Link2 size={16} />}
                    {copied ? 'Copied!' : 'Copy Profile Link'}
                </button>
            </div>

            <div className="relative w-full max-w-2xl bg-glass border border-black/20 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                <div className="space-y-8">
                    {/* Private preview warning for owner */}
                    {isOwner && isProfilePrivate && (
                        <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                            <EyeOff size={16} className="shrink-0" />
                            <span>Your profile is currently set to <strong>Private</strong>. Only you can view this preview. You can enable public sharing in Settings.</span>
                        </div>
                    )}

                    {/* Header / Avatar & Info */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                        <div className="relative">
                            <img
                                src={profile.photoURL || AVATARS[profile.settings?.avatarId || '1'] || AVATARS['1']}
                                alt={profile.username}
                                className="w-24 h-24 rounded-full object-cover border-2 border-primaryLight/50 bg-black/20 shadow-xl"
                            />
                            {profile.settings?.activeFrame && profile.settings.activeFrame !== 'none' && (
                                <div className={`absolute inset-0 rounded-full pointer-events-none ${XP_STORE_FRAMES.find(f => f.id === profile.settings.activeFrame)?.frameClass || ''
                                    }`} />
                            )}
                            <div className="absolute -bottom-2 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-0 px-2.5 py-0.5 rounded-full bg-gradient-main text-white font-bold text-xs shadow-md">
                                Lvl {profile.level}
                            </div>
                        </div>

                        <div className="space-y-2 flex-1">
                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                <h1 className="text-2xl font-display font-bold text-textMain">{profile.username}</h1>
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
                    <div className="grid grid-cols-3 gap-3">
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
                        <h2 className="text-lg font-bold text-textMain flex items-center gap-2">
                            <Award className="text-primaryLight" size={20} />
                            <span>Unlocked Achievements</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {BADGE_DEFINITIONS.filter(badge => {
                                if (!isOwner && hiddenBadges.includes(badge.id)) {
                                    return false;
                                }
                                return true;
                            }).map(badge => {
                                const earned = (profile.badges || []).includes(badge.id);
                                const isHiddenFromPublic = hiddenBadges.includes(badge.id);
                                const BadgeIcon = BADGE_ICONS[badge.icon] || Trophy;

                                return (
                                    <div
                                        key={badge.id}
                                        className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${earned
                                            ? 'bg-primary/10 border-primary/20'
                                            : 'bg-white/5 border-black/10 dark:border-white/5 opacity-40'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${earned ? 'bg-gradient-main text-white shadow-md' : 'bg-black/10 dark:bg-white/10 text-textMuted'
                                            }`}>
                                            {earned ? <BadgeIcon size={20} /> : <Lock size={18} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm text-textMain">{badge.name}</span>
                                                {isOwner && isHiddenFromPublic && (
                                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                        Hidden
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-textMuted">{badge.description}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};