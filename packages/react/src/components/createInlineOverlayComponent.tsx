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
    isUnmounted = false;

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
      // Marker stays at the JSX location so we can recover the immediate
      // JSX parent after the overlay has been portaled to ion-app.
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
      // Reset for React 18 StrictMode: the dev-mode unmount/remount cycle
      // re-uses this instance and leaves the flag set from the prior
      // componentWillUnmount.
      this.isUnmounted = false;

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
       */
      const overlay = this.ref.current;
      if (overlay) {
        componentOnReady(overlay as HTMLElement, () => {
          if (this.isUnmounted) return;
          const markerParent = this.markerRef.current?.parentElement ?? null;
          if (markerParent && markerParent !== this.portalTarget) {
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
      this.isUnmounted = true;
      const node = this.ref.current;
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
       */
      if (node && this.state.isOpen) {
        /**
         * Detach the local event listener that performs the state updates,
         * before dismissing the overlay, to prevent the callback handlers
         * executing after the component has been unmounted. This is to
         * avoid memory leaks.
         */
        node.removeEventListener('didDismiss', this.handleDidDismiss);
        if (this.props.isNested) {
          /**
           * Nested overlays render inline (no portal). CoreDelegate may
           * have moved the node out of its React parent, so React's
           * unmount won't reach it. Remove it directly.
           */
          node.remove();
        } else if (node.isConnected && this.portalTarget && node.parentNode !== this.portalTarget) {
          /**
           * Portaled path: move the overlay back into `portalTarget` so
           * React's portal removeChild can find it. CoreDelegate (or user
           * code in onWillPresent) may have moved it elsewhere while open.
           */
          this.portalTarget.appendChild(node);
        }
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

      return createElement('template', {}, overlayElement);
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
      const wrapper = this.wrapperRef.current;
      const el = this.ref.current;

      /**
       * This component might be unmounted already, if the containing
       * element was removed while the overlay was still open. (For
       * example, if an item contains an inline overlay with a button
       * that removes the item.)
       */
      if (wrapper && el) {
        el.append(wrapper);
        this.setState({ isOpen: false });
      }

      this.props.onDidDismiss && this.props.onDidDismiss(evt);
    };
  };

  // Forward the nesting context as a prop to avoid contextType on the class.
  const ReactComponentWithNesting: React.FC<IonicReactInternalProps<PropType>> = (props) =>
    createElement(NestedOverlayContext.Consumer, {
      children: (isNested: boolean) => createElement(ReactComponent, { ...(props as InternalProps), isNested }),
    });
  ReactComponentWithNesting.displayName = displayName;

  return createForwardRef<PropType, ElementType>(ReactComponentWithNesting, displayName);
};

const DELEGATE_HOST = 'ion-delegate-host';
