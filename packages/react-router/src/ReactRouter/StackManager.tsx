import React from 'react';

import { generateId, isDevMode } from '../utils';

import { RouteManagerContext, RouteManagerContextState } from './RouteManagerContext';
import { View } from './View';
import { ViewItem } from './ViewItem';
import { ViewTransitionManager } from './ViewTransitionManager';

interface StackManagerProps {
  id?: string;
  routeManager: RouteManagerContextState;
  children?: React.ReactNode;
}

interface StackManagerState { }

class StackManagerInner extends React.Component<StackManagerProps, StackManagerState> {
  routerOutletEl: React.RefObject<HTMLIonRouterOutletElement> = React.createRef();
  id: string;

  constructor(props: StackManagerProps) {
    super(props);
    this.id = this.props.id || generateId();
    this.handleViewSync = this.handleViewSync.bind(this);
    this.handleHideView = this.handleHideView.bind(this);
    this.state = {};
  }

  componentDidMount() {
    this.props.routeManager.setupIonRouter(this.id, this.props.children, this.routerOutletEl.current!);
  }

  static getDerivedStateFromProps(props: StackManagerProps, state: StackManagerState) {
    props.routeManager.syncRoute(props.children);
    return state;
  }

  componentWillUnmount() {
    this.props.routeManager.removeViewStack(this.id);
  }

  handleViewSync(page: HTMLElement, viewId: string) {
    this.props.routeManager.syncView(page, viewId);
  }

  handleHideView(viewId: string) {
    this.props.routeManager.hideView(viewId);
  }

  renderChild(item: ViewItem, route: any) {
    const component = React.cloneElement(route, {
      computedMatch: item.routeData.match
    });
    return component;
  }

  render() {
    const routeManager = this.props.routeManager;
    const viewStack = routeManager.viewStacks.get(this.id);
    const views = (viewStack || { views: [] }).views.filter(x => x.show);
    const ionRouterOutlet = React.Children.only(this.props.children) as React.ReactElement;
    const childElements = views.map(view => {
      const route = routeManager.getRoute(view.routeId);
      return (
        <ViewTransitionManager
          id={view.id}
          key={view.key}
          mount={view.mount}
        >
          <View
            onViewSync={this.handleViewSync}
            onHideView={this.handleHideView}
            view={view}
            route={route}
          >
            {this.renderChild(view, route)}
          </View>
        </ViewTransitionManager>
      );
    });

    const elementProps: any = {
      ref: this.routerOutletEl
    };

    if (ionRouterOutlet.props.forwardedRef) {
      ionRouterOutlet.props.forwardedRef.current = this.routerOutletEl;
    }

    if (isDevMode()) {
      elementProps['data-stack-id'] = this.id;
    }

    const routerOutletChild = React.cloneElement(ionRouterOutlet, elementProps, childElements);

    return routerOutletChild;
  }
}

const withContext = (Component: any) => {
  return (props: any) => (
    <RouteManagerContext.Consumer>
      {context => <Component {...props} routeManager={context} />}
    </RouteManagerContext.Consumer>
  );
};

export const StackManager = withContext(StackManagerInner);
