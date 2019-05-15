import React from 'react';
import ReactDOM from 'react-dom';
import { dashToPascalCase, attachEventProps } from './utils';

export function createReactComponent<PropType, ElementType>(tagName: string) {
  const displayName = dashToPascalCase(tagName);

  type IonicReactInternalProps = {
    forwardedRef?: React.RefObject<ElementType>;
    children?: React.ReactNode;
  }
  type InternalProps = PropType & IonicReactInternalProps;

  type IonicReactExternalProps = {
    ref?: React.RefObject<ElementType>;
    children?: React.ReactNode;
  }

  class ReactComponent extends React.Component<InternalProps> {
    componentRef: React.RefObject<ElementType>;

    constructor(props: PropType & IonicReactInternalProps) {
      super(props);
      this.componentRef = React.createRef();
    }

    static get displayName() {
      return displayName;
    }

    componentDidMount() {
      this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props: InternalProps) {
      const node = ReactDOM.findDOMNode(this) as HTMLElement;
      attachEventProps(node, props, this.props);
    }

    render() {
      const { children, forwardedRef, ...cProps } = this.props;

      return React.createElement(
        tagName,
        {
          ...cProps,
          ref: forwardedRef
        },
        children
      );
    }
  }

  function forwardRef(props: InternalProps, ref: React.RefObject<ElementType>) {
    return <ReactComponent {...props} forwardedRef={ref} />;
  }
  forwardRef.displayName = displayName;

  return React.forwardRef<ElementType, PropType & IonicReactExternalProps>(forwardRef);
}
