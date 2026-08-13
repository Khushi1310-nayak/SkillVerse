import React, { useMemo, useRef, useState } from 'react';
import { Download, Upload, AlertTriangle, CheckCircle, FileJson, Loader2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import {
  buildBackup,
  downloadBackup,
  readBackupFile,
  restoreBackup,
  summarize,
  BackupSummary,
  ImportMode,
  ValidationResult,
} from '../utils/dataPortability';

/**
 * "Data & Backup" section of Settings → Account.
 *
 * Exports every SkillVerse LocalStorage key into one portable JSON file and
 * restores it again. The restore path always previews what will change before
 * anything is written, because Replace is destructive.
 */
export const DataPortabilityPanel: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pending, setPending] = useState<ValidationResult | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('merge');
  const [isReading, setIsReading] = useState(false);

  // Moves focus into the dialog, keeps Tab inside it, restores focus on close
  // and closes on Escape — `aria-modal` alone does none of that.
  const importDialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(importDialogRef, Boolean(pending?.envelope), () => setPending(null));

  // buildBackup() reads and parses every SkillVerse key, so it must not run on
  // each render. The counts only change after an import, which reloads anyway.
  const localSummary = useMemo(() => summarize(buildBackup()), []);

  const handleExport = () => {
    try {
      const envelope = buildBackup();
      downloadBackup(envelope);
      showToast({ message: 'Backup downloaded.', type: 'success' });
    } catch (err) {
      console.error('Export failed:', err);
      showToast({ message: 'Could not create the backup file.', type: 'error' });
    }
  };

  const handleFileChosen = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset immediately so picking the same file twice still fires onChange.
    event.target.value = '';
    if (!file) return;

    setIsReading(true);
    try {
      const result = await readBackupFile(file);
      if (!result.ok) {
        showToast({ message: result.errors[0] || 'That backup could not be read.', type: 'error' });
        setPending(null);
        return;
      }
      setPending(result);
    } finally {
      setIsReading(false);
    }
  };

  const handleConfirmImport = () => {
    if (!pending?.envelope) return;

    const result = restoreBackup(pending.envelope, importMode);
    setPending(null);

    if (!result.ok) {
      showToast({
        message: result.errors[0] || 'Some data could not be restored.',
        type: 'error',
      });
      return;
    }

    showToast({
      message:
        importMode === 'merge'
          ? 'Backup merged into your current progress.'
          : 'Backup restored. Your previous data was replaced.',
      type: 'success',
    });

    // Most screens read LocalStorage on mount, so a reload is the simplest
    // way to make every widget reflect the restored data at once.
    setTimeout(() => window.location.reload(), 900);
  };

  const SummaryGrid = ({ summary }: { summary: BackupSummary }) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
      {[
        { label: 'Courses', value: summary.courses },
        { label: 'Lesson notes', value: summary.lessonNotes },
        { label: 'AI notes', value: summary.aiNotes },
        { label: 'Practiced Qs', value: summary.practicedQuestions },
        { label: 'Mock interviews', value: summary.mockInterviews },
        { label: 'Streak days', value: summary.trackedDays },
        { label: 'Study days', value: summary.studyDays },
      ].map(item => (
        <div
          key={item.label}
          className="bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl px-3 py-2"
        >
          <div className="text-lg font-bold text-textMain">{item.value}</div>
          <div className="text-xs text-textMuted">{item.label}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl">
        <div className="flex items-start gap-3">
          <FileJson className="text-primaryLight shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-textMain">Data &amp; Backup</div>
            <div className="text-sm text-textMuted">
              Your progress, notes, streaks and career practice are stored in this browser only.
              Export a copy before clearing site data or moving to another device.
            </div>
            <SummaryGrid summary={localSummary} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-main text-white rounded-lg text-sm font-bold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Download size={16} /> Export my data
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isReading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 text-textMain rounded-lg text-sm font-bold transition-all active:scale-95 hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {isReading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Import a backup
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChosen}
            className="hidden"
            aria-label="Choose a SkillVerse backup file"
          />
        </div>
      </div>

      {/* Import preview / confirmation */}
      {pending?.envelope && pending.summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPending(null)} />
          <div
            ref={importDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="import-backup-title"
            tabIndex={-1}
            className="relative bg-background border border-black/20 dark:border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primaryLight mb-4 mx-auto">
              <Upload size={24} />
            </div>
            <h3 id="import-backup-title" className="text-xl font-bold text-textMain text-center mb-2">
              Restore this backup?
            </h3>
            <p className="text-textMuted text-center text-sm mb-4">
              Exported {new Date(pending.envelope.exportedAt).toLocaleString()}
            </p>

            <SummaryGrid summary={pending.summary} />

            {pending.skippedKeys.length > 0 && (
              <div className="mt-4 flex items-start gap-2 text-sm text-orange-500 dark:text-orange-400">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>
                  {pending.skippedKeys.length} unrecognised entr
                  {pending.skippedKeys.length === 1 ? 'y' : 'ies'} will be ignored.
                </span>
              </div>
            )}

            <fieldset className="mt-6 space-y-3">
              <legend className="text-sm font-bold text-textMain mb-2">How should it be applied?</legend>

              {(
                [
                  {
                    value: 'merge' as ImportMode,
                    title: 'Merge (recommended)',
                    body: 'Combines the backup with what is already here. Keeps your best quiz scores and longest streak.',
                  },
                  {
                    value: 'replace' as ImportMode,
                    title: 'Replace',
                    body: 'Overwrites the data in this browser with the backup. Anything newer here is lost.',
                  },
                ]
              ).map(option => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    importMode === option.value
                      ? 'bg-primary/10 border-primaryLight'
                      : 'bg-white/50 dark:bg-white/5 border-black/20 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="import-mode"
                    value={option.value}
                    checked={importMode === option.value}
                    onChange={() => setImportMode(option.value)}
                    className="mt-1 accent-primary"
                  />
                  <span>
                    <span className="block font-bold text-textMain text-sm">{option.title}</span>
                    <span className="block text-xs text-textMuted">{option.body}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            {importMode === 'replace' && (
              <div className="mt-4 flex items-start gap-2 text-sm text-red-500 dark:text-red-400">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>This will overwrite your current progress in this browser and cannot be undone.</span>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setPending(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-textMain border border-black/20 dark:border-white/10 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  importMode === 'replace'
                    ? 'bg-red-500 hover:bg-red-600 focus-visible:ring-red-200'
                    : 'bg-gradient-main hover:shadow-lg hover:shadow-primary/25 focus-visible:ring-primaryLight'
                }`}
              >
                <CheckCircle size={18} /> {importMode === 'replace' ? 'Replace data' : 'Merge data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
