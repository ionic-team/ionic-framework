import { NavDirection } from '@ionic/core';
import { Action as HistoryAction, Location as HistoryLocation, UnregisterCallback } from 'history';
import React from 'react';
import { BrowserRouter, BrowserRouterProps, matchPath, Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { generateUniqueId } from '../utils';
import { IonRouteData } from './IonRouteData';
import { NavManager } from './NavManager';
import { RouteManagerContext, RouteManagerContextState } from './RouteManagerContext';
import { ViewItem } from './ViewItem';
import { ViewStacks } from './ViewStacks';

interface RouterManagerProps extends RouteComponentProps { }

interface RouteManagerState extends RouteManagerContextState { }

class RouteManager extends React.Component<RouterManagerProps, RouteManagerState> {
  listenUnregisterCallback: UnregisterCallback | undefined;

  constructor(props: RouterManagerProps) {
    super(props);
    this.listenUnregisterCallback = this.props.history.listen(this.historyChange.bind(this));
    this.state = {
      viewStacks: new ViewStacks(),
      hideView: this.hideView.bind(this),
      setupIonRouter: this.setupIonRouter.bind(this),
      removeViewStack: this.removeViewStack.bind(this),
      syncView: this.syncView.bind(this),
      transitionView: this.transitionView.bind(this)
    };
  }

  hideView(viewId: string) {
    const viewStacks = Object.assign(new ViewStacks(), this.state.viewStacks);
    const { view } = viewStacks.findViewInfoById(viewId);
    if (view) {
      view.show = false;
      view.key = generateUniqueId();
      this.setState({
        viewStacks
      });
    }
  }

  historyChange(location: HistoryLocation, action: HistoryAction) {
    this.setActiveView(location, action);
  }

  setActiveView(location: HistoryLocation, action: HistoryAction) {
    const viewStacks = Object.assign(new ViewStacks(), this.state.viewStacks);
    const { view: enteringView, viewStack: enteringViewStack, match } = viewStacks.findViewInfoByLocation(location);
    let direction: NavDirection = location.state && location.state.direction;

    if (!enteringViewStack) {
      return;
    }

    const { view: leavingView } = viewStacks.findViewInfoById(enteringViewStack.activeId!);

    if (leavingView && leavingView.routeData.match!.url === location.pathname) {
      return;
    }

    if (enteringView) {
      /**
       * If the page is being pushed into the stack by another view,
       * record the view that originally directed to the new view for back button purposes.
       */
      if (!enteringView.show && action === 'PUSH') {
        enteringView.prevId = leavingView && leavingView.id;
      }

      enteringView.show = true;
      enteringView.mount = true;
      enteringView.routeData.match = match!;
      enteringViewStack.activeId = enteringView.id;

      if (leavingView) {
        if (leavingView.routeData.match!.params.tab === enteringView.routeData.match.params.tab) {
          if (action === 'PUSH') {
            direction = direction || 'forward';
          } else {
            direction = direction || 'back';
            leavingView.mount = false;
          }
        }
        /**
         * If the leaving view is a Redirect, take it out of the rendering phase.
         */
        if (leavingView.route.type === Redirect) {
          leavingView.mount = false;
          leavingView.show = false;
        }


        if (leavingView.route.type === Route && leavingView.route.props.render) {
          if (leavingView.route.props.render().type === Redirect) {
            leavingView.mount = false;
            leavingView.show = false;
          }
        } else if (leavingView.route.type === Redirect) {
          leavingView.mount = false;
          leavingView.show = false;
        }
      }

      this.setState({
        viewStacks
      }, () => {
        const enteringEl = enteringView.ionPageElement ? enteringView.ionPageElement : undefined;
        const leavingEl = leavingView && leavingView.ionPageElement ? leavingView.ionPageElement : undefined;
        if (enteringEl) {
          this.transitionView(
            enteringEl!,
            leavingEl!,
            enteringViewStack.routerOutlet,
            leavingEl && leavingEl.innerHTML !== '' ? direction : undefined!) // Don't animate from an empty view
        } else if (leavingEl) {
          leavingEl.classList.add('ion-page-hidden');
          leavingEl.setAttribute('aria-hidden', 'true');
        }
      });
    }
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
        show: !!match
      };
      if (!!match) {
        activeId = viewId;
      };
      return view;
    }
  }

  async registerViewStack(stack: string, activeId: string | undefined, stackItems: ViewItem[], routerOutlet: HTMLIonRouterOutletElement, _location: HistoryLocation) {

    return new Promise((resolve) => {
      this.setState((prevState) => {
        const prevViewStacks = Object.assign(new ViewStacks, prevState.viewStacks);
        const newStack = {
          id: stack,
          activeId: activeId,
          views: stackItems,
          routerOutlet,
        };
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
    const { viewStack, view } = this.state.viewStacks.findViewInfoById(viewId);

    if (!viewStack || !view) {
      return;
    }

    view.ionPageElement = page;

    if (viewStack.activeId === view.id && !view.prevId) {
      this.transitionView(view.ionPageElement, undefined!, viewStack.routerOutlet, undefined!);
    }

  }

  findActiveView(views: ViewItem[]) {
    let view: ViewItem<IonRouteData> | undefined;
    views.some(x => {
      const match = matchPath(this.props.location.pathname, x.routeData.childProps)
      if (match) {
        view = x;
        return true;
      }
      return false;
    });
    return view;
  }

  transitionView(enteringEl: HTMLElement, leavingEl: HTMLElement, ionRouterOutlet: HTMLIonRouterOutletElement, direction: NavDirection) {
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

  private async commitView(enteringEl: HTMLElement, leavingEl: HTMLElement, ionRouterOuter: HTMLIonRouterOutletElement, direction: NavDirection) {
    await ionRouterOuter.commit(enteringEl, leavingEl, {
      deepWait: true,
      duration: direction === undefined ? 0 : undefined,
      direction: direction,
      showGoBack: direction === 'forward',
      progressAnimation: false
    });

    if (leavingEl && (enteringEl !== leavingEl)) {
      /**
       *  add hidden attributes
      */
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
