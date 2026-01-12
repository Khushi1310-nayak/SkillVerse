import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, Mail, User, Eye, EyeOff, AlertTriangle, Check, ArrowLeft } from 'lucide-react';
import { storageService } from '../services/storageService';
import { User as UserType } from '../types';

interface AuthProps {
  onLogin: (user: UserType) => void;
}

type AuthView = 'login' | 'signup' | 'forgot';

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Clear fields when view changes
  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
    setPassword('');
    setConfirmPassword('');
    if (view === 'login') setUsername('');
  }, [view]);

  // Password Validation Rule: Min 8 chars, at least 1 number
  const isPasswordValid = (pwd: string) => {
    return pwd.length >= 8 && /\d/.test(pwd);
  };

  const getPasswordWarning = () => {
    if (!password) return null;
    const errors = [];
    if (password.length < 8) errors.push("8+ chars");
    if (!/\d/.test(password)) errors.push("1 number");
    
    if (errors.length === 0) return null;
    return `Weak password: Needs ${errors.join(" & ")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validation
    if (view === 'signup' || view === 'forgot') {
        if (!isPasswordValid(password)) {
            setError("Password must be at least 8 characters and contain a number.");
            return;
        }
        if (view === 'forgot' && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
    }

    setLoading(true);

    // Simulate Network Delay
    setTimeout(() => {
      let result;

      if (view === 'signup') {
        result = storageService.register(username, email, password);
      } else if (view === 'login') {
        result = storageService.login(email, password);
      } else if (view === 'forgot') {
        result = storageService.resetPassword(email, password);
      }

      setLoading(false);

      if (result?.success) {
        if (view === 'forgot') {
            setSuccessMsg(result.message || "Success");
            // Don't auto-login on reset, force them to try the new password
            setTimeout(() => setView('login'), 2000);
        } else if (result.user) {
            onLogin(result.user);
        }
      } else {
        setError(result?.message || "An error occurred.");
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12 animate-fade-in relative z-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 transition-all duration-500">
          <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-main bg-clip-text text-transparent animate-fade-in-up">
            {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Start Your Journey' : 'Reset Password'}
          </h1>
          <p className="text-textMuted animate-fade-in-up [animation-delay:100ms]">
            {view === 'login' 
              ? 'Continue building your professional portfolio.' 
              : view === 'signup'
              ? 'Join thousands of developers mastering their craft.'
              : 'Create a new password to access your account.'}
          </p>
        </div>

        <div className="bg-glass border border-white/20 dark:border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group backdrop-blur-md transition-all duration-500 hover:shadow-primary/10">
            {/* Glow effect on card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700 pointer-events-none" />
            
            {error && (
                <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2 animate-fade-in">
                    <AlertTriangle size={16} /> {error}
                </div>
            )}

            {successMsg && (
                <div className="mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-2 animate-fade-in">
                    <Check size={16} /> {successMsg}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
              
              {/* Username Field - Only for Signup */}
              {view === 'signup' && (
                <div className="animate-fade-in-up">
                  <div className="px-1 py-1 space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-textMuted pl-1">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                      <input 
                        type="text" 
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-textMain placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 animate-fade-in-up [animation-delay:100ms] px-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-textMuted pl-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-textMain placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-fade-in-up [animation-delay:200ms] px-1">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-wider text-textMuted pl-1">
                        {view === 'forgot' ? 'New Password' : 'Password'}
                    </label>
                    {view === 'login' && (
                        <button 
                            type="button"
                            onClick={() => setView('forgot')}
                            className="text-xs text-primaryLight hover:underline"
                        >
                            Forgot Password?
                        </button>
                    )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-white/50 dark:bg-black/20 border rounded-xl py-3 pl-12 pr-12 text-textMain placeholder-textMuted focus:outline-none focus:ring-1 transition-all
                        ${getPasswordWarning() && (view === 'signup' || view === 'forgot') 
                            ? 'border-yellow-500/50 focus:border-yellow-500 focus:ring-yellow-500' 
                            : 'border-black/5 dark:border-white/10 focus:border-primaryLight focus:ring-primaryLight'}
                    `}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Visual Password Warning */}
                {(view === 'signup' || view === 'forgot') && getPasswordWarning() && (
                    <div className="text-xs text-yellow-500 pl-1 pt-1 flex items-center gap-1 animate-fade-in">
                        <AlertTriangle size={12} /> {getPasswordWarning()}
                    </div>
                )}
              </div>

              {view === 'forgot' && (
                  <div className="space-y-2 animate-fade-in-up [animation-delay:250ms] px-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-textMuted pl-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                      <input 
                        type="password"
                        required 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-xl py-3 pl-12 pr-12 text-textMain placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="mt-4 w-full bg-gradient-main text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed animate-fade-in-up [animation-delay:300ms]"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Reset Password'} <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center animate-fade-in [animation-delay:400ms]">
                {view === 'forgot' ? (
                     <button 
                       onClick={() => setView('login')}
                       className="text-textMuted hover:text-textMain text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
                     >
                       <ArrowLeft size={14} /> Back to Login
                     </button>
                ) : (
                  <p className="text-textMuted text-sm">
                    {view === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button 
                      onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                      className="text-primaryLight hover:text-primary font-medium transition-colors ml-1 focus:outline-none"
                    >
                      {view === 'login' ? 'Sign Up' : 'Log In'}
                    </button>
                  </p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};