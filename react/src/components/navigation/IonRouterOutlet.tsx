import React from 'react';
import { withRouter, RouteComponentProps, matchPath, RouteProps, match } from 'react-router';
import { generateUniqueId } from '../utils';
import { IonRouterOutletInner } from '../proxies';
import { StackView } from '../StackView';
import { NavContext } from './NavContext';
import { StackItemManager } from './StackItemManager';
import { StackItem } from './StackItem';

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

class RouterOutlet extends React.Component<IonRouterOutletProps, IonRouterOutletState> {
  enteringItem: StackItem;
  leavingItem: StackItem;
  enteringEl: React.RefObject<HTMLDivElement> = React.createRef();
  leavingEl: React.RefObject<HTMLDivElement> = React.createRef();
  containerEl: React.RefObject<HTMLIonRouterOutletElement> = React.createRef();
  inTransition = false;
  context!: React.ContextType<typeof NavContext>;

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

  componentDidMount() {
    const views: StackItem[] = [];
    let activeId: string;
    React.Children.forEach(this.props.children, (child: React.ReactElement<ChildProps>) => {
      const location = this.props.location;
      const viewId = generateUniqueId();
      const key = generateUniqueId();
      const element = child;
      const match: StackItem['match'] = matchPath(location.pathname, child.props);
      const view: StackItem = {
        id: viewId,
        key,
        location,
        match,
        element,
        // prevId: 'aaa', // state.tabActiveIds[match.params.tab],
        mount: true,
        show: !!match,
        ref: React.createRef(),
        childProps: child.props
      }
      if(!!match) {
        activeId = viewId
      };
      views.push(view);
    });
    this.context.registerView('abc', activeId, views, this.containerEl.current);
    this.setState({
      activeId
    });
  }

  // static getDerivedStateFromProps(props: IonRouterOutletProps, state: IonRouterOutletState): Partial<IonRouterOutletState> {
  //   const location = props.location;
  //   let match: StackItem['match'] = null;
  //   let element: StackItem['element'];

  //   /**
  //    * Remove any views that have been unmounted previously
  //    */
  //   const views = state.views.filter(x => x.mount === true);

  //   /**
  //    * Get the current active view and if the path is the same then do nothing
  //    */
  //   const activeView = views.find(v => v.id === state.activeId);

  //   /**
  //    * Look at all available paths and find the one that matches
  //    */
  //   React.Children.forEach(props.children, (child: React.ReactElement<ChildProps>) => {
  //     if (match == null) {
  //       element = child;
  //       match = matchPath(location.pathname, child.props);
  //     }
  //   });

  //   /**
  //    * If there are no matches then set the active view to null and exit
  //    */
  //   if (!match) {
  //     return {
  //       direction: undefined,
  //       activeId: undefined,
  //       prevActiveId: undefined
  //     };
  //   }

  //   /**
  //    * Get the active view for the tab that matches.
  //    * If the location matches the existing tab path then set that view as active
  //    */
  //   const id = state.tabActiveIds[match.params.tab];
  //   const currentActiveTabView = views.find(v => v.id === id);
  //   if (currentActiveTabView && currentActiveTabView.location.pathname === props.location.pathname) {
  //     if (currentActiveTabView.id === state.activeId) {
  //       /**
  //        * The current tab was clicked, so do nothing
  //        */
  //       return null;
  //     }
  //     /**
  //      * Activate a tab that is already in views
  //      */
  //     return {
  //       direction: undefined,
  //       activeId: currentActiveTabView.id,
  //       prevActiveId: state.activeId,
  //       views: views
  //     };
  //   }

  //   /**
  //    * If the new active view is a previous view, then animate it back in
  //    */
  //   if (activeView) {
  //     const prevActiveView = views.find(v => v.id === activeView.prevId);
  //     if (prevActiveView && activeView.match.params.tab === match.params.tab && prevActiveView.match.url === match.url) {
  //       return {
  //         direction: 'back',
  //         activeId: prevActiveView.id,
  //         prevActiveId: activeView.id,
  //         tabActiveIds: {
  //           ...state.tabActiveIds,
  //           [match.params.tab]: prevActiveView.id,
  //         },
  //         views: views.map(x => {
  //           if (x.id === activeView.id) {
  //             return {
  //               ...x,
  //               mount: false
  //             }
  //           }
  //           return x;
  //         })
  //       }
  //     }
  //   }

  //   /**
  //      * If the current view does not match the url, see if the view that matches the url is currently in the stack.
  //      * If so, show the view that matches the url and remove the current view.
  //      */
  //   if (currentActiveTabView && currentActiveTabView.location.pathname !== props.location.pathname) {
  //     const view = views.find(x => x.location.pathname == props.location.pathname);
  //     if (view && view.id === currentActiveTabView.prevId) {
  //       return {
  //         direction: undefined,
  //         activeId: view.id,
  //         prevActiveId: undefined,
  //         views: views.filter(x => x.id !== currentActiveTabView.id),
  //         tabActiveIds: {
  //           ...state.tabActiveIds,
  //           [match.params.tab]: view.id
  //         },
  //       };
  //     }
  //   }

  //   /**
  //    * Else add this new view to the stack
  //    */
  //   const viewId = generateUniqueId();
  //   const newState: IonRouterOutletState = {
  //     direction: (state.tabActiveIds[match.params.tab]) ? 'forward' : undefined,
  //     activeId: viewId,
  //     prevActiveId: state.tabActiveIds[match.params.tab] || state.activeId,
  //     tabActiveIds: {
  //       ...state.tabActiveIds,
  //       [match.params.tab]: viewId
  //     },
  //     views: views.concat({
  //       id: viewId,
  //       location,
  //       match,
  //       element,
  //       prevId: state.tabActiveIds[match.params.tab],
  //       mount: true
  //     })
  //   };

  //   return newState;
  // }

  renderChild(item: StackItem) {
    const component = React.cloneElement(item.element, {
      location: item.location,
      computedMatch: item.match
    });
    return component;
  }

  activateView(_el: HTMLElement) {
    /**
     * Gets called from StackItem to initialize a new view
     */
    // if (!this.state.direction) {
    //   const leavingEl = (this.leavingEl.current != null) ? this.leavingEl.current : undefined;
    //   this.transitionView(el, leavingEl);
    // }
  }

  transitionView(enteringEl: HTMLElement, leavingEl: HTMLElement) {
    //
    /**
     * Super hacky workaround to make sure containerEL is available
     * since activateView might be called from StackItem before IonRouterOutlet is mounted
     */
    if (this.containerEl && this.containerEl.current && this.containerEl.current.componentOnReady) {
      this.context.transitionView(enteringEl, leavingEl, this.containerEl.current, this.state.direction);
    } else {
      setTimeout(() => {
        this.transitionView(enteringEl, leavingEl);
      }, 10);
    }
  }

  componentDidUpdate(_prevProps: IonRouterOutletProps, _prevState: IonRouterOutletState) {
    /**
     * Don't transition the view if the state didn't change
     * Probably means we are still on the same view
     */
    // if (prevState !== this.state) {
    //   const enteringEl = (this.enteringEl.current != null) ? this.enteringEl.current : undefined;
    //   const leavingEl = (this.leavingEl.current != null) ? this.leavingEl.current : undefined;
    //   this.transitionView(enteringEl, leavingEl);
    // }
  }


  render() {
    return (
      <NavContext.Consumer>
        {context => {
          this.context = context;
          const activeId = context.viewStacks['abc'] ? context.viewStacks['abc'].activeId : '';
          // const prevId = context.viewStacks['abc'] ? context.viewStacks['abc'].prevId : '';
          const views = (context.viewStacks['abc'] || {activeId: '', views: []}).views.filter(x => x.show);
          return (
            <IonRouterOutletInner ref={this.containerEl}>

              {views.map((item) => {
                let props: any = {};

                // if (item.id === prevId) {
                //   props = {
                //     'aria-hidden': true,
                //     'className': 'ion-page-hidden'
                //   };
                //   // item.ref = this.leavingEl;
                // } else
                if (item.id === activeId) {
                  props = {
                    // 'ref': this.enteringEl,
                    'className': ' ion-page-invisible'
                    // 'className': (this.state.direction != null ? ' ion-page-invisible' : '')
                  };
                  // item.ref = this.enteringEl;
                } else {
                  props = {
                    'aria-hidden': true,
                    'className': 'ion-page-hidden'
                  };
                  // item.ref = undefined;
                }

                return (
                  <StackItemManager
                    id={item.id}
                    key={item.key}
                    mount={item.mount}
                  >
                    <StackView
                      activateView={this.activateView}
                      ref={item.ref}
                      {...props}
                    >
                      {this.renderChild(item)}
                    </StackView>
                  </StackItemManager>
                );
              })}

            </IonRouterOutletInner>
          );
        }}

      </NavContext.Consumer>
    );
  }
}

export const IonRouterOutlet = /*@__PURE__*/withRouter(RouterOutlet);
