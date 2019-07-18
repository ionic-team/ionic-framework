import React from 'react';
import ReactDom from 'react-dom';
import { dashToPascalCase, attachEventProps } from './utils';
import { RouterDirection } from '@ionic/core';
import { NavContext } from './navigation/routing/NavContext';

export function createReactComponent<PropType, ElementType>(tagName: string, attributeValues: string[] = [], hrefComponent = false) {
  const displayName = dashToPascalCase(tagName);

  type IonicReactInternalProps = {
    forwardedRef?: React.RefObject<ElementType>;
    children?: React.ReactNode;
    href?: string;
    target?: string;
    routerDirection?: RouterDirection;
  }
  type InternalProps = PropType & IonicReactInternalProps;

  type IonicReactExternalProps = {
    ref?: React.RefObject<ElementType>;
    children?: React.ReactNode;
  }

  class ReactComponent extends React.Component<InternalProps> {
    context!: React.ContextType<typeof NavContext>;

    constructor(props: PropType & IonicReactInternalProps) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
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

    handleClick(e: MouseEvent) {
      const { href, target, routerDirection } = this.props;
      if ((href && this.context.hasIonicRouter()) && !target) {
        e.preventDefault();
        this.context.navigate(href, routerDirection);
      }
    }

    render() {
      const { children, forwardedRef, ...cProps } = this.props;

      const propsWithoutAttributeValues = Object.keys(cProps).reduce((oldValue, key) => {
        if(attributeValues.indexOf(key) === -1) {
          (oldValue as any)[key] = (cProps as any)[key];
        }
        return oldValue;
      }, {});

      const newProps: any = {
        ...propsWithoutAttributeValues,
        ref: forwardedRef
      }

      if(hrefComponent) {
        if(newProps.onClick) {
          const oldClick = newProps.onClick;
          newProps.onClick = (e: MouseEvent) => {
            oldClick(e);
            if(!e.defaultPrevented) {
              this.handleClick(e);
            }
          }
        } else {
          newProps.onClick = this.handleClick;
        }
      }

      return React.createElement(
        tagName,
        newProps,
        children
      );
    }
  }

  ReactComponent.contextType = NavContext;

  function forwardRef(props: InternalProps, ref: React.RefObject<ElementType>) {
    return <ReactComponent {...props} forwardedRef={ref} />;
  }
  forwardRef.displayName = displayName;

  return React.forwardRef<ElementType, PropType & IonicReactExternalProps>(forwardRef);
}
