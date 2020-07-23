import { AnimationBuilder } from '@ionic/core';
import React, { useContext } from 'react';

import { RouteAction, RouterDirection, RouterOptions } from '../models';
import { RouteInfo } from '../models/RouteInfo';

export interface IonRouterContextState {
  routeInfo: RouteInfo;
  push: (pathname: string, routerDirection?: RouterDirection, routeAction?: RouteAction, routerOptions?: RouterOptions, animationBuilder?: AnimationBuilder) => void;
  back: (animationBuilder?: AnimationBuilder) => void;
  canGoBack: () => boolean;
}

export const IonRouterContext = React.createContext<IonRouterContextState>({
  routeInfo: undefined as any,
  push: () => { throw new Error('An Ionic Router is required for IonRouterContext'); },
  back: () => { throw new Error('An Ionic Router is required for IonRouterContext'); },
  canGoBack: () => { throw new Error('An Ionic Router is required for IonRouterContext'); }
});

export function useIonRouter() {
  const context = useContext(IonRouterContext);
  return context;
}
