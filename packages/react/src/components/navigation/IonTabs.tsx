import { JSX as LocalJSX } from '@ionic/core';
import React, { Fragment } from 'react';

import { NavContext } from '../../contexts/NavContext';
import PageManager from '../../routing/PageManager';
import { IonRouterOutlet } from '../IonRouterOutlet';

import { IonTabBar } from './IonTabBar';
import { IonTabsContext, IonTabsContextState } from './IonTabsContext';

class IonTabsElement extends HTMLElement {
  constructor() {
    super();
  }
}

if (window && window.customElements) {
  const element = customElements.get('ion-tabs');
  if (!element) {
    customElements.define('ion-tabs', IonTabsElement);
  }
}

declare global {
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

export class IonTabs extends React.Component<Props> {
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
    const { className, onIonTabsDidChange, onIonTabsWillChange, ...props } = this.props;

    const children =
      typeof this.props.children === 'function'
        ? (this.props.children as ChildFunction)(this.ionTabContextState)
        : this.props.children;

    React.Children.forEach(children, (child: any) => {
      if (child == null || typeof child !== 'object' || !child.hasOwnProperty('type')) {
        return;
      }
      if (child.type === IonRouterOutlet || child.type.isRouterOutlet) {
        outlet = React.cloneElement(child, { tabs: true });
      } else if (child.type === Fragment && child.props.children[0].type === IonRouterOutlet) {
        outlet = child.props.children[0];
      }

      let childProps: any = {
        ref: this.tabBarRef
      }

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
          onIonTabsDidChange
        }
      }

      if (onIonTabsWillChange !== undefined) {
        childProps = {
          ...childProps,
          onIonTabsWillChange
        }
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

    if (!outlet) {
      throw new Error('IonTabs must contain an IonRouterOutlet');
    }
    if (!tabBar) {
      throw new Error('IonTabs needs a IonTabBar');
    }

    return (
      <IonTabsContext.Provider value={this.ionTabContextState}>
        {this.context.hasIonicRouter() ? (
          <PageManager
            className={className ? `${className}` : ''}
            routeInfo={this.context.routeInfo}
            {...props}
          >
            <ion-tabs className="ion-tabs" style={hostStyles}>
              {tabBar.props.slot === 'top' ? tabBar : null}
              <div style={tabsInner} className="tabs-inner">
                {outlet}
              </div>
              {tabBar.props.slot === 'bottom' ? tabBar : null}
            </ion-tabs>
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
}
