import React from 'react';
import { withRouter, RouteComponentProps, matchPath, match, Redirect } from 'react-router-dom';
import { UnregisterCallback, Action as HistoryAction, Location as HistoryLocation } from 'history';
import { NavContext, NavContextState, ViewStacks, ViewStack } from './NavContext';
import { ViewItem } from './ViewItem';
import { NavDirection } from '@ionic/core';
import { generateUniqueId } from '../utils';

interface IonRouterProps extends RouteComponentProps { }
interface IonRouterState extends NavContextState { }

class IonRouter extends React.Component<IonRouterProps, IonRouterState> {
  listenUnregisterCallback: UnregisterCallback;
  activeViewId?: string;
  prevViewId?: string;

  constructor(props: IonRouterProps) {
    super(props);
    this.state = {
      viewStacks: {},
      hideView: this.hideView.bind(this),
      registerViewStack: this.registerView.bind(this),
      removeViewStack: this.removeViewStack.bind(this),
      goBack: this.goBack.bind(this),
      transitionView: this.transitionView.bind(this)
    };
  }

  componentWillMount() {
    this.listenUnregisterCallback = this.props.history.listen(this.historyChange.bind(this));
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
    let view: ViewItem;
    let match: match<{ tab: string }>;
    let viewStack: ViewStack;
    const keys = Object.keys(viewStacks);
    keys.some(key => {
      const vs = viewStacks[key];
      return vs.views.some(x => {
        match = matchPath(location.pathname, x.childProps)
        if (match) {
          view = x;
          viewStack = vs;
          return true;
        }
        return false;
      });
    })

    const result: { view: ViewItem, viewStack: ViewStack, match: ViewItem['match'] } = { view, viewStack, match };
    return result;
  }

  findViewInfoById(id: string, viewStacks: ViewStacks) {
    let view: ViewItem;
    let viewStack: ViewStack;
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

    const { view: leavingView } = this.findViewInfoById(this.activeViewId, viewStacks);

    if (leavingView && leavingView.match.url === location.pathname) {
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
      enteringView.match = match;
      enteringViewStack.activeId = enteringView.id;
      this.activeViewId = enteringView.id;

      if (leavingView) {
        this.prevViewId = leavingView.id
        if (leavingView.match.params.tab === enteringView.match.params.tab) {
          if (action === 'PUSH') {
            direction = direction || 'forward';
          } else {
            direction = direction || 'back';
            leavingView.mount = false;
          }
        }
        /**
         * Attempt to determine if the leaving view is a route redirect.
         * If it is, take it out of the rendering phase.
         * We assume Routes with render props are redirects, because of this users should not use
         * the render prop for non redirects, and instead provide a component in its place.
         */
        if(leavingView.element.type === Redirect || leavingView.element.props.render) {
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
          enteringEl,
          leavingEl,
          enteringViewStack.routerOutlet,
          direction);
      });
    }
  }

  componentWillUnmount() {
    this.listenUnregisterCallback();
  }

  registerView(stack: string, activeId: string, stackItems: ViewItem[], routerOutlet: HTMLIonRouterOutletElement, location: HistoryLocation) {
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
      const { view: activeView } = this.findViewInfoById(activeId, this.state.viewStacks);

      if (activeView) {
        this.prevViewId = this.activeViewId;
        this.activeViewId = activeView.id;
        const direction = location.state && location.state.direction;
        const { view: prevView } = this.findViewInfoById(this.prevViewId, this.state.viewStacks);
        this.transitionView(
          activeView.ref.current,
          prevView && prevView.ref.current || undefined,
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

  findActiveView(views: ViewItem[]) {
    let view: ViewItem | undefined;
    views.some(x => {
      const match = matchPath(this.props.location.pathname, x.childProps)
      if (match) {
        view = x;
        return true;
      }
      return false;
    });
    return view;
  }

  goBack = (defaultHref?: string) => {
    const { view: leavingView } = this.findViewInfoByLocation(this.props.location, this.state.viewStacks);
    if (leavingView) {
      const { view: enteringView } = this.findViewInfoById(leavingView.prevId, this.state.viewStacks);
      if (enteringView) {
        this.props.history.replace(enteringView.match.url, { direction: 'back' });
      } else {
        this.props.history.replace(defaultHref, { direction: 'back' });
      }
    } else {
      this.props.history.replace(defaultHref, { direction: 'back' });
    }
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
    await ionRouterOuter.componentOnReady();
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
      <NavContext.Provider value={this.state}>
        {this.props.children}
      </NavContext.Provider>
    );
  }
};

export const IonRouterWrapped = withRouter(IonRouter);
