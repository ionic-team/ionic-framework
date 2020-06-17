import { AnimationBuilder } from '@ionic/core';
import React from 'react';
import ReactDom from 'react-dom';

import { NavContext } from '../contexts/NavContext';
import { RouterOptions } from '../models';
import { RouterDirection } from '../models/RouterDirection';

import { attachProps, camelToDashCase, createForwardRef, dashToPascalCase, isCoveredByReact } from './utils';

interface IonicReactInternalProps<ElementType> extends React.HTMLAttributes<ElementType> {
  forwardedRef?: React.Ref<ElementType>;
  href?: string;
  routerLink?: string;
  ref?: React.Ref<any>;
  routerDirection?: RouterDirection;
  routerOptions?: RouterOptions;
  routerAnimation?: AnimationBuilder;
}

export const createReactComponent = <PropType, ElementType>(
  tagName: string,
  routerLinkComponent = false
) => {
  const displayName = dashToPascalCase(tagName);
  const ReactComponent = class extends React.Component<IonicReactInternalProps<PropType>> {
    context!: React.ContextType<typeof NavContext>;

    constructor(props: IonicReactInternalProps<PropType>) {
      super(props);
    }

    componentDidMount() {
      this.componentDidUpdate(this.props);
    }

    componentDidUpdate(prevProps: IonicReactInternalProps<PropType>) {
      const node = ReactDom.findDOMNode(this) as HTMLElement;
      attachProps(node, this.props, prevProps);
    }

    private handleClick = (e: React.MouseEvent<PropType>) => {
      const { routerLink, routerDirection, routerOptions, routerAnimation } = this.props;
      if (routerLink !== undefined) {
        e.preventDefault();
        this.context.navigate(routerLink, routerDirection, undefined, routerAnimation, routerOptions);
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
        } else if (typeof (cProps as any)[name] === 'string') {
          (acc as any)[camelToDashCase(name)] = (cProps as any)[name];
        }
        return acc;
      }, {});

      const newProps: IonicReactInternalProps<PropType> = {
        ...propsToPass,
        ref: forwardedRef,
        style
      };

      if (routerLinkComponent) {
        if (this.props.routerLink && !this.props.href) {
          newProps.href = this.props.routerLink;
        }
        if (newProps.onClick) {
          const oldClick = newProps.onClick;
          newProps.onClick = (e: React.MouseEvent<PropType>) => {
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
  return createForwardRef<PropType, ElementType>(ReactComponent, displayName);
};
