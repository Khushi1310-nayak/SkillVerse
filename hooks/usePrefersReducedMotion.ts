import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

const getSystemPreference = (): boolean =>
    typeof window !== 'undefined' && !!window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

/**
 * Whether motion should be reduced right now.
 * Source of truth, in priority order:
 *  1. The user's explicit in-app setting (settings.reducedMotion), if set.
 *  2. The OS-level `prefers-reduced-motion` media query, otherwise.
 */
export const usePrefersReducedMotion = (): boolean => {
    const { appUser } = useAuth();
    const [systemPref, setSystemPref] = useState(getSystemPreference);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleChange = () => setSystemPref(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const userSetting = appUser?.settings.reducedMotion;
    return userSetting ?? systemPref;
};