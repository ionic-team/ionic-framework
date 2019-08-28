import React, { ReactNode } from 'react';
import { NavDirection } from '@ionic/core';
import { ViewItem } from './ViewItem';

export interface ViewStack {
  id: string;
  ionRouterOutlet: React.ReactElement;
  routerOutlet: HTMLIonRouterOutletElement;
  activeId?: string,
  views: ViewItem[]
}

export interface ViewStacks {
  [key: string]: ViewStack;
}

export interface RouteManagerContextState {
  syncView: (page: HTMLIonPageElement, viewId: string) => void;
  hideView: (viewId: string) => void;
  viewStacks: ViewStacks;
  setupIonRouter: (id: string, children: ReactNode, routerOutlet: HTMLIonRouterOutletElement) => Promise<void>;
  removeViewStack: (stack: string) => void;
  transitionView: (enteringEl: HTMLElement, leavingEl: HTMLElement, ionRouterOuter: HTMLIonRouterOutletElement, direction: NavDirection) => void;
}

export const RouteManagerContext = /*@__PURE__*/React.createContext<RouteManagerContextState>({
  viewStacks: {},
  syncView: () => { navContextNotFoundError(); },
  hideView: () => { navContextNotFoundError(); },
  setupIonRouter: () => { return Promise.reject(navContextNotFoundError()) },
  removeViewStack: () => { navContextNotFoundError(); },
  transitionView: () => { navContextNotFoundError(); }
});

function navContextNotFoundError() {
  console.error('IonReactRouter not found, did you add it to the app?')
}
