import { ComponentRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Route, Router } from '@angular/router';
import type { AnimationBuilder, NavDirection, RouterDirection } from '@ionic/core/components';

export const insertView = (views: RouteView[], view: RouteView, direction: RouterDirection): RouteView[] => {
  if (direction === 'root') {
    return setRoot(views, view);
  } else if (direction === 'forward') {
    return setForward(views, view);
  } else {
    return setBack(views, view);
  }
};

const setRoot = (views: RouteView[], view: RouteView) => {
  views = views.filter((v) => v.stackId !== view.stackId);
  views.push(view);
  return views;
};

const setForward = (views: RouteView[], view: RouteView) => {
  const index = views.indexOf(view);
  if (index >= 0) {
    views = views.filter((v) => v.stackId !== view.stackId || v.id <= view.id);
  } else {
    views.push(view);
  }
  return views;
};

const setBack = (views: RouteView[], view: RouteView) => {
  const index = views.indexOf(view);
  if (index >= 0) {
    return views.filter((v) => v.stackId !== view.stackId || v.id <= view.id);
  } else {
    return setRoot(views, view);
  }
};

/**
 * Whether going from the leaving route to the entering route runs a
 * guard or resolver, any of which could cancel the navigation. Angular
 * only deactivates and activates the routes below the last one the two
 * share, but some checks run on every matched route.
 */
export const hasNavigationGuards = (leaving: ActivatedRoute, entering: ActivatedRoute): boolean => {
  const subtree = (route: ActivatedRoute): ActivatedRoute[] => [route, ...route.children.flatMap(subtree)];
  const isSameRoute = (a: ActivatedRoute, b: ActivatedRoute) =>
    a.routeConfig === b.routeConfig && JSON.stringify(a.snapshot.params) === JSON.stringify(b.snapshot.params);

  const leavingPath = leaving.pathFromRoot;
  const enteringPath = entering.pathFromRoot;
  let shared = 0;
  while (
    shared < leavingPath.length - 1 &&
    shared < enteringPath.length - 1 &&
    isSameRoute(leavingPath[shared], enteringPath[shared])
  ) {
    shared++;
  }

  const deactivated = [...leavingPath.slice(shared, -1), ...subtree(leaving)];
  const activated = [...enteringPath.slice(shared, -1), ...subtree(entering)];
  const matched = [...enteringPath.slice(0, -1), ...subtree(entering)];

  return (
    deactivated.some(runsDeactivateGuard) ||
    activated.some(runsActivateGuardOrResolver) ||
    matched.some(runsOnEveryMatch)
  );
};

// A title that isn't a string is a resolver.
const hasResolvers = (config: Route) =>
  Object.keys(config.resolve ?? {}).length > 0 || (config.title !== undefined && typeof config.title !== 'string');

const runsDeactivateGuard = ({ routeConfig }: ActivatedRoute) => !!routeConfig?.canDeactivate?.length;

const runsActivateGuardOrResolver = ({ routeConfig }: ActivatedRoute) =>
  !!routeConfig && (!!routeConfig.canActivate?.length || hasResolvers(routeConfig));

const runsOnEveryMatch = ({ routeConfig }: ActivatedRoute) =>
  !!routeConfig &&
  (!!routeConfig.canMatch?.length ||
    !!routeConfig.canActivateChild?.length ||
    (routeConfig.runGuardsAndResolvers !== undefined &&
      routeConfig.runGuardsAndResolvers !== 'paramsChange' &&
      (!!routeConfig.canActivate?.length || !!routeConfig.canDeactivate?.length || hasResolvers(routeConfig))));

export const getUrl = (router: Router, activatedRoute: ActivatedRoute): string => {
  const urlTree = router.createUrlTree(['.'], { relativeTo: activatedRoute });
  return router.serializeUrl(urlTree);
};

export const isTabSwitch = (enteringView: RouteView, leavingView: RouteView | undefined): boolean => {
  if (!leavingView) {
    return true;
  }
  return enteringView.stackId !== leavingView.stackId;
};

export const computeStackId = (prefixUrl: string[] | undefined, url: string): string | undefined => {
  if (!prefixUrl) {
    return undefined;
  }
  const segments = toSegments(url);
  for (let i = 0; i < segments.length; i++) {
    if (i >= prefixUrl.length) {
      return segments[i];
    }
    if (segments[i] !== prefixUrl[i]) {
      return undefined;
    }
  }
  return undefined;
};

export const toSegments = (path: string): string[] => {
  return path
    .split('/')
    .map((s) => s.trim())
    .filter((s) => s !== '');
};

export const destroyView = (view: RouteView | undefined): void => {
  if (view) {
    view.ref.destroy();
    view.unlistenEvents();
  }
};

export interface StackWillChangeEvent {
  enteringView: RouteView;
  /**
   * `true` if the event is trigged as a result of a switch
   * between tab navigation stacks.
   */
  tabSwitch: boolean;
}

export interface StackDidChangeEvent {
  enteringView: RouteView;
  direction: RouterDirection;
  animation: NavDirection | undefined;
  /**
   * `true` if the event is trigged as a result of a switch
   * between tab navigation stacks.
   */
  tabSwitch: boolean;
}

// TODO(FW-2827): types
export interface RouteView {
  id: number;
  url: string;
  stackId: string | undefined;
  element: HTMLElement;
  ref: ComponentRef<any>;
  savedData?: any;
  savedExtras?: NavigationExtras;
  unlistenEvents: () => void;
  animationBuilder?: AnimationBuilder;
  /**
   * The navigation id of the history entry this view was last
   * shown in, or undefined if it was shown without one.
   */
  historyEntryId?: number;
  activatedRoute: ActivatedRoute;
}
