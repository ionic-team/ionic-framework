import type { PropsWithChildren } from 'react';
import React from 'react';
import type { BrowserRouterProps } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import { IonRouter } from './IonRouter';

/**
 * Wrapper around react-router-dom's BrowserRouter that provides a context for IonRouterOutlet.
 * Ionic developers should use IonReactRouter instead of BrowserRouter when using React Router.
 */
export function IonReactRouter({ children, ...props }: PropsWithChildren<BrowserRouterProps>) {
  return (
    <BrowserRouter {...props}>
      <IonRouter>{children}</IonRouter>
    </BrowserRouter>
  );
}
