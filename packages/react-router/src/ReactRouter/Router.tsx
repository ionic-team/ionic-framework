import { NavDirection } from '@ionic/core';
import { RouterDirection, getConfig } from '@ionic/react';
import { Action as HistoryAction, Location as HistoryLocation, UnregisterCallback } from 'history';
import React from 'react';
import { RouteComponentProps, matchPath, withRouter } from 'react-router-dom';

import { generateId, isDevMode } from '../utils';
import { LocationHistory } from '../utils/LocationHistory';

import { IonRouteData } from './IonRouteData';
import { NavManager } from './NavManager';
import { RouteManagerContext, RouteManagerContextState } from './RouteManagerContext';
import { ViewItem } from './ViewItem';
import { ViewStack, ViewStacks } from './ViewStacks';

interface RouteManagerState extends RouteManagerContextState {
  location?: HistoryLocation;
  action?: HistoryAction;
}

class RouteManager extends React.Component<RouteComponentProps, RouteManagerState> {
  listenUnregisterCallback: UnregisterCallback | undefined;
  activeIonPageId?: string;
  currentDirection?: RouterDirection;
  locationHistory = new LocationHistory();

  constructor(props: RouteComponentProps) {
    super(props);
    this.listenUnregisterCallback = this.props.history.listen(this.historyChange.bind(this));
    this.handleNavigate = this.handleNavigate.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.state = {
      viewStacks: new ViewStacks(),
      hideView: this.hideView.bind(this),
      setupIonRouter: this.setupIonRouter.bind(this),
      removeViewStack: this.removeViewStack.bind(this),
      syncView: this.syncView.bind(this)
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
      this.setActiveView(this.state.location!, this.state.action!);
    }
  }

  componentWillUnmount() {
    if (this.listenUnregisterCallback) {
      this.listenUnregisterCallback();
    }
  }

  hideView(viewId: string) {
    const viewStacks = Object.assign(new ViewStacks(), this.state.viewStacks);
    const { view } = viewStacks.findViewInfoById(viewId);
    if (view) {
      view.show = false;
      view.ionPageElement = undefined;
      view.isIonRoute = false;
      view.prevId = undefined;
      view.key = generateId();
      this.setState({
        viewStacks
      });
    }
  }

  historyChange(location: HistoryLocation, action: HistoryAction) {
    location.state = location.state || { direction: this.currentDirection };
    this.currentDirection = undefined;
    if (action === 'PUSH') {
      this.locationHistory.add(location);
    } else if ((action === 'REPLACE' && location.state.direction === 'back') || action === 'POP') {
      this.locationHistory.pop();
    } else {
      this.locationHistory.replace(location);
    }
    this.setState({
      location,
      action
    });
  }

  setActiveView(location: HistoryLocation, action: HistoryAction) {
    const viewStacks = Object.assign(new ViewStacks(), this.state.viewStacks);
    let direction: RouterDirection | undefined = (location.state && location.state.direction) || 'forward';
    let leavingView: ViewItem | undefined;
    const viewStackKeys = viewStacks.getKeys();

    viewStackKeys.forEach(key => {
      const { view: stackEnteringView, viewStack: enteringViewStack, match } = viewStacks.findViewInfoByLocation(location, key);
      if (!stackEnteringView || !enteringViewStack) {
        return;
      }

      /**
       * if stackEnteringView already has a location and it is different from the current location,
       * make a fresh clone of the view and add it to the stack. This ensures that if the same view
       * is selected because the match rule has some wildcards, a separate view is created for
       * each different location matching the same view
       */
      const enteringView = (!stackEnteringView.location) || (stackEnteringView.location && stackEnteringView.location === location.pathname)
        ? stackEnteringView
        : {
          id: generateId(),
          key: generateId(),
          route: stackEnteringView.route,
          routeData: {
            ...stackEnteringView.routeData,
            match
          },
          mount: true,
          show: false,
          isIonRoute: false
        } as ViewItem<IonRouteData>;

      if (stackEnteringView !== enteringView) {
        enteringViewStack.views.push(enteringView);
      }
      enteringView.location = location.pathname;

      leavingView = viewStacks.findViewInfoById(this.activeIonPageId).view;

      if (enteringView.isIonRoute) {
        enteringView.show = true;
        enteringView.mount = true;
        enteringView.routeData.match = match!;

        this.activeIonPageId = enteringView.id;

        if (leavingView) {
          if (direction === 'forward') {
            if (action === 'PUSH') {
              /**
               * If the page is being pushed into the stack by another view,
               * record the view that originally directed to the new view for back button purposes.
               */
              enteringView.prevId = leavingView.id;
            } else if (action === 'POP') {
              direction = leavingView.prevId === enteringView.id ? 'back' : 'none';
            } else {
              direction = direction || 'back';
              leavingView.mount = false;
            }
          }
          if (direction === 'back' || action === 'REPLACE') {
            leavingView.mount = false;
            this.removeOrphanedViews(enteringView, enteringViewStack);
          }
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
      const { view: enteringView, viewStack } = this.state.viewStacks.findViewInfoById(this.activeIonPageId);
      if (enteringView && viewStack) {
        const enteringEl = enteringView.ionPageElement ? enteringView.ionPageElement : undefined;
        const leavingEl = leavingView && leavingView.ionPageElement ? leavingView.ionPageElement : undefined;
        if (enteringEl) {
          // Don't animate from an empty view
          const navDirection = leavingEl && leavingEl.innerHTML === '' ? undefined : direction === 'none' ? undefined : direction;
          const shouldGoBack = !!enteringView.prevId || !!this.locationHistory.previous();
          this.commitView(
            enteringEl!,
            leavingEl!,
            viewStack.routerOutlet,
            navDirection,
            shouldGoBack);
        } else if (leavingEl) {
          leavingEl.classList.add('ion-page-hidden');
          leavingEl.setAttribute('aria-hidden', 'true');
        }

        // Warn if an IonPage was not eventually rendered in Dev Mode
        if (isDevMode()) {
          if (enteringView.routeData.match!.url !== location.pathname) {
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
        if (v.ionPageElement!.classList.contains('ion-page-hidden')) {
          v.show = false;
          v.ionPageElement = undefined;
          v.isIonRoute = false;
          v.prevId = undefined;
          v.key = generateId();
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
      views.push(createViewItem(child, this.props.history.location));
    });

    this.registerViewStack(id, activeId, views, routerOutlet, this.props.location);

    function createViewItem(child: React.ReactElement<any>, location: HistoryLocation) {
      const viewId = generateId();
      const key = generateId();
      const route = child;
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
        route,
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
        views: stackItems,
        routerOutlet
      };
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
    const waitUntilReady = async () => {
      if (routerOutlet.componentOnReady) {
        routerOutlet.dispatchEvent(new Event('routerOutletReady'));
        return;
      } else {
        setTimeout(() => {
          waitUntilReady();
        }, 0);
      }
    };

    await waitUntilReady();

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
    this.setState(state => {
      const viewStacks = Object.assign(new ViewStacks(), state.viewStacks);
      const { view } = viewStacks.findViewInfoById(viewId);

      view!.ionPageElement = page;
      view!.isIonRoute = true;

      return {
        viewStacks
      };

    }, () => {
      this.setActiveView(this.state.location || this.props.location, this.state.action!);
    });
  }

  private async commitView(enteringEl: HTMLElement, leavingEl: HTMLElement, ionRouterOuter: HTMLIonRouterOutletElement, direction?: NavDirection, showGoBack?: boolean) {

    if (enteringEl === leavingEl) {
      return;
    }

    await ionRouterOuter.commit(enteringEl, leavingEl, {
      deepWait: true,
      duration: direction === undefined ? 0 : undefined,
      direction,
      showGoBack,
      progressAnimation: false
    });

    if (leavingEl && (enteringEl !== leavingEl)) {
      /** add hidden attributes */
      leavingEl.classList.add('ion-page-hidden');
      leavingEl.setAttribute('aria-hidden', 'true');
    }
  }

  handleNavigate(type: 'push' | 'replace', path: string, direction?: RouterDirection) {
    this.currentDirection = direction;
    if (type === 'push') {
      this.props.history.push(path);
    } else {
      this.props.history.replace(path);
    }
  }

  navigateBack(defaultHref?: string) {
    const { view: activeIonPage } = this.state.viewStacks.findViewInfoById(this.activeIonPageId);
    if (activeIonPage) {
      const { view: enteringView } = this.state.viewStacks.findViewInfoById(activeIonPage.prevId);
      if (enteringView) {
        const lastLocation = this.locationHistory.findLastLocationByUrl(enteringView.routeData.match!.url);
        if (lastLocation) {
          this.handleNavigate('replace', lastLocation.pathname + lastLocation.search, 'back');
        } else {
          this.handleNavigate('replace', enteringView.routeData.match!.url, 'back');
        }
      } else {
        const currentLocation = this.locationHistory.previous();
        if (currentLocation) {
          this.handleNavigate('replace', currentLocation.pathname + currentLocation.search, 'back');
        } else {
          if (defaultHref) {
            this.handleNavigate('replace', defaultHref, 'back');
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

export const RouteManagerWithRouter = withRouter(RouteManager);
RouteManagerWithRouter.displayName = 'RouteManager';
