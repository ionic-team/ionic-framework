import React from 'react';
import { withRouter, RouteComponentProps, matchPath, match, RouteProps } from 'react-router';
import { generateUniqueId } from '../utils';
import { Location } from 'history';
import { IonRouterOutletInner } from '../proxies';
import { StackItem } from '../StackItem';
import { NavContext } from './NavContext';
import { StackItemManager } from './StackItemManager';

type ChildProps = RouteProps & {
  computedMatch: match<any>
}

type IonRouterOutletProps = RouteComponentProps & {
  children?: React.ReactElement<ChildProps>[] | React.ReactElement<ChildProps>;
};

type IonRouterOutletState = {
  direction?: 'forward' | 'back',
  activeId: string | undefined;
  prevActiveId: string | undefined;
  tabActiveIds: { [tab: string]: string };
  views: StackItem[];
}

type StackItem = {
  id: string;
  location: Location;
  match: match<{ tab: string }>;
  element: React.ReactElement<any>;
  prevId: string;
  mount: boolean;
}

class RouterOutlet extends React.Component<IonRouterOutletProps, IonRouterOutletState> {
  enteringItem: StackItem;
  leavingItem: StackItem;
  enteringEl: React.RefObject<HTMLDivElement> = React.createRef();
  leavingEl: React.RefObject<HTMLDivElement> = React.createRef();
  containerEl: React.RefObject<HTMLIonRouterOutletElement> = React.createRef();
  inTransition = false;

  constructor(props: IonRouterOutletProps) {
    super(props);

    this.state = {
      direction: undefined,
      activeId: undefined,
      prevActiveId: undefined,
      tabActiveIds: {},
      views: []
    };

    this.activateView = this.activateView.bind(this);
  }

  static getDerivedStateFromProps(props: IonRouterOutletProps, state: IonRouterOutletState): Partial<IonRouterOutletState> {
    const location = props.location;
    let match: StackItem['match'] = null;
    let element: StackItem['element'];

    /**
     * Remove any views that have been unmounted previously
     */
    const views = state.views.filter(x => x.mount === true);

    /**
     * Get the current active view and if the path is the same then do nothing
     */
    const activeView = views.find(v => v.id === state.activeId);

    /**
     * Look at all available paths and find the one that matches
     */
    React.Children.forEach(props.children, (child: React.ReactElement<ChildProps>) => {
      if (match == null) {
        element = child;
        match = matchPath(location.pathname, child.props);
      }
    });

    /**
     * If there are no matches then set the active view to null and exit
     */
    if (!match) {
      return {
        direction: undefined,
        activeId: undefined,
        prevActiveId: undefined
      };
    }

    /**
     * Get the active view for the tab that matches.
     * If the location matches the existing tab path then set that view as active
     */
    const id = state.tabActiveIds[match.params.tab];
    const currentActiveTabView = views.find(v => v.id === id);
    if (currentActiveTabView && currentActiveTabView.location.pathname === props.location.pathname) {
      if (currentActiveTabView.id === state.activeId) {
        /**
         * The current tab was clicked, so do nothing
         */
        return null;
      }
      /**
       * Activate a tab that is already in views
       */
      return {
        direction: undefined,
        activeId: currentActiveTabView.id,
        prevActiveId: state.activeId,
        views: views
      };
    }

    /**
     * If the new active view is a previous view, then animate it back in
     */
    if (activeView) {
      const prevActiveView = views.find(v => v.id === activeView.prevId);
      if (prevActiveView && activeView.match.params.tab === match.params.tab && prevActiveView.match.url === match.url) {
        return {
          direction: 'back',
          activeId: prevActiveView.id,
          prevActiveId: activeView.id,
          tabActiveIds: {
            ...state.tabActiveIds,
            [match.params.tab]: prevActiveView.id,
          },
          views: views.map(x => {
            if (x.id === activeView.id) {
              return {
                ...x,
                mount: false
              }
            }
            return x;
          })
        }
      }
    }

    /**
       * If the current view does not match the url, see if the view that matches the url is currently in the stack.
       * If so, show the view that matches the url and remove the current view.
       */
    if (currentActiveTabView && currentActiveTabView.location.pathname !== props.location.pathname) {
      const view = views.find(x => x.location.pathname == props.location.pathname);
      if (view && view.id === currentActiveTabView.prevId) {
        return {
          direction: undefined,
          activeId: view.id,
          prevActiveId: undefined,
          views: views.filter(x => x.id !== currentActiveTabView.id),
          tabActiveIds: {
            ...state.tabActiveIds,
            [match.params.tab]: view.id
          },
        };
      }
    }

    /**
     * Else add this new view to the stack
     */
    const viewId = generateUniqueId();
    const newState: IonRouterOutletState = {
      direction: (state.tabActiveIds[match.params.tab]) ? 'forward' : undefined,
      activeId: viewId,
      prevActiveId: state.tabActiveIds[match.params.tab] || state.activeId,
      tabActiveIds: {
        ...state.tabActiveIds,
        [match.params.tab]: viewId
      },
      views: views.concat({
        id: viewId,
        location,
        match,
        element,
        prevId: state.tabActiveIds[match.params.tab],
        mount: true
      })
    };

    return newState;
  }

  renderChild(item: StackItem) {
    const component = React.cloneElement(item.element, {
      location: item.location,
      computedMatch: item.match
    });
    return component;
  }

  goBack = (defaultHref?: string) => {
    const prevView = this.state.views.find(v => v.id === this.state.activeId);
    const newView = this.state.views.find(v => v.id === prevView.prevId);
    if (newView) {
      this.props.history.replace(newView.location.pathname || defaultHref);
    } else {
      /**
       * find the parent view based on the defaultHref and add it
       * to the views collection so that navigation works properly
       */
      let element: StackItem['element'];
      let match: StackItem['match'];
      React.Children.forEach(this.props.children, (child: React.ReactElement<ChildProps>) => {
        if (match == null) {
          element = child;
          match = matchPath(defaultHref, child.props);
        }
      });

      if (element && match) {
        const viewId = generateUniqueId();
        const parentView: StackItem = {
          id: viewId,
          location: {
            pathname: defaultHref
          } as any,
          element: element,
          match: match,
          prevId: undefined,
          mount: true
        };
        prevView.prevId = viewId;
        this.setState({
          views: [parentView, prevView]
        });
      }
      this.props.history.replace(defaultHref);
    }
  }

  activateView(el: HTMLElement) {
    /**
     * Gets called from StackItem to initialize a new view
     */
    if (!this.state.direction) {
      const leavingEl = (this.leavingEl.current != null) ? this.leavingEl.current : undefined;
      this.transitionView(el, leavingEl);
    }
  }

  transitionView(enteringEl: HTMLElement, leavingEl: HTMLElement) {
    //
    /**
     * Super hacky workaround to make sure containerEL is available
     * since activateView might be called from StackItem before IonRouterOutlet is mounted
     */
    if (this.containerEl && this.containerEl.current && this.containerEl.current.componentOnReady) {
      this.commitView(enteringEl, leavingEl);
    } else {
      setTimeout(() => {
        this.transitionView(enteringEl, leavingEl);
      }, 10);
    }
  }

  async commitView(enteringEl: HTMLElement, leavingEl: HTMLElement) {
    if (!this.inTransition) {
      this.inTransition = true;

      await this.containerEl.current.componentOnReady();
      await this.containerEl.current.commit(enteringEl, leavingEl, {
        deepWait: true,
        duration: this.state.direction === undefined ? 0 : undefined,
        direction: this.state.direction,
        showGoBack: this.state.direction === 'forward',
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

  componentDidUpdate(_prevProps: IonRouterOutletProps, prevState: IonRouterOutletState) {
    /**
     * Don't transition the view if the state didn't change
     * Probably means we are still on the same view
     */
    if (prevState !== this.state) {
      const enteringEl = (this.enteringEl.current != null) ? this.enteringEl.current : undefined;
      const leavingEl = (this.leavingEl.current != null) ? this.leavingEl.current : undefined;
      this.transitionView(enteringEl, leavingEl);
    }
  }

  render() {
    return (
      <IonRouterOutletInner ref={this.containerEl}>
        <NavContext.Provider value={{ goBack: this.goBack }}>
          {this.state.views.map((item) => {
            let props: any = {};

            if (item.id === this.state.prevActiveId) {
              props = {
                'ref': this.leavingEl
              };
            } else if (item.id === this.state.activeId) {
              props = {
                'ref': this.enteringEl,
                'className': (this.state.direction != null ? ' ion-page-invisible' : '')
              };
            } else {
              props = {
                'aria-hidden': true,
                'className': 'ion-page-hidden'
              };
            }

            return (
              <StackItemManager
                key={item.id}
                mount={item.mount}
              >
                <StackItem
                  activateView={this.activateView}
                  {...props}
                >
                  {this.renderChild(item)}
                </StackItem>
              </StackItemManager>
            );
          })}
        </NavContext.Provider>
      </IonRouterOutletInner>
    );
  }
}

export const IonRouterOutlet = /*@__PURE__*/withRouter(RouterOutlet);
