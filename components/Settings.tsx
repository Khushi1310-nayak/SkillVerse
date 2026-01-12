import React, { useState } from 'react';
import { 
  User, Palette, BookOpen, Brain, Award, Shield, 
  Moon, Sun, Save, CheckCircle, RefreshCcw, Trash2, 
  LogOut, AlertTriangle, Smartphone, Zap
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { User as UserType, UserSettings } from '../types';

interface SettingsProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
  onLogout: () => void;
}

const AVATARS = [
  { id: '1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { id: '2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
  { id: '3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
  { id: '4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo' },
  { id: '5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha' },
];

export const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState<UserType>(user);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [modal, setModal] = useState<{ type: 'reset' | 'clear' | null }>({ type: null });

  const handleChange = (field: keyof UserSettings, value: any) => {
    const updatedUser = {
      ...formData,
      settings: { ...formData.settings, [field]: value }
    };
    setFormData(updatedUser);

    // Apply appearance settings immediately for live preview
    if (field === 'theme' || field === 'gradientIntensity') {
      onUpdateUser(updatedUser);
    }
  };

  const handleProfileChange = (field: keyof UserType, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const saveSettings = () => {
    storageService.updateUser(formData);
    onUpdateUser(formData);
    showToast('Settings Saved Successfully');
  };

  const handleResetProgress = () => {
    storageService.resetProgress();
    setModal({ type: null });
    showToast('Progress Reset Successfully');
  };

  const handleClearData = () => {
    storageService.clearData();
    setModal({ type: null });
    // Resetting app state via logout ensures clean slate without hard browser reload
    onLogout();
  };

  const TabButton = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left mb-1
        ${activeTab === id 
          ? 'bg-primary/10 text-primaryLight border border-primary/20 shadow-sm' 
          : 'text-textMuted hover:bg-white/5 hover:text-textMain'
        }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${checked ? 'bg-primaryLight shadow-[0_0_10px_rgba(207,152,147,0.4)]' : 'bg-black/10 dark:bg-white/10'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${checked ? 'left-7' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="animate-fade-in relative">
      <h1 className="text-3xl font-display font-bold text-textMain mb-8">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-glass border border-white/20 dark:border-white/10 rounded-2xl p-4 sticky top-24">
            <TabButton id="profile" icon={User} label="Profile" />
            <TabButton id="appearance" icon={Palette} label="Appearance" />
            <TabButton id="learning" icon={BookOpen} label="Learning" />
            <TabButton id="quiz" icon={Brain} label="Quiz" />
            <TabButton id="certificate" icon={Award} label="Certificate" />
            <TabButton id="account" icon={Shield} label="Account" />
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-glass border border-white/20 dark:border-white/10 rounded-3xl p-8 min-h-[500px] relative">
            
            {/* Save Toast */}
            {toastMessage && (
              <div className="absolute top-4 right-4 bg-success text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg animate-fade-in z-20">
                <CheckCircle size={16} /> {toastMessage}
              </div>
            )}

            {/* Profile Section */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
                  <User className="text-primaryLight" /> Profile Settings
                </h2>
                
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-textMuted uppercase tracking-wider">Avatar</label>
                  <div className="flex flex-wrap gap-4">
                    {AVATARS.map(avatar => (
                      <button
                        key={avatar.id}
                        onClick={() => handleChange('avatarId', avatar.id)}
                        className={`p-1 rounded-full border-2 transition-all ${formData.settings.avatarId === avatar.id ? 'border-primaryLight scale-110' : 'border-transparent hover:border-white/20'}`}
                      >
                        <img src={avatar.url} alt="Avatar" className="w-12 h-12 rounded-full bg-white/10" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-textMuted uppercase tracking-wider">Display Name</label>
                    <input 
                      type="text" 
                      value={formData.username}
                      onChange={(e) => handleProfileChange('username', e.target.value)}
                      className="w-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-textMain focus:border-primaryLight focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-textMuted uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-textMain focus:border-primaryLight focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                   <p className="text-sm text-textMuted">Member since: <span className="text-textMain font-medium">{new Date(formData.enrolledDate).toLocaleDateString()}</span></p>
                </div>
              </div>
            )}

            {/* Appearance Section */}
            {activeTab === 'appearance' && (
               <div className="space-y-8 animate-fade-in">
                 <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
                   <Palette className="text-primaryLight" /> Appearance
                 </h2>

                 <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3">
                       {formData.settings.theme === 'dark' ? <Moon size={24} className="text-purple-400" /> : <Sun size={24} className="text-yellow-400" />}
                       <div>
                          <div className="font-bold text-textMain">Theme Mode</div>
                          <div className="text-sm text-textMuted">Toggle between dark and light mode</div>
                       </div>
                    </div>
                    <div className="flex bg-black/5 dark:bg-black/30 rounded-lg p-1">
                       <button 
                         onClick={() => handleChange('theme', 'light')}
                         className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${formData.settings.theme === 'light' ? 'bg-white text-black shadow-md' : 'text-textMuted hover:text-textMain'}`}
                       >
                         Light
                       </button>
                       <button 
                         onClick={() => handleChange('theme', 'dark')}
                         className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${formData.settings.theme === 'dark' ? 'bg-gray-700 text-white shadow-md' : 'text-textMuted hover:text-textMain'}`}
                       >
                         Dark
                       </button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-sm font-semibold text-textMuted uppercase tracking-wider">Gradient Intensity</label>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={formData.settings.gradientIntensity === 'low' ? 30 : formData.settings.gradientIntensity === 'medium' ? 60 : 90}
                      onChange={(e) => {
                         const val = Number(e.target.value);
                         handleChange('gradientIntensity', val < 40 ? 'low' : val < 70 ? 'medium' : 'high');
                      }}
                      className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primaryLight"
                    />
                    <div className="flex justify-between text-xs text-textMuted">
                       <span>Subtle</span>
                       <span>Balanced</span>
                       <span>Vibrant</span>
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-textMuted uppercase tracking-wider">Accent Preview</label>
                    <div className="h-24 rounded-xl bg-gradient-main flex items-center justify-center shadow-lg shadow-primary/20">
                       <span className="text-white font-bold text-lg mix-blend-overlay">SkillVerse Premium UI</span>
                    </div>
                 </div>
               </div>
            )}

            {/* Learning Section */}
            {activeTab === 'learning' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
                  <BookOpen className="text-primaryLight" /> Learning Preferences
                </h2>

                <div className="space-y-2">
                   <label className="text-sm font-semibold text-textMuted uppercase tracking-wider">Daily Study Goal</label>
                   <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="10" max="120" step="10"
                        value={formData.settings.dailyGoal}
                        onChange={(e) => handleChange('dailyGoal', Number(e.target.value))}
                        className="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primaryLight"
                      />
                      <span className="w-24 text-center font-mono text-textMain bg-white/50 dark:bg-white/5 py-2 rounded-lg border border-black/5 dark:border-white/10">
                        {formData.settings.dailyGoal} min
                      </span>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-3">
                         <Smartphone className="text-blue-500 dark:text-blue-400" />
                         <div>
                            <div className="font-bold text-textMain">Progress Reminders</div>
                            <div className="text-sm text-textMuted">Get notified to keep your streak</div>
                         </div>
                      </div>
                      <Toggle checked={formData.settings.reminders} onChange={(v) => handleChange('reminders', v)} />
                   </div>

                   <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-3">
                         <Save className="text-emerald-500 dark:text-emerald-400" />
                         <div>
                            <div className="font-bold text-textMain">Auto-save Notes</div>
                            <div className="text-sm text-textMuted">Automatically save your progress</div>
                         </div>
                      </div>
                      <Toggle checked={formData.settings.autoSave} onChange={(v) => handleChange('autoSave', v)} />
                   </div>
                </div>
              </div>
            )}

            {/* Quiz Section */}
            {activeTab === 'quiz' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
                  <Brain className="text-primaryLight" /> Quiz Preferences
                </h2>

                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-3">
                         <Zap className="text-yellow-500 dark:text-yellow-400" />
                         <div>
                            <div className="font-bold text-textMain">Instant Feedback</div>
                            <div className="text-sm text-textMuted">Show correct/incorrect immediately</div>
                         </div>
                      </div>
                      <Toggle checked={formData.settings.instantFeedback} onChange={(v) => handleChange('instantFeedback', v)} />
                   </div>

                   <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-3">
                         <CheckCircle className="text-success" />
                         <div>
                            <div className="font-bold text-textMain">Show Correct Answers</div>
                            <div className="text-sm text-textMuted">Reveal answers after quiz completion</div>
                         </div>
                      </div>
                      <Toggle checked={formData.settings.showAnswers} onChange={(v) => handleChange('showAnswers', v)} />
                   </div>

                   <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-3">
                         <RefreshCcw className="text-purple-500 dark:text-purple-400" />
                         <div>
                            <div className="font-bold text-textMain">Allow Retry</div>
                            <div className="text-sm text-textMuted">Permit retaking quizzes immediately</div>
                         </div>
                      </div>
                      <Toggle checked={formData.settings.retryQuiz} onChange={(v) => handleChange('retryQuiz', v)} />
                   </div>
                </div>
              </div>
            )}

            {/* Certificate Section */}
            {activeTab === 'certificate' && (
               <div className="space-y-8 animate-fade-in">
                 <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
                   <Award className="text-primaryLight" /> Certificate Settings
                 </h2>

                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-textMuted uppercase tracking-wider">Name on Certificate</label>
                    <input 
                      type="text" 
                      value={formData.settings.certificateName}
                      onChange={(e) => handleChange('certificateName', e.target.value)}
                      placeholder="Legal Name"
                      className="w-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-textMain focus:border-primaryLight focus:outline-none transition-colors"
                    />
                    <p className="text-xs text-textMuted">This name will appear on all your earned certificates.</p>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-textMuted uppercase tracking-wider">Default Format</label>
                    <div className="grid grid-cols-2 gap-4">
                       <button className="p-4 rounded-xl border border-primaryLight bg-primary/10 text-primaryLight font-bold">PDF (Standard)</button>
                       <button className="p-4 rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-textMuted hover:bg-black/10 dark:hover:bg-white/10 cursor-not-allowed">Image (Pro)</button>
                    </div>
                 </div>
               </div>
            )}

            {/* Account Section */}
            {activeTab === 'account' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
                  <Shield className="text-primaryLight" /> Account Management
                </h2>

                <div className="space-y-4">
                   <button 
                     onClick={() => setModal({ type: 'reset' })}
                     className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 border border-black/5 dark:border-white/10 rounded-xl transition-all group"
                   >
                      <div className="flex items-center gap-3">
                         <RefreshCcw className="text-orange-500 dark:text-orange-400" />
                         <div className="text-left">
                            <div className="font-bold text-textMain">Reset Progress</div>
                            <div className="text-sm text-textMuted">Clear all course progress and quiz scores</div>
                         </div>
                      </div>
                      <span className="text-textMuted group-hover:text-textMain">Reset</span>
                   </button>

                   <button 
                     onClick={() => setModal({ type: 'clear' })}
                     className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 hover:bg-red-500/10 border border-black/5 dark:border-white/10 hover:border-red-500/50 rounded-xl transition-all group"
                   >
                      <div className="flex items-center gap-3">
                         <Trash2 className="text-red-500 dark:text-red-400" />
                         <div className="text-left">
                            <div className="font-bold text-textMain group-hover:text-red-500 dark:group-hover:text-red-400">Clear Local Data</div>
                            <div className="text-sm text-textMuted group-hover:text-red-400 dark:group-hover:text-red-300">Remove all account data from this device</div>
                         </div>
                      </div>
                      <span className="text-textMuted group-hover:text-red-500 dark:group-hover:text-red-400">Clear</span>
                   </button>
                </div>
              </div>
            )}

            {/* Save Button (Global) */}
            <div className="mt-12 pt-6 border-t border-black/5 dark:border-white/10 flex justify-end">
               <button 
                 onClick={saveSettings}
                 className="flex items-center gap-2 bg-gradient-main text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95"
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
            <div className="relative bg-background border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up">
               <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 mx-auto">
                  <AlertTriangle size={24} />
               </div>
               <h3 className="text-xl font-bold text-textMain text-center mb-2">
                 {modal.type === 'reset' ? 'Reset Progress?' : 'Clear All Data?'}
               </h3>
               <p className="text-textMuted text-center mb-6">
                 {modal.type === 'reset' 
                   ? 'This will delete all your course progress and quiz scores. This action cannot be undone.'
                   : 'This will remove your account and all associated data from this browser. You will be logged out.'
                 }
               </p>
               <div className="flex gap-4">
                  <button 
                    onClick={() => setModal({ type: null })}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-textMain border border-black/5 dark:border-white/10 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={modal.type === 'reset' ? handleResetProgress : handleClearData}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                  >
                    Confirm
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};