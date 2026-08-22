import type { HTMLIonOverlayElement, OverlayEventDetail } from '@ionic/core/components';
import { componentOnReady } from '@ionic/core/components';
import React, { createElement } from 'react';
import { createPortal } from 'react-dom';

import {
  attachProps,
  camelToDashCase,
  dashToPascalCase,
  isCoveredByReact,
  mergeRefs,
} from './react-component-lib/utils';
import { createForwardRef } from './utils';
import { detachProps } from './utils/detachProps';

// TODO(FW-2959): types

type InlineOverlayState = {
  isOpen: boolean;
};

/**
 * Set to `true` when rendering inside another inline overlay. Nested
 * overlays render at their JSX position (no portal) so that core's
 * `el.closest('ion-popover')`-style nesting detection keeps working,
 * and the outer overlay's portal already gives the subtree the correct
 * React event-delegation root.
 */
const NestedOverlayContext = React.createContext(false);

type DestroyWatch = { marker: HTMLElement; onDestroy: () => void };

/**
 * React skips `componentWillUnmount` when it destroys a subtree it had already
 * hidden, so a hidden overlay watches its own marker leave the document. Every
 * watcher asks the same question of the same tree, so they share one observer:
 * a `document`-wide `subtree` observer per overlay is the change-detection cost
 * core avoids where it can (see modal's `initParentRemovalObserver`).
 */
const destroyWatches = new Set<DestroyWatch>();
let destroyObserver: MutationObserver | undefined;

const stopDestroyObserverIfIdle = () => {
  if (destroyWatches.size === 0) {
    destroyObserver?.disconnect();
    destroyObserver = undefined;
  }
};

const watchForDestroy = (marker: HTMLElement, onDestroy: () => void): DestroyWatch | undefined => {
  // Mirrors core's guard for environments with a DOM but no MutationObserver.
  if (typeof MutationObserver === 'undefined') {
    return undefined;
  }
  const watch: DestroyWatch = { marker, onDestroy };
  destroyWatches.add(watch);
  if (destroyObserver === undefined) {
    destroyObserver = new MutationObserver(() => {
      for (const candidate of Array.from(destroyWatches)) {
        if (candidate.marker.isConnected) {
          continue;
        }
        destroyWatches.delete(candidate);
        candidate.onDestroy();
      }
      stopDestroyObserverIfIdle();
    });
  }
  /**
   * The node React removes is usually the marker's own parent, and a
   * `childList` observer never fires for its own removal, so this watches from
   * the marker's root down rather than from its parent. The root rather than
   * `document.body` so a React root mounted outside the body, or inside a
   * shadow root, is still covered.
   */
  destroyObserver.observe(marker.getRootNode(), { childList: true, subtree: true });
  return watch;
};

const unwatchForDestroy = (watch: DestroyWatch | undefined) => {
  if (watch === undefined) {
    return;
  }
  destroyWatches.delete(watch);
  stopDestroyObserverIfIdle();
};

interface IonicReactInternalProps<ElementType> extends React.HTMLAttributes<ElementType> {
  forwardedRef?: React.ForwardedRef<ElementType>;
  ref?: React.Ref<any>;
  onDidDismiss?: (event: CustomEvent<OverlayEventDetail>) => void;
  onDidPresent?: (event: CustomEvent<OverlayEventDetail>) => void;
  onWillDismiss?: (event: CustomEvent<OverlayEventDetail>) => void;
  onWillPresent?: (event: CustomEvent<OverlayEventDetail>) => void;
  keepContentsMounted?: boolean;
}

export const createInlineOverlayComponent = <PropType, ElementType>(
  tagName: string,
  defineCustomElement?: () => void,
  hasDelegateHost?: boolean
) => {
  if (defineCustomElement) {
    defineCustomElement();
  }
  const displayName = dashToPascalCase(tagName);

  type InternalProps = IonicReactInternalProps<PropType> & { isNested?: boolean };

  const ReactComponent = class extends React.Component<InternalProps, InlineOverlayState> {
    ref: React.RefObject<HTMLIonOverlayElement>;
    wrapperRef: React.RefObject<HTMLElement>;
    markerRef: React.RefObject<HTMLTemplateElement>;
    stableMergedRefs: React.RefCallback<HTMLElement>;
    portalTarget: HTMLElement | null;
    // Bumped on every mount, so a deferred teardown can tell it was revealed.
    private mountCount = 0;
    private hiddenDestroyWatch?: DestroyWatch;
    /**
     * Where a relocated portaled host sat before `componentWillUnmount` moved
     * it back into `portalTarget`, so a reveal can put it back.
     */
    private relocatedPortalHost?: { node: HTMLElement; parent: Node; nextSibling: Node | null };
    /**
     * The host and wrapper as of the last `componentWillUnmount`. React nulls
     * the refs for as long as it keeps this subtree hidden, and a dismiss can
     * land in that window, so `handleDidDismiss` falls back to these.
     */
    private nodesAtUnmount: { host: HTMLElement; wrapper: HTMLElement | null } | null = null;
    /**
     * `componentDidMount` runs again on every reveal, but the redirect must
     * not: core clears `cachedOriginalParent` when the parent is removed, and
     * re-running would put the reference back. The JSX parent never changes,
     * so once is enough.
     */
    private hasRedirectedOriginalParent = false;

    constructor(props: InternalProps) {
      super(props);
      // Create a local ref to to attach props to the wrapped element.
      this.ref = React.createRef();
      // React refs must be stable (not created inline).
      this.stableMergedRefs = mergeRefs(this.ref, this.props.forwardedRef);
      // Component is hidden by default
      this.state = { isOpen: false };
      // Create a local ref to the inner child element.
      this.wrapperRef = React.createRef();
      // Marker stays at the JSX location: portaled overlays recover their JSX
      // parent from it, and it leaves the document only on a real unmount.
      this.markerRef = React.createRef();
      /**
       * Resolve the portal target to the same container CoreDelegate
       * teleports overlays into. Portaling here keeps the overlay inside
       * React's tree so React's synthetic events still dispatch to its
       * children, even after CoreDelegate moves the DOM node out of the
       * declared JSX parent.
       */
      this.portalTarget = typeof document !== 'undefined' ? document.querySelector('ion-app') || document.body : null;
    }

    componentDidMount() {
      this.mountCount++;
      this.nodesAtUnmount = null;
      // React is showing this subtree again, so the pending teardown from the
      // hide is off.
      this.stopWatchingForDestroy();
      this.restoreRelocatedPortalHost();

      this.componentDidUpdate(this.props);

      this.ref.current?.addEventListener('ionMount', this.handleIonMount);
      this.ref.current?.addEventListener('willPresent', this.handleWillPresent);
      this.ref.current?.addEventListener('didDismiss', this.handleDidDismiss);

      /**
       * The overlay is portaled to `portalTarget`, so Stencil caches that
       * container as `cachedOriginalParent`. Modal features (sheet
       * child-route passthrough, parent-removal auto-dismiss) walk up
       * from `cachedOriginalParent` to find the enclosing `.ion-page`,
       * so we redirect it at the marker's JSX parent.
       *
       * Nested overlays are excluded: they never portal, so a nested modal
       * already cached its `<template>`, which sits at the JSX position and
       * resolves the right `.ion-page`.
       */
      const overlay = this.ref.current;
      const generation = this.mountCount;
      if (overlay && !this.props.isNested && !this.hasRedirectedOriginalParent) {
        componentOnReady(overlay as HTMLElement, () => {
          /**
           * A newer mount owns this now, or React nulled the marker ref
           * because it unmounted or hid the subtree. Either way the callback
           * is stale, and leaving the latch open lets the reveal retry.
           */
          const markerParent = this.markerRef.current?.parentElement ?? null;
          if (this.mountCount !== generation || markerParent === null) {
            return;
          }
          // Latch on completion, not on success: either way this instance is
          // done, so a later reveal must not redirect again.
          this.hasRedirectedOriginalParent = true;
          if (markerParent !== this.portalTarget) {
            (overlay as any).cachedOriginalParent = markerParent;
          }
        });
      }
    }

    componentDidUpdate(prevProps: InternalProps) {
      const node = this.ref.current! as HTMLElement;
      /**
       * onDidDismiss and onWillPresent have manual implementations that
       * will invoke the original handler. We need to filter those out
       * so they don't get attached twice and called twice.
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { onDidDismiss, onWillPresent, isNested, ...cProps } = this.props;
      attachProps(node, cProps, prevProps);
    }

    componentWillUnmount() {
      const node = this.ref.current;
      if (!node) {
        return;
      }
      this.nodesAtUnmount = { host: node, wrapper: this.wrapperRef.current };
      /**
       * CoreDelegate (or user code in onWillPresent) can move a portaled
       * overlay out of `portalTarget`. React's portal `removeChild` runs as
       * soon as this returns and needs the host where it left it, so this one
       * has to stay synchronous, before we know whether this is a hide or a
       * destroy. Record where it came from so a reveal can undo the move.
       */
      if (node.isConnected && !this.props.isNested && this.portalTarget && node.parentNode !== this.portalTarget) {
        this.relocatedPortalHost = { node, parent: node.parentNode!, nextSibling: node.nextSibling };
        this.portalTarget.appendChild(node);
      }
      /**
       * React also calls `componentWillUnmount` when it only *hides* a
       * subtree - a Suspense boundary falling back, an Offscreen tree, the
       * StrictMode dev cycle - and then mounts the same instance again on the
       * reveal. Nothing here tells the two apart, so the teardown waits a
       * microtask and runs only if the marker really left the document.
       */
      const marker = this.markerRef.current;
      const mountCount = this.mountCount;
      queueMicrotask(() => {
        // Already back (the StrictMode cycle remounts before this runs).
        if (this.mountCount !== mountCount) {
          return;
        }
        if (marker?.isConnected) {
          this.watchForDestroyWhileHidden(marker, node, mountCount);
          return;
        }
        this.cleanupAfterUnmount(node);
      });
    }

    /**
     * `componentWillUnmount` has to move a relocated portaled host back into
     * `portalTarget` before it knows a hide from a destroy. On a reveal there
     * was no removal to prepare for, so put the host back where it was.
     */
    private restoreRelocatedPortalHost() {
      const relocated = this.relocatedPortalHost;
      this.relocatedPortalHost = undefined;
      if (!relocated || !relocated.parent.isConnected || relocated.node.parentNode !== this.portalTarget) {
        return;
      }
      const { node, parent, nextSibling } = relocated;
      // The recorded sibling can have moved or been removed while hidden, in
      // which case appending is the closest we can get.
      parent.insertBefore(node, nextSibling?.parentNode === parent ? nextSibling : null);
    }

    /**
     * `cleanupAfterUnmount` decides what a destroy actually has to undo:
     * gating here on the state at hide time would miss an overlay that only
     * starts presenting afterwards.
     */
    private watchForDestroyWhileHidden(marker: HTMLElement, node: HTMLElement, mountCount: number) {
      this.hiddenDestroyWatch = watchForDestroy(marker, () => {
        this.hiddenDestroyWatch = undefined;
        // A reveal already happened, so componentDidMount owns the teardown.
        if (this.mountCount !== mountCount) {
          return;
        }
        this.cleanupAfterUnmount(node);
      });
    }

    private stopWatchingForDestroy() {
      unwatchForDestroy(this.hiddenDestroyWatch);
      this.hiddenDestroyWatch = undefined;
    }

    private cleanupAfterUnmount(node: HTMLElement) {
      // The component is really gone, so nothing is waiting to be put back.
      this.nodesAtUnmount = null;
      this.relocatedPortalHost = undefined;
      /**
       * Nested overlays render inline inside a `<template>`. If the host has
       * been moved out of that template, React's unmount won't reach it, so
       * remove it directly. A host still in its template is left for React to
       * remove.
       */
      if (this.props.isNested && node.isConnected && !(node.parentElement instanceof HTMLTemplateElement)) {
        node.remove();
      }
      /**
       * If the overlay is being unmounted, but is still
       * open, this means the unmount was triggered outside
       * of the overlay being dismissed.
       *
       * This can happen with:
       * - The parent component being unmounted
       * - The overlay being conditionally rendered
       * - A route change (push/pop/replace)
       *
       * Unmounting the overlay at this stage should skip
       * the dismiss lifecycle, including skipping the transition.
       *
       * Detach the local event listener that performs the state updates,
       * before dismissing the overlay, to prevent the callback handlers
       * executing after the component has been unmounted. This is to
       * avoid memory leaks.
       */
      if (this.state.isOpen) {
        node.removeEventListener('didDismiss', this.handleDidDismiss);
        detachProps(node, this.props);
      }
    }

    render() {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children, forwardedRef, style, className, ref, isNested, ...cProps } = this.props;

      const propsToPass = Object.keys(cProps).reduce((acc, name) => {
        if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
          const eventName = name.substring(2).toLowerCase();
          if (isCoveredByReact(eventName)) {
            (acc as any)[name] = (cProps as any)[name];
          }
        } else if (['string', 'boolean', 'number'].includes(typeof (cProps as any)[name])) {
          (acc as any)[camelToDashCase(name)] = (cProps as any)[name];
        }
        return acc;
      }, {});

      const newProps: IonicReactInternalProps<PropType> = {
        ...propsToPass,
        ref: this.stableMergedRefs,
        style,
      };

      /**
       * Some overlays need `.ion-page` so content
       * takes up the full size of the parent overlay.
       */
      const getWrapperClasses = () => {
        if (hasDelegateHost) {
          return `${DELEGATE_HOST} ion-page`;
        }

        return DELEGATE_HOST;
      };

      const overlayElement = createElement(
        tagName,
        newProps,
        // Children, not the overlay host, observe `isNested = true`.
        createElement(
          NestedOverlayContext.Provider,
          { value: true },
          /**
           * We only want the inner component to be mounted if the overlay
           * is open, so conditionally render based on `isOpen` state.
           */
          this.state.isOpen || this.props.keepContentsMounted
            ? createElement(
                'div',
                {
                  ref: this.wrapperRef,
                  className: getWrapperClasses(),
                },
                children
              )
            : null
        )
      );

      // Top-level overlays portal into `portalTarget` with a marker
      // `<template>` at the JSX location to recover the immediate JSX
      // parent after CoreDelegate teleports. Nested overlays and SSR
      // fall back to a `<template>` wrapper.
      if (!isNested && this.portalTarget) {
        return createElement(
          React.Fragment,
          null,
          createElement('template', { ref: this.markerRef }),
          createPortal(overlayElement, this.portalTarget)
        );
      }

      return createElement('template', { ref: this.markerRef }, overlayElement);
    }

    static get displayName() {
      return displayName;
    }

    private handleIonMount = () => {
      /**
       * Mount the inner component when the
       * overlay is about to open.
       *
       * For ion-popover, this is when `ionMount` is emitted.
       * For other overlays, this is when `willPresent` is emitted.
       */
      this.setState({ isOpen: true });
    };

    private handleWillPresent = (evt: any) => {
      this.setState({ isOpen: true });
      /**
       * Manually call the onWillPresent
       * handler if present as setState will
       * cause the event handlers to be
       * destroyed and re-created.
       */
      this.props.onWillPresent && this.props.onWillPresent(evt);
    };

    private handleDidDismiss = (evt: any) => {
      // The refs are null for as long as React keeps this subtree hidden, so a
      // dismiss that lands there falls back to the nodes recorded at hide time.
      const wrapper = this.wrapperRef.current ?? this.nodesAtUnmount?.wrapper ?? null;
      const el = this.ref.current ?? this.nodesAtUnmount?.host ?? null;

      /**
       * React's `removeChild` needs the wrapper as a direct child of the host,
       * and Stencil's scoped-slot relocation (ion-alert, ion-action-sheet,
       * ion-loading) can nest it deeper. So this has to run before the flip
       * below, which is what triggers that removal. Already a direct child
       * means leaving it alone: appending would only reorder it against core's
       * own nodes.
       */
      if (wrapper && el && wrapper.parentElement !== el) {
        el.append(wrapper);
      }
      /**
       * Flip either way: a dismiss that lands while hidden would otherwise
       * leave the contents mounted against a closed overlay on reveal. After a
       * real unmount this is a no-op.
       */
      this.setState({ isOpen: false });

      this.props.onDidDismiss && this.props.onDidDismiss(evt);
    };
  };

  // Forward the nesting context as a prop to avoid contextType on the class.
  // The render function is passed via `children` (not as a varargs child) so it
  // matches `Context.Consumer`'s render-prop signature `(value) => ReactNode`.
  const ReactComponentWithNesting: React.FC<IonicReactInternalProps<PropType>> = (props) =>
    createElement(NestedOverlayContext.Consumer, {
      children: (isNested: boolean) => createElement(ReactComponent, { ...(props as InternalProps), isNested }),
    });
  ReactComponentWithNesting.displayName = displayName;

  return createForwardRef<PropType, ElementType>(ReactComponentWithNesting, displayName);
};

const DELEGATE_HOST = 'ion-delegate-host';
