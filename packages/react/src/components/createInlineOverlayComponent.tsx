import type { HTMLIonOverlayElement, OverlayEventDetail } from '@ionic/core/components';
import React, { createElement } from 'react';

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
  const ReactComponent = class extends React.Component<IonicReactInternalProps<PropType>, InlineOverlayState> {
    ref: React.RefObject<HTMLIonOverlayElement>;
    wrapperRef: React.RefObject<HTMLElement>;
    stableMergedRefs: React.RefCallback<HTMLElement>;

    constructor(props: IonicReactInternalProps<PropType>) {
      super(props);
      // Create a local ref to to attach props to the wrapped element.
      this.ref = React.createRef();
      // React refs must be stable (not created inline).
      this.stableMergedRefs = mergeRefs(this.ref, this.props.forwardedRef);
      // Component is hidden by default
      this.state = { isOpen: false };
      // Create a local ref to the inner child element.
      this.wrapperRef = React.createRef();
    }

    componentDidMount() {
      this.componentDidUpdate(this.props);

      this.ref.current?.addEventListener('ionMount', this.handleIonMount);
      this.ref.current?.addEventListener('willPresent', this.handleWillPresent);
      this.ref.current?.addEventListener('didDismiss', this.handleDidDismiss);
    }

    componentDidUpdate(prevProps: IonicReactInternalProps<PropType>) {
      const node = this.ref.current! as HTMLElement;
      attachProps(node, this.props, prevProps);
    }

    componentWillUnmount() {
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
        node.remove();
        detachProps(node, this.props);
      }
    }

    render() {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children, forwardedRef, style, className, ref, ...cProps } = this.props;

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

      return createElement(
        'template',
        {},
        createElement(
          tagName,
          newProps,
          /**
           * We only want the inner component
           * to be mounted if the overlay is open,
           * so conditionally render the component
           * based on the isOpen state.
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
  return createForwardRef<PropType, ElementType>(ReactComponent, displayName);
};

const DELEGATE_HOST = 'ion-delegate-host';
