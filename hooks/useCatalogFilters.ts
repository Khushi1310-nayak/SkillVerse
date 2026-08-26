import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Course catalog filter state, stored in the URL query string.
 *
 * Keeping this in component state meant it was destroyed by every navigation:
 * open a course, press Back, and the catalog remounted with all six controls
 * reset. It also made a filtered view impossible to share or bookmark, and a
 * refresh destructive. The URL models exactly this kind of state natively, so
 * it is the source of truth here and the component holds none of it.
 */

export type SortOption = 'default' | 'rating' | 'reviews' | 'az';
export type LevelFilter = 'all' | 'Beginner' | 'Intermediate' | 'Advanced';
export type TimeFilter = 'all' | 'under30' | '30to60' | '1to2h' | '2hplus';

export interface CatalogFilters {
  search: string;
  category: string;
  level: LevelFilter;
  time: TimeFilter;
  sort: SortOption;
  savedOnly: boolean;
}

/** Query-string keys. Short, because they end up in shared links. */
export const CATALOG_PARAMS = {
  search: 'q',
  category: 'category',
  level: 'level',
  time: 'time',
  sort: 'sort',
  savedOnly: 'saved',
} as const;

export const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  search: '',
  category: 'all',
  level: 'all',
  time: 'all',
  sort: 'default',
  savedOnly: false,
};

const LEVEL_VALUES: LevelFilter[] = ['all', 'Beginner', 'Intermediate', 'Advanced'];
const TIME_VALUES: TimeFilter[] = ['all', 'under30', '30to60', '1to2h', '2hplus'];
const SORT_VALUES: SortOption[] = ['default', 'rating', 'reviews', 'az'];

/** How long typing pauses before the search term is written to the URL. */
const SEARCH_DEBOUNCE_MS = 300;

/**
 * Anything not in the allowed set falls back to the default rather than being
 * trusted. A shared link can be hand-edited, and a category that was renamed
 * since the link was created would otherwise filter the catalog down to
 * nothing with no visible cause.
 */
const readEnum = <T extends string>(raw: string | null, allowed: T[], fallback: T): T =>
  raw !== null && (allowed as string[]).includes(raw) ? (raw as T) : fallback;

export const parseCatalogFilters = (
  params: URLSearchParams,
  validCategoryIds: string[]
): CatalogFilters => {
  const rawCategory = params.get(CATALOG_PARAMS.category);

  return {
    search: params.get(CATALOG_PARAMS.search) ?? DEFAULT_CATALOG_FILTERS.search,
    category:
      rawCategory !== null && validCategoryIds.includes(rawCategory)
        ? rawCategory
        : DEFAULT_CATALOG_FILTERS.category,
    level: readEnum(params.get(CATALOG_PARAMS.level), LEVEL_VALUES, 'all'),
    time: readEnum(params.get(CATALOG_PARAMS.time), TIME_VALUES, 'all'),
    sort: readEnum(params.get(CATALOG_PARAMS.sort), SORT_VALUES, 'default'),
    savedOnly: params.get(CATALOG_PARAMS.savedOnly) === '1',
  };
};

/**
 * Writes only the values that differ from their default, so an unfiltered
 * catalog stays a clean `/courses` rather than carrying six redundant params.
 */
export const serializeCatalogFilters = (filters: CatalogFilters): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.search.trim()) params.set(CATALOG_PARAMS.search, filters.search);
  if (filters.category !== 'all') params.set(CATALOG_PARAMS.category, filters.category);
  if (filters.level !== 'all') params.set(CATALOG_PARAMS.level, filters.level);
  if (filters.time !== 'all') params.set(CATALOG_PARAMS.time, filters.time);
  if (filters.sort !== 'default') params.set(CATALOG_PARAMS.sort, filters.sort);
  if (filters.savedOnly) params.set(CATALOG_PARAMS.savedOnly, '1');

  return params;
};

export const countActiveFilters = (filters: CatalogFilters): number =>
  (filters.search.trim() ? 1 : 0) +
  (filters.category !== 'all' ? 1 : 0) +
  (filters.level !== 'all' ? 1 : 0) +
  (filters.time !== 'all' ? 1 : 0) +
  (filters.sort !== 'default' ? 1 : 0) +
  (filters.savedOnly ? 1 : 0);

export interface UseCatalogFiltersResult {
  filters: CatalogFilters;
  /** What the search box displays — updates instantly, debounced into the URL. */
  searchDraft: string;
  setSearchDraft: (value: string) => void;
  setFilter: <K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export const useCatalogFilters = (validCategoryIds: string[]): UseCatalogFiltersResult => {
  const [searchParams, setSearchParams] = useSearchParams();

  // `validCategoryIds` is usually a fresh array each render; joining it keeps
  // the parse memo from re-running on every render for an unchanged list.
  const categoryKey = validCategoryIds.join(',');
  const filters = useMemo(
    () => parseCatalogFilters(searchParams, validCategoryIds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, categoryKey]
  );

  const [searchDraft, setSearchDraftState] = useState(filters.search);

  // Pull the URL's value back into the box when the change did not come from
  // typing — Back/Forward, a pasted link, or Clear filters.
  const lastCommittedSearch = useRef(filters.search);
  useEffect(() => {
    if (filters.search !== lastCommittedSearch.current) {
      lastCommittedSearch.current = filters.search;
      setSearchDraftState(filters.search);
    }
  }, [filters.search]);

  const commit = useCallback(
    (next: CatalogFilters) => {
      lastCommittedSearch.current = next.search;
      // `replace` so typing does not push one history entry per keystroke.
      // Back should leave the catalog, not walk backwards through the query.
      setSearchParams(serializeCatalogFilters(next), { replace: true });
    },
    [setSearchParams]
  );

  const setFilter = useCallback(
    <K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) => {
      commit({ ...filters, [key]: value });
    },
    [commit, filters]
  );

  const setSearchDraft = useCallback((value: string) => setSearchDraftState(value), []);

  // Debounce the search term into the URL. Without this every keystroke is a
  // router update, and a fast typist generates a burst of them.
  useEffect(() => {
    if (searchDraft === filters.search) return;

    const timer = setTimeout(() => {
      commit({ ...filters, search: searchDraft });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchDraft, filters, commit]);

  const clearFilters = useCallback(() => {
    setSearchDraftState('');
    commit(DEFAULT_CATALOG_FILTERS);
  }, [commit]);

  const activeFilterCount = countActiveFilters(filters);

  return {
    filters,
    searchDraft,
    setSearchDraft,
    setFilter,
    clearFilters,
    hasActiveFilters: activeFilterCount > 0,
    activeFilterCount,
  };
};
