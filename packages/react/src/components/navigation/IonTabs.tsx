import { JSX as LocalJSX } from '@ionic/core';
import React from 'react';

import { NavContext } from '../../contexts/NavContext';
import { IonRouterOutlet } from '../IonRouterOutlet';

import { IonTabBar } from './IonTabBar';

interface Props extends LocalJSX.IonTabs {
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
  context!: React.ContextType<typeof NavContext>;
  routerOutletRef: React.Ref<HTMLIonRouterOutletElement> = React.createRef();

  constructor(props: Props) {
    super(props);
  }

  render() {
    let outlet: React.ReactElement<{}> | undefined;
    let tabBar: React.ReactElement | undefined;

    React.Children.forEach(this.props.children, (child: any) => {
      if (child == null || typeof child !== 'object' || !child.hasOwnProperty('type')) {
        return;
      }
      if (child.type === IonRouterOutlet) {
        outlet = child;
      }
      if (child.type === IonTabBar) {
        const { onIonTabsDidChange, onIonTabsWillChange } = this.props;
        tabBar = React.cloneElement(child, { onIonTabsDidChange, onIonTabsWillChange });
      }
    });

    if (!outlet) {
      throw new Error('IonTabs must contain an IonRouterOutlet');
    }
    if (!tabBar) {
      // TODO, this is not required
      throw new Error('IonTabs needs a IonTabBar');
    }

    return (
      <div style={hostStyles}>
        {tabBar.props.slot === 'top' ? tabBar : null}
        <div style={tabsInner} className="tabs-inner">
          {outlet}
        </div>
        {tabBar.props.slot === 'bottom' ? tabBar : null}
      </div>
    );
  }

  static get contextType() {
    return NavContext;
  }
}
