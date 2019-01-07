import React, { Component } from 'react';
import { IonTabs, IonTab, IonTabBar } from '../index';
import { withRouter, RouteComponentProps, matchPath } from 'react-router';

type Props = RouteComponentProps & {
  children: React.ReactNode;
}

type State = {
  activeTab: string
}

class IonTabsNav extends Component<Props, State> {

  getMatch() {
    return matchPath<{ tabName: string }>(this.props.location.pathname, {
      path: `${this.props.match.url}:tabName`
    });
  }

  onTabBarChange = (e: CustomEvent<{ tab: string}>) => {
    console.log(e);
    const match = this.getMatch();
    if (match && e.detail.tab !== match.params.tabName) {
      this.props.history.push(`${this.props.match.url}${e.detail.tab}`);
    }
  }

  renderChildren = () => {
    const match = this.getMatch();
    if (match === null) {
      return null;
    }

    return React.Children.map(this.props.children, (child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return child;
      }
      if (child.type === IonTab) {
        return React.cloneElement(child, {
          active: child.props.tab === match.params.tabName
        });
      }
      if (child.type === IonTabBar) {
        return React.cloneElement(child, {
          selectedTab: match.params.tabName,
          onIonTabBarChanged: this.onTabBarChange
        });
      }
      return child;
    })
  }

  render() {

    return (
      <IonTabs>
        { this.renderChildren() }
      </IonTabs>
    );
  }
}

export default withRouter(IonTabsNav);
