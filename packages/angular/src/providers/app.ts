import { PublicNav } from '@ionic/core';

export class App {

  _element: HTMLIonAppElement;
  constructor() {
    this._element = document.querySelector('ion-app');
  }

  setTitle(title: string) {
    document.title = title;
  }

  isScrolling(): boolean {
    return isScrollingImpl(this);
  }

  getRootNavs(): PublicNav[] {
    return getRootNavsImpl(this);
  }

  getTopNavs(rootNavId?: number): PublicNav[] {
    return getTopNavsImpl(this, rootNavId);
  }

  getNavByIdOrName(nameOrId: number | string): PublicNav {
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

export function getTopNavsImpl(app: App, rootNavId?: number): PublicNav[] {
  if (app._element && app._element.getTopNavs) {
    return app._element.getTopNavs(rootNavId);
  }
  return [];
}

export function getNavByIdOrNameImpl(app: App, nameOrId: number | string): PublicNav {
  if (app._element && app._element.getNavByIdOrName) {
    return app._element.getNavByIdOrName(nameOrId);
  }
  return null;
}