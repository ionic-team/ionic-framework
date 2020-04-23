import {
  LocationHistory,
  NavManager,
  RouteAction,
  RouteInfo,
  RouteManagerContext,
  RouteManagerContextState,
  RouterDirection,
  generateId
} from '@ionic/react';
import { WithRouterProps } from 'next/dist/client/with-router';
import { Router, withRouter } from 'next/router';
import React from 'react';

import { NextRouteInfo, NextRouteOptions } from './NextRouteInfo';
import StackManager from './StackManager';

interface IonNextRouterState {
}

class IonNextRouterInner extends React.Component<WithRouterProps, IonNextRouterState> {
  currentPathname: string | undefined;
  currentTab?: string;
  exitViewFromOtherOutletHandlers: ((pathname: string) => void)[] = [];
  incomingRouteParams?: Partial<RouteInfo>;
  locationHistory = new LocationHistory();
  routeChangedHandlers: ((routeInfo: RouteInfo) => void)[] = [];
  routeInfo: NextRouteInfo;
  routeMangerContextState: RouteManagerContextState = {
    exitViewFromOtherOutlet: this.exitViewFromOtherOutlet.bind(this),
    onRouteChange: this.registerRouteChangeHandler.bind(this),
    onExitViewFromOtherOutlet: this.registerExitViewFromOtherOutletHandler.bind(this)
  };

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
    this.registerRouteChangeHandler = this.registerRouteChangeHandler.bind(this);

    this.props.router.beforePopState(({ as }) => {
      this.routeInfo = { ...this.routeInfo, pathname: as, lastPathname: this.currentPathname, routeAction: 'replace', routeDirection: 'back' };
      return true;
    });
  }

  componentDidMount() {
    this.routeInfo.tab = this.currentTab;
    Router.events.on('routeChangeComplete', this.handleHistoryChange);
  }

  shouldComponentUpdate() {
    return false;
  }

  exitViewFromOtherOutlet(pathname: string) {
    this.exitViewFromOtherOutletHandlers.forEach(cb => {
      cb(pathname);
    });
  }

  handleChangeTab(tab: string, path: string, routeOptions?: any) {
    const routeInfo = this.locationHistory.getCurrentRouteInfoForTab(tab);
    if (routeInfo) {
      this.incomingRouteParams = { ...routeInfo, routeAction: 'push', routeDirection: 'none' };
      this.props.router.push(routeInfo.routeOptions?.routePath || path, routeOptions?.as);
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

    this.forceUpdate();

    this.routeChangedHandlers.forEach(h => h(this.routeInfo));

    this.currentPathname = router.pathname;
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
          this.props.router.push(prevInfo.routeOptions?.routePath || route, prevInfo.routeOptions?.as);
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

  registerExitViewFromOtherOutletHandler(cb: (pathname: string) => void) {
    this.exitViewFromOtherOutletHandlers.push(cb);
    return () => {
      this.exitViewFromOtherOutletHandlers = this.exitViewFromOtherOutletHandlers.filter(x => x !== cb);
    };
  }

  registerRouteChangeHandler(cb: (routeInfo: RouteInfo) => void) {
    this.routeChangedHandlers.push(cb);
    return () => {
      this.routeChangedHandlers = this.routeChangedHandlers.filter(x => x !== cb);
    };
  }

  render() {
    return (
      <RouteManagerContext.Provider
        value={this.routeMangerContextState}
      >
        <NavManager
          stackManager={StackManager}
          routeInfo={this.routeInfo}
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
