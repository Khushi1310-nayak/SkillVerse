import { useState, useCallback } from 'react';

export type NotificationPermissionState = 'unsupported' | 'default' | 'granted' | 'denied';

interface UseNotificationsReturn {
  /** Whether the browser supports the Web Notifications API at all. */
  isSupported: boolean;
  /** Current permission state, including 'unsupported' when the API is absent. */
  permission: NotificationPermissionState;
  /**
   * Request notification permission from the browser.
   * Must only be called in response to a deliberate user action.
   * Returns the resulting permission string, or 'unsupported' if the API is absent.
   */
  requestPermission: () => Promise<NotificationPermissionState>;
}

/**
 * Thin wrapper around the native Web Notifications API.
 * Does NOT request permission automatically — consumers must call
 * requestPermission() only in response to explicit user interaction.
 */
export const useNotifications = (): UseNotificationsReturn => {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;

  const getPermission = (): NotificationPermissionState => {
    if (!isSupported) return 'unsupported';
    return Notification.permission as NotificationPermissionState;
  };

  const [permission, setPermission] = useState<NotificationPermissionState>(getPermission);

  const requestPermission = useCallback(async (): Promise<NotificationPermissionState> => {
    if (!isSupported) return 'unsupported';

    // If already decided, don't open the native prompt again.
    if (Notification.permission === 'denied') {
      setPermission('denied');
      return 'denied';
    }
    if (Notification.permission === 'granted') {
      setPermission('granted');
      return 'granted';
    }

    try {
      const result = await Notification.requestPermission();
      const state = result as NotificationPermissionState;
      setPermission(state);
      return state;
    } catch {
      // Some browsers (e.g. older Firefox) use a callback form only;
      // fall back gracefully without crashing.
      const fallback = Notification.permission as NotificationPermissionState;
      setPermission(fallback);
      return fallback;
    }
  }, [isSupported]);

  return { isSupported, permission, requestPermission };
};
