import React from 'react';
import ReactDOM from 'react-dom';
import { attachEventProps } from './utils'
import { ensureElementInBody, dashToPascalCase } from './utils';

export function createOverlayComponent<T, E extends HTMLElement, C extends HTMLElement>(tagName: string, controllerTagName: string) {
  const displayName = dashToPascalCase(tagName);

  type IonicReactInternalProps = {
    forwardedRef?: React.RefObject<E>;
    children: React.ReactNode;
    show: boolean;
  }

  return class ReactControllerComponent extends React.Component<T & IonicReactInternalProps> {
    element: E;
    controllerElement: C;
    el: HTMLDivElement;

    constructor(props: T & IonicReactInternalProps) {
      super(props);

      this.el = document.createElement('div');
    }

    static get displayName() {
      return displayName;
    }

    async componentDidMount() {
      this.controllerElement = ensureElementInBody<C>(controllerTagName);
      await (this.controllerElement as any).componentOnReady();
    }

    async componentDidUpdate(prevProps: T & IonicReactInternalProps) {
      if (prevProps.show !== this.props.show && this.props.show === true) {
        const { children, show, ...cProps} = this.props as any;
        cProps.component = this.el;
        cProps.componentProps = {};

        this.element = await (this.controllerElement as any).create(cProps);
        await (this.element as any).present();

        attachEventProps(this.element, cProps);
      }
      if (prevProps.show !== this.props.show && this.props.show === false) {
        return await (this.element as any).dismiss();
      }
    }

    render() {
      return ReactDOM.createPortal(
        this.props.children,
        this.el,
      );
    }
  }
}

