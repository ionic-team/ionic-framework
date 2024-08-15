import type { JSX as LocalJSX } from '@ionic/core/components';
import React, { Fragment } from 'react';

import { NavContext } from '../../contexts/NavContext';
import PageManager from '../../routing/PageManager';
import { HTMLElementSSR } from '../../utils/HTMLElementSSR';
import { IonRouterOutlet } from '../IonRouterOutlet';
import { IonTabsInner } from '../inner-proxies';
import { IonTab } from '../proxies';

import { IonTabBar } from './IonTabBar';
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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ion-tabs': any;
    }
  }
}

type ChildFunction = (ionTabContext: IonTabsContextState) => React.ReactNode;

interface Props extends LocalJSX.IonTabs {
  className?: string;
  children: ChildFunction | React.ReactNode;
}

const hostStyles: React.CSSProperties = {
  display: 'flex',
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  contain: 'layout size style',
};

const tabsInner: React.CSSProperties = {
  position: 'relative',
  flex: 1,
  contain: 'layout size style',
};

export const IonTabs = /*@__PURE__*/ (() =>
  class extends React.Component<Props> {
    context!: React.ContextType<typeof NavContext>;
    routerOutletRef: React.Ref<HTMLIonRouterOutletElement> = React.createRef();
    selectTabHandler?: (tag: string) => boolean;
    tabBarRef = React.createRef<any>();

    ionTabContextState: IonTabsContextState = {
      activeTab: undefined,
      selectTab: () => false,
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

    render() {
      let outlet: React.ReactElement<{}> | undefined;
      let tabBar: React.ReactElement | undefined;
      let hasIonTab = false;
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
          outlet = child.props.children[0];
        } else if (child.type === IonTab) {
          /**
           * This indicates that IonTabs will be using a basic tab-based navigation
           * without the history stack or URL updates associated with the router.
           */
          hasIonTab = true;
        }

        let childProps: any = {
          ref: this.tabBarRef,
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

        if (child.type === IonTabBar || child.type.isTabBar) {
          tabBar = React.cloneElement(child, childProps);
        } else if (
          child.type === Fragment &&
          (child.props.children[1].type === IonTabBar || child.props.children[1].type.isTabBar)
        ) {
          tabBar = React.cloneElement(child.props.children[1], childProps);
        }
      });

      if (!outlet && !hasIonTab) {
        throw new Error('IonTabs must contain an IonRouterOutlet');
      }
      if (outlet && hasIonTab) {
        throw new Error('IonTabs cannot contain an IonRouterOutlet and an IonTab at the same time');
      }
      if (!tabBar) {
        throw new Error('IonTabs needs a IonTabBar');
      }

      if (hasIonTab) {
        return <IonTabsInner {...this.props}></IonTabsInner>;
      }

      return (
        <IonTabsContext.Provider value={this.ionTabContextState}>
          {this.context.hasIonicRouter() ? (
            <PageManager className={className ? `${className}` : ''} routeInfo={this.context.routeInfo} {...props}>
              <IonTabsInner {...this.props}>
                {React.Children.map(children, (child: any) => {
                  if (child.type === IonTabBar || child.type.isTabBar) {
                    /**
                     * The modified tabBar needs to be returned to include
                     * the context and the overridden methods.
                     */
                    return tabBar;
                  }
                  return child;
                })}
              </IonTabsInner>
            </PageManager>
          ) : (
            <div className={className ? `${className}` : 'ion-tabs'} {...props} style={hostStyles}>
              {tabBar.props.slot === 'top' ? tabBar : null}
              <div style={tabsInner} className="tabs-inner">
                {outlet}
              </div>
              {tabBar.props.slot === 'bottom' ? tabBar : null}
            </div>
          )}
        </IonTabsContext.Provider>
      );
    }

    static get contextType() {
      return NavContext;
    }
  })();
