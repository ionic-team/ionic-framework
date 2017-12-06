import { NavContainer } from '@ionic/core';

export class App {

  constructor(public _element: HTMLIonAppElement) {
  }

  setTitle(title: string) {
    document.title = title;
  }

  isScrolling(): boolean {
    return isScrollingImpl(this);
  }

  getRootNavs(): NavContainer[] {
    return getRootNavsImpl(this);
  }

  getActiveNavs(rootNavId?: number): NavContainer[] {
    return getActiveNavsImpl(this, rootNavId);
  }

  getNavByIdOrName(nameOrId: number | string): NavContainer {
    return getNavByIdOrNameImpl(this, nameOrId);
  }
}

export function isScrollingImpl(app: App) {
  if (app._element && app._element.isScrolling) {
    return app._element.isScrolling();
  }
  return false;
}

export function getRootNavsImpl(app: App) {
  if (app._element && app._element.getRootNavs) {
    return app._element.getRootNavs();
  }
  return [];
}

export function getActiveNavsImpl(app: App, rootNavId?: number): NavContainer[] {
  if (app._element && app._element.getActiveNavs) {
    return app._element.getActiveNavs(rootNavId);
  }
  return [];
}

export function getNavByIdOrNameImpl(app: App, nameOrId: number | string): NavContainer {
  if (app._element && app._element.getNavByIdOrName) {
    return app._element.getNavByIdOrName(nameOrId);
  }
  return null;
}