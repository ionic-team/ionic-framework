import {
  LocationHistory,
  NavManager,
  RouteAction,
  RouteInfo,
  RouteManagerContext,
  RouteManagerContextState,
  RouterDirection,
  ViewItem,
  generateId
} from '@ionic/react';
import { WithRouterProps } from 'next/dist/client/with-router';
import { Router, withRouter } from 'next/router';
import React from 'react';

import { NextRouteInfo, NextRouteOptions } from './NextRouteInfo';
import { NextRouterViewStack } from './NextRouterViewStack';
import StackManager from './StackManager';

interface IonNextRouterState {
  routeInfo: RouteInfo;
}

class IonNextRouterInner extends React.PureComponent<WithRouterProps, IonNextRouterState> {
  currentPathname: string | undefined;
  currentTab?: string;
  incomingRouteParams?: Partial<RouteInfo>;
  locationHistory = new LocationHistory();
  routeChangedHandlers: ((routeInfo: RouteInfo) => void)[] = [];
  routeInfo: NextRouteInfo;
  viewStack = new NextRouterViewStack();
  routeMangerContextState: RouteManagerContextState = {
    clearOutlet: this.viewStack.clear,
    getViewItemForTransition: this.viewStack.getViewItemForTransition,
    getChildrenToRender: this.viewStack.getChildrenToRender,
    createViewItem: this.viewStack.createViewItem,
    findViewItemByPathname: this.viewStack.findViewItemByPathname,
    findViewItemByRouteInfo: this.viewStack.findViewItemByRouteInfo,
    findLeavingViewItemByRouteInfo: this.viewStack.findLeavingViewItemByRouteInfo,
    addViewItem: this.viewStack.add,
    unMountViewItem: this.viewStack.remove
  };
  viewItemsForTransition: { [key: string]: ViewItem | undefined; } = {};

  constructor(props: WithRouterProps) {
    super(props);

    const asPathParts = this.props.router.asPath.split('?');
    this.routeInfo = {
      id: generateId('routeInfo'),
      pathname: asPathParts[0],
      search: asPathParts[1] ? '?' + asPathParts[1] : '',
      routeOptions: {
        routePath: this.props.router.pathname,
        as: this.props.router.asPath
      }
    };

    this.locationHistory.add(this.routeInfo);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handleNavigateBack = this.handleNavigateBack.bind(this);
    this.handleHistoryChange = this.handleHistoryChange.bind(this);
    this.handleResetTab = this.handleResetTab.bind(this);
    this.handleSetCurrentTab = this.handleSetCurrentTab.bind(this);

    this.state = {
      routeInfo: this.routeInfo
    };
  }

  componentDidMount() {
    this.routeInfo.tab = this.currentTab;
    Router.events.on('routeChangeComplete', this.handleHistoryChange);
    this.props.router.beforePopState(({ as }) => {
      this.routeInfo = { ...this.routeInfo, pathname: as, lastPathname: this.currentPathname, routeAction: 'replace', routeDirection: 'back' };
      return true;
    });
  }

  handleChangeTab(tab: string, path: string, routeOptions?: any) {
    const routeInfo = this.locationHistory.getCurrentRouteInfoForTab(tab);
    if (routeInfo) {
      this.incomingRouteParams = { ...routeInfo, routeAction: 'push', routeDirection: 'none' };
      if (routeInfo.pathname === path) {
        this.props.router.push(routeInfo.routeOptions?.routePath, routeInfo.pathname || path);
      } else {
        this.incomingRouteParams.pathname = path;
        this.props.router.push(path, routeOptions?.as);
      }
    } else {
      this.handleNavigate(path, 'push', 'none', routeOptions, tab);
    }
  }

  handleHistoryChange(enteringUrl: string) {

    const router = this.props.router;
    let leavingLocationInfo: NextRouteInfo;
    if (this.incomingRouteParams) {
      if (this.incomingRouteParams.routeAction === 'replace') {
        leavingLocationInfo = this.locationHistory.previous();
      } else {
        leavingLocationInfo = this.locationHistory.current();
      }
    } else {
      leavingLocationInfo = this.locationHistory.current();
    }
    const leavingUrl = leavingLocationInfo.pathname + leavingLocationInfo.search;

    if (leavingUrl !== enteringUrl) {

      if (!this.incomingRouteParams) {
        this.incomingRouteParams = {
          routeAction: 'push',
          routeDirection: 'forward',
          routeOptions: { as: router.asPath, routePath: router.pathname },
        };
      }

      if (this.incomingRouteParams?.id) {
        this.routeInfo = {
          ...this.incomingRouteParams as RouteInfo,
          lastPathname: leavingLocationInfo.pathname,
          routeOptions: {
            as: router.asPath,
            routePath: router.pathname,
            lastRoutePath: leavingLocationInfo.routeOptions?.routePath
          }
        };
        this.locationHistory.add(this.routeInfo);
      } else {
        const asPathParts = router.asPath.split('?');
        const isPushed = (this.incomingRouteParams.routeAction === 'push' && this.incomingRouteParams.routeDirection === 'forward');
        this.routeInfo = {
          id: generateId('routeInfo'),
          ...this.incomingRouteParams,
          lastPathname: leavingLocationInfo.pathname,
          pathname: asPathParts[0],
          search: asPathParts[1] ? '?' + asPathParts[1] : '',
          params: router.query,
          routeOptions: {
            as: router.asPath,
            routePath: router.pathname,
            lastRoutePath: leavingLocationInfo.routeOptions?.routePath
          }
        };
        if (isPushed) {
          this.routeInfo.tab = leavingLocationInfo.tab;
          this.routeInfo.pushedByRoute = leavingLocationInfo.pathname;
        } else if (this.routeInfo.routeAction === 'pop') {
          const r = this.locationHistory.findLastLocation(this.routeInfo);
          this.routeInfo.pushedByRoute = r?.pushedByRoute;
        } else if (this.routeInfo.routeAction === 'push' && this.routeInfo.tab !== leavingLocationInfo.tab) {
          // If we are switching tabs grab the last route info for the tab and use its pushedByRoute
          const lastRoute = this.locationHistory.getCurrentRouteInfoForTab(this.routeInfo.tab);
          this.routeInfo.pushedByRoute = lastRoute?.pushedByRoute;
        }
        this.locationHistory.add(this.routeInfo);
      }

    }

    this.setState({
      routeInfo: this.routeInfo
    });

    this.incomingRouteParams = undefined;

  }

  handleNavigate(pathname: string, routeAction: RouteAction, routeDirection?: RouterDirection, routeOptions?: NextRouteOptions, tab?: string) {
    this.incomingRouteParams = {
      routeAction,
      routeDirection,
      routeOptions,
      tab
    };

    if (routeAction === 'push') {
      this.props.router.push(routeOptions?.routePath || pathname, routeOptions?.as);
    } else {
      this.props.router.replace(routeOptions?.routePath || pathname, routeOptions?.as);
    }
  }

  handleNavigateBack(route: string | RouteInfo = '/') {
    if (typeof route === 'string') {
      const routeInfo = this.locationHistory.current();
      if (routeInfo && routeInfo.pushedByRoute) {
        const prevInfo = this.locationHistory.findLastLocation(routeInfo);
        if (prevInfo) {
          this.incomingRouteParams = { ...prevInfo, routeAction: 'pop', routeDirection: 'back' };
          if (routeInfo.lastPathname === routeInfo.pushedByRoute) {
            this.props.router.back();
          } else {
            this.props.router.replace(prevInfo.routeOptions?.routePath || route, prevInfo.routeOptions?.as);
          }
        } else {
          this.handleNavigate(route, 'pop', 'back');
        }
      } else {
        this.handleNavigate(route, 'pop', 'back');
      }
    }
  }

  handleResetTab(tab: string, originalHref: string, originalRouteOptions: NextRouteOptions) {
    const routeInfo = this.locationHistory.getFirstRouteInfoForTab(tab);
    if (routeInfo) {
      const newRouteInfo = { ...routeInfo };
      newRouteInfo.pathname = originalHref;
      newRouteInfo.routeOptions = originalRouteOptions;
      this.incomingRouteParams = { ...newRouteInfo, routeAction: 'pop', routeDirection: 'back' };
      this.props.router.push(newRouteInfo.routeOptions?.routePath || newRouteInfo.pathname, newRouteInfo.routeOptions?.as);
    }
  }

  handleSetCurrentTab(tab: string) {
    this.currentTab = tab;
    const ri = { ...this.locationHistory.current() };
    if (ri.tab !== tab) {
      ri.tab = tab;
      this.locationHistory.update(ri);
    }
  }

  render() {
    return (
      <RouteManagerContext.Provider
        value={this.routeMangerContextState}
      >
        <NavManager
          stackManager={StackManager}
          routeInfo={this.state.routeInfo!}
          onChangeTab={this.handleChangeTab}
          onNavigateBack={this.handleNavigateBack}
          onNavigate={this.handleNavigate}
          onSetCurrentTab={this.handleSetCurrentTab}
          onResetTab={this.handleResetTab}
        >
          {this.props.children}
        </NavManager>
      </RouteManagerContext.Provider>
    );
  }
}

export const IonNextRouter = withRouter(IonNextRouterInner);
IonNextRouter.displayName = 'IonNextRouter';
