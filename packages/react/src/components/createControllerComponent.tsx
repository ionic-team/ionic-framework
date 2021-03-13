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
  onDidPresent?: (event: CustomEvent<OverlayEventDetail>) => void;
  onWillDismiss?: (event: CustomEvent<OverlayEventDetail>) => void;
  onWillPresent?: (event: CustomEvent<OverlayEventDetail>) => void;
}

export const createControllerComponent = <
  OptionsType extends object,
  OverlayType extends OverlayBase
>(
  displayName: string,
  controller: { create: (options: OptionsType) => Promise<OverlayType> }
) => {
  const didDismissEventName = `on${displayName}DidDismiss`;
  const didPresentEventName = `on${displayName}DidPresent`;
  const willDismissEventName = `on${displayName}WillDismiss`;
  const willPresentEventName = `on${displayName}WillPresent`;

  type Props = OptionsType &
    ReactControllerProps & {
      forwardedRef?: React.RefObject<OverlayType>;
    };

  class Overlay extends React.Component<Props> {
    overlay?: OverlayType;
    isUnmounted = false;

    constructor(props: Props) {
      super(props);
      this.handleDismiss = this.handleDismiss.bind(this);
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
      if (this.overlay) {
        this.overlay.dismiss();
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

    handleDismiss(event: CustomEvent<OverlayEventDetail<any>>) {
      if (this.props.onDidDismiss) {
        this.props.onDidDismiss(event);
      }
      if (this.props.forwardedRef) {
        (this.props.forwardedRef as any).current = undefined;
      }
    }

    async present(prevProps?: Props) {
      const {
        isOpen,
        onDidDismiss,
        onDidPresent,
        onWillDismiss,
        onWillPresent,
        ...cProps
      } = this.props;
      this.overlay = await controller.create({
        ...(cProps as any),
      });
      attachProps(
        this.overlay,
        {
          [didDismissEventName]: this.handleDismiss,
          [didPresentEventName]: (e: CustomEvent) =>
            this.props.onDidPresent && this.props.onDidPresent(e),
          [willDismissEventName]: (e: CustomEvent) =>
            this.props.onWillDismiss && this.props.onWillDismiss(e),
          [willPresentEventName]: (e: CustomEvent) =>
            this.props.onWillPresent && this.props.onWillPresent(e),
        },
        prevProps
      );
      // Check isOpen again since the value could have changed during the async call to controller.create
      // It's also possible for the component to have become unmounted.
      if (this.props.isOpen === true && this.isUnmounted === false) {
        if (this.props.forwardedRef) {
          (this.props.forwardedRef as any).current = this.overlay;
        }
        await this.overlay.present();
      }
    }

    render(): null {
      return null;
    }
  }

  return React.forwardRef<OverlayType, Props>((props, ref) => {
    return <Overlay {...props} forwardedRef={ref} />;
  });
};
