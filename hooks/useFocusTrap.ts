import { useEffect, useRef, RefObject } from 'react';

/**
 * CSS selector that matches every natively focusable element type.
 * Excludes elements that are explicitly removed from the tab order.
 */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), ' +
  'select:not([disabled]), textarea:not([disabled]), ' +
  '[tabindex]:not([tabindex="-1"])';

/**
 * useFocusTrap
 *
 * Traps keyboard focus inside `containerRef` while `isActive` is true.
 *
 * Behaviour:
 *  - On activation: saves the currently focused element, then moves focus to
 *    the first focusable child (or the container itself as a fallback).
 *  - Tab from the last focusable child wraps to the first.
 *  - Shift+Tab from the first focusable child wraps to the last.
 *  - Escape invokes `onClose` (if provided).
 *  - On deactivation: restores focus to the element that was active before the
 *    trap engaged. Handles the case where that element has since been removed
 *    from the DOM (e.g. after a logout flow).
 *
 * @param containerRef - Ref pointing to the modal's root DOM element.
 * @param isActive     - Engage the trap when `true`; release when `false`.
 * @param onClose      - Optional callback called when the user presses Escape.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  onClose?: () => void,
): void {
  // Store onClose in a ref so changes to its identity don't trigger the main
  // effect, which would unnecessarily reset the saved focus target.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // The element focused before the trap was activated — restored on cleanup.
  const savedFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // ── Save the active element so we can restore it when the modal closes ──
    if (document.activeElement instanceof HTMLElement) {
      savedFocusRef.current = document.activeElement;
    }

    // ── Helper: live snapshot of focusable children inside the trap ──────────
    const getFocusable = (): HTMLElement[] =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    // ── Move focus into the modal on the next tick so the DOM is painted ─────
    const focusTimer = setTimeout(() => {
      const focusable = getFocusable();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        // No interactive children — focus the container so screen readers
        // can announce it and Escape still works.
        container.focus();
      }
    }, 0);

    // ── Keyboard handler ─────────────────────────────────────────────────────
    const handleKeyDown = (event: KeyboardEvent): void => {
      // Escape → close the modal
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusable();

      // No focusable children — keep the browser from leaving the container
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      // Single focusable child — Tab stays on it
      if (focusable.length === 1) {
        event.preventDefault();
        focusable[0].focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        // Shift+Tab from the first element → wrap to the last
        if (active === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        // Tab from the last element → wrap to the first
        if (active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // ── Cleanup: remove listener and restore focus ────────────────────────────
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);

      const previous = savedFocusRef.current;
      if (previous && document.body.contains(previous)) {
        try {
          previous.focus();
        } catch {
          // The element may no longer be focusable (e.g. removed from the DOM
          // after a logout destroys the triggering component).
        }
      }
      savedFocusRef.current = null;
    };
  }, [isActive, containerRef]); // containerRef identity is stable (useRef object)
}
