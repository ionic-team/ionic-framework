import { OverlayEventDetail } from '@ionic/core';
import React from 'react';

import { attachProps } from './utils';

interface OverlayBase extends HTMLElement {
  present: () => Promise<void>;
  dismiss: (data?: any, role?: string | undefined) => Promise<boolean>;
}

export interface ReactControllerProps {
  isOpen: boolean;
  onDidDismiss?: (event: CustomEvent<OverlayEventDetail>) => void;
}

export const createControllerComponent = <OptionsType extends object, OverlayType extends OverlayBase>(
  displayName: string,
  controller: { create: (options: OptionsType) => Promise<OverlayType> }
) => {
  const dismissEventName = `on${displayName}DidDismiss`;

  type Props = OptionsType & ReactControllerProps;

  return class extends React.Component<Props> {
    overlay?: OverlayType;
    isUnmounted = false;

    constructor(props: Props) {
      super(props);
    }

    static get displayName() {
      return displayName;
    }

    async componentDidMount() {
      const { isOpen } = this.props;
      if (isOpen as boolean) {
        this.present();
      }
    }

    componentWillUnmount() {
      this.isUnmounted = true;
      if (this.overlay) { this.overlay.dismiss(); }
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
      const { isOpen, onDidDismiss, ...cProps } = this.props;
      let overlay = this.overlay;
      if (!overlay) {
        overlay = this.overlay = await controller.create({
          ...cProps as any
        });
      }
      attachProps(overlay, {
        [dismissEventName]: onDidDismiss
      }, prevProps);
      // Check isOpen again since the value could have changed during the async call to controller.create
      // It's also possible for the component to have become unmounted.
      if (this.props.isOpen === true && this.isUnmounted === false) {
        await overlay.present();
      }
    }

    render(): null {
      return null;
    }
  };
};
