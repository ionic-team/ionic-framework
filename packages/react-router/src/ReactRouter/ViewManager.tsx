import React, { useEffect } from 'react';
import { generateUniqueId } from '../utils';
import { View } from './View';
import { ViewItemManager } from './ViewItemManager';
import { RouteManagerContext } from './RouteManagerContext';
import { ViewItem } from './ViewItem';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-router-outlet': any;
    }
  }
}

type ViewManagerProps = {
  id?: string;
};

type ViewManagerState = {}

export class ViewManager extends React.Component<ViewManagerProps, ViewManagerState> {
  containerEl: React.RefObject<HTMLIonRouterOutletElement> = React.createRef();
  context!: React.ContextType<typeof RouteManagerContext>;
  id: string;

  constructor(props: ViewManagerProps) {
    super(props);
    this.id = this.props.id || generateUniqueId();
    this.handleViewSync = this.handleViewSync.bind(this);
  }

  componentDidMount() {
    this.context.setupIonRouter(this.id, this.props.children, this.containerEl.current!)
      .then(() => transitionFirstView());

    let retryCount = 0;
    const transitionFirstView = () => {
      const viewStack = this.context.viewStacks[this.id];
      if (!viewStack) {
        setTimeout(() => {
          transitionFirstView();
        }, 25);
      } else {
        const activeView = viewStack.views.find(x => x.id === viewStack.activeId);
        if(!activeView) {
          return;
        } else if (activeView.ionPageElement) {
          this.context.transitionView(activeView.ionPageElement, undefined!, this.containerEl.current!, undefined!);
        } else {
          if (retryCount >= 100) {
            console.error('IonPage component not found, does your page have an IonPage component as it\'s root component?');
          } else {
            retryCount += 1;
            console.log(retryCount);
            setTimeout(() => {
              transitionFirstView();
            }, 25);
          }
        }
      }
    }
  }

  componentWillUnmount() {
    this.context.removeViewStack(this.id);
  }

  handleViewSync(page: HTMLElement, viewId: string) {
    page.setAttribute('data-view-id', viewId);
    page.classList.add('ion-page-invisible');
    this.context.syncView(page, viewId);
  }

  renderChild(item: ViewItem) {
    const component = React.cloneElement(item.route, {
      computedMatch: item.routeData.match
    });
    return component;
  }

  render() {
    const context = this.context;
    const viewStack = context.viewStacks[this.id];
    const views = (viewStack || { views: [] }).views.filter(x => x.show);
    const ionRouterOutlet = React.Children.only(this.props.children) as React.ReactElement;

    const childElements = views.map((view) => {
      return (
        <ViewItemManager
          id={view.id}
          key={view.key}
          mount={view.mount}
        >
          <View
            onViewSync={this.handleViewSync}
            view={view}
          >
            {this.renderChild(view)}
          </View>
        </ViewItemManager>
      );
    });

    return (
      React.cloneElement(ionRouterOutlet, {
        ref: this.containerEl,
        "data-stack-id": this.id
      }, childElements)
    );

  }

  static get contextType() {
    return RouteManagerContext;
  }
}
