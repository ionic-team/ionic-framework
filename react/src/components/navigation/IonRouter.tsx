import React from 'react';
import { withRouter, RouteComponentProps, matchPath, match } from 'react-router-dom';
import { UnregisterCallback, Action as HistoryAction, Location as HistoryLocation } from 'history';
import { NavContext, NavContextState, ViewStacks, ViewStack } from './NavContext';
import { StackItem } from './StackItem';
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
      goBack: this.goBack.bind(this),
      transitionView: this.transitionView.bind(this)
    };
  }

  componentWillMount() {
    this.listenUnregisterCallback = this.props.history.listen(this.historyChange.bind(this));
  }

  hideView(viewId: string) {
    const viewStacks = Object.assign({}, this.state.viewStacks);
    const { view } = this.findViewById(viewId, viewStacks);
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
    let view: StackItem;
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

    const result: { view: StackItem, viewStack: ViewStack, match: StackItem['match'] } = { view, viewStack, match };
    return result;
  }

  findViewById(id: string, viewStacks: ViewStacks) {
    let view: StackItem;
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
    const { view: enteringView, viewStack, match } = this.findViewInfoByLocation(location, viewStacks);

    let direction: NavDirection = location.state && location.state.direction;

    if (!viewStack) {
      return;
    }

    const { view: leavingView } = this.findViewById(this.activeViewId, viewStacks);

    // if (leavingView && leavingView.match.url === location.pathname) {
    //   return;
    // }

    if (enteringView) {
      enteringView.show = true;
      enteringView.show = true;
      enteringView.match = match;
      viewStack.activeId = enteringView.id;
      this.activeViewId = enteringView.id;

      if (leavingView) {
        viewStack.prevId = leavingView.id;
        this.prevViewId = leavingView.id
        if(leavingView.match.params.tab === enteringView.match.params.tab) {
          if (action === 'PUSH') {
            direction = direction || 'forward';
          } else {
            direction = direction || 'back';
            leavingView.mount = false;
          }
        }
      }

      this.setState({
        viewStacks
      }, () => {
        const enteringEl = enteringView.ref && enteringView.ref.current ? enteringView.ref.current : undefined;
        const leavingEl = leavingView.ref && leavingView.ref.current ? leavingView.ref.current : undefined;
        this.transitionView(enteringEl, leavingEl, viewStack.routerOutlet, direction);
      });
    }
  }

  componentWillUnmount() {
    this.listenUnregisterCallback();
  }

  registerView(stack: string, activeId: string, stackItems: StackItem[], routerOutlet: HTMLIonRouterOutletElement, location: HistoryLocation) {
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
      const { view: activeView } = this.findViewById(activeId, this.state.viewStacks);
      if (activeView) {
        this.prevViewId = this.activeViewId;
        this.activeViewId = activeView.id;
        const direction = location.state ? location.state.direction : undefined;
        if (direction) {
          const { view: prevView } = this.findViewById(this.prevViewId, this.state.viewStacks);
          this.transitionView(activeView.ref.current, prevView && prevView.ref.current || undefined, routerOutlet, direction);
        } else {
          this.transitionView(activeView.ref.current, undefined, routerOutlet, undefined);
        }
      }
    });
  };

  findActiveView(views: StackItem[]) {
    let view: StackItem | undefined;
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
    const { viewStack } = this.findViewInfoByLocation(this.props.location, this.state.viewStacks);
    const { view: newView } = this.findViewById(viewStack.prevId, this.state.viewStacks);
    if (newView) {
      this.props.history.replace(newView.match.url, { direction: 'back' });
    } else {
      this.props.history.replace(defaultHref, { direction: 'back' });
    }
  }

  transitionView(enteringEl: HTMLElement, leavingEl: HTMLElement, ionRouterOuter: HTMLIonRouterOutletElement, direction: NavDirection) {
    /**
     * Super hacky workaround to make sure ionRouterOuter is available
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

    if (leavingEl) {
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
