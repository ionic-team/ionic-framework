import React from 'react';
import { ViewItem } from './ViewItem';
import { NavDirection } from '@ionic/core';
import { Location } from 'history';


export interface ViewStack {
  routerOutlet: HTMLIonRouterOutletElement;
  activeId?: string,
  // prevId?: string,
  views: ViewItem[]
}

export interface ViewStacks {
  [key: string]: ViewStack;
}

export interface NavContextState {
  hideView: (viewId: string) => void;
  viewStacks: ViewStacks;
  registerViewStack: (stack: string, activeId: string, stackItems: ViewItem[], ionRouterOutlet: HTMLIonRouterOutletElement, location: Location) => void;
  removeViewStack: (stack: string) => void;
  goBack: (defaultHref?: string) => void;
  transitionView: (enteringEl: HTMLElement, leavingEl: HTMLElement, ionRouterOuter: HTMLIonRouterOutletElement, direction: NavDirection) => void;
}

export const NavContext = /*@__PURE__*/React.createContext<NavContextState>({
  viewStacks: {},
  hideView: () => { navContextNotFoundError(); },
  goBack: () => { navContextNotFoundError(); },
  registerViewStack: () => { navContextNotFoundError(); },
  removeViewStack: () => { navContextNotFoundError(); },
  transitionView: () => { navContextNotFoundError(); }
});

function navContextNotFoundError() {
  console.error('IonRouter not found, did you add it to the app?')
}
