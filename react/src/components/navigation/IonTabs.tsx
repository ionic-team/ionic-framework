import React, { Component } from 'react';
import { IonTabBar, IonRouterOutlet } from '../index';

type Props = {
  children: React.ReactNode;
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
  contain: 'layout size style'
};

const tabsInner: React.CSSProperties = {
  position: 'relative',
  flex: 1,
  contain: 'layout size style'
};


export default class IonTabs extends Component<Props> {

  render() {
    let outlet: React.ReactElement<{}>;
    let tabBar: React.ReactElement<{ slot: 'bottom' | 'top' }>;

    React.Children.forEach(this.props.children, child => {
      if (typeof child === 'object' && child.type === IonRouterOutlet) {
        outlet = child;
      }
      if (typeof child === 'object' && child.type === IonTabBar) {
        tabBar = child;
      }
    });

    return (
      <div style={hostStyles}>
        { tabBar.props.slot === 'top' ? tabBar : null }
        <div style={tabsInner} className="tabs-inner">
          { outlet }
        </div>
        { tabBar.props.slot === 'bottom' ? tabBar : null }
      </div>
    );
  }
}
