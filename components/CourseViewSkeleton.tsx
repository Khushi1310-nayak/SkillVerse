import React from 'react';

/**
 * Placeholder for CourseView while the course is being fetched.
 *
 * The page structure is known before the data arrives, so this mirrors the
 * real two-column layout (sidebar + content card) rather than showing a bare
 * spinner. It uses the same theme tokens as the rest of the app so it renders
 * correctly in light mode as well as dark.
 */
export const CourseViewSkeleton: React.FC = () => (
  <div
    className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <span className="sr-only">Loading course…</span>

    {/* Sidebar */}
    <div className="lg:col-span-1 space-y-6" aria-hidden="true">
      <div className="h-5 w-24 rounded bg-black/10 dark:bg-white/10 animate-pulse" />

      <div className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-6">
        <div className="w-12 h-12 rounded-xl bg-black/10 dark:bg-white/10 animate-pulse mb-4" />
        <div className="h-6 w-3/4 rounded bg-black/10 dark:bg-white/10 animate-pulse mb-2" />
        <div className="h-6 w-1/2 rounded bg-black/10 dark:bg-white/10 animate-pulse" />

        <div className="flex flex-col gap-2 mt-6">
          <div className="h-11 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />
          <div className="h-11 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>

    {/* Main content card */}
    <div className="lg:col-span-3" aria-hidden="true">
      <div className="bg-glass border border-black/20 dark:border-white/10 rounded-3xl p-8 md:p-12 min-h-[600px]">
        <div className="h-9 w-2/3 rounded bg-black/10 dark:bg-white/10 animate-pulse mb-8" />

        <div className="space-y-3 mb-10">
          <div className="h-4 w-full rounded bg-black/10 dark:bg-white/10 animate-pulse" />
          <div className="h-4 w-11/12 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
          <div className="h-4 w-4/5 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
        </div>

        {/* Stand-in for the embedded code playground */}
        <div className="h-40 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse mb-10" />

        <div className="space-y-3 mb-10">
          <div className="h-4 w-full rounded bg-black/10 dark:bg-white/10 animate-pulse" />
          <div className="h-4 w-10/12 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
        </div>

        <div className="pt-8 border-t border-black/20 dark:border-white/10">
          <div className="h-5 w-32 rounded bg-black/10 dark:bg-white/10 animate-pulse mb-4" />
          <div className="flex flex-wrap gap-4">
            <div className="h-9 w-28 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
            <div className="h-9 w-36 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
            <div className="h-9 w-24 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
