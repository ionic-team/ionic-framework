import type { PropsWithChildren } from 'react';
import React from 'react';
import type { BrowserRouterProps } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import { IonRouter } from './IonRouter';

/**
 * Wrapper around react-router-dom's BrowserRouter that provides a context for IonRouterOutlet.
 * Ionic developers should use IonReactRouter instead of BrowserRouter when using React Router.
 */
export function IonReactRouter({ children }: PropsWithChildren<BrowserRouterProps>) {
  // BrowserRouter is used so that the route state is kept in sync with the browser history.
  // This reflects the current route in the URL.
  return (
    <BrowserRouter>
      <IonRouter>{children}</IonRouter>
    </BrowserRouter>
  );
}
