// import type { JSX } from '@ionic/core/components';
import { IonNav as IonNavCmp } from '@ionic/core/components/ion-nav.js';
import React, { createElement } from 'react';
import {
  attachProps,
  camelToDashCase,
  defineCustomElement,
  isCoveredByReact,
  mergeRefs,
} from '../react-component-lib/utils';
import { createForwardRef } from '../utils';

// export const IonNav = /*@__PURE__*/ createReactComponent<JSX.IonNav, HTMLIonNavElement>(
//   'ion-nav',
//   undefined,
//   (originalProps: any, propsToPass: any) => {
//     const delegate = {
//       attachViewToDom: async (
//         container: any,
//         component: any,
//         propsOrDataObj?: any,
//         cssClasses?: string[]
//       ): Promise<HTMLElement> => {
//         console.log('attachViewToDom', {
//           container,
//           component,
//           propsOrDataObj,
//           cssClasses,
//         });
//         const div = document.createElement('div');
//         cssClasses && div.classList.add(...cssClasses);
//         container.appendChild(div);

//         return div;
//       },
//       removeViewFromDom: (container: any, component: any): Promise<void> => {
//         console.log('removeViewFromDom', {
//           container,
//           component,
//         });
//         return Promise.resolve();
//       },
//     };

//     const newProps = {
//       ...originalProps,
//       ...propsToPass,
//       delegate,
//     };

//     return newProps;
//   },
//   defineIonNav
// );

export const IonNav = /*@__PURE__*/ () => {
  defineCustomElement('ion-nav', IonNavCmp);

  const displayName = 'IonNav';

  const delegate = {
    attachViewToDom: async (
      container: any,
      component: any,
      propsOrDataObj?: any,
      cssClasses?: string[]
    ): Promise<HTMLElement> => {
      console.log('attachViewToDom', {
        container,
        component,
        propsOrDataObj,
        cssClasses,
      });
      const div = document.createElement('div');
      cssClasses && div.classList.add(...cssClasses);
      container.appendChild(div);

      return div;
    },
    removeViewFromDom: (container: any, component: any): Promise<void> => {
      console.log('removeViewFromDom', {
        container,
        component,
      });
      return Promise.resolve();
    },
  };

  const ReactComponent = class extends React.Component<React.HTMLAttributes<any>> {
    ref: React.RefObject<HTMLElement>;
    stableMergedRefs: React.RefCallback<HTMLElement>;

    constructor(props: any) {
      super(props);
      // Create a local ref to to attach props to the wrapped element.
      this.ref = React.createRef();
      // React refs must be stable (not created inline).
      this.stableMergedRefs = mergeRefs(this.ref, (this.props as any).forwardedRef);
    }

    componentDidUpdate(prevProps: any) {
      const node = this.ref.current! as HTMLElement;
      attachProps(node, this.props, prevProps);
    }

    render() {
      const { children, style, className, ...cProps } = this.props;

      const propsToPass: any = Object.keys(cProps).reduce((acc, name) => {
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

      propsToPass.delegate = delegate;

      const newProps = {
        ...propsToPass,
        ref: this.stableMergedRefs,
        style,
      };
      return createElement('ion-nav', newProps, children);
    }

    static displayName() {
      return this.displayName;
    }
  };

  return createForwardRef<any, any>(ReactComponent, displayName);
};
