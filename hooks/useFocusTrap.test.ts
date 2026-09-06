import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { useFocusTrap } from './useFocusTrap';

describe('useFocusTrap Accessibility Hook', () => {
  it('moves focus to the first focusable element when active', async () => {
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    button1.textContent = 'Button 1';
    button2.textContent = 'Button 2';
    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);

    const containerRef = { current: container };
    renderHook(() => useFocusTrap(containerRef, true));

    // Allow the setTimeout(..., 0) tick to fire
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(document.activeElement).toBe(button1);
    document.body.removeChild(container);
  });

  it('invokes onClose when Escape is pressed', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const containerRef = { current: container };
    const onClose = vi.fn();

    renderHook(() => useFocusTrap(containerRef, true, onClose));

    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(escEvent);

    expect(onClose).toHaveBeenCalledTimes(1);
    document.body.removeChild(container);
  });

  it('traps tab focus within the container elements', async () => {
    const container = document.createElement('div');
    const input = document.createElement('input');
    const button = document.createElement('button');
    container.appendChild(input);
    container.appendChild(button);
    document.body.appendChild(container);

    const containerRef = { current: container };
    renderHook(() => useFocusTrap(containerRef, true));

    await new Promise((resolve) => setTimeout(resolve, 10));
    button.focus();
    expect(document.activeElement).toBe(button);

    // Press Tab from last element
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    document.dispatchEvent(tabEvent);

    expect(document.activeElement).toBe(input);
    document.body.removeChild(container);
  });
});
