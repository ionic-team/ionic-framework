import { Component, Element, Listen, Method, Prop, State } from '@stencil/core';
import { Config, Nav, NavContainer, NavEvent } from '../../index';
import { isReady } from '../../utils/helpers';

const rootNavs = new Map<number, HTMLIonNavElement>();

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

  @Element() element: HTMLElement;

  @State() modeCode: string;
  @State() hoverCSS = false;
  @State() useRouter = false;

  @Prop({ context: 'config' }) config: Config;

  componentWillLoad() {
    this.modeCode = this.config.get('mode');
    this.useRouter = this.config.getBoolean('useRouter', false);
    this.hoverCSS = this.config.getBoolean('hoverCSS', true);
  }

  @Listen('body:navInit')
  protected registerRootNav(event: NavEvent) {
    rootNavs.set(event.target.getId(), event.target);
  }


  /**
   * Returns an array of top level Navs
   */
  @Method()
  getRootNavs(): NavContainer[] {
    /*const navs: NavContainer[] = [];
    rootNavs.forEach((rootNav: NavContainer) => {
      navs.push(rootNav);
    });
    return navs;
    */
    return [];
  }


  /**
   * Check if the app is currently scrolling
   */
  @Method() isScrolling(): boolean {
    // TODO - sync with Manu
    return false;
  }

  @Method() getActiveNavs(rootNavId?: number): NavContainer[] {
    /*const portal = portals.get(PORTAL_MODAL);
    if (portal && portal.views && portal.views.length) {
      return findTopNavs(portal);
    }
    */
    // TODO - figure out if a modal is open, don't use portal
    /*if (!rootNavs.size) {
      return [];
    }
    if (rootNavId) {
      return findTopNavs(rootNavs.get(rootNavId));
    }
    if (rootNavs.size === 1) {
      return findTopNavs(rootNavs.values().next().value);
    }
    // fallback to just using all root navs
    let activeNavs: NavContainer[] = [];
    rootNavs.forEach(nav => {
      activeNavs = activeNavs.concat(findTopNavs(nav));
    });
    return activeNavs;
    */
    return [];
  }

  @Method() getNavByIdOrName(_nameOrId: number | string): any {
    /*const navs = Array.from(rootNavs.values());
    for (const navContainer of navs) {
      const match = getNavByIdOrNameImpl(navContainer, nameOrId);
      if (match) {
        return match;
      }
    }
    */
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
    const dom = [<slot></slot>];
    if (this.useRouter) {
      // dom.push(<ion-router-controller></ion-router-controller>);
    }
    return dom;
  }
}


export function findTopNavs(nav: NavContainer): NavContainer[] {
  let containers: NavContainer[] = [];
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

export function getNavByIdOrNameImpl(nav: NavContainer, id: number | string): NavContainer {
  if (nav.id === id || nav.name === id) {
    return nav;
  }
  for (const child of nav.getAllChildNavs()) {
    const tmp = getNavByIdOrNameImpl(child, id);
    if (tmp) {
      return tmp;
    }
  }
  return null;
}

export function handleBackButtonClick(): Promise<any> {
  // if there is a menu controller dom element, hydrate it, otherwise move on
  // TODO ensure ion-menu-controller is the name
  const menuControllerElement = document.querySelector('ion-menu-controller'); // TODO - use menu controller types
  const promise = menuControllerElement ?  isReady(menuControllerElement) : Promise.resolve();
  return promise.then(() => {
    // TODO check if the menu is open, close it if so
  });
}
