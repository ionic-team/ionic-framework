/**
 * Mock the `@ionic/core/components` ESM boundary so Jest can load the wrapper.
 * Jest can't import Ionic's ESM-only custom elements, so we stub the few
 * values `createInlineOverlayComponent` reaches: `componentOnReady` (used to
 * redirect `cachedOriginalParent` after mount) and `getPlatforms`/`isPlatform`
 * (pulled in transitively via `./utils`).
 */
jest.mock('@ionic/core/components', () => ({
  // Delegates to a mutable hook so individual tests can run side effects
  // (e.g. teleporting the host) at the moment the overlay comes online.
  componentOnReady: (el: HTMLElement, cb: () => void) => mockComponentOnReady(el, cb),
  getPlatforms: () => [],
  isPlatform: () => false,
}));

import { act, render } from '@testing-library/react';
import React from 'react';

import { createInlineOverlayComponent } from '../createInlineOverlayComponent';

// Default: resolve immediately, no side effects. Reset in `afterEach`.
// `mock` prefix lets the `jest.mock` factory reference it despite hoisting.
const defaultComponentOnReady = (_el: HTMLElement, cb: () => void) => cb();
let mockComponentOnReady = defaultComponentOnReady;

// Mirror how `IonModal` is generated: a delegate-host overlay.
const IonModal = createInlineOverlayComponent<any, any>('ion-modal', undefined, true) as any;
// An overlay rendered inside another overlay observes the nested context.
const IonPopover = createInlineOverlayComponent<any, any>('ion-popover', undefined, true) as any;

/**
 * Simulate what CoreDelegate does when an overlay presents: it teleports the
 * host element out of its portal parent into another in-document container
 * (the running app uses ion-app; here we use any sibling).
 */
const teleport = (el: HTMLElement) => {
  const dest = document.createElement('div');
  dest.id = 'teleport-destination';
  document.body.appendChild(dest);
  dest.appendChild(el);
};

afterEach(() => {
  document.body.innerHTML = '';
  mockComponentOnReady = defaultComponentOnReady;
});

describe('createInlineOverlayComponent: unmount cleanup', () => {
  it('removes a relocated overlay on unmount even when it never opened', () => {
    const { unmount } = render(<IonModal />);

    const modal = document.body.querySelector('ion-modal') as HTMLElement;
    expect(modal).toBeTruthy();

    // Overlay is teleported while still closed (isOpen === false).
    teleport(modal);

    unmount();

    expect(document.querySelector('ion-modal')).toBeNull();
  });

  it('removes a normally-portaled overlay on unmount (no relocation)', () => {
    const { unmount } = render(<IonModal />);

    expect(document.body.querySelector('ion-modal')).toBeTruthy();

    unmount();

    expect(document.querySelector('ion-modal')).toBeNull();
  });

  it('removes an open, relocated overlay on unmount', () => {
    const { unmount } = render(<IonModal />);
    const modal = document.body.querySelector('ion-modal') as HTMLElement;

    // Drive the overlay to its open state the way core does, then teleport it.
    act(() => {
      modal.dispatchEvent(new CustomEvent('willPresent'));
    });
    teleport(modal);

    unmount();

    expect(document.querySelector('ion-modal')).toBeNull();
  });

  it('does not orphan a relocated overlay across a StrictMode mount/unmount cycle', () => {
    /**
     * React 18 StrictMode mounts, unmounts, then remounts each component in
     * dev to surface unsafe state reuse. CoreDelegate teleports the host out
     * of its portal parent as the overlay comes online (simulated here from
     * componentOnReady, which fires in componentDidMount). At the first
     * StrictMode unmount the host is relocated but still closed - exactly the
     * case that previously left an orphan behind, producing a duplicate
     * `<ion-modal>` in the DOM.
     */
    mockComponentOnReady = (el, cb) => {
      teleport(el);
      cb();
    };

    render(
      <React.StrictMode>
        <IonModal />
      </React.StrictMode>
    );

    // Only the surviving remount's host should remain. The discarded first
    // mount must not leave an orphan.
    expect(document.querySelectorAll('ion-modal')).toHaveLength(1);
  });

  it('removes a relocated nested overlay on unmount even when it never opened', () => {
    // keepContentsMounted renders the children (and the nested popover) while
    // the outer modal is closed, so the popover observes the nested context.
    const { unmount } = render(
      <IonModal keepContentsMounted={true}>
        <IonPopover />
      </IonModal>
    );

    const popover = document.body.querySelector('ion-popover') as HTMLElement;
    expect(popover).toBeTruthy();

    // Nested overlay is teleported while still closed.
    teleport(popover);

    unmount();

    expect(document.querySelector('ion-popover')).toBeNull();
  });

  it('removes an open, relocated nested overlay on unmount', () => {
    const { unmount } = render(
      <IonModal keepContentsMounted={true}>
        <IonPopover />
      </IonModal>
    );

    const popover = document.body.querySelector('ion-popover') as HTMLElement;

    // Drive the nested popover open the way core does, then teleport it out of
    // its `<template>`. This exercises the `node.remove()` branch followed by
    // the `isOpen` teardown block on an already-detached node.
    act(() => {
      popover.dispatchEvent(new CustomEvent('willPresent'));
    });
    teleport(popover);

    expect(() => unmount()).not.toThrow();

    expect(document.querySelector('ion-popover')).toBeNull();
  });
});
