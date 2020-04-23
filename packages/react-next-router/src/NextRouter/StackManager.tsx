import {
  RouteInfo,
  RouteManagerContext,
  StackContext,
  ViewItem,
  ViewLifeCycleManager,
  generateId
} from '@ionic/react';
import React from 'react';

import { NextRouteInfo } from './NextRouteInfo';

interface StackManagerProps {
  routeInfo: NextRouteInfo;
}

interface StackManagerState { }

class StackManager extends React.Component<StackManagerProps, StackManagerState> {
  context!: React.ContextType<typeof RouteManagerContext>;
  viewItems: ViewItem[] = [];
  ionRouterOutlet?: React.ReactElement;
  routerOutletElement: HTMLIonRouterOutletElement | undefined;
  firstRender = true;
  routerContextSubscriptions: (() => void)[] = [];

  constructor(props: StackManagerProps) {
    super(props);
    this.handlePageTransition = this.handlePageTransition.bind(this);
    this.setupFirstPage = this.setupFirstPage.bind(this);
    this.registerIonPage = this.registerIonPage.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
  }

  componentDidMount() {
    if (this.routerOutletElement) {
      console.log('SM Mount - ' + this.routerOutletElement.id);
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
    console.log('SM UNMount - ' + (this.routerOutletElement?.id as any).id);
    this.routerContextSubscriptions.forEach(unsubscribe => unsubscribe());
  }

  shouldComponentUpdate(nextProps: any) {
    return this.props.children !== nextProps.children;
  }

  exitViewFromOtherOutlet(_pathname: string) {
    // const { viewItem } = findViewItemByRoute(this.viewItems, pathname);
    // if (viewItem) {

    //   this.viewItems = this.viewItems.filter(v => {
    //     const matchProps = {
    //       exact: v.routeData.childProps.exact,
    //       path: v.routeData.childProps.path || v.routeData.childProps.props.from,
    //       component: v.routeData.childProps.component
    //     };
    //     const match = matchPath(this.props.routeInfo.pathname, matchProps);
    //     return !!match;
    //   });

    //   this.forceUpdate();
    // }
  }

  async handlePageTransition(routeInfo: RouteInfo) {
    // If routerOutlet isn't quite ready, give it another try in a moment
    if (!this.routerOutletElement || !this.routerOutletElement.commit) {
      setTimeout(() => this.handlePageTransition(routeInfo), 10);
    } else {
      this.transitionPage(routeInfo);
    }
  }

  async setupFirstPage() {
    const enteringViewItem = findViewItemByRoute(this.viewItems, this.props.routeInfo.routeOptions?.routePath);
    if (enteringViewItem) {
      this.handlePageTransition(this.props.routeInfo);
    }
  }

  registerIonPage(page: HTMLElement, routeInfo: NextRouteInfo) {
    const foundView = findViewItemByRoute(this.viewItems, routeInfo.routeOptions?.routePath);
    if (foundView) {
      foundView.ionPageElement = page;
      foundView.ionRoute = true;
    }
    if (foundView?.routeData.pendingTransition) {
      this.firstRender = false;
    }
  }

  renderChildren(ionRouterOutlet: React.ReactElement) {

    const children: React.ReactNode[] = [];

    const child = React.Children.only(ionRouterOutlet.props.children);
    let foundChild = false;

    this.viewItems.forEach(viewItem => {
      const viewManagerChild = React.Children.only(viewItem.reactElement.props.children);
      // if (viewItem.reactElement.type === child.type) {
      if (viewManagerChild.type === child.type) {
        foundChild = true;
      }
      children.push(viewItem.reactElement);
    });

    if (!foundChild) {
      const newViewItem = createViewItem(child, this.props.routeInfo);
      this.viewItems.push(newViewItem);
      children.push(newViewItem.reactElement);
    }

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

  async transitionPage(routeInfo: NextRouteInfo) {

    const enteringViewItem = findViewItemByRoute(this.viewItems, routeInfo.routeOptions?.routePath);
    const leavingViewItem = findViewItemByRoute(this.viewItems, routeInfo.routeOptions?.lastRoutePath);

    if (!enteringViewItem || !enteringViewItem.ionPageElement) {
      if (enteringViewItem) {
        enteringViewItem.routeData.pendingTransition = true;
      }
      return;
    }

    if (enteringViewItem.ionRoute) {

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
            duration: direction === undefined ? 0 : undefined,
            direction: direction as any,
            showGoBack: direction === 'forward',
            progressAnimation: false
          });
          if (leavingViewItem && leavingViewItem.ionPageElement) {
            /** add hidden attributes */
            leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
            leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
          }
        }
      }
    }

    if (leavingViewItem) {
      if (!leavingViewItem.ionRoute) {
        this.viewItems = this.viewItems.filter(x => x !== leavingViewItem);
      }
    }

    this.forceUpdate();
  }

  render() {
    // debugger;
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

function createViewItem(reactElement: React.ReactElement | undefined, routeInfo: NextRouteInfo, page?: HTMLElement) {
  const id = generateId('viewItem');
  const viewItem: ViewItem = {
    id,
    ionPageElement: page,
    reactElement: (
      <ViewLifeCycleManager key={`view-${id}`}>
        {reactElement}
      </ViewLifeCycleManager>
    ),
    mount: true,
    ionRoute: false,
    routeData: {
      pendingTransition: true,
      route: routeInfo.routeOptions?.routePath
    }
  };

  return viewItem;
}

function findViewItemByRoute(viewItems: ViewItem[], route?: string) {
  if (!route) {
    return undefined;
  }
  const viewItem = viewItems.find(x => x.routeData.route === route);
  return viewItem;
}
