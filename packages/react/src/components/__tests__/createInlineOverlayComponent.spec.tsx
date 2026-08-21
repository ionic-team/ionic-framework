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
 * host element out of its portal parent into another in-document container.
 * The running app uses the single `ion-app` for every overlay, so one shared
 * destination is created lazily and reused - overlays that present in
 * sequence end up as siblings there, in presentation order.
 */
const teleport = (el: HTMLElement) => {
  let dest = document.getElementById('teleport-destination');
  if (!dest) {
    dest = document.createElement('div');
    dest.id = 'teleport-destination';
    document.body.appendChild(dest);
  }
  dest.appendChild(el);
  return dest;
};

/**
 * A component that suspends until `resolve` is called, plus the helpers to
 * drive it. Rendering `<Suspender />` inside a boundary hides that boundary's
 * content - React runs `componentWillUnmount` on everything in it without
 * actually unmounting - and `reveal()` brings the same instances back with
 * `componentDidMount`.
 */
const createSuspender = () => {
  let resolveSuspender!: () => void;
  let hasResolved = false;
  const suspenderPromise = new Promise<void>((resolve) => {
    resolveSuspender = () => {
      hasResolved = true;
      resolve();
    };
  });

  return {
    Suspender: () => {
      if (!hasResolved) {
        throw suspenderPromise;
      }
      return null;
    },
    reveal: async () => {
      await act(async () => {
        resolveSuspender();
        await suspenderPromise;
      });
    },
  };
};

/**
 * The ids of `#teleport-destination`'s children, in document order. Document
 * order is what core's `getPresentedOverlay` reads to decide which overlay
 * Escape, hardware back and the focus trap act on, so a restore that changes
 * it changes which overlay the user is talking to.
 */
const teleportedOrder = () =>
  Array.from(document.getElementById('teleport-destination')?.children ?? []).map((el) => el.id);

/**
 * Render `children` inside a Suspense boundary alongside a sibling that can be
 * made to suspend on demand. `hide()` suspends that sibling, which is what the
 * reported bug hits: the overlay itself renders fine, something else in the
 * boundary does not, and React hides the whole boundary - running
 * `componentWillUnmount` on the overlay wrapper without unmounting it.
 */
const renderWithBoundary = (children: React.ReactNode) => {
  const { Suspender, reveal } = createSuspender();

  let suspend!: () => void;
  const Boundary = () => {
    const [isSuspended, setIsSuspended] = React.useState(false);
    suspend = () => setIsSuspended(true);

    return (
      <React.Suspense fallback={<div>loading</div>}>
        {children}
        {isSuspended ? <Suspender /> : null}
      </React.Suspense>
    );
  };

  const result = render(<Boundary />);

  return {
    ...result,
    hide: () =>
      act(() => {
        suspend();
      }),
    reveal,
  };
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

describe('createInlineOverlayComponent: hidden subtree restore', () => {
  it('restores a relocated nested overlay when a Suspense boundary hides and reveals it', async () => {
    /**
     * React runs `componentWillUnmount` when it *hides* a subtree as well as
     * when it destroys one: a Suspense boundary falling back after mount runs
     * it, then runs `componentDidMount` again on the same instance when the
     * boundary reveals its content. A host removed while hidden has to come
     * back, since React only re-inserts nodes it removed itself. Otherwise an
     * overlay that was mid-`present()` is gone for good, with no dismiss
     * lifecycle ever firing.
     */
    const { hide, reveal } = renderWithBoundary(
      <IonModal keepContentsMounted={true}>
        <IonPopover />
      </IonModal>
    );

    const popover = document.body.querySelector('ion-popover') as HTMLElement;

    // CoreDelegate teleports the host out of its `<template>` as `present()`
    // starts, before the events that flip `isOpen` have fired.
    const teleportDestination = teleport(popover);

    // A sibling suspends, so React hides the boundary's content: the overlay
    // wrapper gets componentWillUnmount without actually being unmounted.
    hide();

    // The boundary reveals its content again on the same instances.
    await reveal();

    expect(popover.isConnected).toBe(true);
    expect(popover.parentElement).toBe(teleportDestination);
  });

  it('restores a hidden nested overlay to its original position in the container', async () => {
    /**
     * Restoring the host is not enough on its own: core's `getPresentedOverlay`
     * takes the *last* match in document order, so Escape, hardware back and
     * the focus trap all follow the overlay that sits last in `ion-app`.
     * Anything appended there while the subtree was hidden - a Suspense
     * fallback showing an `ion-loading` is the obvious one - has to stay after
     * the overlay that was already presented, so the restore has to remember
     * the position, not just the parent.
     */
    const { hide, reveal } = renderWithBoundary(
      <IonModal keepContentsMounted={true}>
        <IonPopover id="nested-popover" />
      </IonModal>
    );

    const popover = document.body.querySelector('ion-popover') as HTMLElement;
    const teleportDestination = teleport(popover);

    hide();

    // Something else presents into the same container while the subtree is
    // hidden. The restored overlay must not jump behind it.
    const laterOverlay = document.createElement('ion-loading');
    laterOverlay.id = 'later-overlay';
    teleportDestination.appendChild(laterOverlay);

    await reveal();

    expect(teleportedOrder()).toEqual(['nested-popover', 'later-overlay']);
  });

  it('keeps the stacking order of two nested overlays across a hide', async () => {
    /**
     * React tears a subtree down parent-first and builds it back up
     * child-first, so two nested overlays restored by appending come back in
     * the opposite order. In `ion-app` that hands Escape and the focus trap to
     * the wrong overlay: the menu would dismiss while the submenu opened on
     * top of it stays up.
     */
    const { hide, reveal } = renderWithBoundary(
      <IonModal keepContentsMounted={true}>
        <IonPopover id="menu-popover" keepContentsMounted={true}>
          <IonPopover id="submenu-popover" />
        </IonPopover>
      </IonModal>
    );

    const menu = document.querySelector('#menu-popover') as HTMLElement;
    const submenu = document.querySelector('#submenu-popover') as HTMLElement;

    // Presented in order, so the submenu sits after the menu in the container.
    teleport(menu);
    teleport(submenu);
    expect(teleportedOrder()).toEqual(['menu-popover', 'submenu-popover']);

    hide();
    await reveal();

    expect(teleportedOrder()).toEqual(['menu-popover', 'submenu-popover']);
  });

  it('presents and dismisses a nested overlay after the reveal', async () => {
    /**
     * A reconnected node is not the same thing as a working overlay. The
     * present/dismiss lifecycle has to reach the app again: the contents mount
     * on `willPresent`, non-React `on*` props are re-bound, and `didDismiss`
     * still unmounts the contents.
     */
    const onWillPresent = jest.fn();
    const onDidPresent = jest.fn();
    const onDidDismiss = jest.fn();

    const { hide, reveal } = renderWithBoundary(
      <IonModal keepContentsMounted={true}>
        <IonPopover onWillPresent={onWillPresent} onIonPopoverDidPresent={onDidPresent} onDidDismiss={onDidDismiss}>
          <span data-testid="popover-content">content</span>
        </IonPopover>
      </IonModal>
    );

    const popover = document.body.querySelector('ion-popover') as HTMLElement;
    teleport(popover);

    hide();
    await reveal();

    // The overlay presents: contents mount and both present handlers fire.
    act(() => {
      popover.dispatchEvent(new CustomEvent('willPresent'));
      popover.dispatchEvent(new CustomEvent('ionPopoverDidPresent'));
    });

    expect(onWillPresent).toHaveBeenCalledTimes(1);
    expect(onDidPresent).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-testid="popover-content"]')).toBeTruthy();

    // And it dismisses: the handler reaches the app and the contents unmount.
    act(() => {
      popover.dispatchEvent(new CustomEvent('didDismiss'));
    });

    expect(onDidDismiss).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-testid="popover-content"]')).toBeNull();
  });

  it('restores a nested overlay whose own contents suspended while presenting', async () => {
    /**
     * The reported flow. Core emits `ionMount` from the middle of `present()`,
     * which is what first mounts the overlay's children, so a suspension in
     * those children always lands while `present()` is in flight and the host
     * has just been teleported out of its `<template>`.
     */
    const { Suspender, reveal } = createSuspender();
    const onDidPresent = jest.fn();

    render(
      <React.Suspense fallback={<div>loading</div>}>
        <IonModal keepContentsMounted={true}>
          <IonPopover id="nested-popover" onIonPopoverDidPresent={onDidPresent}>
            <Suspender />
          </IonPopover>
        </IonModal>
      </React.Suspense>
    );

    const popover = document.querySelector('#nested-popover') as HTMLElement;
    const teleportDestination = teleport(popover);

    // `present()`: the host is already teleported when `ionMount` mounts the
    // contents, and the contents suspend as they render.
    act(() => {
      popover.dispatchEvent(new CustomEvent('ionMount'));
    });

    await reveal();

    expect(popover.isConnected).toBe(true);
    expect(popover.parentElement).toBe(teleportDestination);

    // `present()` runs to completion against the restored host.
    act(() => {
      popover.dispatchEvent(new CustomEvent('ionPopoverDidPresent'));
    });

    expect(onDidPresent).toHaveBeenCalledTimes(1);
  });

  it('does not orphan a relocated nested overlay across a StrictMode mount/unmount cycle', () => {
    /**
     * The nested branch removes its host outright where the portaled branch
     * only moves it, so the StrictMode dev cycle has to be covered on both.
     * The discarded first mount must not leave an orphan behind, and the
     * surviving instance must still have its host.
     */
    mockComponentOnReady = (el, cb) => {
      teleport(el);
      cb();
    };

    render(
      <React.StrictMode>
        <IonModal keepContentsMounted={true}>
          <IonPopover id="nested-popover" />
        </IonModal>
      </React.StrictMode>
    );

    expect(document.querySelectorAll('ion-popover')).toHaveLength(1);
    expect(document.querySelector('ion-popover')?.isConnected).toBe(true);
  });
});
