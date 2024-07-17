import type { Action as HistoryAction, History, Location as HistoryLocation } from 'history';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef } from 'react';
import type { BrowserRouterProps } from 'react-router-dom';
import { BrowserRouter, useLocation } from 'react-router-dom';

import { IonRouter } from './IonRouter';

interface IonReactRouterProps extends BrowserRouterProps {
  history?: History;
}

export const IonReactRouter = ({ children }: PropsWithChildren<IonReactRouterProps>) => {
  const location = useLocation();

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
    handleHistoryChange(location, 'POP'); // TODO @sean unsure about this
  }, [location]);

  return (
    <BrowserRouter>
      <IonRouter registerHistoryListener={registerHistoryListener}>{children}</IonRouter>
    </BrowserRouter>
  );
};
