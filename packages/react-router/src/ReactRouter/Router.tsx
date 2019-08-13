import { NavDirection } from '@ionic/core';
import { Action as HistoryAction, Location as HistoryLocation, UnregisterCallback } from 'history';
import React from 'react';
import { BrowserRouter, BrowserRouterProps, match, matchPath, Redirect, Route, RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { generateUniqueId } from '../utils';
import { NavManager } from './NavManager';
import { RouteManagerContext, RouteManagerContextState, ViewStack, ViewStacks } from './RouteManagerContext';
import { ViewItem } from './ViewItem';

interface RouterManagerProps extends RouteComponentProps { }

interface RouteManagerState extends RouteManagerContextState { }

interface IonRouteData {
  match: match<{ tab: string }> | null;
  childProps: RouteProps;
}

class RouteManager extends React.Component<RouterManagerProps, RouteManagerState> {
  listenUnregisterCallback: UnregisterCallback | undefined;
  activeViewId?: string;
  prevViewId?: string;

  constructor(props: RouterManagerProps) {
    super(props);
    this.listenUnregisterCallback = this.props.history.listen(this.historyChange.bind(this));
    this.state = {
      viewStacks: {},
      hideView: this.hideView.bind(this),
      setupIonRouter: this.setupIonRouter.bind(this),
      removeViewStack: this.removeViewStack.bind(this),
      renderChild: this.renderChild.bind(this),
      transitionView: this.transitionView.bind(this)
    };
  }

  hideView(viewId: string) {
    const viewStacks = Object.assign({}, this.state.viewStacks);
    const { view } = this.findViewInfoById(viewId, viewStacks);
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

  findViewInfoByLocation(location: HistoryLocation, viewStacks: ViewStacks) {
    let view: ViewItem<IonRouteData> | undefined;
    let match: IonRouteData["match"] | null | undefined;
    let viewStack: ViewStack | undefined;
    const keys = Object.keys(viewStacks);
    keys.some(key => {
      const vs = viewStacks[key];
      return vs.views.some(x => {
        const matchProps = {
          exact: x.routeData.childProps.exact,
          path: x.routeData.childProps.path || x.routeData.childProps.from,
          component: x.routeData.childProps.component
        };
        match = matchPath(location.pathname, matchProps)
        if (match) {
          view = x;
          viewStack = vs;
          return true;
        }
        return false;
      });
    })

    const result = { view, viewStack, match };
    return result;
  }

  findViewInfoById(id: string, viewStacks: ViewStacks) {
    let view: ViewItem<IonRouteData> | undefined;
    let viewStack: ViewStack | undefined;
    const keys = Object.keys(viewStacks);
    keys.some(key => {
      const vs = viewStacks[key];
      view = vs.views.find(x => x.id === id);
      if (view) {
        viewStack = vs;
        return true;
      } else {
        return false;
      }
    });
    return { view, viewStack };
  }

  setActiveView(location: HistoryLocation, action: HistoryAction) {
    const viewStacks = Object.assign({}, this.state.viewStacks);
    const { view: enteringView, viewStack: enteringViewStack, match } = this.findViewInfoByLocation(location, viewStacks);
    let direction: NavDirection = location.state && location.state.direction;

    if (!enteringViewStack) {
      return;
    }

    const { view: leavingView } = this.findViewInfoById(this.activeViewId!, viewStacks);

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
      this.activeViewId = enteringView.id;

      if (leavingView) {
        this.prevViewId = leavingView.id
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
        if(leavingView.element.type === Redirect) {
          leavingView.mount = false;
          leavingView.show = false;
        }


        if (leavingView.element.type === Route && leavingView.element.props.render) {
          if (leavingView.element.props.render().type === Redirect) {
            leavingView.mount = false;
            leavingView.show = false;
          }
        } else if (leavingView.element.type === Redirect) {
          leavingView.mount = false;
          leavingView.show = false;
        }
      }

      this.setState({
        viewStacks
      }, () => {
        const enteringEl = enteringView.ref && enteringView.ref.current ? enteringView.ref.current : undefined;
        const leavingEl = leavingView && leavingView.ref && leavingView.ref.current ? leavingView.ref.current : undefined;
        this.transitionView(
          enteringEl!,
          leavingEl!,
          enteringViewStack.routerOutlet,
          leavingEl && leavingEl.innerHTML !== '' ? direction : undefined!) // Don't animate from an empty view
      });
    }
  }

  componentWillUnmount() {
    this.listenUnregisterCallback && this.listenUnregisterCallback();
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
      const viewId = generateUniqueId();
      const key = generateUniqueId();
      const element = child;
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
        element,
        mount: true,
        show: !!match,
        ref: React.createRef()
      };
      if (!!match) {
        activeId = viewId;
      };
      return view;
    }
  }

  registerViewStack(stack: string, activeId: string | undefined, stackItems: ViewItem[], routerOutlet: HTMLIonRouterOutletElement, location: HistoryLocation) {
    this.setState((prevState) => {
      const prevViewStacks = Object.assign({}, prevState.viewStacks);
      prevViewStacks[stack] = {
        activeId: activeId,
        views: stackItems,
        routerOutlet
      };
      return {
        viewStacks: prevViewStacks
      };
    }, () => {
      const { view: activeView } = this.findViewInfoById(activeId!, this.state.viewStacks);

      if (activeView) {
        this.prevViewId = this.activeViewId;
        this.activeViewId = activeView.id;
        const direction = location.state && location.state.direction;
        const { view: prevView } = this.findViewInfoById(this.prevViewId!, this.state.viewStacks);
        this.transitionView(
          activeView.ref!.current!,
          prevView && prevView.ref!.current || undefined!,
          routerOutlet,
          direction);
      }
    });
  };

  removeViewStack(stack: string) {
    const viewStacks = Object.assign({}, this.state.viewStacks);
    delete viewStacks[stack];
    this.setState({
      viewStacks
    });
  }

  renderChild(item: ViewItem<IonRouteData>) {
    const component = React.cloneElement(item.element, {
      computedMatch: item.routeData.match
    });
    return component;
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

  transitionView(enteringEl: HTMLElement, leavingEl: HTMLElement, ionRouterOuter: HTMLIonRouterOutletElement, direction: NavDirection) {
    /**
     * Super hacky workaround to make sure ionRouterOutlet is available
     * since transitionView might be called before IonRouterOutlet is fully mounted
     */
    if (ionRouterOuter && ionRouterOuter.componentOnReady) {
      this.commitView(enteringEl, leavingEl, ionRouterOuter, direction);
    } else {
      setTimeout(() => {
        this.transitionView(enteringEl, leavingEl, ionRouterOuter, direction);
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
          findViewInfoById={(id: string) => this.findViewInfoById(id, this.state.viewStacks)}
          findViewInfoByLocation={(location: HistoryLocation) => this.findViewInfoByLocation(location, this.state.viewStacks)}
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
