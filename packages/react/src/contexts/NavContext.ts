import { RouterDirection } from '@ionic/core';
import React from 'react';

export interface NavContextState {
  getPageManager: () => any;
  getStackManager: () => any;
  goBack: (defaultHref?: string) => void;
  navigate: (path: string, direction?: RouterDirection | 'none') => void;
  hasIonicRouter: () => boolean;
  registerIonPage: (page: HTMLElement) => void;
  tabNavigate: (url: string) => void;
  currentPath: string | undefined;
}

export const NavContext = /*@__PURE__*/React.createContext<NavContextState>({
  getPageManager: () => undefined,
  getStackManager: () => undefined,
  goBack: (defaultHref?: string) => {
    if (defaultHref !== undefined) {
      window.location.pathname = defaultHref;
    } else {
      window.history.back();
    }
  },
  navigate: (path: string) => { window.location.pathname = path; },
  tabNavigate: () => undefined,
  hasIonicRouter: () => false,
  registerIonPage: () => undefined,
  currentPath: undefined
});
