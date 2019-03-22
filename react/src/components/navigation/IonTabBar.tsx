import React, { Component } from 'react';
import { IonTabBarInner, IonTabButton } from '../index';
import { withRouter, RouteComponentProps } from 'react-router';
import { Components } from '@ionic/core';

type Props = RouteComponentProps & Components.IonTabBarAttributes & {
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

class IonTabBar extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    const tabActiveUrls: { [key: string]: Tab } = {};

    React.Children.forEach(this.props.children, (child) => {
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

  renderChild = (activeTab: string) => (child: React.ReactElement<Components.IonTabButtonAttributes & { onIonTabButtonClick: (e: CustomEvent) => void }>) => {
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

export default withRouter(IonTabBar);
