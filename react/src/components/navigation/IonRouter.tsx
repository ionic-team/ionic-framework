import React from 'react';
import { withRouter, RouteComponentProps, matchPath, match } from 'react-router-dom';
import { UnregisterCallback, Action as HistoryAction, Location as HistoryLocation } from 'history';
import { NavContext, NavContextState, ViewStack, ViewStacks } from './NavContext';
import { StackItem } from './StackItem';
import { NavDirection } from '@ionic/core';
import { generateUniqueId } from '../utils';
// import { generateUniqueId } from '../utils';

interface IonRouterProps extends RouteComponentProps { }
interface IonRouterState extends NavContextState { }

class IonRouter extends React.Component<IonRouterProps, IonRouterState> {
  listenUnregisterCallback: UnregisterCallback;
  inTransition = false;

  constructor(props: IonRouterProps) {
    super(props);
    this.state = {
      viewStacks: {},
      hideView: this.hideView.bind(this),
      registerView: this.registerView.bind(this),
      goBack: this.goBack.bind(this),
      transitionView: this.transitionView.bind(this)
    };
  }

  componentWillMount() {
    this.listenUnregisterCallback = this.props.history.listen(this.historyChange.bind(this));
  }

  hideView(viewId: string) {
    const viewStacks = Object.assign({}, this.state.viewStacks);
    const view = this.findViewById(viewId, viewStacks);
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

  findViewByLocation(location: HistoryLocation, viewStack: ViewStack) {
    let view: StackItem;
    let match: match<{ tab: string }>;
    viewStack.views.some(x => {
      match = matchPath(location.pathname, x.childProps)
      view = x;
      if (match) {
        return true;
      }
      return false;
    });
    const result: [StackItem, match<{ tab: string }>] = [view, match];
    return result;
  }

  findViewById(id: string, viewStacks: ViewStacks) {
    const view = viewStacks['abc'].views.find(x => x.id === id);
    return view;
  }

  setActiveView(location: HistoryLocation, action: HistoryAction) {
    const viewStacks = Object.assign({}, this.state.viewStacks);
    const viewStack = viewStacks['abc'];
    const leavingView = this.findViewById(viewStack.activeId, viewStacks);
    if (leavingView.match.url === location.pathname) {
      return;
    }
    let direction: NavDirection;
    const [enteringView, match] = this.findViewByLocation(location, viewStack);
    if (enteringView) {

      enteringView.show = true;
      enteringView.mount = true;
      enteringView.match = match;

      if (enteringView.match.params.tab === leavingView.match.params.tab) {
        if(action === 'PUSH') {
          direction = 'forward';
        } else {
          direction = 'back';
          leavingView.mount = false;
        }
      }

      viewStack.activeId = enteringView.id;
      viewStack.prevId = leavingView.id;

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

  registerView(stack: string, activeId: string, stackItems: StackItem[], routerOutlet: HTMLIonRouterOutletElement) {
    const viewStacks = Object.assign({}, this.state.viewStacks);
    if (viewStacks[stack]) {
      viewStacks[stack] = {
        activeId,
        views: viewStacks[stack].views.concat(stackItems),
        routerOutlet
      };
    } else {
      viewStacks[stack] = {
        activeId,
        views: stackItems,
        routerOutlet
      };
    }
    this.setState({
      viewStacks: viewStacks
    }, () => {
      const view = this.findViewById(activeId, viewStacks);
      this.transitionView(view.ref.current, undefined, routerOutlet, undefined);
    });
  };

  goBack = (defaultHref?: string) => {
    this.props.history.replace(defaultHref);
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
    if (!this.inTransition) {
      this.inTransition = true;

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
      this.inTransition = false;
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
