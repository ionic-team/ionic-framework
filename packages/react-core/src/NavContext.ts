import React from 'react';
import { RouterDirection } from '@ionic/core';

export interface NavContextState {
  // hideView: (viewId: string) => void;
  // viewStacks: ViewStacks;
  // setupIonRouter: (id: string, children: ReactNode, routerOutlet: HTMLIonRouterOutletElement) => void;
  // removeViewStack: (stack: string) => void;
  // renderChild: (item: ViewItem) => void;
  getHistory: () => History;
  getLocation: () => Location;
  getViewManager: () => any;
  goBack: (defaultHref?: string) => void;
  // transitionView: (enteringEl: HTMLElement, leavingEl: HTMLElement, ionRouterOuter: HTMLIonRouterOutletElement, direction: NavDirection) => void;
  navigate: (path: string, direction?: RouterDirection) => void;
  hasIonicRouter: () => boolean;
}

export const NavContext = /*@__PURE__*/React.createContext<NavContextState>({
  // viewStacks: {},
  // hideView: () => { navContextNotFoundError(); },
  getHistory: () => window.history,
  getLocation: () => window.location,
  getViewManager: () => undefined,
  goBack: (defaultHref?: string) => {
    if(defaultHref) {
      window.location.pathname = defaultHref;
    } else {
      window.history.back();
    }
  },
  // setupIonRouter: () => { navContextNotFoundError() },
  // removeViewStack: () => { navContextNotFoundError(); },
  // renderChild: () => { navContextNotFoundError(); },
  // transitionView: () => { navContextNotFoundError(); },
  navigate: (path: string) => { window.location.pathname = path },
  hasIonicRouter: () => false
});
