
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  Settings, 
  Menu, 
  X, 
  AlertTriangle,
  Briefcase 
} from 'lucide-react';
import { User } from '../types';
import { GoldSnow } from './GoldSnow';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const AVATARS: Record<string, string> = {
  '1': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  '2': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  '3': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  '4': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  '5': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
};

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Apply theme and gradient intensity
  useEffect(() => {
    if (user?.settings?.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [user?.settings?.theme]);

  const gradientOpacity = user?.settings?.gradientIntensity === 'low' ? 0.3 : user?.settings?.gradientIntensity === 'high' ? 1.0 : 0.6;

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, id }: { to: string; icon: any; label: string; id?: string }) => (
    <Link
      to={to}
      id={id}
      onClick={() => setMobileMenuOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${isActive(to) 
          ? 'bg-gradient-main text-white shadow-lg shadow-primary/20' 
          : 'text-textMuted hover:bg-white/5 hover:text-textMain'
        }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {isActive(to) && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
    </Link>
  );

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
    navigate('/');
  };

  if (!user) {
    // Should typically be handled by LandingPage -> Auth flow in App.tsx
    // But if Layout wraps Auth:
    return (
      <div className="min-h-screen font-sans text-textMain bg-background relative overflow-hidden transition-colors duration-500">
        <GoldSnow />
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px]" />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-textMain bg-background flex transition-colors duration-500">
       <GoldSnow />
       {/* Background Ambience */}
       <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div 
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] transition-opacity duration-700"
            style={{ opacity: gradientOpacity }} 
          />
          <div 
            className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] transition-opacity duration-700" 
            style={{ opacity: gradientOpacity }}
          />
        </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-white/20 dark:border-white/5 bg-background/80 backdrop-blur-xl z-50 p-6 shadow-2xl transition-colors duration-500">
        <Link to="/" className="flex items-center gap-3 mb-12">
           <div className="w-10 h-10 rounded-xl bg-gradient-main flex items-center justify-center text-white font-bold shadow-lg">
              SV
           </div>
           <span className="text-2xl font-display font-bold bg-gradient-main bg-clip-text text-transparent">
              SkillVerse
           </span>
        </Link>

        <nav className="flex-1 space-y-2">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" id="nav-dashboard" />
          <NavItem to="/courses" icon={BookOpen} label="Courses" id="nav-courses" />
          <NavItem to="/career" icon={Briefcase} label="Career Mode" id="nav-career" />
          <NavItem to="/certifications" icon={Award} label="Certifications" id="nav-certs" />
          <NavItem to="/settings" icon={Settings} label="Settings" id="nav-settings" />
        </nav>

        <div className="pt-6 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-2" id="nav-user-profile">
             <img 
               src={AVATARS[user.settings.avatarId || '1']} 
               alt="Avatar" 
               className="w-10 h-10 rounded-full bg-white/10"
             />
             <div className="overflow-hidden">
                <div className="font-bold text-textMain truncate">{user.username}</div>
                <div className="text-xs text-textMuted truncate">{user.email}</div>
             </div>
          </div>
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-textMuted hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 z-50">
         <Link to="/" className="text-xl font-display font-bold text-textMain">SkillVerse</Link>
         <button onClick={() => setMobileMenuOpen(true)} className="text-textMain p-2">
            <Menu />
         </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 bottom-0 left-0 w-3/4 max-w-sm bg-background border-r border-white/10 p-6 flex flex-col animate-slide-right">
             <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold text-textMain">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-textMuted"><X /></button>
             </div>
             <nav className="space-y-2 flex-1">
                <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/courses" icon={BookOpen} label="Courses" />
                <NavItem to="/career" icon={Briefcase} label="Career Mode" />
                <NavItem to="/certifications" icon={Award} label="Certifications" />
                <NavItem to="/settings" icon={Settings} label="Settings" />
             </nav>
             <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-3 px-4 py-3 text-red-400 font-medium"
              >
                <LogOut size={20} /> Log Out
              </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full lg:max-w-[calc(100vw-288px)]">
         <div className="pt-24 lg:pt-10 px-6 lg:px-12 pb-12 mx-auto max-w-7xl">
            {children}
         </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
           <div className="relative bg-background border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 mx-auto">
                 <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-textMain text-center mb-2">Log Out?</h3>
              <p className="text-textMuted text-center mb-6">Are you sure you want to log out of your account?</p>
              <div className="flex gap-4">
                 <button 
                   onClick={() => setShowLogoutConfirm(false)}
                   className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-textMain border border-black/5 dark:border-white/10 font-medium transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={confirmLogout}
                   className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                 >
                   Log Out
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
