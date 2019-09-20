import React, { ReactNode } from 'react';
import { NavDirection } from '@ionic/core';
import { ViewStacks } from './ViewStacks';

export interface RouteManagerContextState {
  syncView: (page: HTMLElement, viewId: string) => void;
  hideView: (viewId: string) => void;
  viewStacks: ViewStacks;
  setupIonRouter: (id: string, children: ReactNode, routerOutlet: HTMLIonRouterOutletElement) => Promise<void>;
  removeViewStack: (stack: string) => void;
  transitionView: (enteringEl: HTMLElement, leavingEl: HTMLElement, ionRouterOuter: HTMLIonRouterOutletElement, direction: NavDirection) => void;
}

export const RouteManagerContext = /*@__PURE__*/React.createContext<RouteManagerContextState>({
  viewStacks: new ViewStacks(),
  syncView: () => { navContextNotFoundError(); },
  hideView: () => { navContextNotFoundError(); },
  setupIonRouter: () => { return Promise.reject(navContextNotFoundError()) },
  removeViewStack: () => { navContextNotFoundError(); },
  transitionView: () => { navContextNotFoundError(); }
});

function navContextNotFoundError() {
  console.error('IonReactRouter not found, did you add it to the app?')
}
