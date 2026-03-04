/**
 * `IonReactHashRouter` provides a way to use hash-based routing in Ionic
 * React applications.
 */

import type { Action as HistoryAction, Location as HistoryLocation } from 'history';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef } from 'react';
import type { HashRouterProps } from 'react-router-dom';
import { HashRouter, useLocation, useNavigationType } from 'react-router-dom';

import { IonRouter } from './IonRouter';

const RouterContent = ({ children }: PropsWithChildren<{}>) => {
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

  return <IonRouter registerHistoryListener={registerHistoryListener}>{children}</IonRouter>;
};

export const IonReactHashRouter = ({ children, ...routerProps }: PropsWithChildren<HashRouterProps>) => {
  return (
    <HashRouter {...routerProps}>
      <RouterContent>{children}</RouterContent>
    </HashRouter>
  );
};
