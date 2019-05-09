import React from 'react';
import { OverlayEventDetail } from '@ionic/core';
import { attachEventProps, ensureElementInBody, dashToPascalCase, generateUniqueId } from './utils'
import { OverlayComponentElement, OverlayControllerComponentElement } from '../types';

export function createControllerComponent<T extends object, E extends OverlayComponentElement, C extends OverlayControllerComponentElement<E>>(tagName: string, controllerTagName: string) {
  const displayName = dashToPascalCase(tagName);
  const dismissEventName = `on${displayName}DidDismiss`;

  type ReactProps = {
    isOpen: boolean;
    onDidDismiss: (event: CustomEvent<OverlayEventDetail>) => void;
  }
  type Props = T & ReactProps;

  return class ReactControllerComponent extends React.Component<Props> {
    element: E;
    controllerElement: C;
    id: string;

    constructor(props: Props) {
      super(props);

      this.id = generateUniqueId();
    }

    static get displayName() {
      return displayName;
    }

    componentDidMount() {
      this.controllerElement = ensureElementInBody<C>(controllerTagName);
    }

    async componentDidUpdate(prevProps: Props) {
      if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen === true) {
        const { isOpen, onDidDismiss, ...cProps} = this.props;
        const elementProps = {
          ...cProps,
          [dismissEventName]: onDidDismiss
        };

        if (this.controllerElement.componentOnReady) {
          await this.controllerElement.componentOnReady();
        }

        this.element = await this.controllerElement.create(elementProps);
        attachEventProps(this.element, elementProps, prevProps);

        await this.element.present();
      }
      if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen === false) {
        await this.element.dismiss();
      }
    }

    render(): null {
      return null;
    }
  }
}

