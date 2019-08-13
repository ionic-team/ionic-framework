import { OverlayEventDetail } from '@ionic/core';
import React from 'react';

import { attachEventProps } from './utils';

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

    constructor(props: Props) {
      super(props);
    }

    static get displayName() {
      return displayName;
    }

    async componentDidMount() {
      const { isOpen } = this.props;
      // TODO
      if (isOpen as boolean) {
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
      const { isOpen, onDidDismiss, ...cProps } = this.props;
      const overlay = this.overlay = await controller.create({
        ...cProps as any
      });
      attachEventProps(overlay, {
        [dismissEventName]: onDidDismiss
      }, prevProps);
      await overlay.present();
    }

    render(): null {
      return null;
    }
  };
};
