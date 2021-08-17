import { AnimationBuilder } from '@ionic/core';
import React, { useContext } from 'react';

import { RouteAction, RouterDirection, RouterOptions } from '../models';
import { RouteInfo } from '../models/RouteInfo';

export interface IonRouterContextState {
  routeInfo: RouteInfo;
  push: (
    pathname: string,
    routerDirection?: RouterDirection,
    routeAction?: RouteAction,
    routerOptions?: RouterOptions,
    animationBuilder?: AnimationBuilder
  ) => void;
  back: (animationBuilder?: AnimationBuilder) => void;
  canGoBack: () => boolean;
  nativeBack: () => void;
}

export const IonRouterContext = React.createContext<IonRouterContextState>({
  routeInfo: undefined as any,
  push: () => {
    throw new Error('An Ionic Router is required for IonRouterContext');
  },
  back: () => {
    throw new Error('An Ionic Router is required for IonRouterContext');
  },
  canGoBack: () => {
    throw new Error('An Ionic Router is required for IonRouterContext');
  },
  nativeBack: () => {
    throw new Error('An Ionic Router is required for IonRouterContext');
  },
});

/**
 * A hook for more direct control over routing in an Ionic React applicaiton. Allows you to pass additional meta-data to the router before the call to the native router.
 */
export function useIonRouter(): UseIonRouterResult {
  const context = useContext(IonRouterContext);
  return {
    back: context.back,
    push: context.push,
    goBack: context.back,
    canGoBack: context.canGoBack,
    routeInfo: context.routeInfo,
  };
}

export type UseIonRouterResult = {
  /**
   * @deprecated - Use goBack instead
   * @param animationBuilder - Optional - A custom transition animation to use
   */
  back(animationBuilder?: AnimationBuilder): void;
  /**
   * Navigates to a new pathname
   * @param pathname - The path to navigate to
   * @param routerDirection - Optional - The RouterDirection to use for transition purposes, defaults to 'forward'
   * @param routeAction - Optional - The RouteAction to use for history purposes, defaults to 'push'
   * @param routerOptions - Optional - Any additional parameters to pass to the router
   * @param animationBuilder - Optional - A custom transition animation to use
   */
  push(
    pathname: string,
    routerDirection?: RouterDirection,
    routeAction?: RouteAction,
    routerOptions?: RouterOptions,
    animationBuilder?: AnimationBuilder
  ): void;
  /**
   * Navigates backwards in history, using the IonRouter to determine history
   * @param animationBuilder - Optional - A custom transition animation to use
   */
  goBack(animationBuilder?: AnimationBuilder): void;
  /**
   * Determines if there are any additional routes in the the Router's history. However, routing is not prevented if the browser's history has more entries. Returns true if more entries exist, false if not.
   */
  canGoBack(): boolean;
  routeInfo: RouteInfo;
};
