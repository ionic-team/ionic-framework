
import React from 'react';

import { NavContext, NavContextState } from '../contexts/NavContext';
import { RouteAction } from '../models/IonRouteAction';
import { RouteInfo } from '../models/RouteInfo';
import { RouterDirection } from '../models/RouterDirection';

import PageManager from './PageManager';

interface NavManagerProps {
  routeInfo: RouteInfo;
  onNavigateBack: (defaultHref?: string) => void;
  onNavigate: (path: string, action: RouteAction, direction?: RouterDirection, options?: any, tab?: string) => void;
  onSetCurrentTab: (tab?: string) => void;
  stackManager: any;
}

export class NavManager extends React.Component<NavManagerProps, NavContextState> {

  constructor(props: NavManagerProps) {
    super(props);
    this.state = {
      goBack: this.goBack.bind(this),
      hasIonicRouter: () => true,
      navigate: this.navigate.bind(this),
      getStackManager: this.getStackManager.bind(this),
      getPageManager: this.getPageManager.bind(this),
      routeInfo: this.props.routeInfo,
      setCurrentTab: this.props.onSetCurrentTab,
      // registerIonPage: () => { return; } // overridden in View for each IonPage
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('ionBackButton', (e: any) => {
        e.detail.register(0, () => {
          this.goBack();
        });
      });
    }
  }

  goBack(defaultHref?: string) {
    this.props.onNavigateBack(defaultHref);
  }

  navigate(path: string, direction: RouterDirection = 'forward', action: RouteAction = 'push', options?: any, tab?: string) {
    this.props.onNavigate(path, action, direction, options, tab);
  }

  getPageManager() {
    return PageManager;
  }

  getStackManager() {
    return this.props.stackManager;
  }

  render() {
    return (
      <NavContext.Provider value={{ ...this.state, routeInfo: this.props.routeInfo }}>
        {this.props.children}
      </NavContext.Provider>
    );
  }

}
