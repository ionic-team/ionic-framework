import React from 'react';
import { ensureElementInBody, dashToPascalCase } from './utils';

export function createControllerComponent<T, E, C extends HTMLElement>(tagName: string, controllerTagName: string) {
  const displayName = dashToPascalCase(tagName);

  type IonicReactInternalProps = {
    forwardedRef?: React.RefObject<E>;
    children?: React.ReactNode;
    show: boolean
  }

  type IonicReactExternalProps = {
    ref?: React.RefObject<E>;
    children?: React.ReactNode;
    show: boolean
  }

  class ReactControllerComponent extends React.Component<T & IonicReactInternalProps> {
    element: E;
    controllerElement: C;

    constructor(props: T & IonicReactInternalProps) {
      super(props);
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
        const { children, forwardedRef, show, ...cProps} = this.props as any;
        this.element = await (this.controllerElement as any).create(cProps);
        return await (this.element as any).present();
      }
      if (prevProps.show !== this.props.show && this.props.show === false) {
        return await (this.element as any).dismiss();
      }
    }

    render(): null {
      return null;
    }
  }

  function forwardRef(props: T & IonicReactInternalProps, ref: React.RefObject<E>) {
    return <ReactControllerComponent {...props} forwardedRef={ref} />;
  }
  forwardRef.displayName = displayName;

  return React.forwardRef<E, T & IonicReactExternalProps>(forwardRef);
}

