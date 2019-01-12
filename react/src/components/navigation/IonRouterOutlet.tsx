import React, { Component } from 'react';
import { withRouter, RouteComponentProps, matchPath, match, RouteProps } from 'react-router';
import { Components } from '@ionic/core';
import { generateUniqueId } from '../utils';
import { Location } from 'history';
import { IonBackButton } from '../index';

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
  outletActiveId: string;
  tabActiveIds: { [tab: string]: string };
  views: StackItem[];
}

interface ContextInterface {
  goBack: () => void
}

const Context = React.createContext<ContextInterface>({
  goBack: () => {}
});

class IonRouterOutlet extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      outletActiveId: null,
      tabActiveIds: {},
      views: []
    };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const location = props.location;
    let match: match<{ tab: string }> | null = null;
    let element: React.ReactElement<ChildProps>;

    /**
     * Get the current active view and if the path is the same then do nothing
     */
    const activeOutletView = IonRouterOutlet.getViewById(state, state.outletActiveId);

    if (activeOutletView && location && activeOutletView.location.pathname === location.pathname) {
      return null;
    }

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
        outletActiveId: null
      };
    }

    // The tab groups current active view should be the overall active View
    /**
     * Get the active view for the tab that matches.
     * If the location matches the existing tab path then set that view as active
     */
    const id = state.tabActiveIds[match.params.tab];
    const currentActiveTabView = IonRouterOutlet.getViewById(state, id);
    if (currentActiveTabView && currentActiveTabView.location.pathname === props.location.pathname) {
      return {
        outletActiveId: currentActiveTabView.id
      };
    }

    /**
     * If the match tab is the same as the current active
     */
    if (activeOutletView) {
      const activeOutletPrevView = IonRouterOutlet.getViewById(state, activeOutletView.prevId);
      if (activeOutletPrevView && activeOutletView.match.params.tab === match.params.tab && activeOutletPrevView.match.url === match.url) {
        return {
          outletActiveId: activeOutletPrevView.id,
          tabActiveIds: {
            ...state.tabActiveIds,
            [match.params.tab]: activeOutletPrevView.id,
          },
          views: state.views.filter(v => v.id !== activeOutletView.id)
        }
      }
    }

    const viewId = generateUniqueId();

    return {
      outletActiveId: viewId,
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

  static getViewById(state: State, id: string) {
    if (id != null) {
      return state.views.find(v => v.id === id);
    }

    return null;
  }

  renderChild(item: StackItem) {
    return React.cloneElement(item.element, {
      location: item.location,
      computedMatch: item.match
    });
  }

  goBack = () => {
    const prevView = IonRouterOutlet.getViewById(this.state, this.state.outletActiveId);
    const newView = IonRouterOutlet.getViewById(this.state, prevView.prevId);

    this.props.history.replace(newView.location.pathname);
  }

  render() {
    return (
      <Context.Provider value={{ goBack: this.goBack }}>
        {this.state.views.map((item) => {
          return (
            <div style={(this.state.outletActiveId === item.id) ? {} : { 'display': 'none' }} key={item.id}>
              { this.renderChild(item) }
            </div>
          );
        })}
      </Context.Provider>
    );
  }
}

export default withRouter(IonRouterOutlet);


type ButtonProps = Components.IonBackButtonAttributes & {
  goBack: () => void;
};

export class IonBackButtonNav extends Component<ButtonProps> {
  context!: React.ContextType<typeof Context>;

  clickButton = (e: MouseEvent) => {
    e.stopPropagation();

    this.context.goBack();
  }

  render() {
    return (
      <IonBackButton onClick={this.clickButton} {...this.props}></IonBackButton>
    );
  }
}

IonBackButtonNav.contextType = Context;
