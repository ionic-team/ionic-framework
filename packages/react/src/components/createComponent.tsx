import { AnimationBuilder } from '@ionic/core';
import React from 'react';

import { NavContext } from '../contexts/NavContext';
import { RouterOptions } from '../models';
import { RouterDirection } from '../models/RouterDirection';

import {
  attachProps,
  camelToDashCase,
  createForwardRef,
  dashToPascalCase,
  isCoveredByReact,
  mergeRefs,
} from './utils';

interface IonicReactInternalProps<ElementType> extends React.HTMLAttributes<ElementType> {
  forwardedRef?: React.ForwardedRef<ElementType>;
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
    ref: React.RefObject<HTMLElement>;
    stableMergedRefs: React.RefCallback<HTMLElement>

    constructor(props: IonicReactInternalProps<PropType>) {
      super(props);
      // Create a local ref to to attach props to the wrapped element.
      this.ref = React.createRef();
      // React refs must be stable (not created inline).
      this.stableMergedRefs = mergeRefs(this.ref, this.props.forwardedRef)
    }

    componentDidMount() {
      this.componentDidUpdate(this.props);
    }

    componentDidUpdate(prevProps: IonicReactInternalProps<PropType>) {
      const node = this.ref.current! as HTMLElement;
      attachProps(node, this.props, prevProps);
    }

    private handleClick = (e: React.MouseEvent<PropType>) => {
      const { routerLink, routerDirection, routerOptions, routerAnimation } = this.props;
      if (routerLink !== undefined) {
        e.preventDefault();
        this.context.navigate(
          routerLink,
          routerDirection,
          undefined,
          routerAnimation,
          routerOptions
        );
      }
    };

    render() {
      const { children, forwardedRef, style, className, ref, ...cProps } = this.props;

      const propsToPass = Object.keys(cProps).reduce((acc, name) => {
        if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
          const eventName = name.substring(2).toLowerCase();
          if (isCoveredByReact(eventName)) {
            (acc as any)[name] = (cProps as any)[name];
          }
        } else if (['string', 'boolean', 'number'].includes(typeof (cProps as any)[name])) {
          (acc as any)[camelToDashCase(name)] = (cProps as any)[name];
        }
        return acc;
      }, {});

      const newProps: IonicReactInternalProps<PropType> = {
        ...propsToPass,
        ref: this.stableMergedRefs,
        style,
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

      return React.createElement(tagName, newProps, children);
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
