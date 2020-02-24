import { JSX as LocalJSX } from '@ionic/core';
import React, { useContext } from 'react';

import { NavContext } from '../../contexts/NavContext';
import { IonTabBarInner } from '../inner-proxies';
import { IonTabButton } from '../proxies';

type Props = LocalJSX.IonTabBar & {
  onIonTabsDidChange?: (event: CustomEvent<{ tab: string }>) => void;
  onIonTabsWillChange?: (event: CustomEvent<{ tab: string }>) => void;
  currentPath?: string;
  slot?: 'bottom' | 'top';
};

interface TabUrls {
  originalHref: string;
  currentHref: string;
}

interface State {
  activeTab: string | undefined;
  tabs: { [key: string]: TabUrls };
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
          currentHref: child.props.href
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

export const IonTabBar: React.FC<Props> = React.memo<Props>(props => {
  const context = useContext(NavContext);
  return (
    <IonTabBarUnwrapped
      {...props as any}
      currentPath={props.currentPath || context.currentPath}
    >
      {props.children}
    </IonTabBarUnwrapped>
  );
});
