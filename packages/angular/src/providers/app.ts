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

  getRootNavsAsync(): Promise<PublicNav[]> {
    return getRootNavsAsyncImpl(this);
  }

  getTopNavs(rootNavId?: number): PublicNav[] {
    return getTopNavsImpl(this, rootNavId);
  }

  getTopNavsAsync(rootNavId?: number): Promise<PublicNav[]> {
    return getTopNavsAsyncImpl(this, rootNavId);
  }

  getNavByIdOrName(nameOrId: number | string): PublicNav {
    return getNavByIdOrNameImpl(this, nameOrId);
  }

  getNavByIdOrNameAsync(nameOrId: number | string): Promise<PublicNav> {
    return getNavByIdOrNameAsyncImpl(this, nameOrId);
  }

  registerBackButtonAction(fn: Function, priority = 0): Promise<() => void> {
    return this._element.componentOnReady().then(() => {
      return this._element.registerBackButtonAction(fn, priority);
    });
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

export function getRootNavsAsyncImpl(app: App) {
  return app._element.componentOnReady().then(() => {
    return app._element.getRootNavs();
  });
}

export function getTopNavsImpl(app: App, rootNavId?: number): PublicNav[] {
  if (app._element && app._element.getTopNavs) {
    return app._element.getTopNavs(rootNavId);
  }
  return [];
}

export function getTopNavsAsyncImpl(app: App, rootNavId?: number): Promise<PublicNav[]> {
  return app._element.componentOnReady().then(() => {
    return app._element.getTopNavs(rootNavId);
  });
}

export function getNavByIdOrNameImpl(app: App, nameOrId: number | string): PublicNav {
  if (app._element && app._element.getNavByIdOrName) {
    return app._element.getNavByIdOrName(nameOrId);
  }
  return null;
}

export function getNavByIdOrNameAsyncImpl(app: App, nameOrId: number | string): Promise<PublicNav> {
  return app._element.componentOnReady().then(() => {
    return app._element.getNavByIdOrName(nameOrId);
  });
}
