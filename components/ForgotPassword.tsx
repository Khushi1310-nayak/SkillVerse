import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Eye, EyeOff, AlertTriangle, Check, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { checkPasswordStrength, validateEmail } from '../utils/validators';
import { CheckItem } from './CheckItem';
import { AuthView } from './Auth';

interface ForgotPasswordProps {
  setView: (view: AuthView) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ setView }) => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const pwdStrength = checkPasswordStrength(password);

  const shakeAnimation = {
    shake: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const eValid = validateEmail(email);
    if (!eValid.valid) return setError(eValid.error || "Invalid email");

    if (pwdStrength.score < 2 || !pwdStrength.checks.length) {
      return setError("Please create a stronger password (minimum 12 characters).");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccessMsg("Password reset email sent! Check your inbox.");
      setTimeout(() => setView('login'), 3000);
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
              New Password
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

        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 px-1 overflow-hidden"
          >
            <label className="text-xs font-semibold uppercase tracking-wider text-textMuted pl-1">Confirm New Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
              <input 
                type="password"
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-textMain placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
                placeholder="••••••••"
              />
              {confirmPassword.length > 0 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {confirmPassword === password ? <Check size={18} className="text-green-500" /> : <AlertTriangle size={18} className="text-red-500" />}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

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
              Send Reset Link <ArrowRight size={20} />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={() => setView('login')}
          className="text-textMuted hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition-colors focus:outline-none"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>
      </div>
    </>
  );
};
