import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPassword } from './ForgotPassword';
import { VerifyEmail } from './VerifyEmail';

export type AuthView = 'login' | 'signup' | 'forgot' | 'verify';

export const Auth: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  
  // If user is logged in but unverified, force them into verify view
  useEffect(() => {
    if (user && !user.emailVerified && user.providerData[0]?.providerId === "password") {
       setView('verify');
    }
  }, [user]);

  if (view === 'verify') {
    return <VerifyEmail email={email} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12 relative z-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <motion.h1 
            key={`h1-${view}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold mb-4 bg-gradient-main bg-clip-text text-transparent"
          >
            {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Start Your Journey' : 'Reset Password'}
          </motion.h1>
          <motion.p 
            key={`p-${view}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-textMuted"
          >
            {view === 'login' 
              ? 'Continue building your professional portfolio.' 
              : view === 'signup'
              ? 'Join thousands of developers mastering their craft.'
              : 'Create a new password to access your account.'}
          </motion.p>
        </div>

        <motion.div 
           layout
           className="bg-glass border border-black/20 dark:border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden group backdrop-blur-md"
        >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            
            {view === 'login' && <LoginForm setView={setView} />}
            {view === 'signup' && <SignupForm setView={setView} onSignupSuccess={(userEmail) => { setEmail(userEmail); setView('verify'); }} />}
            {view === 'forgot' && <ForgotPassword setView={setView} />}
        </motion.div>
      </div>
    </div>
  );
};