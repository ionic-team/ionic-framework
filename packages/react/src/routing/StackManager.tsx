
import React, { ReactElement, ReactNode } from 'react';

import { DefaultIonLifeCycleContext } from '../contexts/IonLifeCycleContext';
import { RouteInfo } from '../models/RouteInfo';

import { RouteManagerContext } from './RouteManagerContext';
import { ViewLifeCycleManager } from './ViewLifeCycleManager';

export interface StackContextState {
  registerIonPage: (page: HTMLElement) => void;

}

export const StackContext = React.createContext<StackContextState>({
  registerIonPage: () => undefined
});

interface StackManagerProps { }

interface ViewItem {
  id: string;
  reactElement?: ReactElement;
  ionPageElement?: HTMLElement | undefined;
  mount: boolean;
}

interface StackManagerState { }

export class StackManager extends React.Component<StackManagerProps, StackManagerState> {
  ionLifeCycleContext = new DefaultIonLifeCycleContext();
  context!: React.ContextType<typeof RouteManagerContext>;
  pages: Map<string, ViewItem> = new Map();
  leavingElement: HTMLElement | undefined;

  routerOutlet: HTMLIonRouterOutletElement | undefined;

  constructor(props: StackManagerProps) {
    super(props);
    this.handlePageTransition = this.handlePageTransition.bind(this);
    this.setupFirstPage = this.setupFirstPage.bind(this);
    this.registerIonPage = this.registerIonPage.bind(this);
  }

  componentDidMount() {
    if (this.routerOutlet) {
      this.context.onRouteChange(this.handlePageTransition);
      this.setupFirstPage(this.context.routerInfo);
    }
  }

  componentWillUnmount() {
    // Todo: unregister events from nav context
  }

  async handlePageTransition(routeInfo: RouteInfo) {
    // const { router } = this.context;
    const enteringViewItem = this.pages.get(routeInfo.currentRoute);
    const leavingViewItem = this.pages.get(routeInfo.lastRoute!);

    if (routeInfo.routeAction === 'push' && routeInfo.routeDirection === 'forward') {
      // enteringViewItem.prevId = leavingViewItem.id;
    } else {
      const shouldLeavingViewBeRemoved = routeInfo.routeDirection !== 'none' && leavingViewItem && (enteringViewItem !== leavingViewItem);
      if (shouldLeavingViewBeRemoved) {
        this.pages.delete(routeInfo.lastRoute!);
        // routeInfo.lastPathname = undefined;
      }

    }

    const direction = (routeInfo.routeDirection === 'none' || routeInfo.routeDirection === 'root')
      ? undefined
      : routeInfo.routeDirection;

    if (enteringViewItem && enteringViewItem.ionPageElement && this.routerOutlet) {
      if (leavingViewItem && leavingViewItem.ionPageElement && (enteringViewItem === leavingViewItem)) {
        // If a page is transitioning to another version of itself
        // we clone it so we can have an animation to show
        const newLeavingElement = clonePageElement(leavingViewItem.ionPageElement.outerHTML);
        if (newLeavingElement) {
          this.routerOutlet.appendChild(newLeavingElement);
          await this.routerOutlet.commit(enteringViewItem.ionPageElement, newLeavingElement, {
            deepWait: true,
            // duration: 1500,
            duration: direction === undefined ? 0 : undefined,
            direction: direction as any,
            showGoBack: direction === 'forward',
            progressAnimation: false
          });
          this.routerOutlet.removeChild(newLeavingElement);
        }
      } else {
        await this.routerOutlet.commit(enteringViewItem.ionPageElement, leavingViewItem?.ionPageElement, {
          // this.routerOutlet.appendChild(this.leavingElement);
          // this.routerOutlet.removeChild(leavingViewItem.ionPageElement);
          // await this.routerOutlet.commit(enteringViewItem.ionPageElement, this.leavingElement, {
          deepWait: true,
          // duration: 1500,
          duration: direction === undefined ? 0 : undefined,
          direction: direction as any,
          showGoBack: direction === 'forward',
          progressAnimation: false
        });
        if (leavingViewItem && leavingViewItem.ionPageElement) {
          // this.routerOutlet.replaceChild(leavingViewItem.ionPageElement, this.leavingElement);
          // this.routerOutlet.removeChild(this.leavingElement);
          /** add hidden attributes */
          leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
          leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
        }
      }
    }
    this.forceUpdate();
  }

  async setupFirstPage(routeInfo: RouteInfo) {
    const enteringViewItem = this.pages.get(routeInfo.currentRoute);
    if (enteringViewItem && enteringViewItem.ionPageElement && this.routerOutlet) {
      await this.routerOutlet.commit(enteringViewItem.ionPageElement, undefined, {
        deepWait: true,
        duration: undefined,
        direction: undefined,
        showGoBack: false,
        progressAnimation: false
      });
    }
  }

  registerIonPage(page: HTMLElement) {
    const pageId = this.context.routerInfo.currentRoute;
    if (this.pages.has(pageId)) {
      this.pages.get(pageId)!.ionPageElement = page;
    } else {
      this.pages.set(pageId, {
        id: pageId,
        ionPageElement: page,
        mount: true
      });
    }
  }

  renderChildren(ionRouterOutlet: ReactNode) {
    const viewItems = Array.from(this.pages.values()).filter(v => v.mount);
    const component = React.cloneElement(ionRouterOutlet as any, {
      ref: (node: HTMLIonRouterOutletElement) => {
        this.routerOutlet = node;
        const { ref } = ionRouterOutlet as any;
        if (typeof ref === 'function') {
          ref(node);
        }
      }
    },
      viewItems.map(v => {
        return (
          <ViewLifeCycleManager key={v.id}>
            {v.reactElement}
          </ViewLifeCycleManager>
        );
      }
      )
    );
    return component;
  }

  render() {

    const { children } = this.props;
    const ionRouterOutlet = React.Children.only(children) as React.ReactElement;
    if (ionRouterOutlet.props.ionPageContainer) {
      if (!this.pages.has(this.context.routerInfo.currentRoute)) {
        this.pages.set(this.context.routerInfo.currentRoute, {
          id: this.context.routerInfo.currentRoute,
          reactElement: React.Children.only(ionRouterOutlet.props.children),
          mount: true
        });
      }
      return (
        <StackContext.Provider value={{ registerIonPage: this.registerIonPage }}>
          {this.renderChildren(ionRouterOutlet)}
        </StackContext.Provider>
      );
    } else {
      return React.cloneElement(ionRouterOutlet, {
        ref: (node: HTMLIonRouterOutletElement) => {
          this.routerOutlet = node;
          const { ref } = ionRouterOutlet as any;
          if (typeof ref === 'function') {
            ref(node);
          }
        }
      });
    }
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
