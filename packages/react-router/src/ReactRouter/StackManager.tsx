import React from 'react';

import { generateId, isDevMode } from '../utils';

import { RouteManagerContext } from './RouteManagerContext';
import { View } from './View';
import { ViewItem } from './ViewItem';
import { ViewTransitionManager } from './ViewTransitionManager';

interface StackManagerProps {
  id?: string;
}

interface StackManagerState {
  routerOutletReady: boolean;
}

export class StackManager extends React.Component<StackManagerProps, StackManagerState> {
  routerOutletEl: React.RefObject<HTMLIonRouterOutletElement> = React.createRef();
  context!: React.ContextType<typeof RouteManagerContext>;
  id: string;

  constructor(props: StackManagerProps) {
    super(props);
    this.id = this.props.id || generateId();
    this.handleViewSync = this.handleViewSync.bind(this);
    this.handleHideView = this.handleHideView.bind(this);
    this.state = {
      routerOutletReady: false
    };
  }

  componentDidMount() {
    this.context.setupIonRouter(this.id, this.props.children, this.routerOutletEl.current!);
    this.routerOutletEl.current!.addEventListener('routerOutletReady', () => {
      this.setState({
        routerOutletReady: true
      });
    });
  }

  componentWillUnmount() {
    this.context.removeViewStack(this.id);
  }

  handleViewSync(page: HTMLElement, viewId: string) {
    this.context.syncView(page, viewId);
  }

  handleHideView(viewId: string) {
    this.context.hideView(viewId);
  }

  renderChild(item: ViewItem) {
    const component = React.cloneElement(item.route, {
      computedMatch: item.routeData.match
    });
    return component;
  }

  render() {
    const context = this.context;
    const viewStack = context.viewStacks.get(this.id);
    const views = (viewStack || { views: [] }).views.filter(x => x.show);
    const ionRouterOutlet = React.Children.only(this.props.children) as React.ReactElement;
    const { routerOutletReady } = this.state;

    const childElements = routerOutletReady ? views.map(view => {
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
          >
            {this.renderChild(view)}
          </View>
        </ViewTransitionManager>
      );
    }) : <div></div>;

    const elementProps: any = {
      ref: this.routerOutletEl
    };

    if(ionRouterOutlet.props.forwardedRef) {
      ionRouterOutlet.props.forwardedRef.current = this.routerOutletEl;
    }

    if (isDevMode()) {
      elementProps['data-stack-id'] = this.id;
    }

    const routerOutletChild = React.cloneElement(ionRouterOutlet, elementProps, childElements);

    return routerOutletChild;
  }

  static get contextType() {
    return RouteManagerContext;
  }
}