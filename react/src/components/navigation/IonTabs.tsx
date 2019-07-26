import React from 'react';
import { IonTabBar } from './IonTabBar';
import { IonRouterOutlet } from './routing/IonRouterOutlet';

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

export class IonTabs extends React.Component<Props> {

  render() {
    let outlet: React.ReactElement<{}>;
    let tabBar: React.ReactElement<{ slot: 'bottom' | 'top' }>;

    React.Children.forEach(this.props.children, (child: any) => {
      if (child == null || typeof child !== 'object' || !child.hasOwnProperty('type')) {
        return;
      }
      if (child.type === IonRouterOutlet) {
        outlet = child;
      }
      if (child.type === IonTabBar) {
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
