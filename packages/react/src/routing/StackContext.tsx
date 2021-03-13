import React from 'react';

import { RouteInfo } from '../models/RouteInfo';

export interface StackContextState {
  registerIonPage: (page: HTMLElement, routeInfo: RouteInfo) => void;
  isInOutlet: () => boolean;
}

export const StackContext = React.createContext<StackContextState>({
  registerIonPage: () => undefined,
  isInOutlet: () => false,
});
