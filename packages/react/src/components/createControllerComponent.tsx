import type { OverlayEventDetail } from '@ionic/core/components';
import React from 'react';

import {
  attachProps,
  dashToPascalCase,
  setRef,
} from './react-component-lib/utils';

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
  tagName: string,
  controller: { create: (options: OptionsType) => Promise<OverlayType> },
  defineCustomElement?: () => void
) => {
  if (defineCustomElement) {
    defineCustomElement();
  }

  const displayName = dashToPascalCase(tagName);
  const didDismissEventName = `on${displayName}DidDismiss`;
  const didPresentEventName = `on${displayName}DidPresent`;
  const willDismissEventName = `on${displayName}WillDismiss`;
  const willPresentEventName = `on${displayName}WillPresent`;

  type Props = OptionsType &
    ReactControllerProps & {
      forwardedRef?: React.ForwardedRef<OverlayType>;
    };

  class Overlay extends React.Component<Props> {
    overlay?: OverlayType;
    willUnmount = false;

    constructor(props: Props) {
      super(props);
      this.handleDismiss = this.handleDismiss.bind(this);
    }

    static get displayName() {
      return displayName;
    }

    async componentDidMount() {
      /**
       * Starting in React v18, strict mode will unmount and remount a component.
       * See: https://reactjs.org/blog/2022/03/29/react-v18.html#new-strict-mode-behaviors
       *
       * We need to reset this flag when the component is re-mounted so that
       * overlay.present() will be called and the overlay will display.
       */
      this.willUnmount = false;
      const { isOpen } = this.props;
      if (isOpen as boolean) {
        this.present();
      }
    }

    componentWillUnmount() {
      this.willUnmount = true;
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
      setRef(this.props.forwardedRef, null);
    }

    async present(prevProps?: Props) {
      const { isOpen, onDidDismiss, onDidPresent, onWillDismiss, onWillPresent, ...cProps } =
        this.props;

      if (this.overlay) {
        this.overlay.remove();
      }

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
      if (this.props.isOpen === true && this.willUnmount === false) {
        setRef(this.props.forwardedRef, this.overlay);
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
