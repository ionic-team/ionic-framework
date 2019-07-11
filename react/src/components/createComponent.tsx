import React from 'react';
import ReactDom from 'react-dom';
import { dashToPascalCase, attachEventProps } from './utils';

export function createReactComponent<PropType, ElementType>(tagName: string, attributeValues: string[] = []) {
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

    constructor(props: PropType & IonicReactInternalProps) {
      super(props);
    }

    static get displayName() {
      return displayName;
    }

    componentDidMount() {
      this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props: InternalProps) {
      const node = ReactDom.findDOMNode(this) as HTMLElement;
      attachEventProps(node, props, this.props);
    }

    render() {
      const { children, forwardedRef, ...cProps } = this.props;

      const propsWithoutAttributeValues = Object.keys(cProps).reduce((oldValue, key) => {
        if(attributeValues.indexOf(key) === -1) {
          (oldValue as any)[key] = (cProps as any)[key];
        }
        return oldValue;
      }, {});

      return React.createElement(
        tagName,
        {
          ...propsWithoutAttributeValues,
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
