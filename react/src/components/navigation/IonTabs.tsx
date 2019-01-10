import React, { Component } from 'react';
import { IonTabBarNav, IonRouterOutlet } from '../index';

type Props = {
  children: React.ReactNode;
}

export default class IonTabs extends Component<Props> {

  render() {
    let outlet: React.ReactElement<{}>;
    let tabBar: React.ReactElement<{ slot: 'bottom' | 'top' }>;

    React.Children.forEach(this.props.children, child => {
      if (typeof child === 'object' && child.type === IonRouterOutlet) {
        outlet = child;
      }
      if (typeof child === 'object' && child.type === IonTabBarNav) {
        tabBar = child;
      }
    });

    return (
      <>
        { tabBar.props.slot === 'top' ? tabBar : null }
        <div className="tabs-inner">
          { outlet }
        </div>
        { tabBar.props.slot === 'bottom' ? tabBar : null }
      </>
    );
  }
}
