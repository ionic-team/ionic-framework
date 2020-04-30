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
  getConfig
} from '@ionic/react';
import { Action as HistoryAction, Location as HistoryLocation } from 'history';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { ReactRouterViewStack } from './ReactRouterViewStack';
import StackManager from './StackManager';

export interface LocationState { }

interface IonRouteProps extends RouteComponentProps<{}, {}, LocationState> {
  registerHistoryListener: (cb: (location: HistoryLocation<any>, action: HistoryAction) => void) => void;
}

interface IonRouteState {
  location?: HistoryLocation<LocationState>;
  action?: RouteAction;
}

class IonRouterInner extends React.Component<IonRouteProps, IonRouteState> {
  currentPathname: string | undefined;
  currentTab?: string;
  exitViewFromOtherOutletHandlers: ((pathname: string) => ViewItem | undefined)[] = [];
  incomingRouteParams?: Partial<RouteInfo>;
  locationHistory = new LocationHistory();
  routeChangedHandlers: ((routeInfo: RouteInfo) => void)[] = [];
  routeInfo: RouteInfo;
  viewStack = new ReactRouterViewStack();
  routeMangerContextState: RouteManagerContextState = {
    onRouteChange: this.registerRouteChangeHandler.bind(this),
    getViewItemForTransition: this.viewStack.getViewItemForTransition,
    getChildrenToRender: this.viewStack.getChildrenToRender,
    createViewItem: this.viewStack.createViewItem,
    findViewItemByPathname: this.viewStack.findViewItemByPathname,
    findViewItemByRouteInfo: this.viewStack.findViewItemByRouteInfo,
    findLeavingViewItemByRouteInfo: this.viewStack.findLeavingViewItemByRouteInfo,
    addViewItem: this.viewStack.add,
    unMountViewItem: this.viewStack.remove
  };
  pendingRouteChange?: RouteInfo;
  viewItemsForTransition: { [key: string]: ViewItem | undefined; } = {};

  constructor(props: IonRouteProps) {
    super(props);

    this.routeInfo = {
      id: generateId('routeInfo'),
      pathname: this.props.location.pathname,
      search: this.props.location.search
    };

    this.locationHistory.add(this.routeInfo);

    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleResetTab = this.handleResetTab.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handleNavigateBack = this.handleNavigateBack.bind(this);
    this.props.registerHistoryListener(this.handleHistoryChange.bind(this));
    this.handleSetCurrentTab = this.handleSetCurrentTab.bind(this);
  }

  componentDidMount() {
    this.routeInfo.tab = this.currentTab;
  }

  shouldComponentUpdate() {
    return false;
  }

  getViewItemForTransition(pathname: string) {
    console.log(`getting view: ${pathname}`);
    return this.viewItemsForTransition[pathname];
  }

  handleChangeTab(tab: string, path: string, routeOptions?: any) {
    const routeInfo = this.locationHistory.getCurrentRouteInfoForTab(tab);
    if (routeInfo) {
      this.incomingRouteParams = { ...routeInfo, routeAction: 'push', routeDirection: 'none' };
      this.props.history.push(routeInfo.pathname + (routeInfo.search || ''));
    } else {
      this.handleNavigate(path, 'push', 'none', routeOptions, tab);
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
    } else if (action === 'REPLACE') {
      leavingLocationInfo = this.locationHistory.previous();
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
            tab: this.currentTab
          };
        }
        if (!this.incomingRouteParams) {
          this.incomingRouteParams = {
            routeAction: 'push',
            routeDirection: 'forward',
            tab: this.currentTab
          };
        }
      }

      if (this.incomingRouteParams?.id) {
        this.routeInfo = {
          ...this.incomingRouteParams as RouteInfo,
          lastPathname: leavingLocationInfo.pathname
        };
        this.locationHistory.add(this.routeInfo);
      } else {
        const isPushed = (this.incomingRouteParams.routeAction === 'push' && this.incomingRouteParams.routeDirection === 'forward');
        this.routeInfo = {
          id: generateId('routeInfo'),
          ...this.incomingRouteParams,
          lastPathname: leavingLocationInfo.pathname,
          pathname: location.pathname,
          search: location.search,
          params: this.props.match.params
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

    if (this.routeChangedHandlers.length === 0) {
      this.pendingRouteChange = this.routeInfo;
    }
    this.routeChangedHandlers.forEach(h => h(this.routeInfo));

    this.currentPathname = location.pathname;
    this.incomingRouteParams = undefined;

  }

  handleNavigate(path: string, routeAction: RouteAction, routeDirection?: RouterDirection, routeOptions?: any, tab?: string) {
    this.incomingRouteParams = {
      routeAction,
      routeDirection,
      routeOptions,
      tab
    };

    if (routeAction === 'push') {
      this.props.history.push(path);
    } else {
      this.props.history.replace(path);
    }
  }

  handleNavigateBack(defaultHref: string | RouteInfo = '/') {
    const config = getConfig();
    defaultHref = defaultHref ? defaultHref : config && config.get('backButtonDefaultHref' as any);
    const routeInfo = this.locationHistory.current();
    if (routeInfo && routeInfo.pushedByRoute) {
      const prevInfo = this.locationHistory.findLastLocation(routeInfo);
      if (prevInfo) {
        this.incomingRouteParams = { ...prevInfo, routeAction: 'pop', routeDirection: 'back' };
        if (routeInfo.lastPathname === routeInfo.pushedByRoute) {
          this.props.history.goBack();
        } else {
          this.props.history.replace(prevInfo.pathname + (prevInfo.search || ''));
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

  registerExitViewFromOtherOutletHandler(cb: (pathname: string) => ViewItem | undefined) {
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

  // storeViewItemForTransition(pathname: string, viewItem: ViewItem) {
  //   console.log(`storing view: ${pathname}`);
  //   this.viewItemsForTransition[pathname] = viewItem;
  //   setTimeout(() => {
  //     console.log(`removing viewItem ${pathname} from pending transitions`);
  //     delete this.viewItemsForTransition[pathname];
  //   }, 10000);
  // }

  render() {
    return (
      <RouteManagerContext.Provider
        value={this.routeMangerContextState}
      >
        <NavManager
          stackManager={StackManager}
          routeInfo={this.routeInfo}
          onNavigateBack={this.handleNavigateBack}
          onNavigate={this.handleNavigate}
          onSetCurrentTab={this.handleSetCurrentTab}
          onChangeTab={this.handleChangeTab}
          onResetTab={this.handleResetTab}
        >
          {this.props.children}
        </NavManager>
      </RouteManagerContext.Provider>
    );
  }
}

export const IonRouter = withRouter(IonRouterInner);
IonRouter.displayName = 'IonRouter';
