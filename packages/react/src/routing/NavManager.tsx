
import React from 'react';
import { AnimationBuilder } from '@ionic/core';
import { NavContext, NavContextState } from '../contexts/NavContext';
import { RouteAction } from '../models/IonRouteAction';
import { RouteInfo } from '../models/RouteInfo';
import { RouterDirection } from '../models/RouterDirection';

import PageManager from './PageManager';

interface NavManagerProps {
  routeInfo: RouteInfo;
  onNavigateBack: (route?: string | RouteInfo, animationBuilder?: AnimationBuilder) => void;
  onNavigate: (path: string, action: RouteAction, direction?: RouterDirection, animationBuilder?: AnimationBuilder, options?: any, tab?: string) => void;
  onSetCurrentTab: (tab: string, routeInfo: RouteInfo) => void;
  onChangeTab: (tab: string, path: string, routeOptions?: any) => void;
  onResetTab: (tab: string, path: string, routeOptions?: any) => void;
  ionRedirect: any;
  ionRoute: any;
  stackManager: any;
}

export class NavManager extends React.Component<NavManagerProps, NavContextState> {

  constructor(props: NavManagerProps) {
    super(props);
    this.state = {
      goBack: this.goBack.bind(this),
      hasIonicRouter: () => true,
      navigate: this.navigate.bind(this),
      getIonRedirect: this.getIonRedirect.bind(this),
      getIonRoute: this.getIonRoute.bind(this),
      getStackManager: this.getStackManager.bind(this),
      getPageManager: this.getPageManager.bind(this),
      routeInfo: this.props.routeInfo,
      setCurrentTab: this.props.onSetCurrentTab,
      changeTab: this.props.onChangeTab,
      resetTab: this.props.onResetTab
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('ionBackButton', (e: any) => {
        e.detail.register(0, (processNextHandler: () => void) => {
          this.goBack();
          processNextHandler();
        });
      });
    }
  }

  goBack(route?: string | RouteInfo, animationBuilder?: AnimationBuilder) {
    this.props.onNavigateBack(route, animationBuilder);
  }

  navigate(path: string, direction: RouterDirection = 'forward', action: RouteAction = 'push', animationBuilder?: AnimationBuilder, options?: any, tab?: string) {
    this.props.onNavigate(path, action, direction, animationBuilder, options, tab);
  }

  getPageManager() {
    return PageManager;
  }

  getIonRedirect() {
    return this.props.ionRedirect;
  }

  getIonRoute() {
    return this.props.ionRoute;
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
