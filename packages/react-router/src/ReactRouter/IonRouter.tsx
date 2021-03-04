import { AnimationBuilder } from '@ionic/core';
import {
  LocationHistory,
  NavManager,
  RouteAction,
  RouteInfo,
  RouteManagerContext,
  RouteManagerContextState,
  RouterDirection,
  ViewItem,
  generateId,
  getConfig,
} from '@ionic/react';
import { Action as HistoryAction, Location as HistoryLocation } from 'history';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { IonRouteInner } from './IonRouteInner';
import { ReactRouterViewStack } from './ReactRouterViewStack';
import StackManager from './StackManager';

export interface LocationState {
  direction?: RouterDirection;
  routerOptions?: { as?: string; unmount?: boolean };
}

interface IonRouteProps extends RouteComponentProps<{}, {}, LocationState> {
  registerHistoryListener: (
    cb: (location: HistoryLocation<any>, action: HistoryAction) => void
  ) => void;
}

interface IonRouteState {
  routeInfo: RouteInfo;
}

class IonRouterInner extends React.PureComponent<IonRouteProps, IonRouteState> {
  currentTab?: string;
  exitViewFromOtherOutletHandlers: ((pathname: string) => ViewItem | undefined)[] = [];
  incomingRouteParams?: Partial<RouteInfo>;
  locationHistory = new LocationHistory();
  viewStack = new ReactRouterViewStack();
  routeMangerContextState: RouteManagerContextState = {
    canGoBack: () => this.locationHistory.canGoBack(),
    clearOutlet: this.viewStack.clear,
    findViewItemByPathname: this.viewStack.findViewItemByPathname,
    getChildrenToRender: this.viewStack.getChildrenToRender,
    goBack: () => this.handleNavigateBack(),
    createViewItem: this.viewStack.createViewItem,
    findViewItemByRouteInfo: this.viewStack.findViewItemByRouteInfo,
    findLeavingViewItemByRouteInfo: this.viewStack.findLeavingViewItemByRouteInfo,
    addViewItem: this.viewStack.add,
    unMountViewItem: this.viewStack.remove,
  };

  constructor(props: IonRouteProps) {
    super(props);

    const routeInfo = {
      id: generateId('routeInfo'),
      pathname: this.props.location.pathname,
      search: this.props.location.search,
    };

    this.locationHistory.add(routeInfo);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleResetTab = this.handleResetTab.bind(this);
    this.handleNativeBack = this.handleNativeBack.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handleNavigateBack = this.handleNavigateBack.bind(this);
    this.props.registerHistoryListener(this.handleHistoryChange.bind(this));
    this.handleSetCurrentTab = this.handleSetCurrentTab.bind(this);

    this.state = {
      routeInfo,
    };
  }

  handleChangeTab(tab: string, path?: string, routeOptions?: any) {
    if (!path) { return; }

    const routeInfo = this.locationHistory.getCurrentRouteInfoForTab(tab);
    const [pathname, search] = path.split('?');
    if (routeInfo) {
      this.incomingRouteParams = { ...routeInfo, routeAction: 'push', routeDirection: 'none' };
      if (routeInfo.pathname === pathname) {
        this.incomingRouteParams.routeOptions = routeOptions;
        this.props.history.push(routeInfo.pathname + (routeInfo.search || ''));
      } else {
        this.incomingRouteParams.pathname = pathname;
        this.incomingRouteParams.search = search ? '?' + search : undefined;
        this.incomingRouteParams.routeOptions = routeOptions;
        this.props.history.push(pathname + (search ? '?' + search : ''));
      }
    } else {
      this.handleNavigate(pathname, 'push', 'none', undefined, routeOptions, tab);
    }
  }

  handleHistoryChange(location: HistoryLocation<LocationState>, action: HistoryAction) {
    let leavingLocationInfo: RouteInfo;
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
    if (leavingUrl !== location.pathname) {
      if (!this.incomingRouteParams) {
        if (action === 'REPLACE') {
          this.incomingRouteParams = {
            routeAction: 'replace',
            routeDirection: 'none',
            tab: this.currentTab, // TODO this isn't legit if replacing to a page that is not in the tabs
          };
        }
        if (action === 'POP') {
          const currentRoute = this.locationHistory.current();
          if (currentRoute && currentRoute.pushedByRoute) {
            const prevInfo = this.locationHistory.findLastLocation(currentRoute);
            this.incomingRouteParams = { ...prevInfo, routeAction: 'pop', routeDirection: 'back' };
          } else {
            this.incomingRouteParams = {
              routeAction: 'pop',
              routeDirection: 'none',
              tab: this.currentTab,
            };
          }
        }
        if (!this.incomingRouteParams) {
          this.incomingRouteParams = {
            routeAction: 'push',
            routeDirection: location.state?.direction || 'forward',
            routeOptions: location.state?.routerOptions,
            tab: this.currentTab,
          };
        }
      }

      let routeInfo: RouteInfo;

      if (this.incomingRouteParams?.id) {
        routeInfo = {
          ...(this.incomingRouteParams as RouteInfo),
          lastPathname: leavingLocationInfo.pathname,
        };
        this.locationHistory.add(routeInfo);
      } else {
        const isPushed =
          this.incomingRouteParams.routeAction === 'push' &&
          this.incomingRouteParams.routeDirection === 'forward';
        routeInfo = {
          id: generateId('routeInfo'),
          ...this.incomingRouteParams,
          lastPathname: leavingLocationInfo.pathname,
          pathname: location.pathname,
          search: location.search,
          params: this.props.match.params,
          prevRouteLastPathname: leavingLocationInfo.lastPathname,
        };
        if (isPushed) {
          routeInfo.tab = leavingLocationInfo.tab;
          routeInfo.pushedByRoute = leavingLocationInfo.pathname;
        } else if (routeInfo.routeAction === 'pop') {
          const r = this.locationHistory.findLastLocation(routeInfo);
          routeInfo.pushedByRoute = r?.pushedByRoute;
        } else if (routeInfo.routeAction === 'push' && routeInfo.tab !== leavingLocationInfo.tab) {
          // If we are switching tabs grab the last route info for the tab and use its pushedByRoute
          const lastRoute = this.locationHistory.getCurrentRouteInfoForTab(routeInfo.tab);
          routeInfo.pushedByRoute = lastRoute?.pushedByRoute;
        } else if (routeInfo.routeAction === 'replace') {
          // Make sure to set the lastPathname, etc.. to the current route so the page transitions out
          const currentRouteInfo = this.locationHistory.current();

          /**
           * If going from /home to /child, then replacing from
           * /child to /home, we don't want the route info to
           * say that /home was pushed by /home which is not correct.
           */
          const currentPushedBy = currentRouteInfo?.pushedByRoute;
          const pushedByRoute = (currentPushedBy !== undefined && currentPushedBy !== routeInfo.pathname) ? currentPushedBy : routeInfo.pushedByRoute;

          routeInfo.lastPathname = currentRouteInfo?.pathname || routeInfo.lastPathname;
          routeInfo.prevRouteLastPathname = currentRouteInfo?.lastPathname;
          routeInfo.pushedByRoute = pushedByRoute;
          routeInfo.routeDirection = currentRouteInfo?.routeDirection || routeInfo.routeDirection;
          routeInfo.routeAnimation = currentRouteInfo?.routeAnimation || routeInfo.routeAnimation;
        }

        this.locationHistory.add(routeInfo);
      }

      this.setState({
        routeInfo,
      });
    }

    this.incomingRouteParams = undefined;
  }

  handleNativeBack() {
    this.props.history.goBack();
  }

  handleNavigate(
    path: string,
    routeAction: RouteAction,
    routeDirection?: RouterDirection,
    routeAnimation?: AnimationBuilder,
    routeOptions?: any,
    tab?: string
  ) {
    this.incomingRouteParams = Object.assign(this.incomingRouteParams || {}, {
      routeAction,
      routeDirection,
      routeOptions,
      routeAnimation,
      tab,
    });

    if (routeAction === 'push') {
      this.props.history.push(path);
    } else {
      this.props.history.replace(path);
    }
  }

  handleNavigateBack(defaultHref: string | RouteInfo = '/', routeAnimation?: AnimationBuilder) {
    const config = getConfig();
    defaultHref = defaultHref ? defaultHref : config && config.get('backButtonDefaultHref' as any);
    const routeInfo = this.locationHistory.current();
    if (routeInfo && routeInfo.pushedByRoute) {
      const prevInfo = this.locationHistory.findLastLocation(routeInfo);
      if (prevInfo) {
        this.incomingRouteParams = {
          ...prevInfo,
          routeAction: 'pop',
          routeDirection: 'back',
          routeAnimation: routeAnimation || routeInfo.routeAnimation,
        };
        if (routeInfo.lastPathname === routeInfo.pushedByRoute || prevInfo.pathname === routeInfo.pushedByRoute) {
          this.props.history.goBack();
        } else {
          this.handleNavigate(prevInfo.pathname + (prevInfo.search || ''), 'pop', 'back');
        }
      } else {
        this.handleNavigate(defaultHref as string, 'pop', 'back');
      }
    } else {
      this.handleNavigate(defaultHref as string, 'pop', 'back');
    }
  }

  handleResetTab(tab: string, originalHref: string, originalRouteOptions: any) {
    const routeInfo = this.locationHistory.getFirstRouteInfoForTab(tab);
    if (routeInfo) {
      const newRouteInfo = { ...routeInfo };
      newRouteInfo.pathname = originalHref;
      newRouteInfo.routeOptions = originalRouteOptions;
      this.incomingRouteParams = { ...newRouteInfo, routeAction: 'pop', routeDirection: 'back' };
      this.props.history.push(newRouteInfo.pathname + (newRouteInfo.search || ''));
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
      <RouteManagerContext.Provider value={this.routeMangerContextState}>
        <NavManager
          ionRoute={IonRouteInner}
          ionRedirect={{}}
          stackManager={StackManager}
          routeInfo={this.state.routeInfo!}
          onNativeBack={this.handleNativeBack}
          onNavigateBack={this.handleNavigateBack}
          onNavigate={this.handleNavigate}
          onSetCurrentTab={this.handleSetCurrentTab}
          onChangeTab={this.handleChangeTab}
          onResetTab={this.handleResetTab}
          locationHistory={this.locationHistory}
        >
          {this.props.children}
        </NavManager>
      </RouteManagerContext.Provider>
    );
  }
}

export const IonRouter = withRouter(IonRouterInner);
IonRouter.displayName = 'IonRouter';
