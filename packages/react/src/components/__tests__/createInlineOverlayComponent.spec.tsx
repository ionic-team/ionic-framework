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

// The unmount teardown is deferred a microtask so it can check whether React
// removed the DOM or only hid it. Let that microtask run.
const flushTeardown = () => act(async () => {});

/**
 * Tracks `MutationObserver` use. `jest.spyOn` cannot wrap a class constructor
 * (its mock is called without `new`), so swap in a subclass. `observersLive`
 * counts observing-minus-disconnected, where a missing `disconnect` shows up.
 */
const countMutationObservers = () => {
  const Original = global.MutationObserver;
  let created = 0;
  let live = 0;
  global.MutationObserver = class extends Original {
    private isObserving = false;

    constructor(callback: MutationCallback) {
      super(callback);
      created++;
    }

    observe(target: Node, options?: MutationObserverInit) {
      if (!this.isObserving) {
        this.isObserving = true;
        live++;
      }
      return super.observe(target, options);
    }

    disconnect() {
      if (this.isObserving) {
        this.isObserving = false;
        live--;
      }
      return super.disconnect();
    }
  };

  return {
    observersCreated: () => created,
    observersLive: () => live,
    restore: () => {
      global.MutationObserver = Original;
    },
  };
};

/**
 * Suspends while it holds a pending promise. Inside a Suspense boundary that
 * hides the boundary's content: React runs `componentWillUnmount` on everything
 * in it without unmounting, then remounts the same instances on the reveal.
 */
const Suspender = ({ pending }: { pending: Promise<void> | null }) => {
  if (pending) {
    throw pending;
  }
  return null;
};

/**
 * Renders `children` in a Suspense boundary next to a sibling that suspends on
 * demand, which is the reported trigger: the overlay renders fine, another
 * child does not, and React hides the whole boundary. Each `hide()` takes a
 * fresh promise so a test can drive more than one cycle. `container` places
 * the React root elsewhere, which the shadow-root case needs.
 */
const renderWithBoundary = (children: React.ReactNode, container?: HTMLElement) => {
  let setPending!: (pending: Promise<void> | null) => void;
  let resolvePending: (() => void) | null = null;

  const Boundary = () => {
    const [pending, setPendingState] = React.useState<Promise<void> | null>(null);
    setPending = setPendingState;

    return (
      <React.Suspense fallback={<div>loading</div>}>
        {children}
        <Suspender pending={pending} />
      </React.Suspense>
    );
  };

  const result = render(<Boundary />, container ? { container } : undefined);

  return {
    ...result,
    hide: async () => {
      const pending = new Promise<void>((resolve) => {
        resolvePending = resolve as () => void;
      });
      act(() => {
        setPending(pending);
      });
      await flushTeardown();
    },
    reveal: async () => {
      await act(async () => {
        setPending(null);
        resolvePending?.();
        resolvePending = null;
      });
      await flushTeardown();
    },
  };
};

afterEach(async () => {
  document.body.innerHTML = '';
  mockComponentOnReady = defaultComponentOnReady;
  jest.restoreAllMocks();
  // Clearing the body disconnects any marker still being watched. Let the
  // shared destroy observer drain so it does not carry into the next test.
  await flushTeardown();
});

describe('createInlineOverlayComponent: cachedOriginalParent', () => {
  it('redirects cachedOriginalParent for a portaled overlay but not a nested one', () => {
    // Core walks up from `cachedOriginalParent` to find the `.ion-page`. A
    // portaled host is cached against the portal container, so it has to be
    // pointed back at its JSX position. A nested host is already there.
    const { container } = render(
      <IonModal keepContentsMounted={true}>
        <IonPopover />
      </IonModal>
    );

    const modal = document.body.querySelector('ion-modal') as any;
    const popover = document.body.querySelector('ion-popover') as any;

    expect(modal.cachedOriginalParent).toBe(container);
    expect(popover.cachedOriginalParent).toBeUndefined();
  });
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

  it('removes a relocated nested overlay on unmount even when it never opened', async () => {
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
    await flushTeardown();

    expect(document.querySelector('ion-popover')).toBeNull();
  });

  it('removes an open, relocated nested overlay on unmount', async () => {
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
    await flushTeardown();

    expect(document.querySelector('ion-popover')).toBeNull();
  });
});

// Fixes https://github.com/ionic-team/ionic-framework/issues/31389
describe('createInlineOverlayComponent: hidden subtree', () => {
  it('leaves a relocated nested overlay alone while a Suspense boundary hides it', async () => {
    // A hide must leave the host where it is, since React did not remove it
    // and will not put it back on the reveal.
    const { hide, reveal } = renderWithBoundary(
      <IonModal keepContentsMounted={true}>
        <IonPopover />
      </IonModal>
    );

    const popover = document.body.querySelector('ion-popover') as HTMLElement;

    // CoreDelegate teleports the host out of its `<template>` as `present()`
    // starts, before the events that flip `isOpen` have fired.
    teleport(popover);
    const teleportDestination = popover.parentElement;

    await hide();

    expect(popover.isConnected).toBe(true);
    expect(popover.parentElement).toBe(teleportDestination);

    await reveal();

    expect(popover.isConnected).toBe(true);
    expect(popover.parentElement).toBe(teleportDestination);
  });

  it('keeps a hidden overlay wired up to the app for the rest of that open', async () => {
    // Core had `present()` in flight when the hide landed and finishes it
    // regardless, so the app's handlers still have to fire while hidden.
    const onDidPresent = jest.fn();
    const onDidDismiss = jest.fn();

    const { hide, reveal } = renderWithBoundary(
      <IonModal keepContentsMounted={true}>
        <IonPopover onIonPopoverDidPresent={onDidPresent} onDidDismiss={onDidDismiss}>
          <span data-testid="popover-content">content</span>
        </IonPopover>
      </IonModal>
    );

    const popover = document.body.querySelector('ion-popover') as HTMLElement;

    // Presenting has started, so the wrapper counts the overlay as open.
    act(() => {
      popover.dispatchEvent(new CustomEvent('willPresent'));
    });
    teleport(popover);

    await hide();

    // Both of these land while the subtree is still hidden.
    act(() => {
      popover.dispatchEvent(new CustomEvent('ionPopoverDidPresent'));
      popover.dispatchEvent(new CustomEvent('didDismiss'));
    });

    expect(onDidPresent).toHaveBeenCalledTimes(1);
    expect(onDidDismiss).toHaveBeenCalledTimes(1);

    await reveal();

    // The dismiss also has to close the wrapper. React nulls the refs for the
    // hidden window, so a close gated on them would leave the contents mounted.
    expect(document.querySelector('[data-testid="popover-content"]')).toBeNull();
  });

  it('keeps a portaled overlay wired up to the app across a hide', async () => {
    // Same coverage for a top-level overlay: a hide must not detach its event
    // bindings either, so `didPresent` still reaches the app.
    const onDidPresent = jest.fn();

    const { hide, reveal } = renderWithBoundary(<IonModal onIonModalDidPresent={onDidPresent} />);

    const modal = document.body.querySelector('ion-modal') as HTMLElement;

    act(() => {
      modal.dispatchEvent(new CustomEvent('willPresent'));
    });

    await hide();

    act(() => {
      modal.dispatchEvent(new CustomEvent('ionModalDidPresent'));
    });

    expect(onDidPresent).toHaveBeenCalledTimes(1);

    await reveal();

    expect(modal.isConnected).toBe(true);
  });

  it('puts a relocated portaled host back where it was after a hide', async () => {
    /**
     * A host moved out of `portalTarget` has to go back synchronously, before a
     * hide can be told from a destroy, or React's portal removal misses it. The
     * reveal undoes that to the exact position, since the real destination is
     * `ion-app` and the overlays in it have an order.
     */
    const { hide, reveal } = renderWithBoundary(<IonModal />);

    const modal = document.body.querySelector('ion-modal') as HTMLElement;

    act(() => {
      modal.dispatchEvent(new CustomEvent('willPresent'));
    });
    teleport(modal);
    const teleportDestination = modal.parentElement as HTMLElement;
    // Give the host a following sibling, or appending and restoring in place
    // are indistinguishable.
    const followingSibling = document.createElement('div');
    teleportDestination.appendChild(followingSibling);

    await hide();
    await reveal();

    expect(modal.parentElement).toBe(teleportDestination);
    expect(modal.nextElementSibling).toBe(followingSibling);
  });

  it('presents and dismisses a nested overlay after the reveal', async () => {
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

    await hide();
    await reveal();

    act(() => {
      popover.dispatchEvent(new CustomEvent('willPresent'));
      popover.dispatchEvent(new CustomEvent('ionPopoverDidPresent'));
    });

    // One call each: the reveal re-adds the same lifecycle listener
    // references, and `syncEvent` swaps rather than stacks the prop handlers.
    expect(onWillPresent).toHaveBeenCalledTimes(1);
    expect(onDidPresent).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-testid="popover-content"]')).toBeTruthy();

    act(() => {
      popover.dispatchEvent(new CustomEvent('didDismiss'));
    });

    expect(onDidDismiss).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-testid="popover-content"]')).toBeNull();
  });

  it('survives a hide of a nested overlay whose own contents suspended while presenting', async () => {
    // Core emits `ionMount` from the middle of `present()`, which is what
    // first mounts the children, so a suspension in them always lands while
    // `present()` is in flight and the host is already teleported.
    const onDidPresent = jest.fn();

    // The latch sits outside React: this suspender is the component that
    // throws, so React discards its state and re-renders it on the retry.
    let contentsReady = false;
    let resolveContents!: () => void;
    const contents = new Promise<void>((resolve) => {
      resolveContents = () => {
        contentsReady = true;
        resolve();
      };
    });
    const SuspendingContents = () => {
      if (!contentsReady) {
        throw contents;
      }
      return null;
    };

    render(
      <React.Suspense fallback={<div>loading</div>}>
        <IonModal keepContentsMounted={true}>
          <IonPopover id="nested-popover" onIonPopoverDidPresent={onDidPresent}>
            <SuspendingContents />
          </IonPopover>
        </IonModal>
      </React.Suspense>
    );

    const popover = document.querySelector('#nested-popover') as HTMLElement;
    teleport(popover);
    const teleportDestination = popover.parentElement;

    // On `present()` the host is already teleported when `ionMount` mounts the
    // contents, and the contents suspend as they render.
    await act(async () => {
      popover.dispatchEvent(new CustomEvent('ionMount'));
    });

    expect(popover.isConnected).toBe(true);

    await act(async () => {
      resolveContents();
      await contents;
    });

    expect(popover.isConnected).toBe(true);
    expect(popover.parentElement).toBe(teleportDestination);

    // Presenting runs to completion against a host that never moved.
    act(() => {
      popover.dispatchEvent(new CustomEvent('ionPopoverDidPresent'));
    });

    expect(onDidPresent).toHaveBeenCalledTimes(1);
  });

  it('removes a relocated nested overlay destroyed while it was hidden', async () => {
    // React skips the second `componentWillUnmount` when it destroys an
    // already-hidden subtree, so cleanup still has to happen.
    const { hide, unmount } = renderWithBoundary(
      <IonModal keepContentsMounted={true}>
        <IonPopover />
      </IonModal>
    );

    const popover = document.body.querySelector('ion-popover') as HTMLElement;
    teleport(popover);

    await hide();
    expect(popover.isConnected).toBe(true);

    unmount();
    await flushTeardown();

    expect(popover.isConnected).toBe(false);
    expect(document.querySelector('ion-popover')).toBeNull();
  });

  it('detaches an open portaled overlay destroyed while it was hidden', async () => {
    // React's portal removal takes the host, but the listeners and props
    // synced onto it are the wrapper's to detach, with no second
    // `componentWillUnmount` to do it in.
    const onDidDismiss = jest.fn();

    const { hide, unmount } = renderWithBoundary(<IonModal onDidDismiss={onDidDismiss} />);

    const modal = document.body.querySelector('ion-modal') as HTMLElement;

    act(() => {
      modal.dispatchEvent(new CustomEvent('willPresent'));
    });

    await hide();

    unmount();
    await flushTeardown();

    act(() => {
      modal.dispatchEvent(new CustomEvent('didDismiss'));
    });

    expect(onDidDismiss).not.toHaveBeenCalled();
  });

  it('detaches an open overlay when the shadow host holding the React root is destroyed', async () => {
    // With a React root inside a shadow root, removing the shadow host
    // disconnects the marker without mutating anything inside it, so a watch
    // scoped to that root alone never fires.
    const onDidDismiss = jest.fn();

    const shadowHost = document.createElement('div');
    document.body.appendChild(shadowHost);
    const container = document.createElement('div');
    shadowHost.attachShadow({ mode: 'open' }).appendChild(container);

    const { hide } = renderWithBoundary(<IonModal onDidDismiss={onDidDismiss} />, container);

    // The host portals to `document.body`, so only the marker is in the shadow root.
    const modal = document.body.querySelector('ion-modal') as HTMLElement;

    act(() => {
      modal.dispatchEvent(new CustomEvent('willPresent'));
    });

    await hide();

    // A raw DOM removal, so React runs nothing and the watch is the only
    // mechanism left to notice the destroy.
    shadowHost.remove();
    await flushTeardown();

    act(() => {
      modal.dispatchEvent(new CustomEvent('didDismiss'));
    });

    expect(onDidDismiss).not.toHaveBeenCalled();
  });

  it('detaches an overlay that only started presenting after the hide', async () => {
    // The overlay can open while hidden, since core keeps running. Deciding at
    // hide time what a destroy has to detach reads an `isOpen` still false.
    const onDidDismiss = jest.fn();

    const { hide, unmount } = renderWithBoundary(<IonModal onDidDismiss={onDidDismiss} />);

    const modal = document.body.querySelector('ion-modal') as HTMLElement;

    await hide();

    // Presenting starts while the subtree is still hidden.
    await act(async () => {
      modal.dispatchEvent(new CustomEvent('willPresent'));
    });

    unmount();
    await flushTeardown();

    act(() => {
      modal.dispatchEvent(new CustomEvent('didDismiss'));
    });

    expect(onDidDismiss).not.toHaveBeenCalled();
  });

  it('moves the wrapper back under the host when a dismiss lands while hidden', async () => {
    /**
     * The wrapper has to be a direct child of the host before flipping `isOpen`
     * makes React remove it, and a scoped overlay's slot relocation can nest it
     * deeper. React nulls the refs for the hidden window, so a dismiss landing
     * there has to recover the nodes or the removal throws.
     */
    const { hide, reveal } = renderWithBoundary(
      <IonModal>
        <span data-testid="modal-content">content</span>
      </IonModal>
    );

    const modal = document.body.querySelector('ion-modal') as HTMLElement;

    act(() => {
      modal.dispatchEvent(new CustomEvent('willPresent'));
    });

    const wrapper = modal.querySelector('.ion-delegate-host') as HTMLElement;
    expect(wrapper).toBeTruthy();

    // Stand in for a scoped overlay relocating its slotted content, which
    // leaves React's wrapper nested one level deeper than React thinks.
    const coreWrapper = document.createElement('div');
    coreWrapper.append(...Array.from(modal.children));
    modal.appendChild(coreWrapper);
    expect(wrapper.parentElement).toBe(coreWrapper);

    await hide();

    act(() => {
      modal.dispatchEvent(new CustomEvent('didDismiss'));
    });

    // Recovered without the refs, so React's removal finds it where it left it.
    expect(wrapper.parentElement).toBe(modal);

    await expect(reveal()).resolves.not.toThrow();

    expect(document.querySelector('[data-testid="modal-content"]')).toBeNull();
    expect(modal.isConnected).toBe(true);
  });

  it('redirects cachedOriginalParent once across repeated hide/reveal cycles', async () => {
    // Core clears `cachedOriginalParent` on parent removal, so a repeatedly
    // suspending subtree must not keep putting the reference back.
    let readyCallbacks = 0;
    mockComponentOnReady = (_el, cb) => {
      readyCallbacks++;
      cb();
    };

    const { hide, reveal } = renderWithBoundary(<IonModal />);
    expect(readyCallbacks).toBe(1);

    const modal = document.body.querySelector('ion-modal') as HTMLElement;

    for (let cycle = 0; cycle < 2; cycle++) {
      await hide();
      // React hides portal children too, so this is the observable hide.
      expect(modal.style.display).toBe('none');
      await reveal();
      expect(modal.style.display).toBe('');
    }

    expect(readyCallbacks).toBe(1);
  });

  it('leaves the cachedOriginalParent redirect to the reveal when the host is ready while hidden', async () => {
    // The real builds resolve `componentOnReady` asynchronously, so it can land
    // in the hidden window with the marker ref nulled and no JSX parent to
    // read. It has to bail without latching, or the reveal cannot redirect.
    let fireReady: (() => void) | null = null;
    mockComponentOnReady = (_el, cb) => {
      fireReady = cb;
    };

    const { container, hide, reveal } = renderWithBoundary(<IonModal />);
    const modal = document.body.querySelector('ion-modal') as any;

    await hide();

    // The host comes online while the subtree is hidden.
    act(() => {
      fireReady?.();
    });
    expect(modal.cachedOriginalParent).toBeUndefined();

    // The reveal registers again and gets the JSX parent this time.
    mockComponentOnReady = defaultComponentOnReady;
    await reveal();

    expect(modal.cachedOriginalParent).toBe(container);
  });

  it('leaves a wrapper that is already a direct child in place', async () => {
    const { hide } = renderWithBoundary(
      <IonModal>
        <span data-testid="modal-content">content</span>
      </IonModal>
    );

    const modal = document.body.querySelector('ion-modal') as HTMLElement;

    act(() => {
      modal.dispatchEvent(new CustomEvent('willPresent'));
    });

    const wrapper = modal.querySelector('.ion-delegate-host') as HTMLElement;
    // Core renders its own nodes after the wrapper, so re-appending a wrapper
    // that is already in place would reorder it past them.
    const coreNode = document.createElement('div');
    modal.appendChild(coreNode);

    await hide();

    act(() => {
      modal.dispatchEvent(new CustomEvent('didDismiss'));
    });

    expect(wrapper.nextElementSibling).toBe(coreNode);
  });

  it('releases the destroy watch on a reveal', async () => {
    const { observersCreated, restore } = countMutationObservers();

    try {
      const { hide, reveal } = renderWithBoundary(<IonModal keepContentsMounted={true} />);

      await hide();
      await reveal();
      // The reveal drained the last watch, so the next hide builds a new
      // observer. Without that release every cycle would add a watch.
      await hide();

      expect(observersCreated()).toBe(2);

      await reveal();
    } finally {
      restore();
    }
  });

  it('leaves no destroy watch behind after a StrictMode mount/unmount cycle', async () => {
    /**
     * The discarded first mount's deferred teardown runs after the remount
     * released its watch, and finds its marker connected because StrictMode
     * never removed the DOM. Without the generation check it registers a watch
     * nothing releases, holding the observer and host for the life of the page.
     */
    const { observersLive, restore } = countMutationObservers();

    try {
      render(
        <React.StrictMode>
          <IonModal />
        </React.StrictMode>
      );
      await flushTeardown();

      expect(observersLive()).toBe(0);
    } finally {
      restore();
    }
  });

  it('cleans up when an ancestor of the marker is destroyed while hidden', async () => {
    // React removes a node above the marker, so an observer on the marker's
    // own parent would never fire.
    let removeAncestor!: () => void;
    let suspend!: () => void;

    /**
     * The boundary sits inside the modal so only the popover is hidden and
     * watched, since an outer overlay hidden alongside it would share the
     * observer and mask which node was registered. The `<div>` is the
     * intervening ancestor, and the state sits outside the boundary because
     * React defers updates made inside a hidden subtree.
     */
    const App = () => {
      const [isPresent, setIsPresent] = React.useState(true);
      const [pending, setPending] = React.useState<Promise<void> | null>(null);
      removeAncestor = () => setIsPresent(false);
      suspend = () => setPending(new Promise<void>(() => undefined));

      return (
        <IonModal keepContentsMounted={true}>
          {isPresent ? (
            <div>
              <React.Suspense fallback={<div>loading</div>}>
                <IonPopover />
                <Suspender pending={pending} />
              </React.Suspense>
            </div>
          ) : null}
        </IonModal>
      );
    };

    render(<App />);

    const popover = document.body.querySelector('ion-popover') as HTMLElement;
    teleport(popover);

    act(() => {
      suspend();
    });
    await flushTeardown();
    expect(popover.isConnected).toBe(true);

    act(() => {
      removeAncestor();
    });
    await flushTeardown();

    expect(popover.isConnected).toBe(false);
  });

  it('leaves a host moved elsewhere during the hidden window where it is', async () => {
    // The reveal only undoes the move `componentWillUnmount` made. A host that
    // something else moved is no longer in `portalTarget`, so the pre-hide
    // position is wrong.
    const { hide, reveal } = renderWithBoundary(<IonModal />);

    const modal = document.body.querySelector('ion-modal') as HTMLElement;

    act(() => {
      modal.dispatchEvent(new CustomEvent('willPresent'));
    });
    teleport(modal);

    await hide();

    const elsewhere = document.createElement('div');
    document.body.appendChild(elsewhere);
    elsewhere.appendChild(modal);

    await reveal();

    expect(modal.parentElement).toBe(elsewhere);
  });

  it('shares one destroy observer across overlays hidden together', async () => {
    // Hidden overlays share one observer rather than each taking a
    // `document`-wide one. At most one construction here: none if a prior
    // watch built it, two if the sharing regresses to per-instance.
    const { observersCreated, restore } = countMutationObservers();

    try {
      const { hide, unmount } = renderWithBoundary(
        <IonModal keepContentsMounted={true}>
          <IonPopover id="first" />
          <IonPopover id="second" />
        </IonModal>
      );

      const first = document.querySelector('#first') as HTMLElement;
      const second = document.querySelector('#second') as HTMLElement;
      teleport(first);
      teleport(second);

      await hide();
      expect(first.isConnected).toBe(true);
      expect(second.isConnected).toBe(true);
      expect(observersCreated()).toBeLessThanOrEqual(1);

      unmount();
      await flushTeardown();

      expect(first.isConnected).toBe(false);
      expect(second.isConnected).toBe(false);
    } finally {
      restore();
    }
  });

  it('does not orphan a relocated nested overlay across a StrictMode mount/unmount cycle', async () => {
    // A relocated nested host has to survive the StrictMode cycle with exactly
    // one copy left in the DOM, same as the portaled StrictMode test.
    // Relocate from a layout effect: `mockComponentOnReady` never fires for a
    // nested overlay, so the host would never leave its `<template>`.
    const Teleporter = () => {
      React.useLayoutEffect(() => {
        teleport(document.querySelector('ion-popover') as HTMLElement);
      }, []);
      return null;
    };

    render(
      <React.StrictMode>
        <IonModal keepContentsMounted={true}>
          <IonPopover id="nested-popover" keepContentsMounted={true}>
            <Teleporter />
          </IonPopover>
        </IonModal>
      </React.StrictMode>
    );
    await flushTeardown();

    const popovers = document.querySelectorAll('ion-popover');
    expect(popovers).toHaveLength(1);
    expect(popovers[0].isConnected).toBe(true);
    expect(popovers[0].parentElement?.id).toBe('teleport-destination');
  });
});
