import type { AnimationBuilder } from '@ionic/core/components';
import React from 'react';

import type { IonRouterContextState } from '../components/IonRouterContext';
import { IonRouterContext } from '../components/IonRouterContext';
import type { NavContextState } from '../contexts/NavContext';
import { NavContext } from '../contexts/NavContext';
import type { RouteAction } from '../models/RouteAction';
import type { RouteInfo } from '../models/RouteInfo';
import type { RouterDirection } from '../models/RouterDirection';
import type { RouterOptions } from '../models/RouterOptions';

import type { LocationHistory } from './LocationHistory';

// TODO(FW-2959): types

interface NavManagerProps {
  routeInfo: RouteInfo;
  onNativeBack: () => void;
  onNavigateBack: (route?: string | RouteInfo, animationBuilder?: AnimationBuilder) => void;
  onNavigate: (
    path: string,
    action: RouteAction,
    direction?: RouterDirection,
    animationBuilder?: AnimationBuilder,
    options?: any,
    tab?: string
  ) => void;
  onNavigateRoot: (pathname: string, animationBuilder?: AnimationBuilder) => void;
  onSetCurrentTab: (tab: string, routeInfo: RouteInfo) => void;
  onChangeTab: (tab: string, path: string, routeOptions?: any) => void;
  onResetTab: (tab: string, path: string, routeOptions?: any) => void;
  ionRoute: any;
  stackManager: any;
  locationHistory: LocationHistory;
}

export class NavManager extends React.PureComponent<NavManagerProps, NavContextState> {
  ionRouterContextValue: IonRouterContextState = {
    push: (
      pathname: string,
      routerDirection?: RouterDirection,
      routeAction?: RouteAction,
      routerOptions?: RouterOptions,
      animationBuilder?: AnimationBuilder
    ) => {
      this.navigate(pathname, routerDirection, routeAction, animationBuilder, routerOptions);
    },
    back: (animationBuilder?: AnimationBuilder) => {
      this.goBack(undefined, animationBuilder);
    },
    navigateRoot: (pathname: string, animationBuilder?: AnimationBuilder) => {
      this.props.onNavigateRoot(pathname, animationBuilder);
    },
    canGoBack: () => this.props.locationHistory.canGoBack(),
    nativeBack: () => this.props.onNativeBack(),
    routeInfo: this.props.routeInfo,
  };

  constructor(props: NavManagerProps) {
    super(props);
    this.state = {
      goBack: this.goBack.bind(this),
      hasIonicRouter: () => true,
      navigate: this.navigate.bind(this),
      getIonRoute: this.getIonRoute.bind(this),
      getStackManager: this.getStackManager.bind(this),
      routeInfo: this.props.routeInfo,
      setCurrentTab: this.props.onSetCurrentTab,
      changeTab: this.props.onChangeTab,
      resetTab: this.props.onResetTab,
    };
  }

  componentDidMount() {
    if (typeof document !== 'undefined') {
      this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
      document.addEventListener('ionBackButton', this.handleHardwareBackButton);
    }
  }

  componentWillUnmount() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('ionBackButton', this.handleHardwareBackButton);
    }
  }

  handleHardwareBackButton(e: any) {
    e.detail.register(0, (processNextHandler: () => void) => {
      this.nativeGoBack();
      processNextHandler();
    });
  }

  goBack(route?: string | RouteInfo, animationBuilder?: AnimationBuilder) {
    this.props.onNavigateBack(route, animationBuilder);
  }

  nativeGoBack() {
    this.props.onNativeBack();
  }

  navigate(
    path: string,
    direction: RouterDirection = 'forward',
    action: RouteAction = 'push',
    animationBuilder?: AnimationBuilder,
    options?: any,
    tab?: string
  ) {
    this.props.onNavigate(path, action, direction, animationBuilder, options, tab);
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
        <IonRouterContext.Provider value={{ ...this.ionRouterContextValue, routeInfo: this.props.routeInfo }}>
          {this.props.children}
        </IonRouterContext.Provider>
      </NavContext.Provider>
    );
  }
}
