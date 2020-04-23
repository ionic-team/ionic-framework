import { JSX as LocalJSX } from '@ionic/core';
import React, { useContext } from 'react';

import { NavContext } from '../../contexts/NavContext';
import { RouteInfo } from '../../models';
import { IonTabBarInner } from '../inner-proxies';

import { IonTabButton } from './IonTabButton';

type IonTabBarUnwrappedProps = LocalJSX.IonTabBar & {
  onIonTabsDidChange?: (event: CustomEvent<{ tab: string; }>) => void;
  onIonTabsWillChange?: (event: CustomEvent<{ tab: string; }>) => void;
  onSetCurrentTab: (tab: string, routeInfo: RouteInfo) => void;
  routeInfo: RouteInfo;
  slot?: 'bottom' | 'top';
  style?: { [key: string]: string; };
};

interface TabUrls {
  originalHref: string;
  currentHref: string;
  originalRouteOptions?: unknown;
  currentRouteOptions?: unknown;
}

interface State {
  activeTab: string | undefined;
  tabs: { [key: string]: TabUrls; };
}

class IonTabBarUnwrapped extends React.PureComponent<IonTabBarUnwrappedProps, State> {
  context!: React.ContextType<typeof NavContext>;

  constructor(props: IonTabBarUnwrappedProps) {
    super(props);
    const tabs: { [key: string]: TabUrls; } = {};
    React.Children.forEach((props as any).children, (child: any) => {
      if (child != null && typeof child === 'object' && child.props && child.type === IonTabButton) {
        tabs[child.props.tab] = {
          originalHref: child.props.href,
          currentHref: child.props.href,
          originalRouteOptions: child.props.href === props.routeInfo?.pathname ? props.routeInfo?.routeOptions : undefined,
          currentRouteOptions: child.props.href === props.routeInfo?.pathname ? props.routeInfo?.routeOptions : undefined,
        };
      }
    });

    const tabKeys = Object.keys(tabs);
    const activeTab = tabKeys
      .find(key => {
        const href = tabs[key].originalHref;
        return props.routeInfo!.pathname.startsWith(href);
      }) || tabKeys[0];

    if (activeTab) {
      // Set active tab currentHref to current url
      tabs[activeTab].currentHref = props.routeInfo?.pathname || tabs[activeTab].currentHref;
      tabs[activeTab].currentRouteOptions = props.routeInfo?.routeOptions || tabs[activeTab].currentRouteOptions;
      props.onSetCurrentTab(activeTab, props.routeInfo);
    }

    this.state = {
      activeTab: undefined, // TODO: should be activeTab set above?
      tabs
    };

    this.onTabButtonClick = this.onTabButtonClick.bind(this);
    this.renderTabButton = this.renderTabButton.bind(this);
  }

  static getDerivedStateFromProps(props: IonTabBarUnwrappedProps, state: State) {
    const tabs = { ...state.tabs };
    const tabKeys = Object.keys(state.tabs);
    const activeTab = tabKeys
      .find(key => {
        const href = state.tabs[key].originalHref;
        return props.routeInfo!.pathname.startsWith(href);
      }) || tabKeys[0];

    // Check to see if the tab button href has changed, and if so, update it in the tabs state
    React.Children.forEach((props as any).children, (child: any) => {
      if (child != null && typeof child === 'object' && child.props && child.type === IonTabButton) {
        const tab = tabs[child.props.tab];
        if (tab.originalHref !== child.props.href) {
          tabs[child.props.tab] = {
            originalHref: child.props.href,
            currentHref: child.props.href,
            originalRouteOptions: child.props.routeOptions,
            currentRouteOptions: child.props.routeOptions
          };
        }
      }
    });
    const { activeTab: prevActiveTab } = state;
    if (activeTab && prevActiveTab) {
      const prevHref = state.tabs[prevActiveTab].currentHref;
      const prevRouteOptions = state.tabs[prevActiveTab].currentRouteOptions;
      if (activeTab !== prevActiveTab || (prevHref !== props.routeInfo?.pathname || prevRouteOptions !== props.routeInfo?.routeOptions)) {
        tabs[activeTab] = {
          originalHref: tabs[activeTab].originalHref,
          currentHref: props.routeInfo!.pathname + (props.routeInfo!.search || ''),
          originalRouteOptions: tabs[activeTab].originalRouteOptions,
          currentRouteOptions: props.routeInfo?.routeOptions
        };
      }
    }

    props.onSetCurrentTab(activeTab, props.routeInfo);

    return {
      activeTab,
      tabs
    };
  }

  private onTabButtonClick(e: CustomEvent<{ href: string, selected: boolean, tab: string; routeOptions: unknown; }>) {
    const tappedTab = this.state.tabs[e.detail.tab];
    const originalHref = tappedTab.originalHref;
    const currentHref = e.detail.href;
    const { activeTab: prevActiveTab } = this.state;
    // this.props.onSetCurrentTab(e.detail.tab, this.props.routeInfo);
    // Clicking the current tab will bring you back to the original href
    if (prevActiveTab === e.detail.tab) {
      if (originalHref !== currentHref) {
        this.context.resetTab(e.detail.tab, originalHref, tappedTab.originalRouteOptions);
      }
    } else {
      if (this.props.onIonTabsWillChange) {
        this.props.onIonTabsWillChange(new CustomEvent('ionTabWillChange', { detail: { tab: e.detail.tab } }));
      }
      if (this.props.onIonTabsDidChange) {
        this.props.onIonTabsDidChange(new CustomEvent('ionTabDidChange', { detail: { tab: e.detail.tab } }));
      }
      this.context.changeTab(e.detail.tab, currentHref, e.detail.routeOptions);
    }
  }

  private renderTabButton(activeTab: string | null | undefined) {

    return (child: (React.ReactElement<LocalJSX.IonTabButton & { onClick: (e: any) => void; routeOptions?: unknown; }>) | null | undefined) => {
      if (child != null && child.props && child.type === IonTabButton) {
        const href = (child.props.tab === activeTab) ? this.props.routeInfo?.pathname : (this.state.tabs[child.props.tab!].currentHref);
        const routeOptions = (child.props.tab === activeTab) ? this.props.routeInfo?.routeOptions : (this.state.tabs[child.props.tab!].currentRouteOptions);

        return React.cloneElement(child, {
          href,
          routeOptions,
          onClick: this.onTabButtonClick
        });
      }
      return null;
    };
  }

  render() {
    const { activeTab } = this.state;

    return (
      <IonTabBarInner {...this.props} selectedTab={activeTab}>
        {React.Children.map(this.props.children as any, this.renderTabButton(activeTab))}
      </IonTabBarInner>
    );
  }

  static get contextType() {
    return NavContext;
  }
}

interface IonTabBarProps extends Omit<IonTabBarUnwrappedProps, 'onSetCurrentTab' | 'routeInfo'> {
  routeInfo?: RouteInfo;
}

export const IonTabBar: React.FC<IonTabBarProps> = React.memo<IonTabBarProps>(props => {
  const context = useContext(NavContext);
  return (
    <IonTabBarUnwrapped
      {...props as any}
      routeInfo={props.routeInfo || context.routeInfo}
      onSetCurrentTab={context.setCurrentTab}
    >
      {props.children}
    </IonTabBarUnwrapped>
  );
});
