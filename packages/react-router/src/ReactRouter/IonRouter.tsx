import { LocationHistory, NavManager, RouteAction, RouteInfo, RouteManagerContext, RouteManagerContextState, RouterDirection } from '@ionic/react';
import { Action as HistoryAction, Location as HistoryLocation } from 'history';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import StackManager from './StackManager';

export interface LocationState {
  // direction?: RouterDirection;
  // action?: RouteAction;
}

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
  exitViewFromOtherOutletHandlers: ((pathname: string) => void)[] = [];
  incomingRouteParams?: Pick<RouteInfo, 'routeAction' | 'routeDirection' | 'routeOptions' | 'tab'>;
  locationHistory = new LocationHistory();
  // previousPathname: string | undefined;
  routeChangedHandlers: ((routeInfo: RouteInfo) => void)[] = [];
  routeInfo: RouteInfo;
  routeMangerContextState: RouteManagerContextState = {
    exitViewFromOtherOutlet: this.exitViewFromOtherOutlet.bind(this),
    onRouteChange: this.registerRouteChangeHandler.bind(this),
    onExitViewFromOtherOutlet: this.registerExitViewFromOtherOutletHandler.bind(this)
  };
  pendingRouteChange?: RouteInfo;

  constructor(props: IonRouteProps) {
    super(props);

    this.routeInfo = {
      currentRoute: this.props.location.pathname,
      pathname: this.props.location.pathname,
      search: this.props.location.search
    };

    this.locationHistory.updateHistory(this.routeInfo);

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

  exitViewFromOtherOutlet(pathname: string) {
    this.exitViewFromOtherOutletHandlers.forEach(cb => {
      cb(pathname);
    });
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
        this.incomingRouteParams = {
          routeAction: action === 'REPLACE' ? 'replace' : 'push',
          routeDirection: action === 'REPLACE' ? 'none' : 'forward',
          tab: this.currentTab
        };
      }

      const isPushed = (this.incomingRouteParams.routeAction === 'push' && this.incomingRouteParams.routeDirection === 'forward');
      this.routeInfo = {
        ...this.incomingRouteParams,
        currentRoute: location.pathname,
        lastRoute: leavingLocationInfo.currentRoute,
        pathname: location.pathname,
        search: location.search,
        tab: isPushed ? leavingLocationInfo.tab : this.currentTab,
        params: this.props.match.params
      };
      if (isPushed) {
        this.routeInfo.pushedByRoute = this.currentPathname;
      } else if (this.incomingRouteParams.routeAction === 'push' && this.currentTab !== leavingLocationInfo.tab) {
        // If we are switching tabs grab the last route info for the tab and use its pushedByRoute
        const lastRoute = this.locationHistory.getCurrentRouteInfoForTab(this.currentTab);
        this.routeInfo.pushedByRoute = lastRoute?.pushedByRoute;
      }

      this.locationHistory.updateHistory(this.routeInfo);

      this.forceUpdate();

      if (this.routeChangedHandlers.length === 0) {
        this.pendingRouteChange = this.routeInfo;
      }
      this.routeChangedHandlers.forEach(h => h(this.routeInfo));
    }

    // this.previousPathname = this.currentPathname;
    this.currentPathname = location.pathname;
    this.incomingRouteParams = undefined;

    // TODO: this state needed?
    this.setState({
      location
    });
  }

  handleNavigate(path: string, routeAction: RouteAction, routeDirection?: RouterDirection, routeOptions?: any) {
    this.incomingRouteParams = {
      routeAction,
      routeDirection,
      routeOptions
    };

    if (routeAction === 'push') {
      this.props.history.push(path);
    } else {
      this.props.history.replace(path);
    }
  }

  handleNavigateBack(path = '/') {
    const routeInfo = this.locationHistory.current();
    if (routeInfo && routeInfo.pushedByRoute) {
      const prevInfo = this.locationHistory.findLastLocation(routeInfo);
      if (prevInfo) {
        this.handleNavigate(prevInfo.currentRoute, 'pop', 'back');
      } else {
        this.handleNavigate(path, 'pop', 'back');
      }
    } else {
      this.handleNavigate(path, 'pop', 'back');
    }
  }

  handleSetCurrentTab(tab?: string) {
    this.currentTab = tab;
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
          onNavigateBack={this.handleNavigateBack}
          onNavigate={this.handleNavigate}
          onSetCurrentTab={this.handleSetCurrentTab}
        >
          {this.props.children}
        </NavManager>
      </RouteManagerContext.Provider>
    );
  }
}

export const IonRouter = withRouter(IonRouterInner);
IonRouter.displayName = 'IonRouter';
