import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import { withRouter, RouteComponentProps, matchPath, match, RouteProps } from 'react-router';
import { generateUniqueId } from '../utils';
import { Location } from 'history';
import { IonRouterOutletInner } from '../index';
import StackManager from '../StackManager';
import { NavContext } from './NavContext';

type ChildProps = RouteProps & {
  computedMatch: match<any>
}

type Props = RouteComponentProps & {
  children?: React.ReactElement<ChildProps>[] | React.ReactElement<ChildProps>;
};

interface StackItem {
  id: string;
  location: Location;
  match: match<{ tab: string }>;
  element: React.ReactElement<any>;
  prevId: string;
  mount: boolean;
  parentRef: React.RefObject<HTMLElement>;
}

interface State {
  direction: 'forward' | 'back' | undefined,
  inTransition: boolean;
  activeId: string | undefined;
  prevActiveId: string | undefined;
  tabActiveIds: { [tab: string]: string };
  views: StackItem[];
}

class RouterOutlet extends Component<Props, State> {

  enteringEl: React.RefObject<HTMLDivElement> = React.createRef();
  leavingEl: React.RefObject<HTMLDivElement> = React.createRef();
  containerEl: React.RefObject<HTMLIonRouterOutletElement> = React.createRef();

  constructor(props: Props) {
    super(props);

    this.state = {
      direction: undefined,
      inTransition: false,
      activeId: undefined,
      prevActiveId: undefined,
      tabActiveIds: {},
      views: []
    };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> {
    const location = props.location;
    let match: StackItem['match'] = null;
    let element: StackItem['element'];

    /**
     * Get the current active view and if the path is the same then do nothing
     */
    const activeView = state.views.find(v => v.id === state.activeId);

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
    const currentActiveTabView = state.views.find(v => v.id === id);
    if (currentActiveTabView && currentActiveTabView.location.pathname === props.location.pathname) {
      if (currentActiveTabView.id === state.activeId) {
        return null;
      }
      return {
        direction: undefined,
        activeId: currentActiveTabView.id,
        prevActiveId: undefined
      };
    }

    /**
     * If the new active view is a previous view
     */
    if (activeView) {
      const prevActiveView = state.views.find(v => v.id === activeView.prevId);
      if (prevActiveView && activeView.match.params.tab === match.params.tab && prevActiveView.match.url === match.url) {
        return {
          direction: 'back',
          activeId: prevActiveView.id,
          prevActiveId: activeView.id,
          tabActiveIds: {
            ...state.tabActiveIds,
            [match.params.tab]: prevActiveView.id,
          },
          // views: state.views.filter(x => x.id !== activeView.id)
          views: state.views.map(x => {
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

    const viewId = generateUniqueId();

    return {
      direction: (state.tabActiveIds[match.params.tab]) ? 'forward' : undefined,
      activeId: viewId,
      prevActiveId: state.tabActiveIds[match.params.tab],
      tabActiveIds: {
        ...state.tabActiveIds,
        [match.params.tab]: viewId
      },
      views: state.views.concat({
        id: viewId,
        location,
        match,
        element,
        prevId: state.tabActiveIds[match.params.tab],
        mount: true,
        parentRef: React.createRef<HTMLElement>()
      })
    };
  }

  renderChild(item: StackItem) {
    const component = React.cloneElement(item.element, {
      location: item.location,
      computedMatch: item.match,
      parentRef: item.parentRef
    });
    return component;
  }

  goBack = (defaultHref?: string) => {
    const prevView = this.state.views.find(v => v.id === this.state.activeId);
    const newView = this.state.views.find(v => v.id === prevView.prevId);
    const newPath = newView ? newView.location.pathname : defaultHref;
    this.props.history.replace(newPath);
  }

  componentDidUpdate() {
    const enteringEl = (this.enteringEl.current != null) ? this.enteringEl.current : undefined;
    const leavingEl = (this.leavingEl.current != null) ? this.leavingEl.current : undefined;

    if (this.state.direction && !this.state.inTransition) {
      this.setState({ inTransition: true });
      this.containerEl.current.commit(enteringEl, leavingEl, {
        deepWait: true,
        duration: this.state.direction === undefined ? 0 : undefined,
        direction: this.state.direction,
        showGoBack: true,
        progressAnimation: false
      }).then(() => {
        this.setState(() => ({
          inTransition: false,
          direction: undefined
        }));
      });
    }
  }

  removeView(view: StackItem) {
    this.setState({
      views: this.state.views.filter(x => x.id !== view.id)
    })
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
                'hidden': this.state.direction == null,
                'className': (this.state.direction == null ? ' ion-page-hidden' : '')
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
                <Transition
                  key={item.id}
                  in={item.mount}
                  timeout={1000}
                  unmountOnExit={true}
                  onExited={() => this.removeView(item)}>
                  {(state: string) => {
                    return (
                      <StackManager ref={item.parentRef} className={state}
                        {...props}
                      >
                        {this.renderChild(item)}
                      </StackManager>);
                  }}
                </Transition>
            );
          })}
        </NavContext.Provider>
      </IonRouterOutletInner>
    );
  }
}

export const IonRouterOutlet = withRouter(RouterOutlet);
