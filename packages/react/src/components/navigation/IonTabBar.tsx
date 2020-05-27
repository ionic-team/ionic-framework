import { JSX as LocalJSX } from '@ionic/core';
import React, { useContext } from 'react';

import { NavContext } from '../../contexts/NavContext';
import { IonicReactProps } from '../IonicReactProps';
import { IonTabBarInner } from '../inner-proxies';
import { IonTabButton } from '../proxies';
import { createForwardRef } from '../utils';

type IonTabBarProps = LocalJSX.IonTabBar & IonicReactProps & {
  onIonTabsDidChange?: (event: CustomEvent<{ tab: string; }>) => void;
  onIonTabsWillChange?: (event: CustomEvent<{ tab: string; }>) => void;
  currentPath?: string;
  slot?: 'bottom' | 'top';
};

interface InternalProps extends IonTabBarProps {
  forwardedRef?: React.RefObject<HTMLIonIconElement>;
}

interface TabUrls {
  originalHref: string;
  currentHref: string;
}

interface IonTabBarState {
  activeTab: string | undefined;
  tabs: { [key: string]: TabUrls; };
}

class IonTabBarUnwrapped extends React.PureComponent<InternalProps, IonTabBarState> {
  context!: React.ContextType<typeof NavContext>;

  constructor(props: InternalProps) {
    super(props);
    const tabs: { [key: string]: TabUrls; } = {};

    React.Children.forEach((props as any).children, (child: any) => {
      if (child != null && typeof child === 'object' && child.props && child.type === IonTabButton) {
        tabs[child.props.tab] = {
          originalHref: child.props.href,
          currentHref: child.props.href
        };
      }
    });

    const tabKeys = Object.keys(tabs);
    const activeTab = tabKeys
      .find(key => {
        const href = tabs[key].originalHref;
        return props.currentPath!.startsWith(href);
      }) || tabKeys[0];

    this.state = {
      activeTab,
      tabs
    };

    this.onTabButtonClick = this.onTabButtonClick.bind(this);
    this.renderTabButton = this.renderTabButton.bind(this);
    this.setActiveTabOnContext = this.setActiveTabOnContext.bind(this);
    this.selectTab = this.selectTab.bind(this);
  }

  setActiveTabOnContext = (_tab: string) => { };

  selectTab(tab: string) {
    const tabUrl = this.state.tabs[tab];
    if (tabUrl) {
      this.onTabButtonClick(new CustomEvent('ionTabButtonClick', {
        detail: {
          href: tabUrl.currentHref,
          tab,
          selected: tab === this.state.activeTab
        }
      }));
      return true;
    }
    return false;
  }

  static getDerivedStateFromProps(props: IonTabBarProps, state: IonTabBarState) {

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
            currentHref: child.props.href
          };
        }
      }
    });

    if (!(activeTab === undefined || (activeTab === state.activeTab && state.tabs[activeTab].currentHref === props.currentPath))) {
      tabs[activeTab] = {
        originalHref: tabs[activeTab].originalHref,
        currentHref: props.currentPath!
      };
    }

    return {
      activeTab,
      tabs
    };
  }

  private onTabButtonClick(e: CustomEvent<{ href: string, selected: boolean, tab: string; }>) {
    const originalHref = this.state.tabs[e.detail.tab].originalHref;
    const currentHref = e.detail.href;
    const { activeTab: prevActiveTab } = this.state;
    // Clicking the current tab will bring you back to the original href
    if (prevActiveTab === e.detail.tab) {
      if (originalHref === currentHref) {
        this.context.navigate(originalHref, 'none');
      } else {
        this.context.navigate(originalHref, 'back', 'pop');
      }
    } else {
      if (this.props.onIonTabsWillChange) {
        this.props.onIonTabsWillChange(new CustomEvent('ionTabWillChange', { detail: { tab: e.detail.tab } }));
      }
      if (this.props.onIonTabsDidChange) {
        this.props.onIonTabsDidChange(new CustomEvent('ionTabDidChange', { detail: { tab: e.detail.tab } }));
      }
      this.setActiveTabOnContext(e.detail.tab);
      this.context.navigate(currentHref, 'none');
    }
  }

  private renderTabButton(activeTab: string | null | undefined) {
    return (child: (React.ReactElement<LocalJSX.IonTabButton & { onIonTabButtonClick: (e: CustomEvent) => void; }>) | null | undefined) => {
      if (child != null && child.props && child.type === IonTabButton) {
        const href = (child.props.tab === activeTab) ? this.props.currentPath : (this.state.tabs[child.props.tab!].currentHref);

        return React.cloneElement(child, {
          href,
          onIonTabButtonClick: this.onTabButtonClick
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
      {...props as any}
      currentPath={props.currentPath || context.currentPath}
    >
      {props.children}
    </IonTabBarUnwrapped>
  );
});

export const IonTabBar = createForwardRef<IonTabBarProps, HTMLIonTabBarElement>(IonTabBarContainer, 'IonTabBar');
