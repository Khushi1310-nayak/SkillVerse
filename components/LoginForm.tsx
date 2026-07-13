import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Eye, EyeOff, AlertTriangle, Check, Github, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { validateEmail } from '../utils/validators';
import { AuthView } from './Auth';

interface LoginFormProps {
  setView: (view: AuthView) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ setView }) => {
  const { login, loginWithGoogle, loginWithGithub } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const shakeAnimation = {
    shake: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setError(null);
    setLoading(true);
    try {
      if (provider === 'google') await loginWithGoogle();
      if (provider === 'github') await loginWithGithub();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const eValid = validateEmail(email);
    if (!eValid.valid) return setError(eValid.error || "Invalid email");

    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', ...shakeAnimation.shake }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
              <AlertTriangle size={16} className="shrink-0" /> {error}
            </div>
          </motion.div>
        )}
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-2">
              <Check size={16} className="shrink-0" /> {successMsg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-textMain placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
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
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-textMain placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
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
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 flex items-center justify-center gap-2 transition-colors focus:outline-none"
        >
          <Chrome size={18} /> Google
        </button>
        <button 
          onClick={() => handleSocialLogin('github')}
          disabled={loading}
          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 flex items-center justify-center gap-2 transition-colors focus:outline-none"
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
