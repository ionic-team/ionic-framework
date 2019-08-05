import { RouterDirection } from '@ionic/core';
import React from 'react';
import ReactDom from 'react-dom';
import { NavContext } from '../contexts/NavContext';
import { ReactProps } from './ReactProps';
import { attachEventProps, createForwardRef, dashToPascalCase } from './utils';

interface IonicReactInternalProps<ElementType> {
  forwardedRef?: React.Ref<ElementType>;
  children?: React.ReactNode;
  href?: string;
  target?: string;
  routerDirection?: RouterDirection;
}

export const createReactComponent = <PropType, ElementType> (
  tagName: string,
  attributeValues: string[] = [],
  hrefComponent = false
) => {
  const displayName = dashToPascalCase(tagName);
  const ReactComponent = class extends React.Component<IonicReactInternalProps<ElementType>> {

    context!: React.ContextType<typeof NavContext>;

    constructor(props: IonicReactInternalProps<ElementType>) {
      super(props);
    }

    componentDidMount() {
      this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props: IonicReactInternalProps<ElementType>) {
      const node = ReactDom.findDOMNode(this) as HTMLElement;
      attachEventProps(node, props, this.props);
    }

    private handleClick = (e: MouseEvent) => {
      // TODO: review target usage
      const { href, routerDirection } = this.props;
      if (href !== undefined && this.context.hasIonicRouter()) {
        e.preventDefault();
        this.context.navigate(href, routerDirection);
      }
    }

    render() {
      const { children, forwardedRef, ...cProps } = this.props;

      const propsWithoutAttributeValues = Object.keys(cProps).reduce((oldValue, key) => {
        if (attributeValues.indexOf(key) === -1) {
          (oldValue as any)[key] = (cProps as any)[key];
        }
        return oldValue;
      }, {});

      const newProps: any = {
        ...propsWithoutAttributeValues,
        ref: forwardedRef
      };

      if (hrefComponent) {
        if (newProps.onClick) {
          const oldClick = newProps.onClick;
          newProps.onClick = (e: MouseEvent) => {
            oldClick(e);
            if (!e.defaultPrevented) {
              this.handleClick(e);
            }
          };
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

    static get displayName() {
      return displayName;
    }

    static get contextType() {
      return NavContext;
    }
  };
  return createForwardRef<PropType & ReactProps, ElementType>(ReactComponent, displayName);
};
