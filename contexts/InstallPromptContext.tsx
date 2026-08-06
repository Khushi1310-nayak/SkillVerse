import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface InstallPromptContextType {
    isInstallable: boolean;
    isInstalled: boolean;
    promptInstall: () => Promise<boolean>;
}

const InstallPromptContext = createContext<InstallPromptContextType | null>(null);

// Mounted at the very root of the app (see App.tsx) so this listener
// attaches on first paint. `beforeinstallprompt` fires once, early, and
// if nothing is listening yet when it fires, it's lost for the session —
// this must NOT live inside a route-specific component like Settings.
export const InstallPromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const standaloneQuery = window.matchMedia('(display-mode: standalone)');
        setIsInstalled(standaloneQuery.matches || (window.navigator as any).standalone === true);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const promptInstall = useCallback(async () => {
        if (!deferredPrompt) return false;
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setIsInstallable(false);
        return outcome === 'accepted';
    }, [deferredPrompt]);

    return (
        <InstallPromptContext.Provider value={{ isInstallable, isInstalled, promptInstall }}>
            {children}
        </InstallPromptContext.Provider>
    );
};

export const useInstallPrompt = (): InstallPromptContextType => {
    const context = useContext(InstallPromptContext);
    if (!context) throw new Error('useInstallPrompt must be used within an InstallPromptProvider');
    return context;
};