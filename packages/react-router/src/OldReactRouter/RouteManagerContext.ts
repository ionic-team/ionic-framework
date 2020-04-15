import React, { ReactNode } from 'react';

import { ViewStacks } from './ViewStacks';

export interface RouteManagerContextState {
  syncView: (page: HTMLElement, viewId: string) => void;
  syncRoute: (route: any) => void;
  hideView: (viewId: string) => void;
  viewStacks: ViewStacks;
  setupIonRouter: (id: string, children: ReactNode, routerOutlet: HTMLIonRouterOutletElement) => void;
  removeViewStack: (stack: string) => void;
  getRoute: (id: string) => any;
}

export const RouteManagerContext = /*@__PURE__*/React.createContext<RouteManagerContextState>({
  viewStacks: new ViewStacks(),
  syncView: () => { navContextNotFoundError(); },
  syncRoute: () => { navContextNotFoundError(); },
  hideView: () => { navContextNotFoundError(); },
  setupIonRouter: () => Promise.reject(navContextNotFoundError()),
  removeViewStack: () => { navContextNotFoundError(); },
  getRoute: () => { navContextNotFoundError(); }
});

function navContextNotFoundError() {
  console.error('IonReactRouter not found, did you add it to the app?');
}
