import type { Components } from '@ionic/core';
import type { JSX as LocalJSX } from '@ionic/core/components';
import React, { Fragment } from 'react';

import { NavContext } from '../../contexts/NavContext';
import PageManager from '../../routing/PageManager';
import { HTMLElementSSR } from '../../utils/HTMLElementSSR';
import { IonRouterOutlet } from '../IonRouterOutlet';
import { IonTabsInner } from '../inner-proxies';
import { IonTab } from '../proxies';

import type { IonTabsContextState } from './IonTabsContext';
import { IonTabsContext } from './IonTabsContext';

class IonTabsElement extends HTMLElementSSR {
  constructor() {
    super();
  }
}

// TODO(FW-2959): types

if (typeof (window as any) !== 'undefined' && window.customElements) {
  const element = window.customElements.get('ion-tabs');
  if (!element) {
    window.customElements.define('ion-tabs', IonTabsElement);
  }
}

export interface IonTabsProps extends React.HTMLAttributes<Components.IonTabs> {
  onIonTabsWillChange?: (event: CustomEvent<{ tab: string }>) => void;
  onIonTabsDidChange?: (event: CustomEvent<{ tab: string }>) => void;
}

declare module 'react' {
  interface HTMLElements {
    'ion-tabs': IonTabsProps;
  }
}

type ChildFunction = (ionTabContext: IonTabsContextState) => React.ReactNode;

interface Props extends LocalJSX.IonTabs {
  className?: string;
  children: ChildFunction | React.ReactNode;
  onIonTabsWillChange?: (event: CustomEvent<{ tab: string }>) => void;
  onIonTabsDidChange?: (event: CustomEvent<{ tab: string }>) => void;
}

export class IonTabs extends React.Component<Props> {
  shouldComponentUpdate(): boolean {
    return true;
  }

  context!: React.ContextType<typeof NavContext>;
  /**
   * `routerOutletRef` allows users to add a `ref` to `IonRouterOutlet`.
   * Without this, `ref.current` will be `undefined` in the user's app,
   * breaking their ability to access the `IonRouterOutlet` instance.
   * Do not remove this ref.
   */
  routerOutletRef: React.Ref<Components.IonRouterOutlet> = React.createRef();
  selectTabHandler?: (tag: string) => boolean;
  tabBarRef = React.createRef<any>();

  ionTabContextState: IonTabsContextState = {
    activeTab: undefined,
    selectTab: () => false,
    hasRouterOutlet: false,
    /**
     * Tab bar can be used as a standalone component,
     * so the props can not be passed directly to the
     * tab bar component. Instead, props will be
     * passed through the context.
     */
    tabBarProps: { ref: this.tabBarRef },
  };

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    if (this.tabBarRef.current) {
      // Grab initial value
      this.ionTabContextState.activeTab = this.tabBarRef.current.state.activeTab;
      // Override method
      this.tabBarRef.current.setActiveTabOnContext = (tab: string) => {
        this.ionTabContextState.activeTab = tab;
      };
      this.ionTabContextState.selectTab = this.tabBarRef.current.selectTab;
    }
  }

  renderTabsInner(children: React.ReactNode, outlet: React.ReactElement<{}> | undefined) {
    return (
      <IonTabsInner {...this.props}>
        {React.Children.map(children, (child: React.ReactNode) => {
          if (React.isValidElement(child)) {
            const isRouterOutlet =
              child.type === IonRouterOutlet ||
              (child.type as any).isRouterOutlet ||
              (child.type === Fragment && child.props.children[0].type === IonRouterOutlet);

            if (isRouterOutlet) {
              /**
               * The modified outlet needs to be returned to include
               * the ref.
               */
              return outlet;
            }
          }
          return child;
        })}
      </IonTabsInner>
    );
  }

  render() {
    let outlet: React.ReactElement<{}> | undefined;
    // Check if IonTabs has any IonTab children
    let hasTab = false;
    const { className, onIonTabsDidChange, onIonTabsWillChange, ...props } = this.props;

    const children =
      typeof this.props.children === 'function'
        ? (this.props.children as ChildFunction)(this.ionTabContextState)
        : this.props.children;

    React.Children.forEach(children, (child: any) => {
      // eslint-disable-next-line no-prototype-builtins
      if (child == null || typeof child !== 'object' || !child.hasOwnProperty('type')) {
        return;
      }
      if (child.type === IonRouterOutlet || child.type.isRouterOutlet) {
        outlet = React.cloneElement(child);
      } else if (child.type === Fragment && child.props.children[0].type === IonRouterOutlet) {
        outlet = React.cloneElement(child.props.children[0]);
      } else if (child.type === IonTab) {
        /**
         * This indicates that IonTabs will be using a basic tab-based navigation
         * without the history stack or URL updates associated with the router.
         */
        hasTab = true;
      }

      this.ionTabContextState.hasRouterOutlet = !!outlet;

      let childProps: any = {
        ...this.ionTabContextState.tabBarProps,
      };

      /**
       * Only pass these props
       * down from IonTabs to IonTabBar
       * if they are defined, otherwise
       * if you have a handler set on
       * IonTabBar it will be overridden.
       */
      if (onIonTabsDidChange !== undefined) {
        childProps = {
          ...childProps,
          onIonTabsDidChange,
        };
      }

      if (onIonTabsWillChange !== undefined) {
        childProps = {
          ...childProps,
          onIonTabsWillChange,
        };
      }

      this.ionTabContextState.tabBarProps = childProps;
    });

    if (!outlet && !hasTab) {
      throw new Error('IonTabs must contain an IonRouterOutlet or an IonTab');
    }
    if (outlet && hasTab) {
      throw new Error('IonTabs cannot contain an IonRouterOutlet and an IonTab at the same time');
    }

    if (hasTab) {
      return <IonTabsInner {...this.props}></IonTabsInner>;
    }

    /**
     * TODO(ROU-11051)
     *
     * There is no error handling for the case where there
     * is no associated Route for the given IonTabButton.
     *
     * More investigation is needed to determine how to
     * handle this to prevent any overwriting of the
     * IonTabButton's onClick handler and how the routing
     * is handled.
     */

    return (
      <IonTabsContext.Provider value={this.ionTabContextState}>
        {this.context.hasIonicRouter() ? (
          <PageManager className={className ? `${className}` : ''} routeInfo={this.context.routeInfo} {...props}>
            {this.renderTabsInner(children, outlet)}
          </PageManager>
        ) : (
          this.renderTabsInner(children, outlet)
        )}
      </IonTabsContext.Provider>
    );
  }

  static get contextType() {
    return NavContext;
  }
}
