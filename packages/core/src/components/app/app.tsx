import { Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '@stencil/core';
import { Config, NavEvent, OverlayController, PublicNav, PublicViewController } from '../../index';

import { getOrAppendElement } from '../../utils/helpers';
import { isCordova } from '../../global/platform-utils';

const rootNavs = new Map<number, HTMLIonNavElement>();
const ACTIVE_SCROLLING_TIME = 100;

@Component({
  tag: 'ion-app',
  styleUrls: {
    ios: 'app.ios.scss',
    md: 'app.md.scss'
  },
  host: {
    theme: 'app'
  }
})
export class App {

  private scrollTime = 0;

  @Element() element: HTMLElement;
  @Event() exitApp: EventEmitter<ExitAppEventDetail>;

  @State() modeCode: string;
  @State() hoverCSS = false;
  @State() useRouter = false;

  @Prop({ context: 'config' }) config: Config;

  componentWillLoad() {
    this.modeCode = this.config.get('mode');
    this.useRouter = this.config.getBoolean('useRouter', false);
    this.hoverCSS = this.config.getBoolean('hoverCSS', false);
  }

  @Listen('body:navInit')
  protected registerRootNav(event: NavEvent) {
    rootNavs.set(event.target.getId(), event.target);
  }

  /**
   * Returns an array of top level Navs
   */
  @Method()
  getRootNavs(): PublicNav[] {
    const navs: PublicNav[] = [];
    rootNavs.forEach((rootNav: PublicNav) => {
      navs.push(rootNav);
    });
    return navs;
  }

  /**
   * Returns whether the application is enabled or not
   */
  @Method()
  isEnabled(): boolean {
    return true;
  }

  /**
   * Boolean if the app is actively scrolling or not.
   * @return {boolean} returns true or false
   */
  @Method()
  isScrolling(): boolean {
    const scrollTime = this.scrollTime;
    if (scrollTime === 0) {
      return false;
    }
    if (scrollTime < Date.now()) {
      this.scrollTime = 0;
      return false;
    }
    return true;
  }

  @Method()
  setScrolling() {
    this.scrollTime = Date.now() + ACTIVE_SCROLLING_TIME;
  }

  @Method()
  getTopNavs(rootNavId = -1): PublicNav[] {
    return getTopNavsImpl(rootNavId);
  }

  @Method()
  getNavByIdOrName(nameOrId: number | string): PublicNav {
    const navs = Array.from(rootNavs.values());
    for (const navContainer of navs) {
      const match = getNavByIdOrNameImpl(navContainer, nameOrId);
      if (match) {
        return match;
      }
    }
    return null;
  }

  @Listen('document:backbutton')
  hardwareBackButtonPressed() {
    // check if menu exists and is open
    return checkIfMenuIsOpen().then((done: boolean) => {
      if (!done) {
        // we need to check if there is an action-sheet, alert, loading, picker, popover or toast open
        // if so, just return and don't do anything
        // Why? I have no idea, but that is the existing behavior in Ionic 3
        return checkIfNotModalOverlayIsOpen();
      }
      return done;
    }).then((done: boolean) => {
      if (!done) {
        // if there's a modal open, close that instead
        return closeModalIfOpen();
      }
      return done;
    }).then((done: boolean) => {
      // okay cool, it's time to pop a nav if possible
      if (!done) {
        return popEligibleView();
      }
      return done;
    }).then((done: boolean) => {
      if (!done) {
        // okay, we didn't find a nav that we can pop, so we should just exit the app
        // since each platform exits differently, just delegate it to the platform to
        // figure out how to exit
        return this.exitApp.emit();
      }
      return Promise.resolve();
    });
  }

  @Listen('document:paused')
  appResume(): void {
    return null;
  }

  @Listen('document:resume')
  appPaused(): void {
    return null;
  }

  hostData() {
    return {
      class: {
        [this.modeCode]: true,
        'enable-hover': this.hoverCSS
      }
    };
  }

  render() {
    const isDevice = true;
    return [
      isCordova() && <ion-cordova-platform/>,
      isDevice && <ion-tap-click />,
      isDevice && <ion-status-tap />,
      <slot></slot>
    ];
  }
}

export function getTopNavsImpl(rootNavId = -1) {
  if (!rootNavs.size) {
    return [];
  }

  if (rootNavId !== -1) {
    return findTopNavs(rootNavs.get(rootNavId));
  }

  if (rootNavs.size === 1) {
    return findTopNavs(rootNavs.values().next().value);
  }

  // fallback to just using all root navs
  let activeNavs: PublicNav[] = [];
  rootNavs.forEach(nav => {
    activeNavs = activeNavs.concat(findTopNavs(nav));
  });
  return activeNavs;
}

export function findTopNavs(nav: PublicNav): PublicNav[] {
  let containers: PublicNav[] = [];
  const childNavs = nav.getChildNavs();
  if (!childNavs || !childNavs.length) {
    containers.push(nav);
  } else {
    childNavs.forEach(childNav => {
      const topNavs = findTopNavs(childNav);
      containers = containers.concat(topNavs);
    });
  }
  return containers;
}

export function getNavByIdOrNameImpl(nav: PublicNav, id: number | string): PublicNav {
  if (nav.navId === id || nav.name === id) {
    return nav;
  }
  for (const child of nav.getChildNavs()) {
    const tmp = getNavByIdOrNameImpl(child, id);
    if (tmp) {
      return tmp;
    }
  }
  return null;
}

export function getHydratedController(tagName: string): Promise<HTMLElement> {
  const controller = getOrAppendElement(tagName);
  return (controller as any).componentOnReady();
}

export function checkIfMenuIsOpen(): Promise<boolean> {
  return getHydratedController('ion-menu-controller').then((menuController: HTMLIonMenuControllerElement) => {
    if (menuController.isOpen()) {
      return menuController.close().then(() => {
        return true;
      });
    }
    return false;
  });
}

export function checkIfNotModalOverlayIsOpen(): Promise<boolean> {
  const promises: Promise<any>[] = [];
  promises.push(checkIfOverlayExists('ion-action-sheet-controller'));
  promises.push(checkIfOverlayExists('ion-alert-controller'));
  promises.push(checkIfOverlayExists('ion-loading-controller'));
  promises.push(checkIfOverlayExists('ion-picker-controller'));
  promises.push(checkIfOverlayExists('ion-popover-controller'));
  promises.push(checkIfOverlayExists('ion-toast-controller'));
  return Promise.all(promises).then((results: boolean[]) => {
    return results.every((value: boolean) => !!value);
  });
}

export function checkIfOverlayExists(tagName: string): Promise<boolean> {
  const overlayControllerElement = document.querySelector(tagName) as any as OverlayController;
  if (!overlayControllerElement) {
    return Promise.resolve(false);
  }
  return (overlayControllerElement as any).componentOnReady().then(() => {
    return !!(overlayControllerElement.getTop());
  });
}

export function closeModalIfOpen(): Promise<boolean> {
  return getHydratedController('ion-modal-controller').then((modalController: HTMLIonModalControllerElement) => {
    if (modalController.getTop()) {
      return modalController.dismiss().then(() => {
        return true;
      });
    }
    return false;
  });
}

export function popEligibleView(): Promise<boolean> {
  let navToPop: PublicNav = null;
  let mostRecentVC: PublicViewController = null;
  rootNavs.forEach(nav => {
    const topNavs = getTopNavsImpl(nav.navId);
    const poppableNavs = topNavs.map(topNav => getPoppableNav(topNav)).filter(nav => !!nav).filter(nav => !!nav.last());
    poppableNavs.forEach(poppable => {
      const topViewController = poppable.last();
      if (!mostRecentVC || topViewController.timestamp >= mostRecentVC.timestamp) {
        mostRecentVC = topViewController;
        navToPop = poppable;
      }
    });
  });
  if (navToPop) {
    return navToPop.pop().then(() => {
      return true;
    });
  }
  return Promise.resolve(false);
}

export function getPoppableNav(nav: PublicNav): PublicNav {
  if (!nav) {
    return null;
  }

  // to be a poppable nav, a nav must a top view, plus a view that we can pop back to
  if (nav.getViews.length > 1) {
    return nav;
  }

  return getPoppableNav(nav.parent);
}

export interface ExitAppEvent extends CustomEvent {
  target: HTMLIonAppElement;
  detail: ExitAppEventDetail;
}

export interface ExitAppEventDetail {
}
