import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Gift, ScrollText, Sparkles, Target, Trophy } from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import { UserQuestProgress, WeeklyQuestDefinition } from '../types';

interface QuestBoardProps {
  userId?: string;
  currentUser?: { uid?: string; username?: string } | null;
}

const getQuestCompletion = (quest: WeeklyQuestDefinition, progress: UserQuestProgress | null) => {
  const objectiveProgress = progress?.objectiveProgress || {};
  const completedObjectives = quest.objectives.filter((objective) => {
    const current = objectiveProgress[objective.id] || 0;
    return current >= objective.target;
  }).length;

  return {
    completedObjectives,
    totalObjectives: quest.objectives.length,
    percent: Math.round((completedObjectives / quest.objectives.length) * 100),
  };
};

export const QuestBoard: React.FC<QuestBoardProps> = ({ userId }) => {
  const [progressMap, setProgressMap] = useState<Record<string, UserQuestProgress | null>>({});
  const [quests, setQuests] = useState<WeeklyQuestDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setQuests([]);
      return;
    }

    let active = true;
    const load = async () => {
      try {
        const [activeQuests, data] = await Promise.all([
          firestoreService.getActiveQuestDefinitions(),
          firestoreService.getUserQuestProgress(userId),
        ]);

        if (!active) return;

        const map: Record<string, UserQuestProgress | null> = {};
        data.forEach((item) => {
          map[item.questId] = item;
        });

        setQuests(activeQuests);
        setProgressMap(map);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [userId]);

  const questSet = useMemo(() => quests, [quests]);

  if (loading) {
    return (
      <div className="bg-glass border border-black/20 dark:border-white/20 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-main flex items-center justify-center">
            <ScrollText className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-textMain">Weekly Quests</h3>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-20 rounded-2xl bg-white/5 animate-pulse" />
          <div className="h-20 rounded-2xl bg-white/5 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-glass border border-black/20 dark:border-white/20 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-main flex items-center justify-center shadow-lg">
            <Trophy className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-textMain">Weekly Quests</h3>
            <p className="text-sm text-textMuted">Complete objectives for bonus XP and rewards.</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primaryLight text-xs font-bold uppercase tracking-wider border border-primary/20">
          <Clock3 size={12} /> This Week
        </div>
      </div>

      <div className="space-y-4">
        {questSet.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-4 text-sm text-textMuted">
            No active weekly quest is running right now.
          </div>
        ) : questSet.map((quest) => {
          const progress = progressMap[quest.id] || null;
          const state = getQuestCompletion(quest, progress);
          const complete = state.completedObjectives === state.totalObjectives;

          return (
            <div
              key={quest.id}
              className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-textMain">{quest.title}</h4>
                    {complete && <CheckCircle2 size={18} className="text-emerald-500" />}
                  </div>
                  <p className="text-sm text-textMuted mt-1">{quest.description}</p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primaryLight">
                  <Gift size={14} /> {quest.reward.xp} XP
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {quest.objectives.map((objective) => {
                  const current = progress?.objectiveProgress?.[objective.id] || 0;
                  const objectiveComplete = current >= objective.target;

                  return (
                    <div key={objective.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Target size={14} className={objectiveComplete ? 'text-emerald-500' : 'text-textMuted'} />
                          <span className="text-sm font-medium text-textMain truncate">{objective.title}</span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                          <div
                            className={`h-full rounded-full ${objectiveComplete ? 'bg-emerald-500' : 'bg-gradient-main'}`}
                            style={{ width: `${Math.min(100, (current / objective.target) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="ml-3 text-xs font-bold text-textMuted">
                        {Math.min(current, objective.target)}/{objective.target}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-textMuted">
                  <Sparkles size={14} className="text-primaryLight" />
                  {state.completedObjectives}/{state.totalObjectives} objectives complete
                </div>

                <div className="w-24 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${complete ? 'bg-emerald-500' : 'bg-gradient-main'}`}
                    style={{ width: `${state.percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
