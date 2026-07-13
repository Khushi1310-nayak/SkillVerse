import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

interface VerifyEmailProps {
  email: string;
}

export const VerifyEmail: React.FC<VerifyEmailProps> = ({ email }) => {
  const { resendVerificationEmail, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleResendVerify = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await resendVerificationEmail();
      setSuccessMsg("Verification email sent! Please check your inbox.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12 relative z-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-md bg-glass border border-white/20 p-8 rounded-3xl shadow-2xl text-center"
      >
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="text-primaryLight w-10 h-10" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Verify your email</h2>
        <p className="text-textMuted mb-8">
          We've sent a verification link to <span className="font-bold text-white">{user?.email || email}</span>. 
          Please verify your email to access the platform.
        </p>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        {successMsg && <div className="mb-4 text-green-500 text-sm">{successMsg}</div>}
        <button 
          onClick={handleResendVerify}
          disabled={loading}
          className="w-full bg-gradient-main text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/40 transition-all flex justify-center items-center gap-2 mb-4 disabled:opacity-50"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Resend Verification Email"
          )}
        </button>
        <button 
          onClick={() => window.location.reload()} 
          className="text-textMuted text-sm hover:text-white transition-colors"
        >
          I have verified my email
        </button>
      </motion.div>
    </div>
  );
};
