import {
  RouteInfo,
  RouteManagerContext,
  StackContext,
  generateId
} from '@ionic/react';
import React from 'react';

interface StackManagerProps {
  routeInfo: RouteInfo;
}

interface StackManagerState { }

export class StackManager extends React.Component<StackManagerProps, StackManagerState> {
  id: string;
  context!: React.ContextType<typeof RouteManagerContext>;
  ionRouterOutlet?: React.ReactElement;
  routerOutletElement: HTMLIonRouterOutletElement | undefined;
  firstRender = true;
  routerContextSubscriptions: (() => void)[] = [];

  constructor(props: StackManagerProps) {
    super(props);
    this.registerIonPage = this.registerIonPage.bind(this);
    this.transitionPage = this.transitionPage.bind(this);
    this.id = generateId('routerOutlet');
    this.state = {};
  }

  componentDidMount() {
    if (this.routerOutletElement) {
      console.log('SM Mount - ' + this.routerOutletElement.id);
      this.routerContextSubscriptions.push(
        this.context.onRouteChange(this.handlePageTransition.bind(this))
      );
      this.firstRender = false;
    }
  }

  componentWillUnmount() {
    console.log('SM UNMount - ' + (this.routerOutletElement?.id as any).id);
    this.routerContextSubscriptions.forEach(unsubscribe => unsubscribe());
  }

  shouldComponentUpdate() {
    return false;
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
    // const matchedNode = matchComponent(this.ionRouterOutlet!.props.children, routeInfo) as React.ReactElement;
    // if (matchedNode) {
    // const { viewItem: foundView } = findViewItemByRoute(this.viewItems, routeInfo.pathname);
    const foundView = this.context.findViewItemByRouteInfo(this.id, routeInfo);
    if (foundView) {
      foundView.ionPageElement = page;
      // TODO: check to make sure component still updates (redux/etc...)
      // foundView.reactElement = matchedNode as any;
      foundView.ionRoute = true;
    }
    this.handlePageTransition(routeInfo);
  }

  async transitionPage(routeInfo: RouteInfo) {
    const enteringViewItem = this.context.findViewItemByRouteInfo(this.id, routeInfo);
    let leavingViewItem = this.context.findLeavingViewItemByRouteInfo(this.id, routeInfo);

    if (!enteringViewItem || !enteringViewItem.ionPageElement) {
      if (enteringViewItem) {
        // The ionPage hasn't been rendered yet, try again in a moment
        enteringViewItem.routeData.pendingTransition = true;
      } else {
        // TODO: investigatge moving viewitem creation here insetead of in reader/getChildren
        // this.forceUpdate();
      }
      return;
    }

    if (enteringViewItem.ionRoute) {
      if (routeInfo.lastPathname && (!leavingViewItem || !leavingViewItem.ionRoute)) {
        const viewFromOtherOutlet = this.context.getViewItemForTransition(routeInfo.lastPathname);
        if (leavingViewItem) {
          this.context.unMountViewItem(leavingViewItem);
        }
        if (viewFromOtherOutlet) {
          leavingViewItem = viewFromOtherOutlet;
        }
      }

      if (routeInfo.routeAction === 'push' && routeInfo.routeDirection === 'forward') {
        // enteringViewItem.prevId = leavingViewItem.id;
      } else {
        const shouldLeavingViewBeRemoved = routeInfo.routeDirection !== 'none' && leavingViewItem && (enteringViewItem !== leavingViewItem);
        if (shouldLeavingViewBeRemoved) {
          this.context.unMountViewItem(leavingViewItem!);
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

    this.forceUpdate();
  }

  render() {
    const { children } = this.props;
    const ionRouterOutlet = React.Children.only(children) as React.ReactElement;
    this.ionRouterOutlet = ionRouterOutlet;
    const components = this.context.getChildrenToRender(this.id, this.ionRouterOutlet, this.props.routeInfo);
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

// TODO: keep until the todo in registerIonPage is done
// function matchComponent(node: React.ReactNode, routeInfo: RouteInfo) {
//   let matchedNode: React.ReactNode;
//   React.Children.forEach(node as React.ReactElement, (child: React.ReactElement) => {
//     const matchProps = {
//       exact: child.props.exact,
//       path: child.props.path || child.props.from,
//       component: child.props.component
//     };
//     const match = matchPath(routeInfo.pathname, matchProps);
//     if (match) {
//       matchedNode = child;
//     }
//   });
//   return matchedNode;
// }
