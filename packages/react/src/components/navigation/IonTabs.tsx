import type { JSX as LocalJSX } from '@ionic/core/components';
import React, { Fragment, cloneElement, useContext, useEffect, useRef } from 'react';

import { NavContext } from '../../contexts/NavContext';
import PageManager from '../../routing/PageManager';
import { HTMLElementSSR } from '../../utils/HTMLElementSSR';
import { IonRouterOutlet } from '../IonRouterOutlet';

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

export const IonTabs = (props: Props) => {
  const { hasIonicRouter, routeInfo } = useContext(NavContext);
  const tabBarRef = useRef<any>(null); // TODO @sean find the type for this

  const ionTabContextState: IonTabsContextState = {
    activeTab: undefined,
    selectTab: () => false,
  };

  useEffect(() => {
    if (tabBarRef.current) {
      ionTabContextState.activeTab = tabBarRef.current.state.activeTab;
      // Overrides the web component implementation of this method
      tabBarRef.current.setActiveTabOnContext = (tab: string) => {
        ionTabContextState.activeTab = tab;
      };
      ionTabContextState.selectTab = tabBarRef.current.selectTab;
    }
  }, []);

  let outlet: React.ReactElement | undefined;
  let tabBar: React.ReactElement | undefined;
  const { className, onIonTabsDidChange, onIonTabsWillChange, ...restProps } = props;

  const children =
    typeof props.children === 'function' ? (props.children as ChildFunction)(ionTabContextState) : props.children;

  React.Children.forEach(children, (child: any) => {
    // eslint-disable-next-line no-prototype-builtins
    if (child == null || typeof child !== 'object' || !child.hasOwnProperty('type')) {
      return;
    }
    if (child.type === IonRouterOutlet || child.type.isRouterOutlet) {
      outlet = cloneElement(child);
    } else if (child.type === Fragment && child.props.children[0].type === IonRouterOutlet) {
      outlet = child.props.children[0]; // TODO @sean why do we cloneElement everywhere but here?
    }

    let childProps: any = {
      ref: tabBarRef,
    };

    /**
     * Only pass these props down from IonTabs to
     * IonTabsBar if they are defined. Otherwise if you have
     * a handler set on IonTabBar it will be overridden.
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
      tabBar = cloneElement(child, childProps);
    } else if (child.type === Fragment && child.props.children[1].type === IonTabBar) {
      tabBar = cloneElement(child.props.children[1], childProps);
    }
  });

  if (!outlet) {
    throw new Error('[Ionic Error]: IonTabs must contain an <IonRouterOutlet />');
  }

  if (!tabBar) {
    throw new Error('[Ionic Error]: IonTabs must contain an <IonTabBar />');
  }
  return (
    <IonTabsContext.Provider value={ionTabContextState}>
      {hasIonicRouter() ? (
        <PageManager className={className ? `${className}` : ''} routeInfo={routeInfo} {...restProps}>
          <ion-tabs className="ion-tabs" style={hostStyles}>
            {tabBar.props.slot === 'top' ? tabBar : null}
            <div style={tabsInner} className="tabs-inner">
              {outlet}
            </div>
            {tabBar.props.slot === 'bottom' ? tabBar : null}
          </ion-tabs>
        </PageManager>
      ) : (
        <div className={className ? `${className}` : 'ion-tabs'} {...restProps} style={hostStyles}>
          {tabBar.props.slot === 'top' ? tabBar : null}
          <div style={tabsInner} className="tabs-inner">
            {outlet}
          </div>
          {tabBar.props.slot === 'bottom' ? tabBar : null}
        </div>
      )}
    </IonTabsContext.Provider>
  );
};
