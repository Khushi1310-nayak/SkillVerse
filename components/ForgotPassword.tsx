import React, { useState } from 'react';
import { ArrowRight, Mail, AlertTriangle, Check, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { validateEmail } from '../utils/validators';
import { AuthView } from './Auth';
import { useToast } from '../contexts/ToastContext';

interface ForgotPasswordProps {
  setView: (view: AuthView) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ setView }) => {
  const { resetPassword } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

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

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      showToast({ message: emailValidation.error || 'Please enter a valid email address.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim().toLowerCase());
      showToast({ message: 'Password reset email sent. Check your inbox for the next step.', type: 'success' });
      setTimeout(() => setView('login'), 3000);
    } catch (err: any) {
      showToast({ message: getFriendlyResetError(err), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

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
              className="w-full bg-white/5 border border-black/20 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-textMain placeholder-textMuted focus:outline-none focus:border-primaryLight focus:ring-1 focus:ring-primaryLight transition-all"
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
            <span className="w-5 h-5 border-2 border-black/20 dark:border-white/30 border-t-white rounded-full animate-spin" />
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
