import { inject } from 'vue';
import { AnimationBuilder } from '../';
import { Location } from '../types';

export type RouteAction = 'push' | 'pop' | 'replace';
export type RouteDirection = 'forward' | 'back' | 'root' | 'none';

export interface UseIonRouterResult {
  canGoBack: (deep?: number) => boolean;
  push: (location: string | Location, routerAnimation?: AnimationBuilder) => void;
  replace: (location: string | Location, routerAnimation?: AnimationBuilder) => void;
  back: (routerAnimation?: AnimationBuilder) => void;
  forward: (routerAnimation?: AnimationBuilder) => void;
  navigate: (
    location: string | Location,
    routerDirection?: RouteDirection,
    routerAction?: RouteAction,
    routerAnimation?: AnimationBuilder
  ) => void;
}

/**
 * Used to navigate within Vue Router
 * while controlling the animation.
 */
export const useIonRouter = (): UseIonRouterResult => {
  const { canGoBack, goBack, goForward, handleNavigate } = inject('navManager') as any;

  const navigate = (
    location: string | Location,
    routerDirection?: RouteDirection,
    routerAction?: RouteAction,
    routerAnimation?: AnimationBuilder
  ) => handleNavigate(location, routerAction, routerDirection, routerAnimation);

  const push = (
    location: string | Location,
    routerAnimation?: AnimationBuilder
  ) => navigate(location, 'forward', 'push', routerAnimation);

  const replace = (
    location: string | Location,
    routerAnimation?: AnimationBuilder
  ) => navigate(location, 'root', 'replace', routerAnimation);

  const back = (
    routerAnimation?: AnimationBuilder
  ) => goBack(routerAnimation);

  const forward = (
    routerAnimation?: AnimationBuilder
  ) => goForward(routerAnimation);

  return {
    canGoBack,
    push,
    replace,
    back,
    forward,
    navigate
  } as UseIonRouterResult
}


