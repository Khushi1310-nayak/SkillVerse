import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Eye, EyeOff, Github, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { validateEmail } from '../utils/validators';
import { AuthView } from './Auth';

interface LoginFormProps {
  setView: (view: AuthView) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ setView }) => {
  const { login, loginWithGoogle, loginWithGithub } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    try {
      if (provider === 'google') await loginWithGoogle();
      if (provider === 'github') await loginWithGithub();
    } catch (err: any) {
      showToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eValid = validateEmail(email);
    if (!eValid.valid) return showToast({ message: eValid.error || "Invalid email", type: 'error' });

    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      showToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
        <div className="space-y-2 px-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-textMuted pl-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-black/20 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-textMain placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div className="space-y-2 px-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-textMuted pl-1">
              Password
            </label>
            <button 
              type="button"
              onClick={() => setView('forgot')}
              className="text-xs text-primaryLight hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
            <input 
              type={showPassword ? "text" : "password"}
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-black/20 dark:border-white/10 rounded-xl py-3 pl-12 pr-12 text-textMain placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={loading}
          className="mt-4 w-full bg-gradient-main text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-black/20 dark:border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight size={20} />
            </>
          )}
        </motion.button>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="h-px bg-white/10 flex-1" />
        <div className="text-xs text-textMuted uppercase">Or continue with</div>
        <div className="h-px bg-white/10 flex-1" />
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
          className="flex-1 bg-white/5 hover:bg-white/10 border border-black/20 dark:border-white/10 rounded-xl py-3 flex items-center justify-center gap-2 transition-colors focus:outline-none"
        >
          <Chrome size={18} /> Google
        </button>
        <button 
          onClick={() => handleSocialLogin('github')}
          disabled={loading}
          className="flex-1 bg-white/5 hover:bg-white/10 border border-black/20 dark:border-white/10 rounded-xl py-3 flex items-center justify-center gap-2 transition-colors focus:outline-none"
        >
          <Github size={18} /> GitHub
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-textMuted text-sm">
          Don't have an account?{' '}
          <button 
            onClick={() => setView('signup')}
            className="text-primaryLight hover:text-white font-medium transition-colors ml-1 focus:outline-none"
          >
            Sign Up
          </button>
        </p>
      </div>
    </>
  );
};