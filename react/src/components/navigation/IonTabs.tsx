import React from 'react';
import { NavContext } from '@ionic/react-core'
import { IonRouterOutlet } from '../proxies';
import { IonTabBar } from './IonTabBar';

type Props = {
  children: React.ReactNode;
}

type State = {}

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

export class IonTabs extends React.Component<Props, State> {
  context!: React.ContextType<typeof NavContext>;
  routerOutletRef: React.RefObject<HTMLIonRouterOutletElement> = React.createRef();

  constructor(props: Props) {
    super(props);
  }

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

    if(!outlet) {
      throw new Error('IonTabs must contain an IonRouterOutlet');
    }

    const NavManager = this.context.getViewManager();

    return (
      <div style={hostStyles}>
        {tabBar.props.slot === 'top' ? tabBar : null}
        <div style={tabsInner} className="tabs-inner">
          {this.context.hasIonicRouter() ? (
            <NavManager>
              {outlet}
            </NavManager>
          ) : (
              <>{outlet}</>
            )}
        </div>
        {tabBar.props.slot === 'bottom' ? tabBar : null}
      </div>
    );
  }
}
IonTabs.contextType = NavContext;
