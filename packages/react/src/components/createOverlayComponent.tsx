import { OverlayEventDetail } from '@ionic/core';
import React from 'react';
import ReactDOM from 'react-dom';

import { attachProps } from './utils';

interface OverlayElement extends HTMLElement {
  present: () => Promise<void>;
  dismiss: (data?: any, role?: string | undefined) => Promise<boolean>;
}

export interface ReactOverlayProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onDidDismiss?: (event: CustomEvent<OverlayEventDetail>) => void;
}

export const createOverlayComponent = <OverlayComponent extends object, OverlayType extends OverlayElement>(
  displayName: string,
  controller: { create: (options: any) => Promise<OverlayType>; }
) => {
  const dismissEventName = `on${displayName}DidDismiss`;

  type Props = OverlayComponent & ReactOverlayProps & {
    forwardedRef?: React.RefObject<OverlayType>;
  };

  class Overlay extends React.Component<Props> {
    overlay?: OverlayType;
    el: HTMLDivElement;

    constructor(props: Props) {
      super(props);
      this.el = document.createElement('div');
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
      if (this.overlay) { this.overlay.dismiss(); }
    }

    handleDismiss(event: CustomEvent<OverlayEventDetail<any>>) {
      if (this.props.onDidDismiss) {
        this.props.onDidDismiss(event);
      }
      if (this.props.forwardedRef) {
        (this.props.forwardedRef as any).current = undefined;
      }
    }

    async componentDidUpdate(prevProps: Props) {
      if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen === true) {
        this.present(prevProps);
      }
      if (this.overlay && prevProps.isOpen !== this.props.isOpen && this.props.isOpen === false) {
        await this.overlay.dismiss();
      }
    }

    async present(prevProps?: Props) {
      const { children, isOpen, onDidDismiss, ...cProps } = this.props;
      const elementProps = {
        ...cProps,
        ref: this.props.forwardedRef,
        [dismissEventName]: this.handleDismiss
      };

      const overlay = this.overlay = await controller.create({
        ...elementProps,
        component: this.el,
        componentProps: {}
      });

      if (this.props.forwardedRef) {
        (this.props.forwardedRef as any).current = overlay;
      }

      attachProps(overlay, elementProps, prevProps);

      await overlay.present();
    }

    render() {
      return ReactDOM.createPortal(
        this.props.isOpen ? this.props.children : null,
        this.el
      );
    }
  }

  return React.forwardRef<OverlayType, Props>((props, ref) => {
    return <Overlay {...props} forwardedRef={ref} />;
  });
};
