import { CATEGORIES } from '../constants';

export type SortOption = 'default' | 'rating' | 'reviews' | 'az';
export type LevelFilter = 'all' | 'Beginner' | 'Intermediate' | 'Advanced';
export type TimeFilter = 'all' | 'under30' | '30to60' | '1to2h' | '2hplus';

export const VALID_LEVELS: LevelFilter[] = ['all', 'Beginner', 'Intermediate', 'Advanced'];
export const VALID_TIMES: TimeFilter[] = ['all', 'under30', '30to60', '1to2h', '2hplus'];
export const VALID_SORTS: SortOption[] = ['default', 'rating', 'reviews', 'az'];

export const validateCategory = (value: unknown): string => {
  if (typeof value !== 'string') return 'all';

  const normalized = value.trim();
  if (normalized === 'all') return 'all';

  return CATEGORIES.some(category => category.id === normalized) ? normalized : 'all';
};

export const validateLevel = (value: unknown): LevelFilter => {
  if (typeof value !== 'string') return 'all';

  return VALID_LEVELS.includes(value as LevelFilter) ? (value as LevelFilter) : 'all';
};

export const validateTime = (value: unknown): TimeFilter => {
  if (typeof value !== 'string') return 'all';

  return VALID_TIMES.includes(value as TimeFilter) ? (value as TimeFilter) : 'all';
};

export const validateSort = (value: unknown): SortOption => {
  if (typeof value !== 'string') return 'default';

  return VALID_SORTS.includes(value as SortOption) ? (value as SortOption) : 'default';
};

export const validateSavedOnly = (value: unknown): '0' | '1' => {
  return value === '1' ? '1' : '0';
};
