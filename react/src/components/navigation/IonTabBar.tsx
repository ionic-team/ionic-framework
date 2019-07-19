import React, { useContext } from 'react';
import { IonTabBarInner } from '../inner-proxies';
import { JSX as LocalJSX } from '@ionic/core';
import { IonTabButton } from '../proxies';
import { NavContext } from './routing/NavContext';

type Props = LocalJSX.IonTabBar & {
  navigate: (path: string) => void;
  currentPath: string;
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

class IonTabBarUnwrapped extends React.Component<Props, State> {

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
        return props.currentPath.startsWith(href)
      });

    if (!activeTab || (activeTab === state.activeTab && state.tabs[activeTab].currentHref === props.currentPath)) {
      return null;
    }

    return {
      activeTab,
      tabs: {
        ...state.tabs,
        [activeTab]: {
          originalHref: state.tabs[activeTab].originalHref,
          currentHref: props.currentPath
        }
      }
    }
  }


  onTabButtonClick = (e: CustomEvent<{ href: string, selected: boolean, tab: string }>) => {
    const targetUrl = (this.state.activeTab === e.detail.tab) ?
      this.state.tabs[e.detail.tab].originalHref :
      this.state.tabs[e.detail.tab].currentHref;
    this.props.navigate(targetUrl);
  }

  renderChild = (activeTab: string) => (child: React.ReactElement<LocalJSX.IonTabButton & { onIonTabButtonClick: (e: CustomEvent) => void }>) => {
    if (child != null && typeof child === 'object' && child.props && child.type === IonTabButton) {
      const href = (child.props.tab === activeTab) ? this.props.currentPath : (this.state.tabs[child.props.tab].currentHref);

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
        {React.Children.map(this.props.children, this.renderChild(this.state.activeTab))}
      </IonTabBarInner>
    );
  }
}


export const IonTabBar: React.FC<LocalJSX.IonTabBar> = (props) => {
  const context = useContext(NavContext);
  return (
    <IonTabBarUnwrapped
      {...props as any}
      navigate={(path: string) => {
        context.navigate(path);
      }}
      currentPath={context.getLocation().pathname}>
      {props.children}
    </IonTabBarUnwrapped>
  )
}
