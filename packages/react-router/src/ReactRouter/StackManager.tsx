import React from 'react';
import { generateUniqueId, isDevMode } from '../utils';
import { View } from './View';
import { ViewTransitionManager } from './ViewTransitionManager';
import { RouteManagerContext } from './RouteManagerContext';
import { ViewItem } from './ViewItem';

type StackManagerProps = {
  id?: string;
};

type StackManagerState = {}

export class StackManager extends React.Component<StackManagerProps, StackManagerState> {
  routerOutletEl: React.RefObject<HTMLIonRouterOutletElement> = React.createRef();
  context!: React.ContextType<typeof RouteManagerContext>;
  id: string;

  constructor(props: StackManagerProps) {
    super(props);
    this.id = this.props.id || generateUniqueId();
    this.handleViewSync = this.handleViewSync.bind(this);
    this.handleHideView = this.handleHideView.bind(this);
  }

  componentDidMount() {
    this.context.setupIonRouter(this.id, this.props.children, this.routerOutletEl.current!);
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

    const childElements = views.map((view) => {
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
    });

    const elementProps: any = {
      ref: this.routerOutletEl
    }

    if(isDevMode()) {
      elementProps['data-stack-id'] = this.id
    }

    const routerOutletChild = React.cloneElement(ionRouterOutlet, elementProps, childElements);


    return routerOutletChild;
  }

  static get contextType() {
    return RouteManagerContext;
  }
}
