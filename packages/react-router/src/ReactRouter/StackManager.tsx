import {
  RouteInfo,
  RouteManagerContext,
  StackContext,
  ViewItem,
  generateId
} from '@ionic/react';
import React from 'react';
import { matchPath } from 'react-router-dom';

import { clonePageElement } from './clonePageElement';

interface StackManagerProps {
  routeInfo: RouteInfo;
}

interface StackManagerState { }

export class StackManager extends React.PureComponent<StackManagerProps, StackManagerState> {
  id: string;
  context!: React.ContextType<typeof RouteManagerContext>;
  inTransition = false;
  ionRouterOutlet?: React.ReactElement;
  routerOutletElement: HTMLIonRouterOutletElement | undefined;

  constructor(props: StackManagerProps) {
    super(props);
    this.registerIonPage = this.registerIonPage.bind(this);
    this.transitionPage = this.transitionPage.bind(this);
    this.handlePageTransition = this.handlePageTransition.bind(this);
    this.id = generateId('routerOutlet');
  }

  componentDidMount() {
    if (this.routerOutletElement) {
      console.log(`SM Mount - ${this.routerOutletElement.id} (${this.id})`);
      this.handlePageTransition(this.props.routeInfo);
    }
  }

  componentDidUpdate(prevProps: StackManagerProps) {
    if (this.props.routeInfo.pathname !== prevProps.routeInfo.pathname) {
      this.handlePageTransition(this.props.routeInfo);
    }
  }

  componentWillUnmount() {
    console.log(`SM UNMount - ${(this.routerOutletElement?.id as any).id} (${this.id})`);
    this.context.clearOutlet(this.id);
  }

  async handlePageTransition(routeInfo: RouteInfo) {
    if (!this.inTransition) {
      // If routerOutlet isn't quite ready, give it another try in a moment
      if (!this.routerOutletElement || !this.routerOutletElement.commit) {
        setTimeout(() => this.handlePageTransition(routeInfo), 10);
      } else {
        let enteringViewItem = this.context.findViewItemByRouteInfo(routeInfo, this.id);
        const leavingViewItem = this.context.findLeavingViewItemByRouteInfo(routeInfo, this.id);

        if (!(routeInfo.routeAction === 'push' && routeInfo.routeDirection === 'forward')) {
          const shouldLeavingViewBeRemoved = routeInfo.routeDirection !== 'none' && leavingViewItem && (enteringViewItem !== leavingViewItem);
          if (shouldLeavingViewBeRemoved) {
            leavingViewItem!.mount = false;
          }
        }

        const enteringRoute = matchRoute(this.ionRouterOutlet?.props.children, routeInfo) as React.ReactElement;
        // TODO: we need to set the route here since its synced later?
        if (enteringViewItem) {
          enteringViewItem.reactElement = enteringRoute;
        }
        if (!enteringViewItem) {
          if (enteringRoute) {
            enteringViewItem = this.context.createViewItem(this.id, enteringRoute, routeInfo);
            this.context.addViewItem(enteringViewItem);
          }
        }
        if (enteringViewItem && enteringViewItem.ionPageElement) {
          this.transitionPage(routeInfo, enteringViewItem, leavingViewItem);
        } else {
          this.forceUpdate();
        }
      }
    }
  }

  registerIonPage(page: HTMLElement, routeInfo: RouteInfo) {
    const foundView = this.context.findViewItemByRouteInfo(routeInfo, this.id);
    if (foundView) {
      foundView.ionPageElement = page;
      foundView.ionRoute = true;
    }
    this.handlePageTransition(routeInfo);
  }

  async transitionPage(routeInfo: RouteInfo, enteringViewItem: ViewItem, leavingViewItem?: ViewItem) {

    // TODO: Needed?
    if (routeInfo.lastPathname && (!leavingViewItem || !leavingViewItem.ionRoute)) {
      const viewFromOtherOutlet = this.context.getViewItemForTransition(routeInfo.lastPathname);
      if (leavingViewItem) {
        this.context.unMountViewItem(leavingViewItem);
      }
      if (viewFromOtherOutlet) {
        leavingViewItem = viewFromOtherOutlet;
      }
    }

    const direction = (routeInfo.routeDirection === 'none' || routeInfo.routeDirection === 'root')
      ? undefined
      : routeInfo.routeDirection;

    if (enteringViewItem && enteringViewItem.ionPageElement && this.routerOutletElement) {
      if (leavingViewItem && leavingViewItem.ionPageElement && (enteringViewItem === leavingViewItem)) {
        // If a page is transitioning to another version of itself
        // we clone it so we can have an animation to show
        const newLeavingElement = clonePageElement(leavingViewItem.ionPageElement.outerHTML);
        if (newLeavingElement) {
          this.routerOutletElement.appendChild(newLeavingElement);
          await this.routerOutletElement.commit(enteringViewItem.ionPageElement, newLeavingElement, {
            deepWait: true,
            duration: direction === undefined ? 0 : undefined,
            direction: direction as any,
            showGoBack: direction === 'forward',
            progressAnimation: false,
            animationBuilder: routeInfo.routeAnimation
          });
          this.routerOutletElement.removeChild(newLeavingElement);
        }
      } else {
        await this.routerOutletElement.commit(enteringViewItem.ionPageElement, leavingViewItem?.ionPageElement, {
          deepWait: true,
          duration: direction === undefined ? 0 : undefined,
          direction: direction as any,
          showGoBack: direction === 'forward',
          progressAnimation: false,
          animationBuilder: routeInfo.routeAnimation
        });
        if (leavingViewItem && leavingViewItem.ionPageElement) {
          leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
          leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
        }
      }
    }

    // TODO: needed?
    if (leavingViewItem) {
      if (!leavingViewItem.ionRoute) {
        this.context.unMountViewItem(leavingViewItem);
      }
    }
  }

  render() {
    const { children } = this.props;
    const ionRouterOutlet = React.Children.only(children) as React.ReactElement;
    this.ionRouterOutlet = ionRouterOutlet;

    const components = this.context.getChildrenToRender(
      this.id,
      this.ionRouterOutlet,
      this.props.routeInfo,
      () => {
        this.forceUpdate();
      });
    return (
      <StackContext.Provider value={{ registerIonPage: this.registerIonPage }}>
        {React.cloneElement(ionRouterOutlet as any, {
          ref: (node: HTMLIonRouterOutletElement) => {
            this.routerOutletElement = node;
            const { ref } = ionRouterOutlet as any;
            if (typeof ref === 'function') {
              ref(node);
            }
          }
        },
          components
        )}
      </StackContext.Provider>
    );
  }

  static get contextType() {
    return RouteManagerContext;
  }
}

export default StackManager;

function matchRoute(node: React.ReactNode, routeInfo: RouteInfo) {
  let matchedNode: React.ReactNode;
  React.Children.forEach(node as React.ReactElement, (child: React.ReactElement) => {
    const matchProps = {
      exact: child.props.exact,
      path: child.props.path || child.props.from,
      component: child.props.component
    };
    const match = matchPath(routeInfo.pathname, matchProps);
    if (match) {
      matchedNode = child;
    }
  });

  if (matchedNode) {
    return matchedNode;
  }
  // If we haven't found a node
  // try to find one that doesn't have a path or from prop, that will be our not found route
  React.Children.forEach(node as React.ReactElement, (child: React.ReactElement) => {
    if (!child.props.path || !child.props.from) {
      matchedNode = child;
    }
  });

  return matchedNode;
}
