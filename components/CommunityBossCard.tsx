import React, { useEffect, useMemo, useState } from 'react';
import { Clock3, Flame, Shield, Swords, TimerReset } from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import { CommunityBossDefinition, CommunityBossProgress } from '../types';

interface CommunityBossCardProps {
  userId?: string;
}

export const CommunityBossCard: React.FC<CommunityBossCardProps> = ({ userId }) => {
  const [boss, setBoss] = useState<CommunityBossDefinition | null>(null);
  const [progress, setProgress] = useState<CommunityBossProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const bossData = await firestoreService.getActiveCommunityBoss();
        const progressData = await firestoreService.getCommunityBossProgress(bossData.id);

        if (!active) return;

        setBoss(bossData);
        setProgress(progressData || {
          bossId: bossData.id,
          totalProgress: 0,
          target: bossData.target,
          updatedAt: new Date().toISOString(),
        });
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [userId]);

  const percent = useMemo(() => {
    if (!boss || !progress) return 0;
    const target = Math.max(progress.target || boss.target, 1);
    return Math.min(100, Math.round((progress.totalProgress / target) * 100));
  }, [boss, progress]);

  const timeLeft = useMemo(() => {
    if (!boss) return 'No active boss';
    const ms = new Date(boss.endsAt).getTime() - Date.now();
    if (ms <= 0) return 'Ended';
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    return `${days}d ${hours}h ${minutes}m left`;
  }, [boss]);

  if (loading) {
    return (
      <div className="bg-glass border border-black/20 dark:border-white/20 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-main flex items-center justify-center">
            <Shield className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-textMain">Community Boss</h3>
          </div>
        </div>
        <div className="h-28 rounded-2xl bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (!boss || !progress) {
    return (
      <div className="bg-glass border border-black/20 dark:border-white/20 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-main flex items-center justify-center shadow-lg">
              <Swords className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-textMain">Community Boss</h3>
              <p className="text-sm text-textMuted">No active boss</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-glass border border-black/20 dark:border-white/20 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-main flex items-center justify-center shadow-lg">
            <Swords className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-textMain">Community Boss</h3>
            <p className="text-sm text-textMuted">{boss.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider border border-rose-500/20">
          <Flame size={12} /> {boss.reward.xp} XP
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-textMuted">{boss.description}</p>

        <div className="flex items-center justify-between text-sm font-medium text-textMuted">
          <span>Progress</span>
          <span>{progress.totalProgress}/{boss.target}</span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-rose-500 via-orange-500 to-yellow-400" style={{ width: `${percent}%` }} />
        </div>

        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-textMuted">
          <span className="flex items-center gap-2"><Shield size={12} /> {percent}%</span>
          <span className="flex items-center gap-2"><TimerReset size={12} /> {timeLeft}</span>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm text-textMain">
          <Clock3 size={16} className="text-primaryLight" />
          <span>{timeLeft}</span>
        </div>
      </div>
    </div>
  );
};
