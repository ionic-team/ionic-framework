import { LocationHistory, NavManager, RouteAction, RouteInfo, RouteManagerContext, RouteManagerContextState, RouterDirection } from '@ionic/react';
import { WithRouterProps } from 'next/dist/client/with-router';
import { Router, withRouter } from 'next/router';
import React from 'react';
class IonNextRouterInner extends React.Component<WithRouterProps, RouteManagerContextState> {

  routeInfo: RouteInfo;
  incomingRouteParams?: Pick<RouteInfo, 'routeAction' | 'routeDirection' | 'routeOptions' | 'tab'>;
  currentPathname: string | undefined;
  previousPathname: string | undefined;
  locationHistory = new LocationHistory();
  currentTab?: string;
  routeRendered = false;

  routerOutletEl: HTMLIonRouterOutletElement | undefined;
  routeChangedHandlers: ((routeInfo: RouteInfo) => void)[] = [];
  setupFirstPage?: (routeInfo: RouteInfo) => void;

  constructor(props: WithRouterProps) {
    super(props);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handleNavigateBack = this.handleNavigateBack.bind(this);
    this.handleRouteChangeComplete = this.handleRouteChangeComplete.bind(this);
    this.handleSetCurrentTab = this.handleSetCurrentTab.bind(this);
    this.init = this.init.bind(this);

    const asPathParts = this.props.router.asPath.split('?');
    this.routeInfo = {
      currentRoute: this.props.router.pathname,
      pathname: asPathParts[0],
      search: asPathParts[1] ? '?' + asPathParts[1] : '',
      routeOptions: {
        as: this.props.router.asPath
      }
    };

    this.currentPathname = this.props.router.pathname;
    this.registerRouteChangeHandler = this.registerRouteChangeHandler.bind(this);
    this.registerSetupFirstPageHandler = this.registerSetupFirstPageHandler.bind(this);

  }

  componentDidMount() {
    this.init();
    this.props.router.beforePopState(({ as }) => {
      this.routeInfo = { ...this.routeInfo, currentRoute: as, lastRoute: this.currentPathname, routeAction: 'replace', routeDirection: 'back' };
      return true;
    });

    Router.events.on('routeChangeComplete', this.handleRouteChangeComplete);
  }

  init() {
    this.routeInfo.tab = this.currentTab;
    this.locationHistory.updateHistory(this.routeInfo);
  }

  handleRouteChangeComplete(enteringUrl: string) {
    const router = this.props.router;
    const leavingLocationInfo = this.locationHistory.current();
    const leavingUrl = leavingLocationInfo.pathname + leavingLocationInfo.search;

    if (leavingUrl !== enteringUrl) {

      if (!this.incomingRouteParams) {
        this.incomingRouteParams = {
          routeAction: 'push',
          routeDirection: 'forward',
          routeOptions: { as: router.asPath },
          tab: this.currentTab
        };
      }

      const asPathParts = router.asPath.split('?');
      const isPushed = (this.incomingRouteParams.routeAction === 'push' && this.incomingRouteParams.routeDirection === 'forward');
      this.routeInfo = {
        ...this.incomingRouteParams,
        currentRoute: router.pathname,
        lastRoute: leavingLocationInfo.currentRoute,
        pathname: asPathParts[0],
        search: asPathParts[1] ? '?' + asPathParts[1] : '',
        tab: isPushed ? leavingLocationInfo.tab : this.currentTab,
        params: router.query
      };
      if (isPushed) {
        this.routeInfo.pushedByRoute = this.currentPathname;
      } else if (this.incomingRouteParams.routeAction === 'replace' && this.currentTab !== leavingLocationInfo.tab) {
        // If we are switching tabs grab the last route info for the tab and use its pushedByRoute
        const lastRoute = this.locationHistory.getCurrentRouteInfoForTab(this.currentTab);
        this.routeInfo.pushedByRoute = lastRoute?.pushedByRoute;
      }

      this.locationHistory.updateHistory(this.routeInfo);

      this.forceUpdate();

      this.routeChangedHandlers.forEach(h => h(this.routeInfo));
    }

    this.previousPathname = this.currentPathname;
    this.currentPathname = router.pathname;
    this.routeRendered = false;
    this.incomingRouteParams = undefined;
  }

  handleNavigate(path: string, routeAction: RouteAction, routeDirection?: RouterDirection, routeOptions?: { as?: string; }) {
    this.incomingRouteParams = {
      routeAction,
      routeDirection,
      routeOptions
    };

    if (routeAction === 'push') {
      this.props.router.push(path, routeOptions?.as);
    } else {
      this.props.router.replace(path, routeOptions?.as);
    }
    this.routeRendered = true;
  }

  handleNavigateBack(path = '/') {
    const routeInfo = this.locationHistory.current();
    if (routeInfo && routeInfo.pushedByRoute) {
      const prevInfo = this.locationHistory.findLastLocation(routeInfo);
      if (prevInfo) {
        this.handleNavigate(prevInfo.currentRoute, 'pop', 'back', { as: prevInfo.routeOptions?.as });
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

  registerRouteChangeHandler(cb: (routeInfo: RouteInfo) => void) {
    this.routeChangedHandlers.push(cb);
  }

  registerSetupFirstPageHandler(cb: (routeInfo: RouteInfo) => void) {
    this.setupFirstPage = cb;
  }

  render() {
    return (
      <RouteManagerContext.Provider
        value={{
          ...this.state,
          onRouteChange: this.registerRouteChangeHandler,
          onSetupFirstPage: this.registerSetupFirstPageHandler,
          routerInfo: { ...this.routeInfo, params: this.props.router.query }
        }}
      >
        <NavManager
          pathname={this.props.router.pathname}
          routeInfo={{ ...this.routeInfo, routeOptions: { as: this.props.router.asPath } }}
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

export const IonNextRouter = withRouter(IonNextRouterInner);
