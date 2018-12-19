import React from 'react';
import ReactDOM from 'react-dom';
import { dashToPascalCase, attachEventProps } from './utils';

export function createReactComponent<T, E>(tagName: string) {
  const displayName = dashToPascalCase(tagName);

  type IonicReactInternalProps = {
    forwardedRef?: React.RefObject<E>;
    children?: React.ReactNode;
  }

  type IonicReactExternalProps = {
    ref?: React.RefObject<E>;
    children?: React.ReactNode;
  }

  class ReactComponent extends React.Component<T & IonicReactInternalProps> {
    componentRef: React.RefObject<E>;

    constructor(props: T & IonicReactInternalProps) {
      super(props);
      this.componentRef = React.createRef();
    }

    static get displayName() {
      return displayName;
    }

    componentDidMount() {
      this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props: any) {
      const node = ReactDOM.findDOMNode(this);

      if (!(node instanceof HTMLElement)) {
        return;
      }

      attachEventProps(node, props);
    }

    render() {
      const { children, forwardedRef, ...cProps } = this.props as any;
      cProps.ref = forwardedRef;

      return React.createElement(tagName, cProps, children);
    }
  }

  function forwardRef(props: T & IonicReactInternalProps, ref: React.RefObject<E>) {
    return <ReactComponent {...props} forwardedRef={ref} />;
  }
  forwardRef.displayName = displayName;

  return React.forwardRef<E, T & IonicReactExternalProps>(forwardRef);
}
