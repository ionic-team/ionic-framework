import React from 'react';
import { OverlayEventDetail } from '@ionic/core';
import { generateUniqueId, attachEventProps } from './utils'

interface LoadingElement {
  present: () => any;
  dismiss: () => any;
}

export function createControllerComponent<OptionsType extends object, LoadingElementType extends LoadingElement>(displayName: string, controller: { create: (options: any) => Promise<LoadingElementType> }) {
  const dismissEventName = `on${displayName}DidDismiss`;

  type ReactControllerProps = {
    isOpen: boolean;
    onDidDismiss: (event: CustomEvent<OverlayEventDetail>) => void;
  }
  type Props = OptionsType & ReactControllerProps;

  return class ReactControllerComponent extends React.Component<Props> {
    controller: LoadingElementType;
    id: string;

    constructor(props: Props) {
      super(props);
      this.id = generateUniqueId();
    }

    static get displayName() {
      return displayName;
    }

    async componentDidMount() {
      const { isOpen } = this.props;
      if (isOpen) {
        this.present();
      }
    }

    async componentDidUpdate(prevProps: Props) {
      if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen === true) {
        this.present(prevProps);
      }
      if (this.controller && prevProps.isOpen !== this.props.isOpen && this.props.isOpen === false) {
        await this.controller.dismiss();
      }
    }

    async present(prevProps?: Props) {
      const { isOpen, onDidDismiss, ...cProps } = this.props;
      const elementProps =  {
        ...cProps,
        [dismissEventName]: onDidDismiss
      };
      this.controller = await controller.create({
        ...elementProps
      });
      attachEventProps(this.controller as any, elementProps, prevProps);
      this.controller.present();
    }

    render(): null {
      return null;
    }
  }
}
