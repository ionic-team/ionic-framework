import React, { Component } from 'react';
import { withRouter, RouteComponentProps, matchPath, match, RouteProps } from 'react-router';
import { generateUniqueId } from '../utils';
import { Location } from 'history';
import { IonRouterOutletInner } from '../index';
import StackItem from '../StackItem';
import { NavContext } from './NavContext';
import StackItemManager from './StackItemManager';

interface ChildProps extends RouteProps {
  computedMatch: match<any>
}

interface IonRouterOutletProps extends RouteComponentProps {
  children?: React.ReactElement<ChildProps>[] | React.ReactElement<ChildProps>;
};

interface StackItem {
  id: string;
  location: Location;
  match: match<{ tab: string }>;
  element: React.ReactElement<any>;
  prevId: string;
  mount: boolean;
}

interface IonRouterOutletState {
  direction?: 'forward' | 'back',
  activeId: string | undefined;
  prevActiveId: string | undefined;
  tabActiveIds: { [tab: string]: string };
  views: StackItem[];
}

class RouterOutlet extends Component<IonRouterOutletProps, IonRouterOutletState> {
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
     * Note: shouldn't ever happen
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
         * If the same tab was already clicked
         */
        return null;
      }
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
      /**
       * Super hacky workaround to make sure containerEL is available
       * since activateView might be called from StackItem before IonRouterOutlet is mounted
       */
      if (this.containerEl.current) {
        this.commitView(el, leavingEl);
      } else {
        setTimeout(() => {
          this.activateView(el);
        }, 10);
      }
    }
  }

  async commitView(el: HTMLElement, leavingEl: HTMLElement) {
    if (!this.inTransition) {
      this.inTransition = true;
      await this.containerEl.current.componentOnReady();
      await this.containerEl.current.commit(el, leavingEl, {
        deepWait: true,
        duration: this.state.direction === undefined ? 0 : undefined,
        direction: this.state.direction,
        showGoBack: !!leavingEl,
        progressAnimation: false
      });

      if (leavingEl) {
        /**
         *  add hidden class back since core seems to remove it
        */
        leavingEl.classList.add('ion-page-hidden');
      }
      this.inTransition = false;
    }
  }

  componentDidUpdate() {
    const enteringEl = (this.enteringEl.current != null) ? this.enteringEl.current : undefined;
    const leavingEl = (this.leavingEl.current != null) ? this.leavingEl.current : undefined;
    this.commitView(enteringEl, leavingEl);
  }

  render() {
    return (
      <IonRouterOutletInner ref={this.containerEl}>
        <NavContext.Provider value={{ goBack: this.goBack }}>
          {this.state.views.map((item) => {
            let props: any = {};

            if (item.id === this.state.prevActiveId) {
              props = {
                'ref': this.leavingEl,
                'hidden': this.state.direction === 'forward',
                'className': (this.state.direction === 'forward' ? ' ion-page-hidden' : '')
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

export const IonRouterOutlet = withRouter(RouterOutlet);
