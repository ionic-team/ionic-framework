import React from 'react';

import { RouteInfo } from '../models/RouteInfo';

export interface StackContextState {
  registerIonPage: (page: HTMLElement, routeInfo: RouteInfo) => void;
  syncIonPage: (page: HTMLElement, routeInfo: RouteInfo) => void;
  isInOutlet: () => boolean;
}

export const StackContext = React.createContext<StackContextState>({
  registerIonPage: () => undefined,
  syncIonPage: () => undefined,
  isInOutlet: () => false
});
