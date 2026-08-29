import React, { useEffect, useState, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { CustomCursor } from './components/CustomCursor';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { InstallPromptProvider } from './contexts/InstallPromptContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { useAuth } from './hooks/useAuth';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { AdminRoute } from './guards/AdminRoute';
import { AdminDashboard } from './components/AdminDashboard';
import { storageService } from './services/storageService'; // Will clean up storageService next
import { ErrorBoundary } from './components/ErrorBoundary';
import NotFound from './components/NotFound';
import { Loader2 } from 'lucide-react';

// Lazy loaded page components
const LandingPage = lazy(() => import('./components/LandingPage').then(m => ({ default: m.LandingPage })));
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const CategoryView = lazy(() => import('./components/CategoryView').then(m => ({ default: m.CategoryView })));
const CourseView = lazy(() => import('./components/CourseView').then(m => ({ default: m.CourseView })));
const Certificate = lazy(() => import('./components/Certificate').then(m => ({ default: m.Certificate })));
const Settings = lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));
const CoursesList = lazy(() => import('./components/CoursesList').then(m => ({ default: m.CoursesList })));
const SavedCourses = lazy(() => import('./components/SavedCourses').then(m => ({ default: m.SavedCourses })));
const Roadmap = lazy(() => import('./components/Roadmap').then(m => ({ default: m.Roadmap })));
const CertificationsList = lazy(() => import('./components/CertificationsList').then(m => ({ default: m.CertificationsList })));
const CareerMode = lazy(() => import('./components/CareerMode').then(m => ({ default: m.CareerMode })));
const CodingPracticePlayground = lazy(() => import('./components/CodingPracticePlayground').then(m => ({ default: m.CodingPracticePlayground })));
const Onboarding = lazy(() => import('./components/Onboarding').then(m => ({ default: m.Onboarding })));
const CredentialVerification = lazy(() => import('./components/CredentialVerification').then(m => ({ default: m.CredentialVerification })));
const DocumentationPage = lazy(() => import('./components/DocumentationPage').then(m => ({ default: m.DocumentationPage })));
const PublicProfilePage = lazy(() => import('./components/PublicProfilePage').then(m => ({ default: m.PublicProfilePage })));
const NotesPage = lazy(() => import('./components/NotesPage'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));

const PageLoader = ({ fullscreen = true }: { fullscreen?: boolean }) => (
  <div className={`${fullscreen ? 'fixed inset-0 z-50' : 'w-full py-20'} flex flex-col items-center justify-center bg-background`}>
    <div className="bg-glass border border-black/20 dark:border-white/10 p-8 rounded-3xl backdrop-blur-md flex flex-col items-center shadow-xl">
      <Loader2 className="animate-spin text-primaryLight w-12 h-12" />
      <p className="mt-4 text-textMuted font-display font-medium text-lg tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  </div>
);

const AppRoutes = () => {
  const { user, appUser, logout, updateUserSettings, updateUserAccount, updateLocalUser, } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (appUser && !appUser.settings.onboardingCompleted) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [appUser]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    const fontSize = appUser?.settings.fontSize ?? 'md';
    document.documentElement.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg');
    document.documentElement.classList.add(`font-size-${fontSize}`);
    document.documentElement.classList.toggle('dyslexia-font', !!appUser?.settings.dyslexiaFont);
  }, [appUser?.settings.fontSize, appUser?.settings.dyslexiaFont]);

  const handleUpdateUser = async (updatedUser: any) => {
    await updateUserAccount(updatedUser);
  };

  const handlePreviewUpdate = (updatedUser: any) => {
    updateLocalUser(updatedUser);
  };

  const handleOnboardingComplete = async (updatedUser: any) => {
    await updateUserSettings(updatedUser.settings);
    setShowOnboarding(false);
  };

  const handleLogout = async () => {
    await logout();
    setShowAuth(false);
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/credential/:token" element={<CredentialVerification />} />
          <Route path="/u/:username" element={<PublicProfilePage />} />

          {/* Verification Wall */}
          <Route path="/verify-email" element={
            user && (!user.emailVerified && user.providerData[0]?.providerId === "password") ?
              <Auth /> : <Navigate to="/" replace />
          } />

          <Route path="/*" element={
            !user && !showAuth ? (
              <LandingPage onGetStarted={() => setShowAuth(true)} />
            ) : !user && showAuth ? (
              <Auth />
            ) : showOnboarding && appUser ? (
              <ProtectedRoute requireVerification={false}>
                <Onboarding user={appUser} onComplete={handleOnboardingComplete} />
              </ProtectedRoute>
            ) : (
              <ProtectedRoute>
                {appUser && (
                  <Layout user={appUser} onLogout={handleLogout} fallback={<PageLoader fullscreen={false} />}>
                    <ErrorBoundary>
                      <Suspense fallback={<PageLoader fullscreen={false} />}>
                        <Routes>
                          <Route path="/" element={<Dashboard user={appUser} />} />
                          <Route path="/courses" element={<CoursesList />} />
                          <Route path="/saved" element={<SavedCourses />} />
                          <Route path="/notes" element={<NotesPage />} />
                          <Route path="/analytics" element={<AnalyticsDashboard user={appUser} />} />
                          <Route path="/roadmap" element={<Roadmap user={appUser} />} />
                          <Route path="/playground" element={<CodingPracticePlayground />} />
                          <Route path="/career" element={<CareerMode user={appUser} />} />
                          <Route path="/certifications" element={<CertificationsList />} />
                          <Route path="/settings" element={<Settings user={appUser} onPreviewUpdate={handlePreviewUpdate} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />} />
                          <Route path="/category/:id" element={<CategoryView />} />
                          <Route path="/course/:id" element={<CourseView />} />
                          <Route path="/certificate/:id" element={<Certificate />} />
                          <Route path="/admin" element={
                            <AdminRoute>
                              <AdminDashboard />
                            </AdminRoute>
                          } />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </ErrorBoundary>
                  </Layout>
                )}
              </ProtectedRoute>
            )
          } />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <InstallPromptProvider>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <HashRouter>
              <AppRoutes />
            </HashRouter>
            <CustomCursor />
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </InstallPromptProvider>
  );
}

export default App;