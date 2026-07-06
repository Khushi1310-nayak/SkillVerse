
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

    // Colors must be space-separated RGB values for Tailwind opacity to work
    let primary = '105 104 166'; // #6968A6
    let primaryLight = '207 152 147'; // #CF9893

    if (user?.settings?.gradientIntensity === 'low') {
      // Subtle
      primary = '139 138 174'; // #8b8aae
      primaryLight = '220 189 187'; // #dcbdbb
    } else if (user?.settings?.gradientIntensity === 'high') {
      // Vibrant
      primary = '81 78 204'; // #514ecc
      primaryLight = '239 107 94'; // #ef6b5e
    }

    document.documentElement.style.setProperty('--color-primary', primary);
    document.documentElement.style.setProperty('--color-primary-light', primaryLight);
  }, [user?.settings?.theme, user?.settings?.gradientIntensity]);

  const getOpacityClass = () => {
    if (user?.settings?.gradientIntensity === 'low') return 'opacity-30';
    if (user?.settings?.gradientIntensity === 'high') return 'opacity-100';
    return 'opacity-60';
  };
  const opacityClass = getOpacityClass();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, id }: { to: string; icon: any; label: string; id?: string }) => (
    <Link
      to={to}
      id={id}
      onClick={() => setMobileMenuOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 overflow-hidden
        ${isActive(to) 
          ? 'bg-gradient-main text-white shadow-lg shadow-primary/20' 
          : 'text-textMuted hover:bg-white/5 hover:text-textMain'
        }`}
    >
      <div className="min-w-[20px] flex items-center justify-center"><Icon size={20} /></div>
      
      {/* For mobile, always show text */}
      <span className="font-medium whitespace-nowrap lg:hidden">{label}</span>
      
      {/* For desktop, show text only when sidebar is hovered */}
      <span className="font-medium whitespace-nowrap hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">{label}</span>
      
      {isActive(to) && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300" />}
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
            className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] transition-opacity duration-700 ${opacityClass}`}
          />
          <div 
            className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] transition-opacity duration-700 ${opacityClass}`}
          />
        </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col group w-[88px] hover:w-72 h-screen sticky top-0 border-r border-white/20 dark:border-white/5 bg-background/80 backdrop-blur-xl z-50 py-6 px-4 hover:px-6 shadow-2xl transition-all duration-300 overflow-hidden overflow-y-auto no-scrollbar">
        <Link to="/" className="flex items-center gap-3 mb-12 overflow-hidden px-2 group/logo">
           <div className="relative w-12 h-12 min-w-[48px] rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10 group-hover/logo:ring-primaryLight/50 group-hover/logo:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-main rounded-xl blur-md opacity-40 group-hover/logo:opacity-80 transition-opacity duration-500"></div>
              <img src="/skillverse-logo.png" alt="SkillVerse Logo" className="relative z-10 w-full h-full object-cover rounded-xl" />
           </div>
           <span className="text-2xl font-display font-bold bg-gradient-main bg-clip-text text-transparent whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

        <div className="pt-6 border-t border-black/5 dark:border-white/5 overflow-hidden">
          <div className="flex items-center gap-3 px-2 py-3 mb-2 overflow-hidden" id="nav-user-profile">
             <img 
               src={AVATARS[user.settings.avatarId || '1']} 
               alt="Avatar" 
               className="w-10 h-10 min-w-[40px] rounded-full bg-white/10"
             />
             <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="font-bold text-textMain truncate">{user.username}</div>
                <div className="text-xs text-textMuted truncate">{user.email}</div>
             </div>
          </div>
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-textMuted hover:bg-red-500/10 hover:text-red-400 transition-all overflow-hidden"
          >
            <div className="min-w-[20px] flex items-center justify-center"><LogOut size={20} /></div>
            <span className="font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 z-50">
         <Link to="/" className="text-xl font-display font-bold text-textMain">SkillVerse</Link>
         <button onClick={() => setMobileMenuOpen(true)} className="text-textMain p-2" title="Open Menu" aria-label="Open Menu">
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
                <button onClick={() => setMobileMenuOpen(false)} className="text-textMuted" title="Close Menu" aria-label="Close Menu"><X /></button>
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
      <main className="flex-1 relative z-10 w-full min-w-0 transition-all duration-300">
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
