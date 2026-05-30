import React from 'react';
import ReactDOM from 'react-dom';

import { OverlayEventDetail } from './interfaces';
import { StencilReactForwardedRef, attachProps, dashToPascalCase, defineCustomElement, setRef } from './utils';

interface OverlayElement extends HTMLElement {
  present: () => Promise<void>;
  dismiss: (data?: any, role?: string | undefined) => Promise<boolean>;
}

export interface ReactOverlayProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onDidDismiss?: (event: CustomEvent<OverlayEventDetail>) => void;
  onDidPresent?: (event: CustomEvent<OverlayEventDetail>) => void;
  onWillDismiss?: (event: CustomEvent<OverlayEventDetail>) => void;
  onWillPresent?: (event: CustomEvent<OverlayEventDetail>) => void;
}

export const createOverlayComponent = <OverlayComponent extends object, OverlayType extends OverlayElement>(
  tagName: string,
  controller: { create: (options: any) => Promise<OverlayType> },
  customElement?: any
) => {
  defineCustomElement(tagName, customElement);

  const displayName = dashToPascalCase(tagName);
  const didDismissEventName = `on${displayName}DidDismiss`;
  const didPresentEventName = `on${displayName}DidPresent`;
  const willDismissEventName = `on${displayName}WillDismiss`;
  const willPresentEventName = `on${displayName}WillPresent`;

  type Props = OverlayComponent &
    ReactOverlayProps & {
      forwardedRef?: StencilReactForwardedRef<OverlayType>;
    };

  let isDismissing = false;

  class Overlay extends React.Component<Props> {
    overlay?: OverlayType;
    el!: HTMLDivElement;

    constructor(props: Props) {
      super(props);
      if (typeof document !== 'undefined') {
        this.el = document.createElement('div');
      }
      this.handleDismiss = this.handleDismiss.bind(this);
    }

    static get displayName() {
      return displayName;
    }

    componentDidMount() {
      if (this.props.isOpen) {
        this.present();
      }
    }

    componentWillUnmount() {
      if (this.overlay) {
        this.overlay.dismiss();
      }
    }

    handleDismiss(event: CustomEvent<OverlayEventDetail<any>>) {
      if (this.props.onDidDismiss) {
        this.props.onDidDismiss(event);
      }
      setRef(this.props.forwardedRef, null);
    }

    shouldComponentUpdate(nextProps: Props) {
      // Check if the overlay component is about to dismiss
      if (this.overlay && nextProps.isOpen !== this.props.isOpen && nextProps.isOpen === false) {
        isDismissing = true;
      }

      return true;
    }

    async componentDidUpdate(prevProps: Props) {
      if (this.overlay) {
        attachProps(this.overlay, this.props, prevProps);
      }

      if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen === true) {
        this.present(prevProps);
      }
      if (this.overlay && prevProps.isOpen !== this.props.isOpen && this.props.isOpen === false) {
        await this.overlay.dismiss();
        isDismissing = false;

        /**
         * Now that the overlay is dismissed
         * we need to render again so that any
         * inner components will be unmounted
         */
        this.forceUpdate();
      }
    }

    async present(prevProps?: Props) {
      const { children, isOpen, onDidDismiss, onDidPresent, onWillDismiss, onWillPresent, ...cProps } = this.props;
      const elementProps = {
        ...cProps,
        ref: this.props.forwardedRef,
        [didDismissEventName]: this.handleDismiss,
        [didPresentEventName]: (e: CustomEvent) => this.props.onDidPresent && this.props.onDidPresent(e),
        [willDismissEventName]: (e: CustomEvent) => this.props.onWillDismiss && this.props.onWillDismiss(e),
        [willPresentEventName]: (e: CustomEvent) => this.props.onWillPresent && this.props.onWillPresent(e),
      };

      this.overlay = await controller.create({
        ...elementProps,
        component: this.el,
        componentProps: {},
      });

      setRef(this.props.forwardedRef, this.overlay);
      attachProps(this.overlay, elementProps, prevProps);

      await this.overlay.present();
    }

    render() {
      /**
       * Continue to render the component even when
       * overlay is dismissing otherwise component
       * will be hidden before animation is done.
       */
      return ReactDOM.createPortal(this.props.isOpen || isDismissing ? this.props.children : null, this.el);
    }
  }

  return React.forwardRef<OverlayType, Props>((props, ref) => {
    return <Overlay {...props} forwardedRef={ref} />;
  });
};
