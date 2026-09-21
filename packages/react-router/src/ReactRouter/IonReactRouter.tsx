/**
 * `IonReactRouter` facilitates the integration of Ionic's specific
 * navigation and UI management with the standard React Router mechanisms,
 * allowing an inner Ionic-specific router (`IonRouter`) to react to
 * navigation events.
 */

import type { Action as HistoryAction, Location as HistoryLocation } from 'history';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef, useCallback } from 'react';
import type { BrowserRouterProps } from 'react-router-dom';
import { BrowserRouter, useLocation, useNavigationType } from 'react-router-dom';

import { IonRouter } from './IonRouter';

/**
 * This component acts as a bridge to ensure React Router hooks like
 * `useLocation` and `useNavigationType` are called within the valid
 * context of a `<BrowserRouter>`.
 *
 * It was split from `IonReactRouter` because these hooks must be
 * descendants of a `<Router>` component, which `BrowserRouter` provides.
 */
const RouterContent = ({ children }: PropsWithChildren<{}>) => {
  const location = useLocation();
  const navigationType = useNavigationType();

  const historyListenHandler = useRef<(location: HistoryLocation, action: HistoryAction) => void>();

  const registerHistoryListener = useCallback((cb: (location: HistoryLocation, action: HistoryAction) => void) => {
    historyListenHandler.current = cb;
  }, []);

  /**
   * Processes navigation changes within the application.
   *
   * Its purpose is to relay the current `location` and the associated
   * `action` ('PUSH', 'POP', or 'REPLACE') to any registered listeners,
   * primarily for `IonRouter` to manage Ionic-specific UI updates and
   * navigation stack behavior.
   *
   * @param loc The current browser history location object.
   * @param act The type of navigation action ('PUSH', 'POP', or
   * 'REPLACE').
   */
  const handleHistoryChange = useCallback((loc: HistoryLocation, act: HistoryAction) => {
    if (historyListenHandler.current) {
      historyListenHandler.current(loc, act);
    }
  }, []);

  useEffect(() => {
    handleHistoryChange(location, navigationType);
  }, [location, navigationType, handleHistoryChange]);

  return <IonRouter registerHistoryListener={registerHistoryListener}>{children}</IonRouter>;
};

export const IonReactRouter = ({ children, ...browserRouterProps }: PropsWithChildren<BrowserRouterProps>) => {
  return (
    <BrowserRouter {...browserRouterProps}>
      <RouterContent>{children}</RouterContent>
    </BrowserRouter>
  );
};
