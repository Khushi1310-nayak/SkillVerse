
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
  Briefcase,
  Shield,
  Code2,
  Bookmark
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { User } from '../types';
import { GoldSnow } from './GoldSnow';
import { ScrollToTop } from './ScrollToTop';
import { CommandPalette } from './CommandPalette';
import { ShortcutsModal } from './ShortcutsModal';
import { XP_STORE_THEMES, XP_STORE_FRAMES } from '../constants';
interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  fallback: React.ReactNode;
}

const AVATARS: Record<string, string> = {
  '1': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  '2': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  '3': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  '4': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  '5': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
};

// Converts a "#rrggbb" (or shorthand "#rgb") hex color into the
// space-separated "r g b" string format Tailwind expects for opacity support.
const hexToRgbString = (hex?: string): string | null => {
  if (!hex) return null;
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  if (full.length !== 6) return null;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return null;
  return `${r} ${g} ${b}`;
};

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, fallback }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd+K: open Command Palette (chord — no input guard needed)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // '?': open Keyboard Shortcuts modal
      // Guard: do not fire when the user is typing inside an interactive element
      if (e.key === '?') {
        const target = e.target as HTMLElement;
        const tag = target.tagName.toLowerCase();
        if (
          tag === 'input' ||
          tag === 'textarea' ||
          tag === 'select' ||
          target.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        setShortcutsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Apply theme and gradient intensity
  useEffect(() => {
    const themePreference = user?.settings?.theme;
    const activeThemeId = user?.settings?.activeTheme || (themePreference === 'light' ? 'light' : 'dark');
    const isCustomTheme = activeThemeId === 'custom';
    const matchedTheme = XP_STORE_THEMES.find(t => t.id === activeThemeId) || XP_STORE_THEMES[0];

    const effectiveMode = isCustomTheme
      ? (themePreference || 'dark')
      : (activeThemeId === 'light' || activeThemeId === 'dark')
        ? (themePreference || matchedTheme.themeMode)
        : matchedTheme.themeMode;

    if (effectiveMode === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    // Colors must be space-separated RGB values for Tailwind opacity to work
    let primary = matchedTheme.primary;
    let primaryLight = matchedTheme.primaryLight;

    if (isCustomTheme) {
      primary = hexToRgbString(user?.settings?.customPrimary) || matchedTheme.primary;
      primaryLight = hexToRgbString(user?.settings?.customPrimaryLight) || matchedTheme.primaryLight;
    } else if (user?.settings?.gradientIntensity === 'low') {
      if (activeThemeId === 'dark' || activeThemeId === 'light') {
        primary = '139 138 174'; // #8b8aae
        primaryLight = '220 189 187'; // #dcbdbb
      }
    } else if (user?.settings?.gradientIntensity === 'high') {
      if (activeThemeId === 'dark' || activeThemeId === 'light') {
        primary = '81 78 204'; // #514ecc
        primaryLight = '239 107 94'; // #ef6b5e
      }
    }

    document.documentElement.style.setProperty('--color-primary', primary);
    document.documentElement.style.setProperty('--color-primary-light', primaryLight);
  }, [user?.settings?.theme, user?.settings?.gradientIntensity, user?.settings?.activeTheme, user?.settings?.customPrimary, user?.settings?.customPrimaryLight]);

  const getOpacityClass = () => {
    if (user?.settings?.gradientIntensity === 'low') return 'opacity-30';
    if (user?.settings?.gradientIntensity === 'high') return 'opacity-100';
    return 'opacity-60';
  };
  const opacityClass = getOpacityClass();

  const isActive = (path: string) => location.pathname === path;
  const showAdminLink = user?.role === 'admin' || user?.role === 'instructor';

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
      <aside className="hidden lg:flex flex-col group w-[88px] hover:w-72 h-screen sticky top-0 border-r border-black/20 dark:border-white/20 dark:border-white/5 bg-background/80 backdrop-blur-xl z-50 py-6 px-4 hover:px-6 shadow-2xl transition-all duration-300 overflow-hidden overflow-y-auto no-scrollbar">
        <Link to="/" className="flex items-center gap-3 mb-12 overflow-hidden px-2 group/logo rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          <div className="relative w-12 h-12 min-w-[48px] rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10 group-hover/logo:ring-primaryLight/50 group-hover/logo:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-main rounded-xl blur-md opacity-40 group-hover/logo:opacity-80 transition-opacity duration-500"></div>
            <img src="/skillverse-logo.png" alt="SkillVerse Logo" className="relative z-10 w-full h-full object-cover rounded-xl" width={48} height={48} />
          </div>
          <span className="text-2xl font-display font-bold bg-gradient-main bg-clip-text text-transparent whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            SkillVerse
          </span>
        </Link>

        <nav className="flex-1 space-y-2">
          <NavItem to="/" icon={LayoutDashboard} label={t('nav.dashboard')} id="nav-dashboard" />
          <NavItem to="/courses" icon={BookOpen} label={t('nav.courses')} id="nav-courses" />
          <NavItem to="/saved" icon={Bookmark} label={t('nav.saved')} id="nav-saved" />
          <NavItem to="/playground" icon={Code2} label="Playground" id="nav-playground" />
          <NavItem to="/career" icon={Briefcase} label={t('nav.career')} id="nav-career" />
          <NavItem to="/certifications" icon={Award} label={t('nav.certifications')} id="nav-certs" />
          {showAdminLink && (
            <NavItem to="/admin" icon={Shield} label={t('nav.admin')} id="nav-admin" />
          )}
          <NavItem to="/settings" icon={Settings} label={t('nav.settings')} id="nav-settings" />
        </nav>

        <div className="pt-6 border-t border-black/20 dark:border-white/5 overflow-hidden">
          <div className="flex items-center gap-3 px-2 py-3 mb-2 overflow-hidden" id="nav-user-profile">
            <div className="relative">
              <img
                src={user.photoURL || AVATARS[user.settings.avatarId || '1']}
                alt="Avatar"
                className="w-10 h-10 min-w-[40px] rounded-full bg-white/10 object-cover"
                width={40}
                height={40}
              />
              {user.settings.activeFrame && user.settings.activeFrame !== 'none' && (
                <div className={`absolute inset-0 rounded-full pointer-events-none ${XP_STORE_FRAMES.find(f => f.id === user.settings.activeFrame)?.frameClass || ''
                  }`} />
              )}
            </div>
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
            <span className="font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-xl border-b border-black/20 dark:border-white/10 flex items-center justify-between px-6 z-50">
        <Link to="/" className="text-xl font-display font-bold text-textMain rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight">SkillVerse</Link>
        <button onClick={() => setMobileMenuOpen(true)} className="text-textMain p-2" title={t('nav.openMenu')} aria-label={t('nav.openMenu')}>
          <Menu />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 bottom-0 left-0 w-3/4 max-w-sm bg-background border-r border-black/20 dark:border-white/10 p-6 flex flex-col animate-slide-right">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-textMain">{t('nav.menu')}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-textMuted" title={t('nav.closeMenu')} aria-label={t('nav.closeMenu')}><X /></button>
            </div>
            <nav className="space-y-2 flex-1">
              <NavItem to="/" icon={LayoutDashboard} label={t('nav.dashboard')} />
              <NavItem to="/courses" icon={BookOpen} label={t('nav.courses')} />
              <NavItem to="/saved" icon={Bookmark} label={t('nav.saved')} />
              <NavItem to="/playground" icon={Code2} label="Playground" />
              <NavItem to="/career" icon={Briefcase} label={t('nav.career')} />
              <NavItem to="/certifications" icon={Award} label={t('nav.certifications')} />
              {showAdminLink && (
                <NavItem to="/admin" icon={Shield} label={t('nav.admin')} />
              )}
              <NavItem to="/settings" icon={Settings} label={t('nav.settings')} />
            </nav>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-3 px-4 py-3 text-red-400 font-medium"
            >
              <LogOut size={20} /> {t('nav.logout')}
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full min-w-0 transition-all duration-300">
        <div className="pt-24 lg:pt-10 px-6 lg:px-12 pb-12 mx-auto max-w-7xl">
          <React.Suspense fallback={fallback}>
            {children}
          </React.Suspense>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-background border border-black/20 dark:border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-textMain text-center mb-2">{t('logout.title')}</h3>
            <p className="text-textMuted text-center mb-6">{t('logout.body')}</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-textMain border border-black/20 dark:border-white/10 font-medium transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
              >
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      )}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <ScrollToTop />
    </div>
  );
};
