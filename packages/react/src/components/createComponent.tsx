import React from 'react';
import ReactDom from 'react-dom';

import { NavContext } from '../contexts/NavContext';

import { ReactProps } from './ReactProps';
import { RouterDirection } from './hrefprops';
import { attachEventProps, createForwardRef, dashToPascalCase, isCoveredByReact } from './utils';
import { deprecationWarning } from './utils/dev';

interface IonicReactInternalProps<ElementType> {
  forwardedRef?: React.Ref<ElementType>;
  children?: React.ReactNode;
  href?: string;
  routerLink?: string;
  target?: string;
  style?: string;
  ref?: React.Ref<any>;
  routerDirection?: RouterDirection;
  className?: string;
}

export const createReactComponent = <PropType, ElementType>(
  tagName: string,
  hrefComponent = false
) => {
  const displayName = dashToPascalCase(tagName);
  const ReactComponent = class extends React.Component<IonicReactInternalProps<ElementType>> {
    context!: React.ContextType<typeof NavContext>;

    constructor(props: IonicReactInternalProps<ElementType>) {
      super(props);
    }

    componentDidMount() {
      this.componentDidUpdate(this.props);
      if (this.props.href) {
        setTimeout(() => {
          deprecationWarning('hrefchange', 'As of RC3, href links no longer go through the router, so transitions will not be applied to these links. To maintain transitions, use the new routerLink prop.');
        }, 2000);
      }
    }

    componentDidUpdate(prevProps: IonicReactInternalProps<ElementType>) {
      const node = ReactDom.findDOMNode(this) as HTMLElement;
      attachEventProps(node, this.props, prevProps);
    }

    private handleClick = (e: MouseEvent) => {
      const { routerLink, routerDirection } = this.props;
      if (routerLink !== undefined) {
        e.preventDefault();
        this.context.navigate(routerLink, routerDirection);
      }
    }

    render() {
      const { children, forwardedRef, style, className, ref, ...cProps } = this.props;

      const propsToPass = Object.keys(cProps).reduce((acc, name) => {
        if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
          const eventName = name.substring(2).toLowerCase();
          if (isCoveredByReact(eventName)) {
            (acc as any)[name] = (cProps as any)[name];
          }
        }
        return acc;
      }, {});

      const newProps: any = {
        ...propsToPass,
        ref: forwardedRef,
        style
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
