import React from 'react';
import { IonTabBarInner } from '../inner-proxies';
import { withRouter, RouteComponentProps } from 'react-router';
import { JSX } from '@ionic/core';
import { IonTabButton } from '../proxies';

type Props = RouteComponentProps & JSX.IonTabBar & {
  children: React.ReactNode;
}

type Tab = {
  originalHref: string,
  currentHref: string
}

type State = {
  activeTab: string | null,
  tabs: { [key: string]: Tab }
}

class TabBar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    const tabActiveUrls: { [key: string]: Tab } = {};

    React.Children.forEach(this.props.children, (child: any) => {
      if (child != null && typeof child === 'object' && child.props && child.type === IonTabButton) {
        tabActiveUrls[child.props.tab] = {
          originalHref: child.props.href,
          currentHref: child.props.href
        };
      }
    });

    this.state = {
      activeTab: null,
      tabs: tabActiveUrls
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const activeTab = Object.keys(state.tabs)
      .find(key => {
        const href = state.tabs[key].originalHref;
        return props.location.pathname.startsWith(href)
      });

    if (!activeTab || (activeTab === state.activeTab && state.tabs[activeTab].currentHref === props.location.pathname)) {
      return null;
    }

    return {
      activeTab,
      tabs: {
        ...state.tabs,
        [activeTab]: {
          originalHref: state.tabs[activeTab].originalHref,
          currentHref: props.location.pathname
        }
      }
    }
  }


  onTabButtonClick = (e: CustomEvent<{ href: string, selected: boolean, tab: string }>) => {
    const targetUrl = (this.state.activeTab === e.detail.tab) ?
      this.state.tabs[e.detail.tab].originalHref :
      this.state.tabs[e.detail.tab].currentHref;

    this.props.history.push(targetUrl);
  }

  renderChild = (activeTab: string) => (child: React.ReactElement<JSX.IonTabButton & { onIonTabButtonClick: (e: CustomEvent) => void }>) => {
    if (child != null && typeof child === 'object' && child.props && child.type === IonTabButton) {
      const href = (child.props.tab === activeTab) ? this.props.location.pathname : (this.state.tabs[child.props.tab].currentHref);

      return React.cloneElement(child, {
        href,
        onIonTabButtonClick: this.onTabButtonClick
      });
    }
    return null;
  }

  render() {
    return (
      <IonTabBarInner {...this.props} selectedTab={this.state.activeTab}>
        { React.Children.map(this.props.children, this.renderChild(this.state.activeTab)) }
      </IonTabBarInner>
    );
  }
}

export const IonTabBar = /*@__PURE__*/withRouter(TabBar);
