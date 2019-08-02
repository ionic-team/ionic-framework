import { RouterDirection } from '@ionic/core';
import React from 'react';

export interface NavContextState {
  getHistory: () => History;
  getLocation: () => Location;
  getViewManager: () => any;
  goBack: (defaultHref?: string) => void;
  navigate: (path: string, direction?: RouterDirection) => void;
  hasIonicRouter: () => boolean;
  currentPath: string | undefined;
}

export const NavContext = /*@__PURE__*/React.createContext<NavContextState>({
  getHistory: () => window.history,
  getLocation: () => window.location,
  getViewManager: () => undefined,
  goBack: (defaultHref?: string) => {
    if (defaultHref !== undefined) {
      window.location.pathname = defaultHref;
    } else {
      window.history.back();
    }
  },
  navigate: (path: string) => { window.location.pathname = path; },
  hasIonicRouter: () => false,
  currentPath: undefined
});
