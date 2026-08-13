import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  User, Palette, BookOpen, Brain, Award, Shield,
  Moon, Sun, Save, CheckCircle, RefreshCcw, Trash2,
  LogOut, AlertTriangle, Smartphone, Zap, Upload, Loader2,
  Trophy, Lock, Footprints, Flame, Briefcase, ShoppingBag, Bookmark, Volume2, Download, Link2, Check
} from 'lucide-react';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase/firebase';
import { storageService } from '../services/storageService';
import { soundManager } from '../utils/soundManager';
import { useInstallPrompt } from '../contexts/InstallPromptContext';
import { BADGE_DEFINITIONS, XP_STORE_THEMES, XP_STORE_CURSORS, XP_STORE_FRAMES, XPStoreTheme, XPStoreCursor, XPStoreFrame } from '../constants';
import { User as UserType, UserSettings, SavedAINote } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../hooks/useAuth';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { LanguageSwitcher } from './LanguageSwitcher';
import { DataPortabilityPanel } from './DataPortabilityPanel';


interface SettingsProps {
  user: UserType;
  onPreviewUpdate: (user: UserType) => void;
  onUpdateUser: (user: UserType) => Promise<void>;
  onLogout: () => void;
}

const AVATARS = [
  { id: '1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { id: '2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
  { id: '3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
  { id: '4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo' },
  { id: '5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha' },
];

const BADGE_ICONS: Record<string, any> = {
  Footprints, Award, Flame, Briefcase,
};

export const Settings: React.FC<SettingsProps> = ({ user, onPreviewUpdate, onUpdateUser, onLogout }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('settings_active_tab') || 'profile';
  });
  const [savedNotes, setSavedNotes] = useState<SavedAINote[]>([]);
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();

  useEffect(() => {
    if (activeTab === 'aiNotes') {
      setSavedNotes(storageService.getSavedAINotes());
    }
  }, [activeTab]);

  const handleDeleteNote = (id: string) => {
    setSavedNotes(storageService.deleteAINote(id));
  };
  const [formData, setFormData] = useState<UserType>(user);
  const [profileLinkCopied, setProfileLinkCopied] = useState(false);
  const [modal, setModal] = useState<{ type: 'reset' | 'clear' | 'unsaved' | null }>({ type: null });
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const { showToast } = useToast();
  const { purchaseItem } = useAuth();
  const navigate = useNavigate();

  // Compute dirty state by comparing current formData with original user prop
  const isDirty = JSON.stringify(formData) !== JSON.stringify(user);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  useEffect(() => {
    localStorage.setItem('settings_active_tab', activeTab);
  }, [activeTab]);

  // Ref and focus trap for the confirmation modal
  const confirmModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(confirmModalRef, !!modal.type, () => setModal({ type: null }));

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handleClick = (e: MouseEvent) => {
      // Ignore modifier clicks, middle clicks, or links meant to open elsewhere
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.href) return;
      if (target.target === '_blank' || target.hasAttribute('download')) return;

      if (target.href.includes('#/')) {
        const url = new URL(target.href);

        if (url.origin === window.location.origin && url.hash !== window.location.hash && url.hash !== '#/settings') {
          e.preventDefault();
          e.stopPropagation();
          const hashPath = url.hash.replace(/^#/, '');
          setPendingPath(hashPath || '/');
          setModal({ type: 'unsaved' });
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isDirty]);

  const handleChange = (field: keyof UserSettings, value: any) => {
    const updatedSettings = {
      ...formData.settings,
      [field]: value
    };
    if (field === 'theme') {
      updatedSettings.activeTheme = value === 'light' ? 'light' : 'dark';
    }
    const updatedUser = {
      ...formData,
      settings: updatedSettings
    };
    setFormData(updatedUser);

    // Apply appearance settings immediately for live preview
    if (field === 'theme' || field === 'gradientIntensity') {
      onPreviewUpdate(updatedUser);
    }
  };

  const handleCustomColorChange = (field: 'customPrimary' | 'customPrimaryLight', value: string) => {
    const updatedSettings: UserSettings = {
      ...formData.settings,
      [field]: value,
      activeTheme: 'custom',
    };
    const updatedUser = { ...formData, settings: updatedSettings };
    setFormData(updatedUser);
    onPreviewUpdate(updatedUser);
  };

  const handleResetCustomTheme = () => {
    const updatedSettings: UserSettings = {
      ...formData.settings,
      activeTheme: 'dark',
      theme: 'dark',
    };
    const updatedUser = { ...formData, settings: updatedSettings };
    setFormData(updatedUser);
    onPreviewUpdate(updatedUser);
  };

  const handleProfileChange = (field: keyof UserType, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCopyProfileLink = async () => {
    const profileUrl = `${window.location.origin}${window.location.pathname}#/u/${encodeURIComponent(user.username)}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setProfileLinkCopied(true);
      showToast({ message: 'Profile Link Copied!', type: 'success' });
      setTimeout(() => setProfileLinkCopied(false), 2000);
    } catch (err) {
      showToast({ message: 'Failed to copy profile link', type: 'error' });
    }
  };

  const handleAvatarSelect = async (avatarId: string) => {
    const updatedUser = {
      ...formData,
      photoURL: '',
      settings: { ...formData.settings, avatarId }
    };
    setFormData(updatedUser);
    onPreviewUpdate(updatedUser);

    const currentUser = auth.currentUser;
    if (currentUser && formData.photoURL) {
      try {
        await updateProfile(currentUser, { photoURL: '' });
        await setDoc(doc(db, 'users', currentUser.uid), { photoURL: '' }, { merge: true });
      } catch (err) {
        console.error('Error clearing photoURL on avatar select:', err);
      }
    }
  };

  const handleRemoveCustomAvatar = async () => {
    const updatedUser = { ...formData, photoURL: '' };
    setFormData(updatedUser);
    onPreviewUpdate(updatedUser);

    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await updateProfile(currentUser, { photoURL: '' });
        await setDoc(doc(db, 'users', currentUser.uid), { photoURL: '' }, { merge: true });
        await onUpdateUser(updatedUser);
        showToast({ message: 'Custom Avatar Removed', type: 'success' });
      } catch (err) {
        console.error('Error removing custom avatar:', err);
        showToast({ message: 'Failed to remove custom avatar', type: 'error' });
      }
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPEG, etc.).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File size exceeds the 2MB limit.');
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setUploadError('User must be authenticated to upload custom avatar.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const fileRef = storageRef(storage, `avatars/${currentUser.uid}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        console.error('Upload error:', error);
        setUploadError('Failed to upload image. Please try again.');
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(currentUser, { photoURL: downloadURL });
          await setDoc(doc(db, 'users', currentUser.uid), { photoURL: downloadURL }, { merge: true });

          const updatedUser = { ...formData, photoURL: downloadURL };
          setFormData(updatedUser);
          onPreviewUpdate(updatedUser);
          await onUpdateUser(updatedUser);

          showToast({ message: 'Custom Avatar Uploaded Successfully!', type: 'success' });
        } catch (err) {
          console.error('Error finalizing avatar upload:', err);
          setUploadError('Error updating profile after upload.');
        } finally {
          setUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      }
    );
  };

  const saveSettings = async () => {
    try {
      onPreviewUpdate(formData);
      await storageService.updateUser(formData);
      await onUpdateUser(formData);
      showToast({ message: 'Settings Saved Successfully', type: 'success' });
    } catch (error) {
      console.error('Error saving user settings:', error);
      showToast({ message: 'Failed to Save Settings', type: 'error' });
    }
  };

  const handleResetProgress = () => {
    storageService.resetProgress();
    setModal({ type: null });
    showToast({ message: 'Progress Reset Successfully', type: 'success' });
  };

  const handleClearData = () => {
    storageService.clearData();
    setModal({ type: null });
    // Resetting app state via logout ensures clean slate without hard browser reload
    onLogout();
  };

  const handleLeave = () => {
    setModal({ type: null });
    if (pendingPath) {
      navigate(pendingPath);
    }
  };

  const TabButton = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        localStorage.setItem('settings_active_tab', id);
      }}
      role="tab"
      aria-selected={activeTab === id}
      aria-label={label}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left mb-1
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${activeTab === id
          ? 'bg-primary/10 text-primaryLight border border-primary/20 shadow-sm'
          : 'text-textMuted hover:bg-white/5 hover:text-textMain'
        }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const Toggle = ({ checked, onChange, ariaLabel = 'Toggle setting' }: { checked: boolean, onChange: (v: boolean) => void, ariaLabel?: string }) => (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background ${checked ? 'bg-primaryLight shadow-[0_0_10px_rgba(207,152,147,0.4)]' : 'bg-black/10 dark:bg-white/10'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${checked ? 'left-7' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="animate-fade-in relative">
      <h1 className="text-3xl font-display font-bold text-textMain mb-8">
        {t('settings.title')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 self-start">
          <div className="bg-glass border border-black/20 dark:border-white/20 dark:border-white/10 rounded-2xl p-4" role="tablist" aria-label="Settings sections">
            <TabButton id="profile" icon={User} label={t('settings.tabs.profile')} />
            <TabButton id="appearance" icon={Palette} label={t('settings.tabs.appearance')} />
            <TabButton id="xpstore" icon={ShoppingBag} label={t('settings.tabs.xpStore')} />
            <TabButton id="learning" icon={BookOpen} label={t('settings.tabs.learning')} />
            <TabButton id="quiz" icon={Brain} label={t('settings.tabs.quiz')} />
            <TabButton id="aiNotes" icon={Bookmark} label="Saved AI Notes" />
            <TabButton id="certificate" icon={Award} label={t('settings.tabs.certificate')} />
            <TabButton id="achievements" icon={Trophy} label={t('settings.tabs.achievements')} />
            <TabButton id="account" icon={Shield} label={t('settings.tabs.account')} />
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-glass border border-black/20 dark:border-white/20 dark:border-white/10 rounded-3xl p-8 min-h-[500px] relative">

            {/* Profile Section */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
                  <User className="text-primaryLight" /> {t('settings.profile.title')}
                </h2>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-textMuted uppercase tracking-wider">{t('settings.profile.avatar')}</label>

                  {/* Current Active Avatar Display & Upload Controls */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-black/20 dark:border-white/10">
                    <div className="relative group">
                      <img
                        src={formData.photoURL || AVATARS.find(a => a.id === formData.settings.avatarId)?.url || AVATARS[0].url}
                        alt={t('settings.profile.currentAvatar')}
                        className="w-20 h-20 rounded-full object-cover bg-white/10 border-2 border-primaryLight shadow-md"
                        width={80}
                        height={80}
                      />
                      {formData.settings.activeFrame && formData.settings.activeFrame !== 'none' && (
                        <div className={`absolute inset-0 rounded-full pointer-events-none ${XP_STORE_FRAMES.find(f => f.id === formData.settings.activeFrame)?.frameClass || ''
                          }`} />
                      )}
                      {formData.photoURL && (
                        <span className="absolute -bottom-1 -right-1 bg-primaryLight text-xs font-bold text-black px-2 py-0.5 rounded-full shadow">
                          {t('settings.profile.custom')}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primaryLight border border-primary/20 rounded-xl font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                          <span>
                            {uploading
                              ? `${t('settings.profile.uploading')} (${uploadProgress}%)`
                              : t('settings.profile.uploadAvatar')}
                          </span>
                        </button>

                        {formData.photoURL && (
                          <button
                            type="button"
                            onClick={handleRemoveCustomAvatar}
                            disabled={uploading}
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          >
                            <Trash2 size={16} />
                            <span>{t('settings.profile.removeAvatar')}</span>
                          </button>
                        )}
                      </div>

                      {uploading && (
                        <div className="w-full max-w-xs bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                          <div
                            className="bg-primaryLight h-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}

                      {uploadError && (
                        <p className="text-sm text-red-400 font-medium flex items-center gap-1 mt-1">
                          <AlertTriangle size={14} /> {uploadError}
                        </p>
                      )}

                      <p className="text-xs text-textMuted">
                        {t('settings.profile.uploadHint')}
                      </p>
                    </div>
                  </div>

                  {/* DiceBear Avatars Grid */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">{t('settings.profile.presetAvatar')}</span>
                    <div className="flex flex-wrap gap-4">
                      {AVATARS.map(avatar => (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => handleAvatarSelect(avatar.id)}
                          aria-label={`Select preset avatar ${avatar.id}`}
                          aria-pressed={!formData.photoURL && formData.settings.avatarId === avatar.id}
                          title={`Select preset avatar ${avatar.id}`}
                          className={`p-1 rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background ${!formData.photoURL && formData.settings.avatarId === avatar.id ? 'border-primaryLight scale-110 shadow-lg' : 'border-transparent hover:border-black/20 dark:border-white/20'}`}
                        >
                          <img src={avatar.url} alt="" className="w-12 h-12 rounded-full bg-white/10" loading="lazy" width={48} height={48} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="profileUsername" className="text-sm font-semibold text-textMuted uppercase tracking-wider">{t('settings.profile.displayName')}</label>
                    <input
                      id="profileUsername"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleProfileChange('username', e.target.value)}
                      title={t('settings.profile.displayName')}
                      placeholder={t('settings.profile.displayNamePlaceholder')}
                      className="w-full bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl px-4 py-3 text-textMain focus:border-primaryLight focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="profileEmail" className="text-sm font-semibold text-textMuted uppercase tracking-wider">{t('settings.profile.email')}</label>
                    <input
                      id="profileEmail"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      title={t('settings.profile.email')}
                      placeholder={t('settings.profile.emailPlaceholder')}
                      className="w-full bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl px-4 py-3 text-textMain focus:border-primaryLight focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-black/20 dark:border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-sm text-textMuted">{t('settings.profile.memberSince')} <span className="text-textMain font-medium">{new Date(formData.enrolledDate).toLocaleDateString(i18n.language)}</span></p>
                  <button
                    type="button"
                    onClick={handleCopyProfileLink}
                    aria-label="Copy shareable public profile link"
                    title="Copy shareable public profile link"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primaryLight border border-primary/20 hover:bg-primary/20 font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {profileLinkCopied ? <Check size={16} /> : <Link2 size={16} />}
                    {profileLinkCopied ? 'Copied!' : 'Copy Profile Link'}
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Section */}
            {activeTab === 'appearance' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
                  <Palette className="text-primaryLight" /> {t('settings.appearance.title')}
                </h2>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/20 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    {formData.settings.theme === 'dark' ? <Moon size={24} className="text-purple-400" /> : <Sun size={24} className="text-yellow-400" />}
                    <div>
                      <div className="font-bold text-textMain">{t('settings.appearance.themeMode')}</div>
                      <div className="text-sm text-textMuted">{t('settings.appearance.themeModeDesc')}</div>
                    </div>
                  </div>
                  <div className="flex self-start sm:self-auto bg-black/5 dark:bg-black/30 rounded-lg p-1 shrink-0">
                    <button
                      onClick={() => handleChange('theme', 'light')}
                      aria-pressed={formData.settings.theme === 'light'}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background ${formData.settings.theme === 'light' ? 'bg-white text-black shadow-md' : 'text-textMuted hover:text-textMain'}`}
                    >
                      {t('settings.appearance.light')}
                    </button>
                    <button
                      onClick={() => handleChange('theme', 'dark')}
                      aria-pressed={formData.settings.theme === 'dark'}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background ${formData.settings.theme === 'dark' ? 'bg-gray-700 text-white shadow-md' : 'text-textMuted hover:text-textMain'}`}
                    >
                      {t('settings.appearance.dark')}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label htmlFor="gradientIntensity" className="text-sm font-semibold text-textMuted uppercase tracking-wider">{t('settings.appearance.gradientIntensity')}</label>
                  <input
                    id="gradientIntensity"
                    type="range"
                    min="0" max="100"
                    value={formData.settings.gradientIntensity === 'low' ? 30 : formData.settings.gradientIntensity === 'medium' ? 60 : 90}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      handleChange('gradientIntensity', val < 40 ? 'low' : val < 70 ? 'medium' : 'high');
                    }}
                    title="Gradient Intensity"
                    placeholder="Gradient Intensity"
                    className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primaryLight"
                  />
                  <div className="flex justify-between text-xs text-textMuted">
                    <span>{t('settings.appearance.subtle')}</span>
                    <span>{t('settings.appearance.balanced')}</span>
                    <span>{t('settings.appearance.vibrant')}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-textMuted uppercase tracking-wider">Accent Preview</label>
                  <div className="h-24 rounded-xl bg-gradient-main flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-white font-bold text-lg mix-blend-overlay">SkillVerse Premium UI</span>
                  </div>
                </div>

                {/* Custom Theme Palette Builder */}
                <div className="space-y-5 p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white/30 dark:bg-white/5">
                  <div>
                    <label className="text-sm font-semibold text-textMuted uppercase tracking-wider">Custom Theme Palette</label>
                    <p className="text-xs text-textMuted mt-1">Pick your own primary and secondary accent colors.</p>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.settings.customPrimary || '#6968A6'}
                        onChange={(e) => handleCustomColorChange('customPrimary', e.target.value)}
                        title="Primary Accent Color"
                        aria-label="Primary Accent Color"
                        className="w-12 h-12 rounded-lg border border-black/10 dark:border-white/10 cursor-pointer bg-transparent p-0"
                      />
                      <div>
                        <div className="text-sm font-bold text-textMain">Primary Accent</div>
                        <div className="text-xs text-textMuted">{(formData.settings.customPrimary || '#6968A6').toUpperCase()}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.settings.customPrimaryLight || '#CF9893'}
                        onChange={(e) => handleCustomColorChange('customPrimaryLight', e.target.value)}
                        title="Secondary Accent Color"
                        aria-label="Secondary Accent Color"
                        className="w-12 h-12 rounded-lg border border-black/10 dark:border-white/10 cursor-pointer bg-transparent p-0"
                      />
                      <div>
                        <div className="text-sm font-bold text-textMain">Secondary Accent</div>
                        <div className="text-xs text-textMuted">{(formData.settings.customPrimaryLight || '#CF9893').toUpperCase()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Live Glassmorphism Preview */}
                  <div
                    className="rounded-2xl p-6 border backdrop-blur-md transition-all duration-300 space-y-4"
                    style={{
                      background: `linear-gradient(135deg, ${formData.settings.customPrimary || '#6968A6'}22 0%, ${formData.settings.customPrimaryLight || '#CF9893'}22 100%)`,
                      borderColor: `${formData.settings.customPrimary || '#6968A6'}55`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-textMain">Live Preview</span>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: formData.settings.customPrimaryLight || '#CF9893' }}
                      >
                        New Badge
                      </span>
                    </div>
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-xl text-white font-medium shadow-lg transition-transform hover:scale-[1.02]"
                      style={{
                        backgroundImage: `linear-gradient(90deg, ${formData.settings.customPrimary || '#6968A6'} 0%, ${formData.settings.customPrimaryLight || '#CF9893'} 100%)`,
                      }}
                    >
                      Sample Button
                    </button>
                  </div>

                  {formData.settings.activeTheme === 'custom' && (
                    <button
                      type="button"
                      onClick={handleResetCustomTheme}
                      className="text-xs font-medium text-textMuted hover:text-textMain underline"
                    >
                      Reset to Default Dark
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/20 dark:border-white/5">
                  <div>
                    <div className="font-bold text-textMain">{t('settings.appearance.language')}</div>
                    <div className="text-sm text-textMuted">{t('settings.appearance.languageDesc')}</div>
                  </div>
                  <LanguageSwitcher />
                </div>
              </div>
            )}

            {/* XP Store Section */}
            {activeTab === 'xpstore' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-black/20 dark:border-white/10 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-textMain flex items-center gap-2">
                      <ShoppingBag className="text-primaryLight" /> {t('settings.xpStore.title')}
                    </h2>
                    <p className="text-textMuted">Unlock exclusive themes and custom cursor styles using your learning XP.</p>
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-2xl px-6 py-3 flex items-center gap-2 self-start sm:self-auto shadow-sm">
                    <Trophy className="text-amber-400 fill-amber-400/20" size={20} />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-textMuted tracking-wider">Your XP Balance</div>
                      <div className="text-lg font-extrabold text-textMain">{formData.xp} XP</div>
                    </div>
                  </div>
                </div>

                {/* Themes Shelf */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-textMain flex items-center gap-2">
                    <Palette size={18} className="text-primaryLight" /> Unlockable Themes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {XP_STORE_THEMES.map(theme => {
                      const isUnlocked = formData.settings.unlockedThemes?.includes(theme.id) ?? ['dark', 'light'].includes(theme.id);
                      const isActive = formData.settings.activeTheme === theme.id || (!formData.settings.activeTheme && theme.id === 'dark');
                      const canAfford = formData.xp >= theme.cost;

                      const handleSelectTheme = () => {
                        const updatedUser = {
                          ...formData,
                          settings: {
                            ...formData.settings,
                            activeTheme: theme.id,
                            theme: theme.themeMode
                          }
                        };
                        setFormData(updatedUser);
                        onPreviewUpdate(updatedUser);
                      };

                      const handleUnlockTheme = async () => {
                        try {
                          await purchaseItem(theme.id, theme.cost, 'theme');
                          if (formData.settings.soundEffects !== false) soundManager.playCoin();
                          showToast({ message: `Unlocked ${theme.name} Theme!`, type: 'success' });
                          setFormData(prev => ({
                            ...prev,
                            xp: prev.xp - theme.cost,
                            settings: {
                              ...prev.settings,
                              unlockedThemes: [...(prev.settings.unlockedThemes || ['dark', 'light']), theme.id],
                              activeTheme: theme.id,
                              theme: theme.themeMode
                            }
                          }));
                        } catch (err: any) {
                          showToast({ message: err.message || 'Failed to unlock theme', type: 'error' });
                        }
                      };

                      return (
                        <div
                          key={theme.id}
                          className={`p-5 rounded-2xl border transition-all flex flex-col justify-between h-48 bg-white/30 dark:bg-white/5
                            ${isActive ? 'border-primaryLight shadow-lg shadow-primary/10' : 'border-black/10 dark:border-white/10'}`}
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-bold text-textMain">{theme.name}</span>
                              {isUnlocked ? (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">Owned</span>
                              ) : (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">{theme.cost} XP</span>
                              )}
                            </div>
                            <p className="text-xs text-textMuted mt-2 line-clamp-2">{theme.description}</p>
                          </div>

                          <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-black/10 dark:border-white/5">
                            <div className="flex gap-1.5">
                              <div className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: `rgb(${theme.primary})` }} />
                              <div className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: `rgb(${theme.primaryLight})` }} />
                            </div>

                            {isUnlocked ? (
                              isActive ? (
                                <span className="text-xs font-bold text-primaryLight uppercase tracking-wider flex items-center gap-1"><CheckCircle size={14} /> Active</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleSelectTheme}
                                  className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-black/20 dark:border-white/10 text-textMain rounded-lg text-xs font-bold transition-all"
                                >
                                  Select
                                </button>
                              )
                            ) : (
                              <button
                                type="button"
                                onClick={handleUnlockTheme}
                                disabled={!canAfford}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                                  ${canAfford
                                    ? 'bg-gradient-main text-white hover:shadow-md active:scale-95'
                                    : 'bg-black/10 dark:bg-white/5 text-textMuted cursor-not-allowed'}`}
                              >
                                Buy Theme
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cursors Shelf */}
                <div className="space-y-4 pt-4 border-t border-black/20 dark:border-white/10">
                  <h3 className="text-lg font-bold text-textMain flex items-center gap-2">
                    <Zap size={18} className="text-primaryLight" /> Custom Cursors
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {XP_STORE_CURSORS.map(cursor => {
                      const isUnlocked = formData.settings.unlockedCursors?.includes(cursor.id) ?? (cursor.id === 'default');
                      const isActive = formData.settings.activeCursor === cursor.id || (!formData.settings.activeCursor && cursor.id === 'default');
                      const canAfford = formData.xp >= cursor.cost;

                      const handleSelectCursor = () => {
                        const updatedUser = {
                          ...formData,
                          settings: {
                            ...formData.settings,
                            activeCursor: cursor.id
                          }
                        };
                        setFormData(updatedUser);
                        onPreviewUpdate(updatedUser);
                      };

                      const handleUnlockCursor = async () => {
                        try {
                          await purchaseItem(cursor.id, cursor.cost, 'cursor');
                          if (formData.settings.soundEffects !== false) soundManager.playCoin();
                          showToast({ message: `Unlocked ${cursor.name} Cursor!`, type: 'success' });
                          setFormData(prev => ({
                            ...prev,
                            xp: prev.xp - cursor.cost,
                            settings: {
                              ...prev.settings,
                              unlockedCursors: [...(prev.settings.unlockedCursors || ['default']), cursor.id],
                              activeCursor: cursor.id
                            }
                          }));
                        } catch (err: any) {
                          showToast({ message: err.message || 'Failed to unlock cursor', type: 'error' });
                        }
                      };

                      return (
                        <div
                          key={cursor.id}
                          className={`p-5 rounded-2xl border transition-all flex flex-col justify-between h-48 bg-white/30 dark:bg-white/5
                            ${isActive ? 'border-primaryLight shadow-lg shadow-primary/10' : 'border-black/10 dark:border-white/10'}`}
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-bold text-textMain">{cursor.name}</span>
                              {isUnlocked ? (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">Owned</span>
                              ) : (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">{cursor.cost} XP</span>
                              )}
                            </div>
                            <p className="text-xs text-textMuted mt-2 line-clamp-2">{cursor.description}</p>
                          </div>

                          <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-black/10 dark:border-white/5">
                            <div className="flex items-center justify-center w-12 h-6 border border-black/10 dark:border-white/5 rounded bg-black/5 dark:bg-black/20 gap-2">
                              <div className={`w-2 h-2 rounded-full ${cursor.dotClass}`} />
                              <div className={`w-4 h-4 rounded-full border-2 ${cursor.ringClass}`} />
                            </div>

                            {isUnlocked ? (
                              isActive ? (
                                <span className="text-xs font-bold text-primaryLight uppercase tracking-wider flex items-center gap-1"><CheckCircle size={14} /> Active</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleSelectCursor}
                                  className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-black/20 dark:border-white/10 text-textMain rounded-lg text-xs font-bold transition-all"
                                >
                                  Select
                                </button>
                              )
                            ) : (
                              <button
                                type="button"
                                onClick={handleUnlockCursor}
                                disabled={!canAfford}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                                  ${canAfford
                                    ? 'bg-gradient-main text-white hover:shadow-md active:scale-95'
                                    : 'bg-black/10 dark:bg-white/5 text-textMuted cursor-not-allowed'}`}
                              >
                                Buy Cursor
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Avatar Frames Shelf */}
                <div className="space-y-4 pt-4 border-t border-black/20 dark:border-white/10">
                  <h3 className="text-lg font-bold text-textMain flex items-center gap-2">
                    <User size={18} className="text-primaryLight" /> Avatar Frames
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {XP_STORE_FRAMES.map(frame => {
                      const isUnlocked = formData.settings.unlockedFrames?.includes(frame.id) ?? (frame.id === 'none');
                      const isActive = formData.settings.activeFrame === frame.id || (!formData.settings.activeFrame && frame.id === 'none');
                      const canAfford = formData.xp >= frame.cost;

                      const handleSelectFrame = () => {
                        const updatedUser = {
                          ...formData,
                          settings: {
                            ...formData.settings,
                            activeFrame: frame.id
                          }
                        };
                        setFormData(updatedUser);
                        onPreviewUpdate(updatedUser);
                      };

                      const handleUnlockFrame = async () => {
                        try {
                          await purchaseItem(frame.id, frame.cost, 'frame');
                          if (formData.settings.soundEffects !== false) soundManager.playCoin();
                          showToast({ message: `Unlocked ${frame.name} Frame!`, type: 'success' });
                          setFormData(prev => ({
                            ...prev,
                            xp: prev.xp - frame.cost,
                            settings: {
                              ...prev.settings,
                              unlockedFrames: [...(prev.settings.unlockedFrames || ['none']), frame.id],
                              activeFrame: frame.id
                            }
                          }));
                        } catch (err: any) {
                          showToast({ message: err.message || 'Failed to unlock frame', type: 'error' });
                        }
                      };

                      return (
                        <div
                          key={frame.id}
                          className={`p-5 rounded-2xl border transition-all flex flex-col justify-between h-48 bg-white/30 dark:bg-white/5
                            ${isActive ? 'border-primaryLight shadow-lg shadow-primary/10' : 'border-black/10 dark:border-white/10'}`}
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-bold text-textMain">{frame.name}</span>
                              {isUnlocked ? (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">Owned</span>
                              ) : (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">{frame.cost} XP</span>
                              )}
                            </div>
                            <p className="text-xs text-textMuted mt-2 line-clamp-2">{frame.description}</p>
                          </div>

                          <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-black/10 dark:border-white/5">
                            {/* Frame Preview */}
                            <div className="relative w-8 h-8 rounded-full overflow-visible flex items-center justify-center">
                              <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="Frame Preview Avatar"
                                className="w-8 h-8 rounded-full object-cover bg-white/10"
                                width={32}
                                height={32}
                              />
                              {frame.id !== 'none' && (
                                <div className={`absolute inset-0 rounded-full pointer-events-none ${frame.frameClass}`} />
                              )}
                            </div>

                            {isUnlocked ? (
                              isActive ? (
                                <span className="text-xs font-bold text-primaryLight uppercase tracking-wider flex items-center gap-1"><CheckCircle size={14} /> Active</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleSelectFrame}
                                  className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-black/20 dark:border-white/10 text-textMain rounded-lg text-xs font-bold transition-all"
                                >
                                  Select
                                </button>
                              )
                            ) : (
                              <button
                                type="button"
                                onClick={handleUnlockFrame}
                                disabled={!canAfford}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                                  ${canAfford
                                    ? 'bg-gradient-main text-white hover:shadow-md active:scale-95'
                                    : 'bg-black/10 dark:bg-white/5 text-textMuted cursor-not-allowed'}`}
                              >
                                Buy Frame
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Learning Section */}
            {activeTab === 'learning' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
                  <BookOpen className="text-primaryLight" /> {t('settings.learning.title')}
                </h2>

                <div className="space-y-2">
                  <label htmlFor="dailyGoal" className="text-sm font-semibold text-textMuted uppercase tracking-wider">{t('settings.learning.dailyGoal')}</label>
                  <div className="flex items-center gap-4">
                    <input
                      id="dailyGoal"
                      type="range"
                      min="10" max="120" step="10"
                      value={formData.settings.dailyGoal}
                      onChange={(e) => handleChange('dailyGoal', Number(e.target.value))}
                      title={t('settings.learning.dailyGoal')}
                      placeholder={t('settings.learning.dailyGoal')}
                      className="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primaryLight"
                    />
                    <span className="w-24 text-center font-mono text-textMain bg-white/50 dark:bg-white/5 py-2 rounded-lg border border-black/20 dark:border-white/10">
                      {formData.settings.dailyGoal} min
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/20 dark:border-white/5">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Smartphone className="text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-textMain">{t('settings.learning.reminders')}</div>
                        <div className="text-sm text-textMuted">{t('settings.learning.remindersDesc')}</div>
                      </div>
                    </div>
                    <div className="shrink-0 mt-1">
                      <Toggle checked={formData.settings.reminders} onChange={(v) => handleChange('reminders', v)} />
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/20 dark:border-white/5">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Save className="text-emerald-500 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-textMain">{t('settings.learning.autoSave')}</div>
                        <div className="text-sm text-textMuted">{t('settings.learning.autoSaveDesc')}</div>
                      </div>
                    </div>
                    <div className="shrink-0 mt-1">
                      <Toggle checked={formData.settings.autoSave} onChange={(v) => handleChange('autoSave', v)} />
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/20 dark:border-white/5">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Volume2 className="text-pink-500 dark:text-pink-400 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-textMain">Sound Effects</div>
                        <div className="text-sm text-textMuted">Play audio feedback for quiz answers, level-ups, and purchases</div>
                      </div>
                    </div>
                    <div className="shrink-0 mt-1">
                      <Toggle
                        checked={formData.settings.soundEffects !== false}
                        onChange={(v) => {
                          handleChange('soundEffects', v);
                          if (v) soundManager.playCorrect();
                        }}
                        ariaLabel="Toggle sound effects"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quiz Section */}
            {activeTab === 'quiz' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
                  <Brain className="text-primaryLight" /> {t('settings.quiz.title')}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/20 dark:border-white/5">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Zap className="text-yellow-500 dark:text-yellow-400 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-textMain">{t('settings.quiz.instantFeedback')}</div>
                        <div className="text-sm text-textMuted">{t('settings.quiz.instantFeedbackDesc')}</div>
                      </div>
                    </div>
                    <div className="shrink-0 mt-1">
                      <Toggle checked={formData.settings.instantFeedback} onChange={(v) => handleChange('instantFeedback', v)} />
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/20 dark:border-white/5">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <CheckCircle className="text-success mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-textMain">{t('settings.quiz.showAnswers')}</div>
                        <div className="text-sm text-textMuted">{t('settings.quiz.showAnswersDesc')}</div>
                      </div>
                    </div>
                    <div className="shrink-0 mt-1">
                      <Toggle checked={formData.settings.showAnswers} onChange={(v) => handleChange('showAnswers', v)} />
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/20 dark:border-white/5">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <RefreshCcw className="text-purple-500 dark:text-purple-400 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-textMain">{t('settings.quiz.allowRetry')}</div>
                        <div className="text-sm text-textMuted">{t('settings.quiz.allowRetryDesc')}</div>
                      </div>
                    </div>
                    <div className="shrink-0 mt-1">
                      <Toggle checked={formData.settings.retryQuiz} onChange={(v) => handleChange('retryQuiz', v)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Saved AI Notes Section */}
            {activeTab === 'aiNotes' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-textMain mb-2 flex items-center gap-2">
                    <Bookmark className="text-primaryLight" /> Saved AI Notes
                  </h2>
                  <p className="text-textMuted">Technical explanations and tips you've bookmarked from the AI Tutor.</p>
                </div>

                {savedNotes.length === 0 ? (
                  <div className="text-center py-16 text-textMuted">
                    <Bookmark size={48} className="mx-auto mb-4 opacity-30" />
                    <p>You haven't saved any AI notes yet.</p>
                    <p className="text-sm mt-1">Look for the bookmark icon on AI Tutor responses.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedNotes.map(note => (
                      <div key={note.id} className="p-5 rounded-2xl border border-black/20 dark:border-white/10 bg-white/50 dark:bg-white/5">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-primaryLight">{note.courseTitle}</span>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-textMuted hover:text-red-500 transition-colors shrink-0"
                            title="Delete note"
                            aria-label="Delete note"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-textMain leading-relaxed whitespace-pre-wrap">{note.text}</p>
                        <p className="text-xs text-textMuted mt-3">{new Date(note.savedAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Certificate Section */}
            {activeTab === 'certificate' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
                  <Award className="text-primaryLight" /> {t('settings.certificate.title')}
                </h2>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-textMuted uppercase tracking-wider">{t('settings.certificate.nameLabel')}</label>
                  <input
                    type="text"
                    value={formData.settings.certificateName}
                    onChange={(e) => handleChange('certificateName', e.target.value)}
                    placeholder={t('settings.certificate.namePlaceholder')}
                    className="w-full bg-white/50 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-xl px-4 py-3 text-textMain focus:border-primaryLight focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-textMuted">{t('settings.certificate.nameHint')}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-textMuted uppercase tracking-wider">{t('settings.certificate.format')}</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 rounded-xl border border-primaryLight bg-primary/10 text-primaryLight font-bold">{t('settings.certificate.pdf')}</button>
                    <button className="p-4 rounded-xl border border-black/20 dark:border-white/10 bg-black/5 dark:bg-white/5 text-textMuted hover:bg-black/10 dark:hover:bg-white/10 cursor-not-allowed">{t('settings.certificate.image')}</button>
                  </div>
                </div>
              </div>
            )}

            {/* Achievements Section */}
            {activeTab === 'achievements' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
                  <Trophy className="text-primaryLight" /> {t('settings.achievements.title')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BADGE_DEFINITIONS.map(badge => {
                    const earned = (formData.badges || []).includes(badge.id);
                    const BadgeIcon = BADGE_ICONS[badge.icon] || Trophy;
                    return (
                      <div
                        key={badge.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all
                          ${earned
                            ? 'bg-primary/10 border-primary/20'
                            : 'bg-white/50 dark:bg-white/5 border-black/20 dark:border-white/10 opacity-50'
                          }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                          ${earned ? 'bg-gradient-main text-white' : 'bg-black/10 dark:bg-white/10 text-textMuted'}`}
                        >
                          {earned ? <BadgeIcon size={22} /> : <Lock size={20} />}
                        </div>
                        <div>
                          <div className="font-bold text-textMain">{badge.name}</div>
                          <div className="text-sm text-textMuted">{badge.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Account Section */}
            {activeTab === 'account' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
                  <Shield className="text-primaryLight" /> {t('settings.account.title')}
                </h2>

                {(isInstallable || isInstalled) && (
                  <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Download className="text-primaryLight" />
                      <div className="text-left">
                        <div className="font-bold text-textMain">Install SkillVerse App</div>
                        <div className="text-sm text-textMuted">
                          {isInstalled
                            ? 'SkillVerse is installed and works offline for previously viewed courses.'
                            : 'Add SkillVerse to your home screen for a full-screen, offline-ready experience.'}
                        </div>
                      </div>
                    </div>
                    {!isInstalled && (
                      <button
                        onClick={async () => {
                          const accepted = await promptInstall();
                          if (accepted) showToast({ message: 'SkillVerse installed!', type: 'success' });
                        }}
                        className="px-4 py-2 bg-gradient-main text-white rounded-lg text-sm font-bold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background shrink-0"
                      >
                        Install
                      </button>
                    )}
                  </div>
                )}

                {/* Export / import before the destructive actions, so there is
                    always a way to take a copy first. */}
                <DataPortabilityPanel />

                <div className="space-y-4">
                  <button
                    onClick={() => setModal({ type: 'reset' })}
                    className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 border border-black/20 dark:border-white/10 rounded-xl transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <div className="flex items-center gap-3">
                      <RefreshCcw className="text-orange-500 dark:text-orange-400" />
                      <div className="text-left">
                        <div className="font-bold text-textMain">{t('settings.account.resetProgress')}</div>
                        <div className="text-sm text-textMuted">{t('settings.account.resetProgressDesc')}</div>
                      </div>
                    </div>
                    <span className="text-textMuted group-hover:text-textMain">{t('settings.account.reset')}</span>
                  </button>

                  <button
                    onClick={() => setModal({ type: 'clear' })}
                    className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 hover:bg-red-500/10 border border-black/20 dark:border-white/10 hover:border-red-500/50 rounded-xl transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <div className="flex items-center gap-3">
                      <Trash2 className="text-red-500 dark:text-red-400" />
                      <div className="text-left">
                        <div className="font-bold text-textMain group-hover:text-red-500 dark:group-hover:text-red-400">{t('settings.account.clearData')}</div>
                        <div className="text-sm text-textMuted group-hover:text-red-400 dark:group-hover:text-red-300">{t('settings.account.clearDataDesc')}</div>
                      </div>
                    </div>
                    <span className="text-textMuted group-hover:text-red-500 dark:group-hover:text-red-400">{t('settings.account.clear')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Save Button (Global) */}
            <div className="mt-12 pt-6 border-t border-black/20 dark:border-white/10 flex justify-end">
              <button
                onClick={saveSettings}
                className="flex items-center gap-2 bg-gradient-main text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Save size={20} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal({ type: null })} />
          <div
            ref={confirmModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            tabIndex={-1}
            className="relative bg-background border border-black/20 dark:border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up"
          >
            {modal.type === 'unsaved' ? (
              <>
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-4 mx-auto">
                  <AlertTriangle size={24} />
                </div>
                <h3 id="confirm-modal-title" className="text-xl font-bold text-textMain text-center mb-2">
                  {t('settings.modals.unsavedTitle')}
                </h3>
                <p className="text-textMuted text-center mb-6">
                  {t('settings.modals.unsavedBody')}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setModal({ type: null })}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-textMain border border-black/20 dark:border-white/10 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {t('settings.modals.stay')}
                  </button>
                  <button
                    onClick={handleLeave}
                    className="flex-1 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {t('settings.modals.leave')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 mx-auto">
                  <AlertTriangle size={24} />
                </div>
                <h3 id="confirm-modal-title" className="text-xl font-bold text-textMain text-center mb-2">
                  {modal.type === 'reset' ? t('settings.modals.resetTitle') : t('settings.modals.clearTitle')}
                </h3>
                <p className="text-textMuted text-center mb-6">
                  {modal.type === 'reset'
                    ? t('settings.modals.resetBody')
                    : t('settings.modals.clearBody')}

                </p>
                {modal.type === 'clear' && (
                  <p className="text-sm text-orange-500 dark:text-orange-400 text-center -mt-3 mb-6">
                    Tip: export a backup first — this cannot be undone.
                  </p>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={() => setModal({ type: null })}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-textMain border border-black/20 dark:border-white/10 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={modal.type === 'reset' ? handleResetProgress : handleClearData}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {t('common.confirm')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};