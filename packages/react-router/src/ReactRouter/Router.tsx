import { NavDirection } from '@ionic/core';
import { RouterDirection, getConfig } from '@ionic/react';
import { Action as HistoryAction, Location as HistoryLocation, UnregisterCallback } from 'history';
import React from 'react';
import { RouteComponentProps, matchPath, withRouter } from 'react-router-dom';

import { generateId, isDevMode } from '../utils';
import { LocationHistory } from '../utils/LocationHistory';

import { IonRouteAction } from './IonRouteAction';
import { IonRouteData } from './IonRouteData';
import { NavManager } from './NavManager';
import { RouteManagerContext, RouteManagerContextState } from './RouteManagerContext';
import { ViewItem } from './ViewItem';
import { ViewStack, ViewStacks } from './ViewStacks';

export interface LocationState {
  direction?: RouterDirection;
  action?: IonRouteAction;
}

interface RouteManagerProps extends RouteComponentProps<{}, {}, LocationState> {
  location: HistoryLocation<LocationState>;
}

interface RouteManagerState extends RouteManagerContextState {
  location?: HistoryLocation<LocationState>;
  action?: IonRouteAction;
}

export class RouteManager extends React.Component<RouteManagerProps, RouteManagerState> {
  listenUnregisterCallback: UnregisterCallback | undefined;
  activeIonPageId?: string;
  currentIonRouteAction?: IonRouteAction;
  currentRouteDirection?: RouterDirection;
  locationHistory = new LocationHistory();
  routes: { [key: string]: React.ReactElement<any>; } = {};
  ionPageElements: { [key: string]: HTMLElement; } = {};
  routerOutlets: { [key: string]: HTMLIonRouterOutletElement; } = {};
  firstRender = true;

  constructor(props: RouteManagerProps) {
    super(props);
    this.listenUnregisterCallback = this.props.history.listen(this.historyChange.bind(this));
    this.handleNavigate = this.handleNavigate.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.state = {
      viewStacks: new ViewStacks(),
      hideView: this.hideView.bind(this),
      setupIonRouter: this.setupIonRouter.bind(this),
      removeViewStack: this.removeViewStack.bind(this),
      syncView: this.syncView.bind(this),
      syncRoute: this.syncRoute.bind(this),
      getRoute: this.getRoute.bind(this)
    };

    this.locationHistory.add({
      hash: window.location.hash,
      key: generateId(),
      pathname: window.location.pathname,
      search: window.location.search,
      state: {}
    });
  }

  componentDidUpdate(_prevProps: RouteComponentProps, prevState: RouteManagerState) {
    // Trigger a page change if the location or action is different
    if (this.state.location && prevState.location !== this.state.location || prevState.action !== this.state.action) {
      const viewStacks = Object.assign(new ViewStacks(), this.state.viewStacks);
      this.setActiveView(this.state.location!, this.state.action!, viewStacks);
    }
  }

  componentWillUnmount() {
    if (this.listenUnregisterCallback) {
      this.listenUnregisterCallback();
    }
  }

  getRoute(id: string) {
    return this.routes[id];
  }

  hideView(viewId: string) {
    const viewStacks = Object.assign(new ViewStacks(), this.state.viewStacks);
    const { view } = viewStacks.findViewInfoById(viewId);
    if (view) {
      view.show = false;
      view.isIonRoute = false;
      view.prevId = undefined;
      view.key = generateId();
      delete this.ionPageElements[view.id];
      this.setState({
        viewStacks
      });
    }
  }

  historyChange(location: HistoryLocation<LocationState>, action: HistoryAction) {
    const ionRouteAction = this.currentIonRouteAction === 'pop' ? 'pop' : action.toLowerCase() as IonRouteAction;
    let direction = this.currentRouteDirection;

    if (ionRouteAction === 'push') {
      this.locationHistory.add(location);
    } else if (ionRouteAction === 'pop') {
      this.locationHistory.pop();
      direction = direction || 'back';
    } else if (ionRouteAction === 'replace') {
      this.locationHistory.replace(location);
      direction = 'none';
    }

    if (direction === 'root') {
      this.locationHistory.clear();
      this.locationHistory.add(location);
    }

    location.state = location.state || { direction };
    this.setState({
      location,
      action: ionRouteAction as IonRouteAction
    });
    this.currentRouteDirection = undefined;
    this.currentIonRouteAction = undefined;
  }

  setActiveView(location: HistoryLocation<LocationState>, action: IonRouteAction, viewStacks: ViewStacks) {
    let direction: RouterDirection | undefined = (location.state && location.state.direction) || 'forward';
    let leavingView: ViewItem | undefined;
    const viewStackKeys = viewStacks.getKeys();
    let shouldTransitionPage = false;
    let leavingViewHtml: string | undefined;

    viewStackKeys.forEach(key => {
      const { view: enteringView, viewStack: enteringViewStack, match } = viewStacks.findViewInfoByLocation(location, key);
      if (!enteringView || !enteringViewStack) {
        return;
      }

      leavingView = viewStacks.findViewInfoById(this.activeIonPageId).view;

      if (enteringView.isIonRoute) {
        enteringView.show = true;
        enteringView.mount = true;
        enteringView.routeData.match = match!;
        shouldTransitionPage = true;

        this.activeIonPageId = enteringView.id;

        if (leavingView) {
          if (action === 'push' && direction === 'forward') {
            /**
             * If the page is being pushed into the stack by another view,
             * record the view that originally directed to the new view for back button purposes.
             */
            enteringView.prevId = leavingView.id;
          } else if (action === 'pop' || action === 'replace') {
            leavingView.mount = false;
            this.removeOrphanedViews(enteringView, enteringViewStack);
          }

          leavingViewHtml = enteringView.id === leavingView.id ? this.ionPageElements[leavingView.id].outerHTML : undefined;
        } else {
          // If there is not a leavingView, then we shouldn't provide a direction
          direction = undefined;
        }

      } else {
        enteringView.show = true;
        enteringView.mount = true;
        enteringView.routeData.match = match!;
      }

    });

    if (leavingView) {
      if (!leavingView.isIonRoute) {
        leavingView.mount = false;
        leavingView.show = false;
      }
    }

    this.setState({
      viewStacks
    }, () => {
      if (shouldTransitionPage) {
        const { view: enteringView, viewStack } = this.state.viewStacks.findViewInfoById(this.activeIonPageId);
        if (enteringView && viewStack) {
          const enteringEl = this.ionPageElements[enteringView.id];
          const leavingEl = leavingView && this.ionPageElements[leavingView.id];
          if (enteringEl) {
            let navDirection: NavDirection | undefined;
            if (leavingEl && leavingEl.innerHTML === '') {
              // Don't animate from an empty view
              navDirection = undefined;
            } else if (direction === 'none' || direction === 'root') {
              navDirection = undefined;
            } else {
              navDirection = direction;
            }
            const shouldGoBack = !!enteringView.prevId;
            const routerOutlet = this.routerOutlets[viewStack.id];
            this.commitView(
              enteringEl!,
              leavingEl!,
              routerOutlet,
              navDirection,
              shouldGoBack,
              leavingViewHtml);
          } else if (leavingEl) {
            leavingEl.classList.add('ion-page-hidden');
            leavingEl.setAttribute('aria-hidden', 'true');
          }
        }

        // Warn if an IonPage was not eventually rendered in Dev Mode
        if (isDevMode()) {
          if (enteringView && enteringView.routeData.match!.url !== location.pathname) {
            setTimeout(() => {
              const { view } = this.state.viewStacks.findViewInfoById(this.activeIonPageId);
              if (view!.routeData.match!.url !== location.pathname) {
                console.warn('No IonPage was found to render. Make sure you wrap your page with an IonPage component.');
              }
            }, 100);
          }
        }
      }
    });
  }

  removeOrphanedViews(view: ViewItem, viewStack: ViewStack) {
    // Note: This technique is a bit wonky for views that reference each other and get into a circular loop.
    // It can still remove a view that probably shouldn't be.
    const viewsToRemove = viewStack.views.filter(v => v.prevId === view.id);
    viewsToRemove.forEach(v => {
      // Don't remove if view is currently active
      if (v.id !== this.activeIonPageId) {
        this.removeOrphanedViews(v, viewStack);

        // If view is not currently visible, go ahead and remove it from DOM
        const page = this.ionPageElements[v.id];
        if (page.classList.contains('ion-page-hidden')) {
          v.show = false;
          v.isIonRoute = false;
          v.prevId = undefined;
          v.key = generateId();
          delete this.ionPageElements[v.id];
        }
        v.mount = false;
      }
    });
  }

  setupIonRouter(id: string, children: any, routerOutlet: HTMLIonRouterOutletElement) {
    const views: ViewItem[] = [];
    let activeId: string | undefined;
    const ionRouterOutlet = React.Children.only(children) as React.ReactElement;
    React.Children.forEach(ionRouterOutlet.props.children, (child: React.ReactElement) => {
      const routeId = generateId();
      this.routes[routeId] = child;
      views.push(createViewItem(child, routeId, this.props.history.location));
    });

    this.registerViewStack(id, activeId, views, routerOutlet, this.props.location);

    function createViewItem(child: React.ReactElement<any>, routeId: string, location: HistoryLocation) {
      const viewId = generateId();
      const key = generateId();

      // const route = child;
      const matchProps = {
        exact: child.props.exact,
        path: child.props.path || child.props.from,
        component: child.props.component
      };
      const match: IonRouteData['match'] = matchPath(location.pathname, matchProps);
      const view: ViewItem<IonRouteData> = {
        id: viewId,
        key,
        routeData: {
          match,
          childProps: child.props
        },
        routeId,
        mount: true,
        show: !!match,
        isIonRoute: false
      };
      if (match && view.isIonRoute) {
        activeId = viewId;
      }
      return view;
    }
  }

  registerViewStack(stack: string, activeId: string | undefined, stackItems: ViewItem[], routerOutlet: HTMLIonRouterOutletElement, _location: HistoryLocation) {
    this.setState(prevState => {
      const prevViewStacks = Object.assign(new ViewStacks(), prevState.viewStacks);
      const newStack: ViewStack = {
        id: stack,
        views: stackItems
      };
      this.routerOutlets[stack] = routerOutlet;
      if (activeId) {
        this.activeIonPageId = activeId;
      }
      prevViewStacks.set(stack, newStack);
      return {
        viewStacks: prevViewStacks
      };
    }, () => {
      this.setupRouterOutlet(routerOutlet);
    });
  }

  async setupRouterOutlet(routerOutlet: HTMLIonRouterOutletElement) {

    const canStart = () => {
      const config = getConfig();
      const swipeEnabled = config && config.get('swipeBackEnabled', routerOutlet.mode === 'ios');
      if (swipeEnabled) {
        const { view } = this.state.viewStacks.findViewInfoById(this.activeIonPageId);
        return !!(view && view.prevId);
      } else {
        return false;
      }
    };

    const onStart = () => {
      this.navigateBack();
    };
    routerOutlet.swipeHandler = {
      canStart,
      onStart,
      onEnd: _shouldContinue => true
    };
  }

  removeViewStack(stack: string) {
    const viewStacks = Object.assign(new ViewStacks(), this.state.viewStacks);
    viewStacks.delete(stack);
    this.setState({
      viewStacks
    });
  }

  syncView(page: HTMLElement, viewId: string) {
    const viewStacks = Object.assign(new ViewStacks(), this.state.viewStacks);
    const { view } = viewStacks.findViewInfoById(viewId);
    if (view) {
      view.isIonRoute = true;
      this.ionPageElements[view.id] = page;
      this.setActiveView(this.state.location || this.props.location, this.state.action!, viewStacks);
    }
  }

  syncRoute(_id: string, routerOutlet: any) {
    const ionRouterOutlet = React.Children.only(routerOutlet) as React.ReactElement;

    React.Children.forEach(ionRouterOutlet.props.children, (child: React.ReactElement) => {
      for (const routeKey in this.routes) {
        const route = this.routes[routeKey];
        if (route.props.path === child.props.path) {
          this.routes[routeKey] = child;
        }
      }
    });
  }

  private async commitView(enteringEl: HTMLElement, leavingEl: HTMLElement, ionRouterOutlet: HTMLIonRouterOutletElement, direction?: NavDirection, showGoBack?: boolean, leavingViewHtml?: string) {
    if (!this.firstRender) {

      if (!('componentOnReady' in ionRouterOutlet)) {
        await waitUntilRouterOutletReady(ionRouterOutlet);
      }

      if ((enteringEl === leavingEl) && direction && leavingViewHtml) {
        // If a page is transitioning to another version of itself
        // we clone it so we can have an animation to show
        const newLeavingElement = clonePageElement(leavingViewHtml);
        ionRouterOutlet.appendChild(newLeavingElement);
        await ionRouterOutlet.commit(enteringEl, newLeavingElement, {
          deepWait: true,
          duration: direction === undefined ? 0 : undefined,
          direction,
          showGoBack,
          progressAnimation: false
        });
        ionRouterOutlet.removeChild(newLeavingElement);
      } else {
        await ionRouterOutlet.commit(enteringEl, leavingEl, {
          deepWait: true,
          duration: direction === undefined ? 0 : undefined,
          direction,
          showGoBack,
          progressAnimation: false
        });
      }

      if (leavingEl && (enteringEl !== leavingEl)) {
        /** add hidden attributes */
        leavingEl.classList.add('ion-page-hidden');
        leavingEl.setAttribute('aria-hidden', 'true');
      }
    } else {
      enteringEl.classList.remove('ion-page-invisible');
      enteringEl.style.zIndex = '101';
      enteringEl.dispatchEvent(new Event('ionViewWillEnter'));
      enteringEl.dispatchEvent(new Event('ionViewDidEnter'));
      this.firstRender = false;
    }
  }

  handleNavigate(ionRouteAction: IonRouteAction, path: string, direction?: RouterDirection) {
    this.currentIonRouteAction = ionRouteAction;
    switch (ionRouteAction) {
      case 'push':
        this.currentRouteDirection = direction;
        this.props.history.push(path);
        break;
      case 'pop':
        this.currentRouteDirection = direction || 'back';
        this.props.history.replace(path);
        break;
      case 'replace':
        this.currentRouteDirection = 'none';
        this.props.history.replace(path);
        break;
    }
  }

  navigateBack(defaultHref?: string) {
    const { view: leavingView } = this.state.viewStacks.findViewInfoById(this.activeIonPageId);
    if (leavingView) {
      if (leavingView.id === leavingView.prevId) {
        const previousLocation = this.locationHistory.previous();
        if (previousLocation) {
          this.handleNavigate('pop', previousLocation.pathname + previousLocation.search);
        } else {
          defaultHref && this.handleNavigate('pop', defaultHref);
        }
      } else {
        const { view: enteringView } = this.state.viewStacks.findViewInfoById(leavingView.prevId);
        if (enteringView) {
          const lastLocation = this.locationHistory.findLastLocationByUrl(enteringView.routeData.match!.url);
          if (lastLocation) {
            this.handleNavigate('pop', lastLocation.pathname + lastLocation.search);
          } else {
            this.handleNavigate('pop', enteringView.routeData.match!.url);
          }
        } else {
          const currentLocation = this.locationHistory.previous();
          if (currentLocation) {
            this.handleNavigate('pop', currentLocation.pathname + currentLocation.search);
          } else {
            if (defaultHref) {
              this.handleNavigate('pop', defaultHref);
            }
          }
        }
      }
    } else {
      if (defaultHref) {
        this.handleNavigate('replace', defaultHref, 'back');
      }
    }
  }

  render() {
    return (
      <RouteManagerContext.Provider value={this.state}>
        <NavManager
          {...this.props}
          onNavigateBack={this.navigateBack}
          onNavigate={this.handleNavigate}
        >
          {this.props.children}
        </NavManager>
      </RouteManagerContext.Provider>
    );
  }
}

function clonePageElement(leavingViewHtml: string) {
  const newEl = document.createElement('div');
  newEl.innerHTML = leavingViewHtml;
  newEl.classList.add('ion-page-hidden');
  newEl.style.zIndex = '';
  // Remove an existing back button so the new element doesn't get two of them
  const ionBackButton = newEl.getElementsByTagName('ion-back-button');
  if (ionBackButton[0]) {
    ionBackButton[0].innerHTML = '';
  }
  return newEl.firstChild as HTMLElement;
}

async function waitUntilRouterOutletReady(ionRouterOutlet: HTMLIonRouterElement) {
  if ('componentOnReady' in ionRouterOutlet) {
    return;
  } else {
    setTimeout(() => {
      waitUntilRouterOutletReady(ionRouterOutlet);
    }, 0);
  }
}

export const RouteManagerWithRouter = withRouter(RouteManager);
RouteManagerWithRouter.displayName = 'RouteManager';
