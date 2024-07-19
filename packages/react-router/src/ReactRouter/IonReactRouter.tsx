import type { Action as HistoryAction, History, Location as HistoryLocation } from 'history';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef } from 'react';
import type { BrowserRouterProps } from 'react-router-dom';
import { BrowserRouter, useLocation, useNavigationType } from 'react-router-dom';

import { IonRouter } from './IonRouter';

interface IonReactRouterProps extends BrowserRouterProps {
  history?: History;
}

/**
 * `IonReactRouter` is Ionic's routing container component. It is a wrapper around `BrowserRouter` from `react-router-dom`.
 */
export const IonReactRouter = ({ children, ...rest }: PropsWithChildren<IonReactRouterProps>) => {
  return (
    <BrowserRouter>
      <IonInnerReactRouter {...rest}>{children}</IonInnerReactRouter>
    </BrowserRouter>
  );
};

/**
 * Browser router provides the context APIs for the hooks to work.
 */
const IonInnerReactRouter = ({ children }: PropsWithChildren<IonReactRouterProps>) => {
  const location = useLocation();
  const navigationType = useNavigationType();

  const historyListenHandler = useRef<(location: HistoryLocation, action: HistoryAction) => void>();

  const registerHistoryListener = (cb: (location: HistoryLocation, action: HistoryAction) => void) => {
    historyListenHandler.current = cb;
  };

  const handleHistoryChange = (location: HistoryLocation, action: HistoryAction) => {
    const locationValue = (location as any).location || location;
    const actionValue = (location as any).action || action;
    if (historyListenHandler.current) {
      historyListenHandler.current(locationValue, actionValue);
    }
  };

  useEffect(() => {
    handleHistoryChange(location, navigationType);
  }, [location, navigationType]);

  return <IonRouter registerHistoryListener={registerHistoryListener}>{children}</IonRouter>;
};
