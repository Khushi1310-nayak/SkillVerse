import React, { useState } from 'react';
import { ArrowRight, Mail, AlertTriangle, Check, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { validateEmail } from '../utils/validators';
import { AuthView } from './Auth';

interface ForgotPasswordProps {
  setView: (view: AuthView) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ setView }) => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const shakeAnimation = {
    shake: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } }
  };

  const getFriendlyResetError = (err: unknown) => {
    const rawError = typeof err === 'string'
      ? err
      : err && typeof err === 'object'
        ? `${'code' in err ? String((err as { code?: unknown }).code ?? '') : ''} ${'message' in err ? String((err as { message?: unknown }).message ?? '') : ''}`
        : '';

    const normalized = rawError.toLowerCase();

    if (normalized.includes('auth/user-not-found') || normalized.includes('user-not-found')) {
      return "We couldn't find an account with that email address.";
    }

    if (normalized.includes('auth/invalid-email') || normalized.includes('invalid-email')) {
      return 'Please enter a valid email address.';
    }

    if (normalized.includes('auth/too-many-requests') || normalized.includes('too-many-requests')) {
      return 'Too many password reset attempts. Please wait a few minutes and try again.';
    }

    return 'We could not send a password reset email right now. Please try again in a few minutes.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return setError(emailValidation.error || 'Please enter a valid email address.');
    }

    setLoading(true);
    try {
      await resetPassword(email.trim().toLowerCase());
      setSuccessMsg('Password reset email sent. Check your inbox for the next step.');
      setTimeout(() => setView('login'), 3000);
    } catch (err: any) {
      setError(getFriendlyResetError(err));
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
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="mb-6 overflow-hidden"
          >
            <div className="relative rounded-2xl border border-green-400/30 bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-transparent p-5 shadow-[0_20px_60px_rgba(34,197,94,0.18)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.22),transparent_55%)]" />
              <div className="relative flex flex-col items-center text-center gap-3 text-green-100">
                <motion.div
                  initial={{ scale: 0.7, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                  className="w-16 h-16 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center shadow-lg shadow-green-500/20"
                >
                  <Check size={32} className="text-green-300" />
                </motion.div>
                <div>
                  <div className="text-lg font-bold text-green-100">Reset link sent</div>
                  <p className="text-sm text-green-100/80 mt-1">{successMsg}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 relative z-10">
        <div className="space-y-2 px-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-textMuted pl-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
            <input 
              type="text"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-textMain placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
              placeholder="name@example.com"
            />
          </div>
          <p className="text-xs text-textMuted pl-1">
            We’ll send a reset link to this address if an account exists.
          </p>
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
