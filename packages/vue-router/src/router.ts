import {
  Router,
  RouteLocationNormalized,
  NavigationGuardNext
} from 'vue-router';
import { createLocationHistory } from './locationHistory';
import { generateId } from './utils';
import {
  ExternalNavigationOptions,
  RouteInfo,
  RouteParams,
  RouteAction,
  RouteDirection,
  IonicVueRouterOptions
} from './types';
import { AnimationBuilder } from '@ionic/core';

export const createIonRouter = (opts: IonicVueRouterOptions, router: Router) => {

  router.beforeEach((to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) => {
    handleHistoryChange(to);
    next();
  });

  const locationHistory = createLocationHistory();
  let currentRouteInfo: RouteInfo;
  let incomingRouteParams: RouteParams;
  let currentTab: string | undefined;

  // TODO types
  let historyChangeListeners: any[] = [];

  if (typeof (document as any) !== 'undefined') {
    document.addEventListener('ionBackButton', (ev: Event) => {
      (ev as any).detail.register(0, (processNextHandler: () => void) => {
        opts.history.go(-1);
        processNextHandler();
      });
    })
  }

  //   NavigationCallback
  opts.history.listen((to: any, _: any, info: any) => handleHistoryChange({ path: to }, info.type, info.direction));

  const handleNavigateBack = (defaultHref?: string, routerAnimation?: AnimationBuilder) => {
    //console.log('--- Begin Navigate Back ---');
    // todo grab default back button href from config
    const routeInfo = locationHistory.current();
    //console.log('Route Info', routeInfo)
    if (routeInfo && routeInfo.pushedByRoute) {
      const prevInfo = locationHistory.findLastLocation(routeInfo);
      if (prevInfo) {
        //console.log('Prev Info', prevInfo)
        incomingRouteParams = { ...prevInfo, routerAction: 'pop', routerDirection: 'back', routerAnimation: routerAnimation || routeInfo.routerAnimation };
        //console.log('Set incoming route params', incomingRouteParams)
        if (routeInfo.lastPathname === routeInfo.pushedByRoute) {
          router.back();
        } else {
          router.replace(prevInfo.pathname + (prevInfo.search || ''));
        }
      } else {
        handleNavigate(defaultHref, 'pop', 'back');
      }
    } else {
      handleNavigate(defaultHref, 'pop', 'back');
    }
    //console.log('--- End Navigate Back ---');
  }

  const handleNavigate = (path: string, routerAction?: RouteAction, routerDirection?: RouteDirection, routerAnimation?: AnimationBuilder, tab?: string) => {
    incomingRouteParams = {
      routerAction,
      routerDirection,
      routerAnimation,
      tab
    }

    if (routerAction === 'push') {
      router.push(path);
    } else {
      router.replace(path);
    }
  }

  // TODO RouteLocationNormalized
  const handleHistoryChange = (location: any, action?: RouteAction, direction?: RouteDirection) => {
    let leavingLocationInfo: RouteInfo;
    if (incomingRouteParams) {
      if (incomingRouteParams.routerAction === 'replace') {
        leavingLocationInfo = locationHistory.previous();
      } else {
        leavingLocationInfo = locationHistory.current();
      }
    } else {
      leavingLocationInfo = locationHistory.current();
    }

    if (!leavingLocationInfo) {
      leavingLocationInfo = {
        pathname: '',
        search: ''
      }
    }

    const leavingUrl = leavingLocationInfo.pathname + leavingLocationInfo.search;
    if (leavingUrl !== location.fullPath) {
      if (!incomingRouteParams) {
        if (action === 'replace') {
          incomingRouteParams = {
            routerAction: 'replace',
            routerDirection: 'none',
            tab: currentTab
          }
        } else if (action === 'pop') {
          const routeInfo = locationHistory.current();
          if (routeInfo && routeInfo.pushedByRoute) {
            const prevRouteInfo = locationHistory.findLastLocation(routeInfo);
            incomingRouteParams = {
              ...prevRouteInfo,
              routerAction: 'pop',
              routerDirection: 'back'
            };
          } else {
            incomingRouteParams = {
              routerAction: 'pop',
              routerDirection: 'none',
              tab: currentTab
            }
          }
        }
        if (!incomingRouteParams) {
          incomingRouteParams = {
            routerAction: 'push',
            routerDirection: direction || 'forward',
            tab: currentTab
          }
          //console.log('No route params, setting', incomingRouteParams)
        }
      }

      //console.log('Incoming Route Params', incomingRouteParams)

      let routeInfo: RouteInfo;
      if (incomingRouteParams?.id) {
        routeInfo = {
          ...incomingRouteParams,
          lastPathname: leavingLocationInfo.pathname
        }
        locationHistory.add(routeInfo);

        //console.log('Incoming route params had id, current routeInfo', routeInfo)
      } else {
        const isPushed = incomingRouteParams.routerAction === 'push' && incomingRouteParams.routerDirection === 'forward';
        routeInfo = {
          id: generateId('routeInfo'),
          ...incomingRouteParams,
          lastPathname: leavingLocationInfo.pathname,
          pathname: location.path,
          search: location.fullPath && location.fullPath.split('?')[1] || '',
          params: location.params && location.params,
        }

        //console.log('No id on incoming route params', routeInfo)

        if (isPushed) {
          routeInfo.tab = leavingLocationInfo.tab;
          routeInfo.pushedByRoute = leavingLocationInfo.pathname;
          //console.log('Was pushed', routeInfo);
        } else if (routeInfo.routerAction === 'pop') {
          const route = locationHistory.findLastLocation(routeInfo);
          routeInfo.pushedByRoute = route?.pushedByRoute;
          //console.log('action pop', routeInfo)
        } else if (routeInfo.routerAction === 'push' && routeInfo.tab !== leavingLocationInfo.tab) {
          const lastRoute = locationHistory.getCurrentRouteInfoForTab(routeInfo.tab);
          routeInfo.pushedByRoute = lastRoute?.pushedByRoute;
          //console.log('was push and switch tab', routeInfo)
        } else if (routeInfo.routerAction === 'replace') {
          const currentRouteInfo = locationHistory.current();
          routeInfo.lastPathname = currentRouteInfo?.pathname || routeInfo.lastPathname;
          routeInfo.pushedByRoute = currentRouteInfo?.pushedByRoute || routeInfo.pushedByRoute;
          routeInfo.routerDirection = currentRouteInfo?.routerDirection || routeInfo.routerDirection;
          routeInfo.routerAnimation = currentRouteInfo?.routerAnimation || routeInfo.routerAnimation;
          //console.log('was repalce',routeInfo)
        }

        locationHistory.add(routeInfo);
      }
      currentRouteInfo = routeInfo;
    }
    incomingRouteParams = undefined;
    historyChangeListeners.forEach(cb => cb(currentRouteInfo));
  }

  const getCurrentRouteInfo = () => currentRouteInfo;

  const canGoBack = (deep: number = 1) => locationHistory.canGoBack(deep);

  const navigate = (navigationOptions: ExternalNavigationOptions) => {
    const { routerAnimation, routerDirection, routerLink } = navigationOptions;

    incomingRouteParams = {
      routerAnimation,
      routerDirection: routerDirection || 'forward',
      routerAction: 'push'
    }

    router.push(routerLink);
  }

  const resetTab = (tab: string, originalHref: string) => {
    const routeInfo = locationHistory.getFirstRouteInfoForTab(tab);
    if (routeInfo) {
      const newRouteInfo = { ...routeInfo };
      newRouteInfo.pathname = originalHref;
      incomingRouteParams = { ...newRouteInfo, routerAction: 'pop', routerDirection: 'back' };
      router.push(newRouteInfo.pathname + (newRouteInfo.search || ''));
    }
  }

  const changeTab = (tab: string, path: string) => {
    const routeInfo = locationHistory.getCurrentRouteInfoForTab(tab);
    const [pathname] = path.split('?');

    if (routeInfo) {
      incomingRouteParams = Object.assign(Object.assign({}, routeInfo), { routerAction: 'push', routerDirection: 'none' });

      const search = (routeInfo.search) ? `?${routeInfo.search}` : '';
      router.push(routeInfo.pathname + search);
    }
    else {
      handleNavigate(pathname, 'push', 'none', undefined, tab);
    }
  }
  const handleSetCurrentTab = (tab: string) => {
    currentTab = tab;

    const ri = { ...locationHistory.current() };
    if (ri.tab !== tab) {
      ri.tab = tab;
      locationHistory.update(ri);
    }
  }

  // TODO types
  const registerHistoryChangeListener = (cb: any) => {
    historyChangeListeners.push(cb);
  }

  return {
    handleNavigateBack,
    handleSetCurrentTab,
    getCurrentRouteInfo,
    canGoBack,
    navigate,
    resetTab,
    changeTab,
    registerHistoryChangeListener
  }
}
