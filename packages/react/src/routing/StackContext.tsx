import React from 'react';

import type { RouteInfo } from '../models/RouteInfo';

import type { ViewItem } from './ViewItem';

export interface StackContextState {
  /**
   * @param ownerViewItem The view that rendered the page, if the router knows it.
   */
  registerIonPage: (page: HTMLElement, routeInfo: RouteInfo, ownerViewItem?: ViewItem) => void;
  isInOutlet: () => boolean;
}

export const StackContext = React.createContext<StackContextState>({
  registerIonPage: () => undefined,
  isInOutlet: () => false,
});
