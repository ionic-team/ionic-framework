import { Component, Element, Listen, Prop } from '@stencil/core';
import { Nav, NavContainer, OverlayPortal } from '../../navigation/nav-interfaces';
import { Config } from '../..';
import { App } from './app-interfaces';
import { isReady } from '../../utils/helpers';

import {
  PORTAL_DEFAULT,
  PORTAL_LOADING,
  PORTAL_MODAL,
  PORTAL_TOAST
} from './app-constants';

const rootNavs = new Map<number, Nav>();
const portals = new Map<string, OverlayPortal>();

@Component({
  tag: 'ion-app',
  styleUrls: {
    ios: 'app.ios.scss',
    md: 'app.md.scss',
    wp: 'app.wp.scss'
  },
  host: {
    theme: 'app'
  }
})
export class IonApp implements App {

  @Element() element: HTMLElement;
  @Prop({ context: 'config' }) config: Config;

  @Listen('body:navInit')
  registerRootNav(event: CustomEvent) {
    rootNavs.set((event.detail as Nav).id, (event.detail as Nav));
  }

  @Listen('body:registerPortal')
  registerPortal(event: CustomEvent) {
    portals.set((event.detail as OverlayPortal).type, (event.detail as OverlayPortal));
  }

  componentWillLoad() {
    componentDidLoadImpl(this);
  }

  getActiveNavs(rootNavId?: number): Nav[] {
    const portal = portals.get(PORTAL_MODAL);
    if (portal && portal.views && portal.views.length) {
      return findTopNavs(portal);
    }
    if (!rootNavs.size) {
      return [];
    }
    if (rootNavId) {
      return findTopNavs(rootNavs.get(rootNavId));
    }
    if (rootNavs.size === 1) {
      return findTopNavs(rootNavs.values().next().value);
    }
    // fallback to just using all root navs
    let activeNavs: Nav[] = [];
    rootNavs.forEach(nav => {
      activeNavs = activeNavs.concat(findTopNavs(nav));
    });
    return activeNavs;
  }

  getNavByIdOrName(nameOrId: number | string) {
    const navs = Array.from(rootNavs.values());
    for (const navContainer of navs) {
      const match = getNavByIdOrNameImpl(navContainer, nameOrId);
      if (match) {
        return match;
      }
    }
    return null;
  }

  render() {
    return ([
      <slot></slot>,
      <ion-overlay-portal type={PORTAL_MODAL}></ion-overlay-portal>,
      <ion-overlay-portal type={PORTAL_DEFAULT}></ion-overlay-portal>,
      <ion-overlay-portal type={PORTAL_LOADING}></ion-overlay-portal>,
      <ion-overlay-portal type={PORTAL_TOAST}></ion-overlay-portal>,
    ]);
  }
}


export function findTopNavs(nav: NavContainer): NavContainer[] {
  let containers: NavContainer[] = [];
  const childNavs = nav.getActiveChildNavs();
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

export function componentDidLoadImpl(app: App) {
  app.element.classList.add(app.config.get('mode'));
  // TODO add platform classes
  if (app.config.getBoolean('hoverCSS', true)) {
    app.element.classList.add('enable-hover');
  }
  // TODO fire platform ready
}

export function handleBackButtonClick(): Promise<any> {
  // if there is a menu controller dom element, hydrate it, otherwise move on
  // TODO ensure ion-menu-controller is the name
  const menuControllerElement = document.querySelector('ion-menu-controller'); // TODO - use menu controller types
  const promise = menuControllerElement ?  isReady(menuControllerElement) : Promise.resolve();
  return promise.then(() => {
    // TODO check if the menu is open, close it if so
    console.log('todo');
  });
}






