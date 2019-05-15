import React, { Component } from 'react';
import { withRouter, RouteComponentProps, matchPath, match, RouteProps } from 'react-router';
import { Components } from '@ionic/core';
import { generateUniqueId } from '../utils';
import { Location } from 'history';
import { IonBackButtonInner, IonRouterOutletInner } from '../index';
import IonPage from '../IonPage';

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
}

interface State {
  direction: 'forward' | 'back' | undefined,
  inTransition: boolean;
  activeId: string | undefined;
  prevActiveId: string | undefined;
  tabActiveIds: { [tab: string]: string };
  views: StackItem[];
}

interface ContextInterface {
  goBack: (defaultHref?: string) => void
}

const Context = React.createContext<ContextInterface>({
  goBack: () => {}
});


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
        prevId: state.tabActiveIds[match.params.tab]
      })
    };
  }

  renderChild(item: StackItem) {
    return React.cloneElement(item.element, {
      location: item.location,
      computedMatch: item.match
    });
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
        duration: this.state.direction === undefined ? 0: undefined,
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

  render() {
    return (
      <IonRouterOutletInner ref={this.containerEl}>
        <Context.Provider value={{ goBack: this.goBack }}>
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
              <IonPage
                {...props}
                key={item.id}
              >
                { this.renderChild(item) }
              </IonPage>
            );
          })}
        </Context.Provider>
      </IonRouterOutletInner>
    );
  }
}

export const IonRouterOutlet = withRouter(RouterOutlet);


type ButtonProps = Components.IonBackButtonAttributes & {
  goBack: () => void;
};

export class IonBackButton extends Component<ButtonProps> {
  context!: React.ContextType<typeof Context>;

  clickButton = (e: MouseEvent) => {
    e.stopPropagation();
    this.context.goBack(this.props.defaultHref);
  }

  render() {
    return (
      <IonBackButtonInner onClick={this.clickButton} {...this.props}></IonBackButtonInner>
    );
  }
}

IonBackButton.contextType = Context;
