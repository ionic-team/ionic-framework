import React, { ReactNode } from 'react';
import { ViewItem } from './ReactRouter/ViewItem';
import { NavDirection, RouterDirection } from '@ionic/core';

export interface ViewStack {
  routerOutlet: HTMLIonRouterOutletElement;
  activeId?: string,
  views: ViewItem[]
}

export interface ViewStacks {
  [key: string]: ViewStack;
}

export interface NavContextState {
  hideView: (viewId: string) => void;
  viewStacks: ViewStacks;
  setupIonRouter: (id: string, children: ReactNode, routerOutlet: HTMLIonRouterOutletElement) => void;
  removeViewStack: (stack: string) => void;
  renderChild: (item: ViewItem) => void;
  goBack: (defaultHref?: string) => void;
  transitionView: (enteringEl: HTMLElement, leavingEl: HTMLElement, ionRouterOuter: HTMLIonRouterOutletElement, direction: NavDirection) => void;
  navigate: (path: string, direction?: RouterDirection) => void;
  hasIonicRouter: () => boolean;
}

export const NavContext = /*@__PURE__*/React.createContext<NavContextState>({
  viewStacks: {},
  hideView: () => { navContextNotFoundError(); },
  goBack: () => { navContextNotFoundError(); },
  setupIonRouter: () => { navContextNotFoundError() },
  removeViewStack: () => { navContextNotFoundError(); },
  renderChild: () => { navContextNotFoundError(); },
  transitionView: () => { navContextNotFoundError(); },
  navigate: () => { navContextNotFoundError(); },
  hasIonicRouter: () => false
});

function navContextNotFoundError() {
  console.error('IonReactRouter not found, did you add it to the app?')
}
