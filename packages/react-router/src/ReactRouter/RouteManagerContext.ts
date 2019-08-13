import React, { ReactNode } from 'react';
import { NavDirection } from '@ionic/core';
import { ViewItem } from './ViewItem';

export interface ViewStack {
  routerOutlet: HTMLIonRouterOutletElement;
  activeId?: string,
  views: ViewItem[]
}

export interface ViewStacks {
  [key: string]: ViewStack;
}

export interface RouteManagerContextState {
  hideView: (viewId: string) => void;
  viewStacks: ViewStacks;
  setupIonRouter: (id: string, children: ReactNode, routerOutlet: HTMLIonRouterOutletElement) => void;
  removeViewStack: (stack: string) => void;
  renderChild: (item: ViewItem) => void;
  transitionView: (enteringEl: HTMLElement, leavingEl: HTMLElement, ionRouterOuter: HTMLIonRouterOutletElement, direction: NavDirection) => void;
}

export const RouteManagerContext = /*@__PURE__*/React.createContext<RouteManagerContextState>({
  viewStacks: {},
  hideView: () => { navContextNotFoundError(); },
  setupIonRouter: () => { navContextNotFoundError() },
  removeViewStack: () => { navContextNotFoundError(); },
  renderChild: () => { navContextNotFoundError(); },
  transitionView: () => { navContextNotFoundError(); }
});

function navContextNotFoundError() {
  console.error('IonReactRouter not found, did you add it to the app?')
}
