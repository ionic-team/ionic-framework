import { NavDirection } from '@ionic/core';
import { RouterDirection } from '@ionic/react';
import { Action as HistoryAction, Location as HistoryLocation, UnregisterCallback } from 'history';
import React from 'react';
import { BrowserRouter, BrowserRouterProps, matchPath, RouteComponentProps, withRouter } from 'react-router-dom';
import { generateUniqueId } from '../utils';
import { IonRouteData } from './IonRouteData';
import { NavManager } from './NavManager';
import { RouteManagerContext, RouteManagerContextState } from './RouteManagerContext';
import { ViewItem } from './ViewItem';
import { ViewStacks, ViewStack } from './ViewStacks';


interface RouteManagerProps extends RouteComponentProps { }

interface RouteManagerState extends RouteManagerContextState {
  location?: HistoryLocation,
  action?: HistoryAction
}

class RouteManager extends React.Component<RouteManagerProps, RouteManagerState> {
  listenUnregisterCallback: UnregisterCallback | undefined;
  activeIonPageId?: string;

  constructor(props: RouteManagerProps) {
    super(props);
    this.listenUnregisterCallback = this.props.history.listen(this.historyChange.bind(this));
    this.state = {
      viewStacks: new ViewStacks(),
      hideView: this.hideView.bind(this),
      setupIonRouter: this.setupIonRouter.bind(this),
      removeViewStack: this.removeViewStack.bind(this),
      syncView: this.syncView.bind(this),
      transitionView: this.transitionView.bind(this),
    };
  }

  componentDidUpdate(_prevProps: RouteManagerProps, prevState: RouteManagerState) {
    // Trigger a page change if the location or action is different
    if (this.state.location && prevState.location !== this.state.location || prevState.action !== this.state.action) {
      this.setActiveView(this.state.location!, this.state.action!);
    }
  }

  hideView(viewId: string) {
    const viewStacks = Object.assign(new ViewStacks(), this.state.viewStacks);
    const { view } = viewStacks.findViewInfoById(viewId);
    if (view) {
      view.show = false;
      view.ionPageElement = undefined;
      view.isIonRoute = false;
      view.key = generateUniqueId();
      this.setState({
        viewStacks
      });
    }
  }

  historyChange(location: HistoryLocation, action: HistoryAction) {
    this.setState({
      location,
      action
    })
  }

  setActiveView(location: HistoryLocation, action: HistoryAction) {
    const viewStacks = Object.assign(new ViewStacks(), this.state.viewStacks);
    let direction: RouterDirection = location.state && location.state.direction || 'forward';
    let leavingView: ViewItem | undefined;
    const viewStackKeys = viewStacks.getKeys();

    viewStackKeys.forEach(key => {
      const { view: enteringView, viewStack: enteringViewStack, match } = viewStacks.findViewInfoByLocation(location, key);
      if (!enteringView || !enteringViewStack) {
        return;
      }
      leavingView = viewStacks.findViewInfoById(this.activeIonPageId).view;

      if (leavingView && leavingView.routeData.match!.url === location.pathname) {
        return;
      }

      if (enteringView) {

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
              } else {
                direction = direction || 'back';
                leavingView.mount = false;
              }
            } else if (action === 'REPLACE') {
              leavingView.mount = false;
            }
          }
        } else {
          enteringView.show = true;
          enteringView.mount = true;
          enteringView.routeData.match = match!;
        }
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
      const { view: enteringView, viewStack } = this.state.viewStacks.findViewInfoById(this.activeIonPageId)
      if (enteringView && viewStack) {
        const enteringEl = enteringView.ionPageElement ? enteringView.ionPageElement : undefined;
        const leavingEl = leavingView && leavingView.ionPageElement ? leavingView.ionPageElement : undefined;

        if (enteringEl) {
          // Don't animate from an empty view
          const navDirection = leavingEl && leavingEl.innerHTML === '' ? undefined : direction === 'none' ? undefined : direction;
          this.transitionView(
            enteringEl!,
            leavingEl!,
            viewStack.routerOutlet,
            navDirection)
        } else if (leavingEl) {
          leavingEl.classList.add('ion-page-hidden');
          leavingEl.setAttribute('aria-hidden', 'true');
        }
      }
    });
  }

  componentWillUnmount() {
    this.listenUnregisterCallback && this.listenUnregisterCallback();
  }

  async setupIonRouter(id: string, children: any, routerOutlet: HTMLIonRouterOutletElement) {
    const views: ViewItem[] = [];
    let activeId: string | undefined;
    const ionRouterOutlet = React.Children.only(children) as React.ReactElement;
    React.Children.forEach(ionRouterOutlet.props.children, (child: React.ReactElement) => {
      views.push(createViewItem(child, this.props.history.location));
    });

    await this.registerViewStack(id, activeId, views, routerOutlet, this.props.location);

    function createViewItem(child: React.ReactElement<any>, location: HistoryLocation) {
      const viewId = generateUniqueId();
      const key = generateUniqueId();
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
        route: route,
        mount: true,
        show: !!match,
        isIonRoute: false
      };
      if (!!match && view.isIonRoute) {
        activeId = viewId;
      };
      return view;
    }
  }

  async registerViewStack(stack: string, activeId: string | undefined, stackItems: ViewItem[], routerOutlet: HTMLIonRouterOutletElement, _location: HistoryLocation) {

    return new Promise((resolve) => {
      this.setState((prevState) => {
        const prevViewStacks = Object.assign(new ViewStacks, prevState.viewStacks);
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
        resolve();
      });
    });
  };

  removeViewStack(stack: string) {
    const viewStacks = Object.assign(new ViewStacks(), this.state.viewStacks);
    viewStacks.delete(stack);
    this.setState({
      viewStacks
    });
  }

  syncView(page: HTMLElement, viewId: string) {
    this.setState((state) => {

      const viewStacks = Object.assign(new ViewStacks(), state.viewStacks);
      const { view } = viewStacks.findViewInfoById(viewId);

      view!.ionPageElement = page;
      view!.isIonRoute = true;

      return {
        viewStacks
      }

    }, () => {
      this.setActiveView(this.state.location || this.props.location, this.state.action!);
    })
  }

  transitionView(enteringEl: HTMLElement, leavingEl: HTMLElement, ionRouterOutlet: HTMLIonRouterOutletElement, direction?: NavDirection) {
    /**
     * Super hacky workaround to make sure ionRouterOutlet is available
     * since transitionView might be called before IonRouterOutlet is fully mounted
     */
    if (ionRouterOutlet && ionRouterOutlet.componentOnReady) {
      this.commitView(enteringEl, leavingEl, ionRouterOutlet, direction);
    } else {
      setTimeout(() => {
        this.transitionView(enteringEl, leavingEl, ionRouterOutlet, direction);
      }, 10);
    }
  }

  private async commitView(enteringEl: HTMLElement, leavingEl: HTMLElement, ionRouterOuter: HTMLIonRouterOutletElement, direction?: NavDirection) {

    if (enteringEl === leavingEl) {
      return;
    }

    await ionRouterOuter.commit(enteringEl, leavingEl, {
      deepWait: true,
      duration: direction === undefined ? 0 : undefined,
      direction: direction,
      showGoBack: direction === 'forward',
      progressAnimation: false
    });

    if (leavingEl && (enteringEl !== leavingEl)) {
      /** add hidden attributes */
      leavingEl.classList.add('ion-page-hidden');
      leavingEl.setAttribute('aria-hidden', 'true');
    }
  }

  render() {
    return (
      <RouteManagerContext.Provider value={this.state}>
        <NavManager {...this.props}
          findViewInfoById={(id: string) => this.state.viewStacks.findViewInfoById(id)}
          findViewInfoByLocation={(location: HistoryLocation) => this.state.viewStacks.findViewInfoByLocation(location)}
          getActiveIonPage={() => this.state.viewStacks.findViewInfoById(this.activeIonPageId)}
        >
          {this.props.children}
        </NavManager>
      </RouteManagerContext.Provider>
    );
  }
};

const RouteManagerWithRouter = withRouter(RouteManager);
RouteManagerWithRouter.displayName = 'RouteManager';

export class IonReactRouter extends React.Component<BrowserRouterProps> {
  render() {
    const { children, ...props } = this.props;
    return (
      <BrowserRouter {...props}>
        <RouteManagerWithRouter>{children}</RouteManagerWithRouter>
      </BrowserRouter>
    );
  }
}
