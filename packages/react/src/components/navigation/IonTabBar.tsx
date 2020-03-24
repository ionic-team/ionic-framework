import { JSX as LocalJSX } from '@ionic/core';
import React, { useContext } from 'react';

import { NavContext } from '../../contexts/NavContext';
import { IonTabBarInner } from '../inner-proxies';

import { IonTabButton } from './IonTabButton';

type Props = LocalJSX.IonTabBar & {
  onIonTabsDidChange?: (event: CustomEvent<{ tab: string; }>) => void;
  onIonTabsWillChange?: (event: CustomEvent<{ tab: string; }>) => void;
  onSetCurrentTab?: (tab?: string) => void;
  currentPath?: string;
  routeInfo?: {
    routeOptions?: unknown;
  };
  slot?: 'bottom' | 'top';
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

class IonTabBarUnwrapped extends React.PureComponent<Props, State> {
  context!: React.ContextType<typeof NavContext>;

  constructor(props: Props) {
    super(props);
    const tabs: { [key: string]: TabUrls; } = {};
    React.Children.forEach((props as any).children, (child: any) => {
      if (child != null && typeof child === 'object' && child.props && child.type === IonTabButton) {
        tabs[child.props.tab] = {
          originalHref: child.props.href,
          currentHref: child.props.href,
          originalRouteOptions: child.props.href === props.currentPath ? props.routeInfo?.routeOptions : undefined,
          currentRouteOptions: child.props.href === props.currentPath ? props.routeInfo?.routeOptions : undefined,
        };
      }
    });

    this.state = {
      activeTab: undefined,
      tabs
    };

    this.onTabButtonClick = this.onTabButtonClick.bind(this);
    this.renderTabButton = this.renderTabButton.bind(this);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const tabs = { ...state.tabs };
    const activeTab = Object.keys(state.tabs)
      .find(key => {
        const href = state.tabs[key].originalHref;
        return props.currentPath!.startsWith(href);
      });

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
      if (activeTab !== prevActiveTab || (prevHref !== props.currentPath || prevRouteOptions !== props.routeInfo?.routeOptions)) {
        // if (!(activeTab === undefined || (activeTab === state.activeTab))) {
        tabs[activeTab] = {
          originalHref: tabs[activeTab].originalHref,
          currentHref: props.currentPath!,
          originalRouteOptions: tabs[activeTab].originalRouteOptions,
          currentRouteOptions: props.routeInfo?.routeOptions
        };
      }
    }

    props.onSetCurrentTab!(activeTab);

    return {
      activeTab,
      tabs
    };
  }

  private onTabButtonClick(e: CustomEvent<{ href: string, selected: boolean, tab: string; routeOptions: unknown; }>) {
    const tappedTab = this.state.tabs[e.detail.tab];
    const originalHref = tappedTab.originalHref;
    const originalRouteOptions = tappedTab.originalRouteOptions;
    const currentHref = e.detail.href;
    const currentRouteOptions = e.detail.routeOptions;
    const { activeTab: prevActiveTab } = this.state;
    this.props.onSetCurrentTab!(e.detail.tab);
    // Clicking the current tab will bring you back to the original href
    if (prevActiveTab === e.detail.tab) {
      if (originalHref === currentHref) {
        this.context.navigate(originalHref, 'none', 'replace', originalRouteOptions, e.detail.tab);
      } else {
        this.context.navigate(originalHref, 'back', 'pop', originalRouteOptions, e.detail.tab);
      }
    } else {
      if (this.props.onIonTabsWillChange) {
        this.props.onIonTabsWillChange(new CustomEvent('ionTabWillChange', { detail: { tab: e.detail.tab } }));
      }
      if (this.props.onIonTabsDidChange) {
        this.props.onIonTabsDidChange(new CustomEvent('ionTabDidChange', { detail: { tab: e.detail.tab } }));
      }
      this.context.navigate(currentHref, 'none', 'replace', currentRouteOptions, e.detail.tab);
    }
  }

  private renderTabButton(activeTab: string | null | undefined) {

    return (child: (React.ReactElement<LocalJSX.IonTabButton & { onClick: (e: any) => void; routeOptions?: unknown; }>) | null | undefined) => {
      if (child != null && child.props && child.type === IonTabButton) {
        const href = (child.props.tab === activeTab) ? this.props.currentPath : (this.state.tabs[child.props.tab!].currentHref);
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

export const IonTabBar: React.FC<Props> = React.memo<Props>(props => {
  debugger;
  const context = useContext(NavContext);
  return (
    <IonTabBarUnwrapped
      {...props as any}
      currentPath={props.currentPath || context.currentPath}
      routeInfo={props.routeInfo || context.routeInfo}
      onSetCurrentTab={context.setCurrentTab}
    >
      {props.children}
    </IonTabBarUnwrapped>
  );
});
