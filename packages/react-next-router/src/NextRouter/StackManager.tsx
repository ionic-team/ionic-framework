import {
  RouteInfo,
  RouteManagerContext,
  StackContext,
  ViewItem,
  generateId
} from '@ionic/react';
import React from 'react';

import { IonRedirect } from './IonRedirect';
import { IonRoute, matchIonRoute } from './IonRoute';
import { NextRouteInfo } from './NextRouteInfo';

interface StackManagerProps {
  routeInfo: NextRouteInfo;
}

interface StackManagerState { }

class StackManager extends React.PureComponent<StackManagerProps, StackManagerState> {
  id: string;
  context!: React.ContextType<typeof RouteManagerContext>;
  viewItems: ViewItem[] = [];
  ionRouterOutlet?: React.ReactElement;
  routerOutletElement: HTMLIonRouterOutletElement | undefined;
  firstRender = true;
  routerContextSubscriptions: (() => void)[] = [];

  constructor(props: StackManagerProps) {
    super(props);
    this.registerIonPage = this.registerIonPage.bind(this);
    this.removeView = this.removeView.bind(this);
    this.transitionPage = this.transitionPage.bind(this);
    this.handlePageTransition = this.handlePageTransition.bind(this);
    this.id = generateId('routerOutlet');
  }

  componentDidMount() {
    if (this.routerOutletElement) {
      console.log('SM Mount - ' + this.routerOutletElement.id);
      this.handlePageTransition(this.props.routeInfo);
    }
  }

  componentDidUpdate(prevProps: StackManagerProps) {
    if (this.props.routeInfo.pathname !== prevProps.routeInfo.pathname) {
      this.handlePageTransition(this.props.routeInfo);
    }
  }

  componentWillUnmount() {
    console.log('SM UNMount - ' + (this.routerOutletElement?.id as any).id);
    this.context.clearOutlet(this.id);
  }

  async handlePageTransition(routeInfo: RouteInfo) {
    // If routerOutlet isn't quite ready, give it another try in a moment
    if (!this.routerOutletElement || !this.routerOutletElement.commit) {
      setTimeout(() => this.handlePageTransition(routeInfo), 10);
    } else {
      // LEFT OFF - when going to /tabs, its creating a view item and the request to
      // /tabs/home is pulling up the wrong one
      let enteringViewItem = this.context.findViewItemByRouteInfo(routeInfo, this.id);
      let leavingViewItem = this.context.findLeavingViewItemByRouteInfo(routeInfo, this.id);

      if (!(routeInfo.routeAction === 'push' && routeInfo.routeDirection === 'forward')) {
        const shouldLeavingViewBeRemoved = routeInfo.routeDirection !== 'none' && leavingViewItem && (enteringViewItem !== leavingViewItem);
        if (shouldLeavingViewBeRemoved) {
          leavingViewItem!.mount = false;
        }
      }

      if (!enteringViewItem) {
        const enteringRoute = matchRoute(this.ionRouterOutlet?.props.children, routeInfo) as React.ReactElement;
        if (enteringRoute) {
          enteringViewItem = this.context.createViewItem(this.id, enteringRoute, routeInfo);
          this.context.addViewItem(enteringViewItem);
        }
      }

      if (enteringViewItem && enteringViewItem.ionPageElement) {
        // If we have a last route, but not a leavingViewItem, item is probably transitioning from a different outlet
        // grab its html to use for transitioning later
        if (!leavingViewItem && routeInfo.lastPathname) {
          leavingViewItem = this.context.getViewItemForTransition(routeInfo.lastPathname);
          if (leavingViewItem) {
            leavingViewItem.mount = false;
          }
          const shouldStoreHtml =
            leavingViewItem &&
            leavingViewItem?.ionRoute &&
            leavingViewItem.ionPageElement &&
            !leavingViewItem.ionPageElement.isConnected &&
            (routeInfo.routeDirection === 'forward' || routeInfo.routeDirection === 'back');
          if (shouldStoreHtml) {
            leavingViewItem!.transitionHtml = leavingViewItem!.ionPageElement?.outerHTML;
          }
        }
        this.transitionPage(routeInfo, enteringViewItem, leavingViewItem);
      }
      this.forceUpdate();
    }
  }

  registerIonPage(page: HTMLElement, routeInfo: NextRouteInfo) {
    const foundView = this.context.findViewItemByRouteInfo(routeInfo, this.id);
    if (foundView) {
      foundView.ionPageElement = page;
      foundView.ionRoute = true;
      // IonPages should be exact routes, so set it since the IonRoute was added dynamically
      if (foundView.reactElement.type === IonRoute) {
        foundView.reactElement = React.cloneElement(foundView.reactElement, {
          exact: true
        });
      }
    }
    this.handlePageTransition(routeInfo);
  }

  removeView(path: string) {
    const viewItemToRemove = this.context.findViewItemByPathname(path, this.id);
    if (viewItemToRemove) {
      this.context.unMountViewItem(viewItemToRemove);
    }
  }

  async transitionPage(routeInfo: RouteInfo, enteringViewItem: ViewItem, leavingViewItem?: ViewItem) {
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
            progressAnimation: false
          });
          this.routerOutletElement.removeChild(newLeavingElement);
        }
      } else {
        let leavingElement: HTMLElement | undefined;
        let appendedLeavingElement = false;
        if (leavingViewItem) {
          if (leavingViewItem.transitionHtml) {
            leavingElement = clonePageElement(leavingViewItem.transitionHtml);
            this.routerOutletElement.appendChild(leavingElement!);
            appendedLeavingElement = true;
          } else {
            leavingElement = leavingViewItem.ionPageElement;
          }
        }
        await this.routerOutletElement.commit(enteringViewItem.ionPageElement, leavingElement, {
          deepWait: true,
          duration: direction === undefined ? 0 : undefined,
          direction: direction as any,
          showGoBack: direction === 'forward',
          progressAnimation: false
        });
        if (leavingViewItem) {
          if (appendedLeavingElement && leavingElement) {
            this.routerOutletElement.removeChild(leavingElement);
          } else if (leavingViewItem.ionPageElement) {
            leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
            leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
          }
        }
      }
    }

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

    const components = this.context.getChildrenToRender(this.id, this.ionRouterOutlet, this.props.routeInfo);
    return (
      <StackContext.Provider value={{ registerIonPage: this.registerIonPage, removeView: this.removeView }}>
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

function clonePageElement(leavingViewHtml: string) {
  if (document) {
    const newEl = document.createElement('div');
    newEl.innerHTML = leavingViewHtml;
    newEl.style.zIndex = '';
    // Remove an existing back button so the new element doesn't get two of them
    const ionBackButton = newEl.getElementsByTagName('ion-back-button');
    if (ionBackButton[0]) {
      ionBackButton[0].innerHTML = '';
    }
    return newEl.firstChild as HTMLElement;
  }
  return undefined;
}

function matchRoute(node: React.ReactNode, routeInfo: NextRouteInfo) {
  let matchedNode: React.ReactNode;
  if (routeInfo.routeOptions?.routePath !== '/404') {
    React.Children.forEach(node as React.ReactElement, (child: React.ReactElement) => {
      if (child) {
        if (!matchedNode) {
          if (child.type === IonRoute || child.type === IonRedirect) {
            const match = matchIonRoute(child.props.path, routeInfo.pathname, child.props.exact);
            if (match) {
              matchedNode = child;
            }
          } else {
            matchedNode = (
              <IonRoute
                path={routeInfo.routeOptions!.routePath!}
                key={`ir-${routeInfo.routeOptions?.routePath}`}
                render={() => child}
              />
            );
          }
        }
      }
    });
  }

  if (matchedNode) {
    return matchedNode;
  }

  // If we haven't found a node
  // try to find one that doesn't have a path or from prop, that will be our not found route
  React.Children.forEach(node as React.ReactElement, (child: React.ReactElement) => {
    if (!(child.props.path || child.props.from) &&
      (child.type === IonRoute || child.type === IonRedirect)) {
      matchedNode = child;
    }
  });
  return matchedNode;
}
