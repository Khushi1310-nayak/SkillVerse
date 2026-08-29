import { useMemo } from 'react';
import { User } from '../types';
import { computeAnalytics, AnalyticsData } from '../utils/analyticsService';

/**
 * Provides memoised analytics for the current user.
 * Re-computes only when the user object reference changes.
 */
export function useAnalytics(user: User): AnalyticsData {
  return useMemo(() => computeAnalytics(user), [user]);
}
