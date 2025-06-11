/**
 * `IonReactRouter` facilitates the integration of Ionic's specific
 * navigation and UI management with the standard React Router mechanisms,
 * allowing an inner Ionic-specific router (`IonRouter`) to react to
 * navigation events.
 */

import type { Action as HistoryAction, Location as HistoryLocation } from 'history';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef } from 'react';
import type { BrowserRouterProps } from 'react-router-dom';
import { BrowserRouter, useLocation, useNavigationType } from 'react-router-dom';

import { IonRouter } from './IonRouter';

export const IonReactRouter = ({ children }: PropsWithChildren<BrowserRouterProps>) => {
  const location = useLocation();
  const navigationType = useNavigationType();

  const historyListenHandler = useRef<(location: HistoryLocation, action: HistoryAction) => void>();

  const registerHistoryListener = (cb: (location: HistoryLocation, action: HistoryAction) => void) => {
    historyListenHandler.current = cb;
  };

  /**
   * Processes navigation changes within the application.
   *
   * Its purpose is to relay the current `location` and the associated
   * `action` ('PUSH', 'POP', or 'REPLACE') to any registered listeners,
   * primarily for `IonRouter` to manage Ionic-specific UI updates and
   * navigation stack behavior.
   *
   * @param location The current browser history location object.
   * @param action The type of navigation action ('PUSH', 'POP', or
   * 'REPLACE').
   */
  const handleHistoryChange = (location: HistoryLocation, action: HistoryAction) => {
    if (historyListenHandler.current) {
      historyListenHandler.current(location, action);
    }
  };

  useEffect(() => {
    handleHistoryChange(location, navigationType);
  }, [location, navigationType]);

  return (
    <BrowserRouter>
      <IonRouter registerHistoryListener={registerHistoryListener}>{children}</IonRouter>
    </BrowserRouter>
  );
};
