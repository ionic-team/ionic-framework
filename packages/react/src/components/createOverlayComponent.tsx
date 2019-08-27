import { OverlayEventDetail } from '@ionic/core';
import React from 'react';
import ReactDOM from 'react-dom';

import { attachEventProps } from './utils';

interface OverlayElement extends HTMLElement {
  present: () => Promise<void>;
  dismiss: (data?: any, role?: string | undefined) => Promise<boolean>;
}

export interface ReactOverlayProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onDidDismiss?: (event: CustomEvent<OverlayEventDetail>) => void;
}

export const createOverlayComponent = <T extends object, OverlayType extends OverlayElement>(
  displayName: string,
  controller: { create: (options: any) => Promise<OverlayType> }
) => {
  const dismissEventName = `on${displayName}DidDismiss`;

  type Props = T & ReactOverlayProps;

  return class extends React.Component<Props> {
    overlay?: OverlayType;
    el: HTMLDivElement;

    constructor(props: Props) {
      super(props);
      this.el = document.createElement('div');
    }

    static get displayName() {
      return displayName;
    }

    componentDidMount() {
      // TODO
      if (this.props.isOpen as boolean) {
        this.present();
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
      const { children, isOpen, onDidDismiss = () => { return; }, ...cProps } = this.props;
      const elementProps = {
        ...cProps,
        [dismissEventName]: onDidDismiss
      };

      const overlay = this.overlay = await controller.create({
        ...elementProps,
        component: this.el,
        componentProps: {}
      });

      attachEventProps(overlay, elementProps, prevProps);

      await overlay.present();
    }

    render() {
      return ReactDOM.createPortal(
        this.props.children,
        this.el,
      );
    }
  };
};
