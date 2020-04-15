import {
  // DefaultIonLifeCycleContext,
  RouteInfo,
  RouteManagerContext,
  StackContext,
  ViewItem,
  ViewLifeCycleManager
} from '@ionic/react';
import React from 'react';
import { matchPath } from 'react-router-dom';

import { generateId } from '../utils';

interface StackManagerProps {
  routeInfo: RouteInfo;
}

interface StackManagerState { }

export class StackManager extends React.Component<StackManagerProps, StackManagerState> {
  context!: React.ContextType<typeof RouteManagerContext>;
  viewItems: ViewItem[] = [];
  // leavingElement: HTMLElement | undefined;
  ionRouterOutlet?: React.ReactElement;
  routerOutletElement: HTMLIonRouterOutletElement | undefined;
  //  isIonPageContainer = false;
  firstRender = true;
  routerContextSubscriptions: (() => void)[] = [];

  constructor(props: StackManagerProps) {
    super(props);

    this.setupFirstPage = this.setupFirstPage.bind(this);
    this.registerIonPage = this.registerIonPage.bind(this);
    this.transitionPage = this.transitionPage.bind(this);

    this.state = {};

    // this.ionRouterOutlet = React.Children.only(this.props.children) as React.ReactElement;
  }

  componentDidMount() {
    if (this.routerOutletElement) {
      this.routerContextSubscriptions.push(
        this.context.onExitViewFromOtherOutlet(this.exitViewFromOtherOutlet.bind(this))
      );
      this.routerContextSubscriptions.push(
        this.context.onRouteChange(this.handlePageTransition.bind(this))
      );
      this.setupFirstPage();
    }
  }

  componentWillUnmount() {
    this.routerContextSubscriptions.forEach(unsubscribe => unsubscribe());
  }

  shouldComponentUpdate() {
    return false;
  }

  exitViewFromOtherOutlet(pathname: string) {
    const { viewItem } = findViewItemByRoute(this.viewItems, pathname);
    if (viewItem) {

      this.viewItems = this.viewItems.filter(v => {
        const matchProps = {
          exact: v.routeData.childProps.exact,
          path: v.routeData.childProps.path || v.routeData.childProps.props.from,
          component: v.routeData.childProps.component
        };
        const match = matchPath(this.props.routeInfo.pathname, matchProps);
        return !!match;
      });

      this.forceUpdate();
    }
  }

  async handlePageTransition(routeInfo: RouteInfo) {
    // If routerOutlet isn't quite ready, give it another try in a moment
    if (!this.routerOutletElement || !this.routerOutletElement.commit) {
      setTimeout(() => this.handlePageTransition(routeInfo), 10);
    } else {
      this.transitionPage(routeInfo);
    }
  }

  registerIonPage(page: HTMLElement, routeInfo: RouteInfo) {
    const matchedNode = matchComponent(this.ionRouterOutlet!.props.children, routeInfo) as React.ReactElement;
    if (matchedNode) {
      const { viewItem: foundView } = findViewItemByRoute(this.viewItems, routeInfo.pathname);
      if (foundView) {
        foundView.ionPageElement = page;
        foundView.reactElement = matchedNode as any;
        foundView.ionRoute = true;
      }
      if (this.firstRender || foundView?.routeData.pendingTransition) {
        this.handlePageTransition(routeInfo);
        this.firstRender = false;
      }
    }
  }

  renderChildren(ionRouterOutlet: React.ReactElement) {

    const children: React.ReactNode[] = [];

    React.Children.forEach(ionRouterOutlet!.props.children, (child: React.ReactElement) => {

      // If child is "Route like"
      if (child.props.path || child.props.from) {
        const foundView = this.viewItems.find(x => {
          if (child.props.path) {
            return x.reactElement.props.path === child.props.path;
          } else {
            return x.reactElement.props.from === child.props.from;
          }
        });
        if (foundView && foundView.mount) {
          const clonedChild = <ViewLifeCycleManager key={`view-${foundView.id}`}>
            {React.cloneElement(child, {
              computedMatch: foundView.routeData.match
            })}
          </ViewLifeCycleManager>;
          children.push(clonedChild);
        } else {
          const newViewItem = createViewItem(child, this.props.routeInfo);
          const clonedChild = <ViewLifeCycleManager key={`view-${newViewItem.id}`}>
            {React.cloneElement(newViewItem.reactElement, {
              computedMatch: newViewItem.routeData.match
            })}
          </ViewLifeCycleManager>;
          this.viewItems.push(newViewItem);
          children.push(clonedChild);
        }
      } else {
        children.push(child);
      }
    });

    const component = React.cloneElement(ionRouterOutlet as any, {
      ref: (node: HTMLIonRouterOutletElement) => {
        this.routerOutletElement = node;
        const { ref } = ionRouterOutlet as any;
        if (typeof ref === 'function') {
          ref(node);
        }
      }
    },
      children
    );
    return component;
  }

  setupFirstPage() {
    const { viewItem } = findViewItemByRoute(this.viewItems, this.props.routeInfo.pathname);
    if (viewItem) {
      this.handlePageTransition(this.props.routeInfo);
    }
  }

  async transitionPage(routeInfo: RouteInfo) {

    const { viewItem: enteringViewItem, match } = findViewItemByRoute(this.viewItems, routeInfo.pathname);
    const { viewItem: leavingViewItem } = findViewItemByRoute(this.viewItems, routeInfo.lastRoute);

    if (!enteringViewItem || !enteringViewItem.ionPageElement) {
      if (enteringViewItem) {
        enteringViewItem.routeData.pendingTransition = true;
      }
      return;
    }

    enteringViewItem!.routeData.match = match;

    if (enteringViewItem.ionRoute) {

      if (routeInfo.lastRoute && !leavingViewItem) {
        console.log('missing view ' + routeInfo.lastRoute);
        this.context.exitViewFromOtherOutlet(routeInfo.lastRoute);
      }

      if (routeInfo.routeAction === 'push' && routeInfo.routeDirection === 'forward') {
        // enteringViewItem.prevId = leavingViewItem.id;
      } else {
        const shouldLeavingViewBeRemoved = routeInfo.routeDirection !== 'none' && leavingViewItem && (enteringViewItem !== leavingViewItem);
        if (shouldLeavingViewBeRemoved) {
          this.viewItems = this.viewItems.filter(x => x !== leavingViewItem);
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
              // duration: 1500,
              duration: direction === undefined ? 0 : undefined,
              direction: direction as any,
              showGoBack: direction === 'forward',
              progressAnimation: false
            });
            this.routerOutletElement.removeChild(newLeavingElement);
          }
        } else {
          await this.routerOutletElement.commit(enteringViewItem.ionPageElement, leavingViewItem?.ionPageElement, {
            deepWait: true,
            // duration: 1500,
            duration: direction === undefined ? 0 : undefined,
            direction: direction as any,
            showGoBack: direction === 'forward',
            progressAnimation: false
          });
          if (leavingViewItem && leavingViewItem.ionPageElement) {
            leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
            leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
          }
        }
      }

    } else {
      enteringViewItem.mount = true;
      enteringViewItem.routeData.match = match!;
    } // TODO: this else block needed?

    if (leavingViewItem) {
      if (!leavingViewItem.ionRoute) {
        this.viewItems = this.viewItems.filter(x => x !== leavingViewItem);
      }
    }

    this.forceUpdate();
  }

  render() {
    const { children } = this.props;
    const ionRouterOutlet = React.Children.only(children) as React.ReactElement;
    this.ionRouterOutlet = ionRouterOutlet;
    const components = this.renderChildren(ionRouterOutlet);
    return (
      <StackContext.Provider value={{ registerIonPage: this.registerIonPage }}>
        {components}
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

function createViewItem(reactElement: React.ReactElement, routeInfo: RouteInfo, page?: HTMLElement) {
  const viewItem: ViewItem = {
    id: generateId(),
    ionPageElement: page,
    reactElement,
    mount: true,
    ionRoute: false
  };

  const matchProps = {
    exact: reactElement.props.exact,
    path: reactElement.props.path || reactElement.props.from,
    component: reactElement.props.component
  };

  const match = matchPath(routeInfo.pathname, matchProps);

  viewItem.routeData = {
    match,
    childProps: reactElement.props
  };

  return viewItem;
}

function findViewItemByRoute(viewItems: ViewItem[], pathname?: string) {
  if (!pathname) {
    return {
      viewItem: undefined,
      match: undefined
    };
  }

  let viewItem: ViewItem | undefined;
  let match: ReturnType<typeof matchPath> | undefined;

  viewItems.some(matchView);

  if (!viewItem) {
    viewItems.some(r => {
      // try to find a route that doesn't have a path or from prop, that will be our not found route
      if (!r.routeData.childProps.path && !r.routeData.childProps.from) {
        match = {
          path: pathname,
          url: pathname,
          isExact: true,
          params: {}
        };
        viewItem = r;
        return true;
      }
      return false;
    });
  }

  return { viewItem, match };

  function matchView(v: ViewItem) {
    const matchProps = {
      exact: v.routeData.childProps.exact,
      path: v.routeData.childProps.path || v.routeData.childProps.from,
      component: v.routeData.childProps.component
    };
    const myMatch = matchPath(pathname!, matchProps);
    if (myMatch) {
      viewItem = v;
      match = myMatch;
      return true;
    }
    return false;
  }
}

function matchComponent(node: React.ReactNode, routeInfo: RouteInfo) {
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
  return matchedNode;
}
