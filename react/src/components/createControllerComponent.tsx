import React from 'react';
import { attachEventProps } from './utils'
import { ensureElementInBody, dashToPascalCase } from './utils';
import { OverlayComponentElement, OverlayControllerComponentElement } from '../types';

export function createControllerComponent<T extends object, E extends OverlayComponentElement, C extends OverlayControllerComponentElement<E>>(tagName: string, controllerTagName: string) {
  const displayName = dashToPascalCase(tagName);

  type ReactProps = {
    show: boolean;
  }
  type Props = T & ReactProps;

  return class ReactControllerComponent extends React.Component<Props> {
    element: E;
    controllerElement: C;

    constructor(props: Props) {
      super(props);
    }

    static get displayName() {
      return displayName;
    }

    async componentDidMount() {
      this.controllerElement = ensureElementInBody<C>(controllerTagName);
      await this.controllerElement.componentOnReady();
    }

    async componentDidUpdate(prevProps: Props) {
      if (prevProps.show !== this.props.show && this.props.show === true) {
        const { show, ...cProps} = this.props;

        this.element = await this.controllerElement.create(cProps);
        await this.element.present();

        attachEventProps(this.element, cProps);
      }
      if (prevProps.show !== this.props.show && this.props.show === false) {
        await this.element.dismiss();
      }
    }

    render(): null {
      return null;
    }
  }
}

