import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, User as UserIcon, Eye, EyeOff, AlertTriangle, Check, Github, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { checkPasswordStrength, validateEmail, validateUsername } from '../utils/validators';
import { CheckItem } from './CheckItem';
import { AuthView } from './Auth';

interface SignupFormProps {
  setView: (view: AuthView) => void;
  onSignupSuccess: (email: string) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ setView, onSignupSuccess }) => {
  const { signup, loginWithGoogle, loginWithGithub } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const pwdStrength = checkPasswordStrength(password);

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

    const uValid = validateUsername(username);
    if (!uValid.valid) return setError(uValid.error || "Invalid username");

    const eValid = validateEmail(email);
    if (!eValid.valid) return setError(eValid.error || "Invalid email");

    if (pwdStrength.score < 2 || !pwdStrength.checks.length) {
      return setError("Please create a stronger password (minimum 12 characters).");
    }

    setLoading(true);
    try {
      await signup(email, password, username);
      onSignupSuccess(email);
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
        <AnimatePresence mode="popLayout">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-1 py-1 space-y-2"
          >
            <label className="text-xs font-semibold uppercase tracking-wider text-textMuted pl-1">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-textMain placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
                placeholder="Choose a username"
              />
            </div>
          </motion.div>
        </AnimatePresence>

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
          
          <AnimatePresence>
            {password.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs text-textMuted font-bold">Password Strength</div>
                    <div className={`text-xs font-bold ${pwdStrength.label === 'Weak' ? 'text-red-500' : pwdStrength.label === 'Fair' ? 'text-orange-500' : pwdStrength.label === 'Good' ? 'text-yellow-400' : 'text-green-500'}`}>
                      {pwdStrength.label}
                    </div>
                  </div>
                  
                  <div className="w-full h-1.5 bg-white/10 rounded-full mb-4 overflow-hidden flex gap-1">
                    <div className={`h-full ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-transparent'} flex-1 transition-colors duration-300`} />
                    <div className={`h-full ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-transparent'} flex-1 transition-colors duration-300`} />
                    <div className={`h-full ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-transparent'} flex-1 transition-colors duration-300`} />
                    <div className={`h-full ${pwdStrength.score >= 4 ? pwdStrength.color : 'bg-transparent'} flex-1 transition-colors duration-300`} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <CheckItem met={pwdStrength.checks.length} label="12+ characters" />
                    <CheckItem met={pwdStrength.checks.upper} label="Uppercase" />
                    <CheckItem met={pwdStrength.checks.lower} label="Lowercase" />
                    <CheckItem met={pwdStrength.checks.number} label="Number" />
                    <CheckItem met={pwdStrength.checks.special} label="Special char" />
                    <CheckItem met={pwdStrength.checks.notCommon} label="Not common" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={loading || pwdStrength.score < 2}
          className="mt-4 w-full bg-gradient-main text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Create Account <ArrowRight size={20} />
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
          Already have an account?{' '}
          <button 
            onClick={() => setView('login')}
            className="text-primaryLight hover:text-white font-medium transition-colors ml-1 focus:outline-none"
          >
            Log In
          </button>
        </p>
      </div>
    </>
  );
};
