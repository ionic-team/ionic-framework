import { defineCustomElement } from '@ionic/core/components/ion-nav.js';
import type { FrameworkDelegate, JSX } from '@ionic/core/components';
import {
  attachProps,
  createForwardRef,
  dashToPascalCase,
  isCoveredByReact,
  mergeRefs,
} from '../react-component-lib/utils';
import React, { createElement } from 'react';
import { ReactDelegate } from '../../framework-delegate';

interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>;
  delegate?: FrameworkDelegate;
}

interface StencilReactInternalProps<ElementType> extends React.HTMLAttributes<ElementType> {
  forwardedRef: React.RefObject<ElementType>;
  ref?: React.Ref<any>;
}

const createReactComponent = <
  PropType,
  ElementType extends HTMLStencilElement,
  ContextStateType = {},
  ExpandedPropsTypes = {}
>(
  tagName: string,
  ReactComponentContext?: React.Context<ContextStateType>,
  manipulatePropsFunction?: (
    originalProps: StencilReactInternalProps<ElementType>,
    propsToPass: any
  ) => ExpandedPropsTypes,
  defineCustomElement?: () => void
) => {
  if (defineCustomElement !== undefined) {
    defineCustomElement();
  }

  const displayName = dashToPascalCase(tagName);
  const ReactComponent = class extends React.Component<StencilReactInternalProps<ElementType>> {
    componentEl!: ElementType;

    setComponentElRef = (element: ElementType) => {
      this.componentEl = element;
    };

    constructor(props: StencilReactInternalProps<ElementType>) {
      super(props);
    }

    componentDidMount() {
      this.componentDidUpdate(this.props);
    }

    componentDidUpdate(prevProps: StencilReactInternalProps<ElementType>) {
      attachProps(this.componentEl, this.props, prevProps);
      this.componentEl.delegate = ReactDelegate();
    }

    render() {
      const { children, forwardedRef, style, className, ref, ...cProps } = this.props;

      let propsToPass = Object.keys(cProps).reduce((acc, name) => {
        if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
          const eventName = name.substring(2).toLowerCase();
          if (typeof document !== 'undefined' && isCoveredByReact(eventName)) {
            (acc as any)[name] = (cProps as any)[name];
          }
        } else {
          (acc as any)[name] = (cProps as any)[name];
        }
        return acc;
      }, {});

      if (manipulatePropsFunction) {
        propsToPass = manipulatePropsFunction(this.props, propsToPass);
      }

      const newProps: Omit<StencilReactInternalProps<ElementType>, 'forwardedRef'> = {
        ...propsToPass,
        ref: mergeRefs(forwardedRef, this.setComponentElRef),
        style,
      };

      /**
       * We use createElement here instead of
       * React.createElement to work around a
       * bug in Vite (https://github.com/vitejs/vite/issues/6104).
       * React.createElement causes all elements to be rendered
       * as <tagname> instead of the actual Web Component.
       */
      return createElement(tagName, newProps, children);
    }

    static get displayName() {
      return displayName;
    }
  };

  // If context was passed to createReactComponent then conditionally add it to the Component Class
  if (ReactComponentContext) {
    ReactComponent.contextType = ReactComponentContext;
  }

  return createForwardRef<PropType, ElementType>(ReactComponent, displayName);
};

export const IonNav = /*@__PURE__*/ createReactComponent<JSX.IonNav, HTMLIonNavElement>(
  'ion-nav',
  undefined,
  undefined,
  defineCustomElement
);
