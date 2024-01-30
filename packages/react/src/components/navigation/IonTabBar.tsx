import type { JSX as LocalJSX } from '@ionic/core/components';
import React, { useContext } from 'react';

import { NavContext } from '../../contexts/NavContext';
import type { RouteInfo } from '../../models';
import type { IonicReactProps } from '../IonicReactProps';
import { IonTabBarInner } from '../inner-proxies';
import { createForwardRef } from '../utils';

import { IonTabButton } from './IonTabButton';

type IonTabBarProps = LocalJSX.IonTabBar &
  IonicReactProps & {
    onIonTabsDidChange?: (event: CustomEvent<{ tab: string }>) => void;
    onIonTabsWillChange?: (event: CustomEvent<{ tab: string }>) => void;
    slot?: 'bottom' | 'top';
    style?: { [key: string]: string };
    // TODO: Refactor type with PropsWithChildren when moving to React v18
    children?: React.ReactNode;
  };

interface InternalProps extends IonTabBarProps {
  forwardedRef?: React.ForwardedRef<HTMLIonIconElement>;
  onSetCurrentTab: (tab: string, routeInfo: RouteInfo) => void;
  routeInfo: RouteInfo;
}

interface TabUrls {
  originalHref: string;
  currentHref: string;
  originalRouteOptions?: unknown;
  currentRouteOptions?: unknown;
}

interface IonTabBarState {
  activeTab?: string;
  tabs: { [key: string]: TabUrls };
}

// TODO(FW-2959): types

class IonTabBarUnwrapped extends React.PureComponent<InternalProps, IonTabBarState> {
  context!: React.ContextType<typeof NavContext>;

  constructor(props: InternalProps) {
    super(props);
    const tabs: { [key: string]: TabUrls } = {};
    React.Children.forEach((props as any).children, (child: any) => {
      if (
        child != null &&
        typeof child === 'object' &&
        child.props &&
        (child.type === IonTabButton || child.type.isTabButton)
      ) {
        tabs[child.props.tab] = {
          originalHref: child.props.href,
          currentHref: child.props.href,
          originalRouteOptions:
            child.props.href === props.routeInfo?.pathname ? props.routeInfo?.routeOptions : undefined,
          currentRouteOptions:
            child.props.href === props.routeInfo?.pathname ? props.routeInfo?.routeOptions : undefined,
        };
      }
    });

    this.state = {
      tabs,
    };

    this.onTabButtonClick = this.onTabButtonClick.bind(this);
    this.renderTabButton = this.renderTabButton.bind(this);
    this.setActiveTabOnContext = this.setActiveTabOnContext.bind(this);
    this.selectTab = this.selectTab.bind(this);
  }

  componentDidMount() {
    const tabs = this.state.tabs;
    const tabKeys = Object.keys(tabs);
    const activeTab = tabKeys.find((key) => {
      const href = tabs[key].originalHref;
      return this.props.routeInfo!.pathname.startsWith(href);
    });

    if (activeTab) {
      this.setState({
        activeTab,
      });
    }
  }

  componentDidUpdate() {
    if (this.state.activeTab) {
      this.setActiveTabOnContext(this.state.activeTab);
    }
  }

  // eslint-disable-next-line
  setActiveTabOnContext = (_tab: string) => {};

  selectTab(tab: string) {
    const tabUrl = this.state.tabs[tab];
    if (tabUrl) {
      this.onTabButtonClick(
        new CustomEvent('ionTabButtonClick', {
          detail: {
            href: tabUrl.currentHref,
            tab,
            selected: tab === this.state.activeTab,
            routeOptions: undefined,
          },
        })
      );
      return true;
    }
    return false;
  }

  static getDerivedStateFromProps(props: InternalProps, state: IonTabBarState) {
    const tabs = { ...state.tabs };
    const tabKeys = Object.keys(state.tabs);
    const activeTab = tabKeys.find((key) => {
      const href = state.tabs[key].originalHref;
      return props.routeInfo!.pathname.startsWith(href);
    });

    // Check to see if the tab button href has changed, and if so, update it in the tabs state
    React.Children.forEach((props as any).children, (child: any) => {
      if (
        child != null &&
        typeof child === 'object' &&
        child.props &&
        (child.type === IonTabButton || child.type.isTabButton)
      ) {
        const tab = tabs[child.props.tab];
        if (!tab || tab.originalHref !== child.props.href) {
          tabs[child.props.tab] = {
            originalHref: child.props.href,
            currentHref: child.props.href,
            originalRouteOptions: child.props.routeOptions,
            currentRouteOptions: child.props.routeOptions,
          };
        }
      }
    });

    const { activeTab: prevActiveTab } = state;
    if (activeTab && prevActiveTab) {
      const prevHref = state.tabs[prevActiveTab].currentHref;
      const prevRouteOptions = state.tabs[prevActiveTab].currentRouteOptions;
      if (
        activeTab !== prevActiveTab ||
        prevHref !== props.routeInfo?.pathname ||
        prevRouteOptions !== props.routeInfo?.routeOptions
      ) {
        tabs[activeTab] = {
          originalHref: tabs[activeTab].originalHref,
          currentHref: props.routeInfo!.pathname + (props.routeInfo!.search || ''),
          originalRouteOptions: tabs[activeTab].originalRouteOptions,
          currentRouteOptions: props.routeInfo?.routeOptions,
        };
        if (props.routeInfo.routeAction === 'pop' && activeTab !== prevActiveTab) {
          // If navigating back and the tabs change, set the prev tab back to its original href
          tabs[prevActiveTab] = {
            originalHref: tabs[prevActiveTab].originalHref,
            currentHref: tabs[prevActiveTab].originalHref,
            originalRouteOptions: tabs[prevActiveTab].originalRouteOptions,
            currentRouteOptions: tabs[prevActiveTab].currentRouteOptions,
          };
        }
      }
    }

    activeTab && props.onSetCurrentTab(activeTab, props.routeInfo);

    return {
      activeTab,
      tabs,
    };
  }

  private onTabButtonClick(
    e: CustomEvent<{ href: string; selected: boolean; tab: string; routeOptions: unknown }>,
    onClickFn?: (e: any) => void
  ) {
    const tappedTab = this.state.tabs[e.detail.tab];
    const originalHref = tappedTab.originalHref;
    const currentHref = e.detail.href;
    const { activeTab: prevActiveTab } = this.state;

    if (onClickFn) {
      /**
       * If the user provides an onClick function, we call it
       * with the original event.
       */
      onClickFn(e);
    }

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
      this.setActiveTabOnContext(e.detail.tab);
      this.context.changeTab(e.detail.tab, currentHref, e.detail.routeOptions);
    }
  }

  private renderTabButton(activeTab: string | null | undefined) {
    return (
      child:
        | React.ReactElement<LocalJSX.IonTabButton & { onClick: (e: any) => void; routeOptions?: unknown }>
        | null
        | undefined
    ) => {
      if (child != null && child.props && (child.type === IonTabButton || (child as any).type.isTabButton)) {
        const href =
          child.props.tab === activeTab
            ? this.props.routeInfo?.pathname
            : this.state.tabs[child.props.tab!].currentHref;
        const routeOptions =
          child.props.tab === activeTab
            ? this.props.routeInfo?.routeOptions
            : this.state.tabs[child.props.tab!].currentRouteOptions;

        return React.cloneElement(child, {
          href,
          routeOptions,
          onClick: (ev: CustomEvent) => this.onTabButtonClick(ev, child.props.onClick),
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

const IonTabBarContainer: React.FC<InternalProps> = React.memo<InternalProps>(({ forwardedRef, ...props }) => {
  const context = useContext(NavContext);
  return (
    <IonTabBarUnwrapped
      ref={forwardedRef}
      {...(props as any)}
      routeInfo={props.routeInfo || context.routeInfo || { pathname: window.location.pathname }}
      onSetCurrentTab={context.setCurrentTab}
    >
      {props.children}
    </IonTabBarUnwrapped>
  );
});

export const IonTabBar = createForwardRef<IonTabBarProps, HTMLIonTabBarElement>(IonTabBarContainer, 'IonTabBar');
