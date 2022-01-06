import {
  h,
  defineComponent,
  ref,
  computed,
  inject,
  provide,
  watch,
  shallowRef,
  InjectionKey,
  onUnmounted,
} from 'vue';
import {
  AnimationBuilder,
  LIFECYCLE_DID_ENTER,
  LIFECYCLE_DID_LEAVE,
  LIFECYCLE_WILL_ENTER,
  LIFECYCLE_WILL_LEAVE
} from '@ionic/core';
import { matchedRouteKey, routeLocationKey, useRoute } from 'vue-router';
import { fireLifecycle, generateId, getConfig } from '../utils';

const isViewVisible = (enteringEl: HTMLElement) => {
  if (enteringEl === undefined) {
    return false;
  }
  return !enteringEl.classList.contains('ion-page-hidden') && !enteringEl.classList.contains('ion-page-invisible');
}

let viewDepthKey: InjectionKey<0> = Symbol(0);
export const IonRouterOutlet = defineComponent({
  name: 'IonRouterOutlet',
  setup(_, { attrs }) {
    const injectedRoute = inject(routeLocationKey)!;
    const route = useRoute();
    const depth = inject(viewDepthKey, 0);
    let usingDeprecatedRouteSetup = false;

    // TODO: Remove in Ionic Vue v6.0
    if (attrs.tabs && route.matched[depth]?.children?.length > 0) {
      console.warn('[@ionic/vue Deprecation]: Your child routes are nested inside of each tab in your routing config. This format will not be supported in Ionic Vue v6.0. Instead, write your child routes as sibling routes. See https://ionicframework.com/docs/vue/navigation#child-routes-within-tabs for more information.');
      usingDeprecatedRouteSetup = true;
    }
    const matchedRouteRef: any = computed(() => {
      const matchedRoute = route.matched[depth];

      const hasMatchedRoute = (matchedRoute !== undefined),
        hasTabs = (attrs.tabs !== undefined),
        hasNextMatchedRoute = (route.matched[depth + 1] !== undefined);

      if (hasMatchedRoute && hasTabs && hasNextMatchedRoute && usingDeprecatedRouteSetup) {
        return route.matched[route.matched.length - 1];
      }

      return matchedRoute;
    });

    provide(viewDepthKey, depth + 1)
    provide(matchedRouteKey, matchedRouteRef);

    const ionRouterOutlet = ref();
    const id = generateId('ion-router-outlet');

    // TODO types
    const ionRouter: any = inject('navManager');
    const viewStacks: any = inject('viewStacks');

    const components = shallowRef([]);

    let skipTransition = false;

    // The base url for this router outlet
    let parentOutletPath: string;

    /**
     * We need to watch the route object
     * to listen for navigation changes.
     * Previously we had watched matchedRouteRef,
     * but if you had a /page/:id route, going from
     * page/1 to page/2 would not cause this callback
     * to fire since the matchedRouteRef was the same.
     */
    watch(() => [route, matchedRouteRef.value], ([currentRoute, currentMatchedRouteRef], [_, previousMatchedRouteRef]) => {
      /**
       * If the matched route ref has changed,
       * then we need to set up a new view item.
       * If the matched route ref has not changed,
       * it is possible that this is a parameterized URL
       * change such as /page/1 to /page/2. In that case,
       * we can assume that the `route` object has changed,
       * but we should only set up a new view item in this outlet
       * if that last matched view item matches our current matched
       * view item otherwise if we had this in a nested outlet the
       * parent outlet would re-render as well as the child page.
       */
      const isNotPreviousRouteRef = currentMatchedRouteRef !== previousMatchedRouteRef;
      const isLastMatchedCurrentRouteRef = currentRoute.matched[currentRoute.matched.length - 1] === currentMatchedRouteRef;
      if (isNotPreviousRouteRef || isLastMatchedCurrentRouteRef) {
        setupViewItem(matchedRouteRef);
      }
    });

    const canStart = () => {
      const config = getConfig();
      const swipeEnabled = config && config.get('swipeBackEnabled', ionRouterOutlet.value.mode === 'ios');
      if (!swipeEnabled) {
        return false;
      }

      const stack = viewStacks.getViewStack(id);
      if (!stack || stack.length <= 1) {
        return false;
      }

      /**
       * We only want to outlet of the entering view
       * to respond to this gesture, so check
       * to make sure the view is in the outlet we want.
       */
      const routeInfo = ionRouter.getLeavingRouteInfo();
      const enteringViewItem = viewStacks.findViewItemByRouteInfo({ pathname: routeInfo.pushedByRoute || '' }, id, usingDeprecatedRouteSetup);

      return !!enteringViewItem;
    }

    const onStart = async () => {
      const routeInfo = ionRouter.getLeavingRouteInfo();
      const { routerAnimation } = routeInfo;
      const enteringViewItem = viewStacks.findViewItemByRouteInfo({ pathname: routeInfo.pushedByRoute || '' }, id, usingDeprecatedRouteSetup);
      const leavingViewItem = viewStacks.findViewItemByRouteInfo(routeInfo, id, usingDeprecatedRouteSetup);

      if (leavingViewItem) {
        let animationBuilder = routerAnimation;
        const enteringEl = enteringViewItem.ionPageElement;
        const leavingEl = leavingViewItem.ionPageElement;

        /**
         * If we are going back from a page that
         * was presented using a custom animation
         * we should default to using that
         * unless the developer explicitly
         * provided another animation.
         */
        const customAnimation = enteringViewItem.routerAnimation;
        if (
          animationBuilder === undefined &&
          // todo check for tab switch
          customAnimation !== undefined
        ) {
          animationBuilder = customAnimation;
        }

        leavingViewItem.routerAnimation = animationBuilder;

        await transition(
          enteringEl,
          leavingEl,
          'back',
          ionRouter.canGoBack(2),
          true,
          animationBuilder
        );
      }

      return Promise.resolve();
    }

    const onEnd = (shouldContinue: boolean) => {
      if (shouldContinue) {
        skipTransition = true;

        /**
         * Use the same logic as clicking
         * ion-back-button to determine where
         * to go back to.
         */
        ionRouter.handleNavigateBack();
      } else {
        /**
         * In the event that the swipe
         * gesture was aborted, we should
         * re-hide the page that was going to enter.
         */
        const routeInfo = ionRouter.getCurrentRouteInfo();
        const enteringViewItem = viewStacks.findViewItemByRouteInfo({ pathname: routeInfo.pushedByRoute || '' }, id, usingDeprecatedRouteSetup);
        enteringViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
        enteringViewItem.ionPageElement.classList.add('ion-page-hidden');
      }
    }

    watch(ionRouterOutlet, () => {
      ionRouterOutlet.value.swipeHandler = {
        canStart,
        onStart,
        onEnd
      }
    });

    const transition = (
      enteringEl: HTMLElement,
      leavingEl: HTMLElement,
      direction: any, // TODO types
      showGoBack: boolean,
      progressAnimation: boolean,
      animationBuilder?: AnimationBuilder
    ) => {
      return new Promise(resolve => {
        if (skipTransition) {
          skipTransition = false;
          return resolve(false);
        }

        if (enteringEl === leavingEl) {
          return resolve(false);
        }

        requestAnimationFrame(() => {
          requestAnimationFrame(async () => {
            const result = await ionRouterOutlet.value.commit(enteringEl, leavingEl, {
              deepWait: true,
              duration: direction === undefined || direction === 'root' || direction === 'none' ? 0 : undefined,
              direction,
              showGoBack,
              progressAnimation,
              animationBuilder
            });

            return resolve(result);
          });
        });
      });
    }

    const handleTransitions = async (enteringViewItem: any, leavingViewItem: any) => {
      const routeInfo = ionRouter.getCurrentRouteInfo();
      const { routerDirection, routerAction, routerAnimation, delta } = ionRouter.getCurrentRouteInfo;
      const hasEnteringView = enteringViewItem !== undefined;
      const enteringEl = hasEnteringView && enteringViewItem.ionPageElement;

      /**
       * All views that can be transitioned to must have
       * an `<ion-page>` element for transitions and lifecycle
       * methods to work properly.
       */
      if (hasEnteringView && enteringEl === undefined) {
        console.warn(`[@ionic/vue Warning]: The view you are trying to render for path ${routeInfo.pathname} does not have the required <ion-page> component. Transitions and lifecycle methods may not work as expected. See https://ionicframework.com/docs/vue/navigation#ionpage for more information.`);
      }
      const isSameView = enteringViewItem === leavingViewItem;
      let hasLeavingView = leavingViewItem !== undefined;
      //What scenario would the same view occur, if the user pushes page/1 to page/1, shouldn't the transition still occur?
      if (isSameView) {
        return;
      }

      /**
       * If the entering view is already
       * visible, then no transition is needed.
       * This is most common when navigating
       * from a tabs page to a non-tabs page
       * and then back to the tabs page.
       * Even when the tabs context navigated away,
       * the inner tabs page was still active.
       * This also avoids an issue where
       * the previous tabs page is incorrectly
       * unmounted since it would automatically
       * unmount the previous view.
       *
       * This should also only apply to entering and
       * leaving items in the same router outlet (i.e.
       * Tab1 and Tab2), otherwise this will
       * return early for swipe to go back when
       * going from a non-tabs page to a tabs page.
       */
      if (hasEnteringView && isViewVisible(enteringEl) && hasLeavingView && !isViewVisible(leavingViewItem.ionPageElement)) {
        return;
      }

      if (hasEnteringView) {
        fireLifecycle(enteringViewItem.vueComponent, enteringViewItem.vueComponentRef, LIFECYCLE_WILL_ENTER);
      }

      if (hasLeavingView && !isSameView) {
        let animationBuilder = routerAnimation;
        const leavingEl = leavingViewItem.ionPageElement;

        fireLifecycle(leavingViewItem.vueComponent, leavingViewItem.vueComponentRef, LIFECYCLE_WILL_LEAVE);

        /**
         * If we are going back from a page that
         * was presented using a custom animation
         * we should default to using that
         * unless the developer explicitly
         * provided another animation.
         */
        const customAnimation = hasEnteringView && enteringViewItem.routerAnimation;
        if (
          animationBuilder === undefined &&
          routerDirection === 'back' &&
          /**
           * @TODO: check for tab switch
           */
          customAnimation !== undefined
        ) {
          animationBuilder = customAnimation;
        }

        leavingViewItem.routerAnimation = animationBuilder;

        if (hasEnteringView) {
          await transition(
            enteringEl,
            leavingEl,
            routerDirection,
            !!routeInfo.pushedByRoute,
            false,
            animationBuilder
          );
        }
        leavingEl.classList.add('ion-page-hidden');
        leavingEl.setAttribute('aria-hidden', 'true');
        /**
         * Not sure what is setting display: none; in some scenarios, but removing it here
         */
        if (hasEnteringView && enteringEl !== null) {
          enteringEl.style.display = null;
        }
        if (routerAction === 'replace') {
          viewStacks.unmountViewItem(leavingViewItem);
        } else {
          viewStacks.mountIntermediaryViews(id, leavingViewItem, delta);
        }

        fireLifecycle(leavingViewItem.vueComponent, leavingViewItem.vueComponentRef, LIFECYCLE_DID_LEAVE);
      }
      if (hasEnteringView) {
        enteringEl.classList.remove('ion-page-hidden');
        fireLifecycle(enteringViewItem.vueComponent, enteringViewItem.vueComponentRef, LIFECYCLE_DID_ENTER);
      }
      components.value = viewStacks.getChildrenToRender(id);
    }

    const handlePageTransition = async () => {
      const routeInfo = ionRouter.getCurrentRouteInfo();

      let enteringViewItem = viewStacks.findViewItemByRouteInfo(routeInfo, id, usingDeprecatedRouteSetup);

      let leavingViewItem = viewStacks.findLeavingViewItemByRouteInfo(routeInfo, id, true, usingDeprecatedRouteSetup);
      await handleTransitions(enteringViewItem, leavingViewItem);
    }

    /**
     * Mounts the viewItem and registers the callbacks
     * @param matchedRouteRef
     */
    const setupViewItem = async (matchedRouteRef: any) => {
      const firstMatchedRoute = route.matched[0];
      if (parentOutletPath === undefined) {
        parentOutletPath = firstMatchedRoute.path;
        viewStacks.setRootPath(id, parentOutletPath);
      }

      /**
       * If no matched route, do not do anything in this outlet.
       * If there is a match, but the first matched path
       * is not the root path for this outlet, then this view
       * change needs to be rendered in a different outlet.
       * We also add an exception for when the matchedRouteRef is
       * equal to the first matched route (i.e. the base router outlet).
       * This logic is mainly to help nested outlets/multi-tab
       * setups work better.
       */
      /**
       * This route change still needs to be handled to properly detect which route you are leaving from a different ion-router-outlet instance,
       * however the transitions will be backwards as it will enter ion-router-outlet 1 first then exit ion-router-outlet 2
       */
      const hasMatchedRoute = matchedRouteRef.value !== undefined;
      const isNotFirstRoute = matchedRouteRef.value !== firstMatchedRoute;
      const isFirstNotParentPath = firstMatchedRoute.path !== parentOutletPath;

      /**
       * We need to handle page transition from lower level ion-router-outlets or else some ion-pages never get cleaned up/life cycles firing
       */
      const createViewItem = !(isNotFirstRoute && isFirstNotParentPath) && hasMatchedRoute;


      const currentRoute = ionRouter.getCurrentRouteInfo();
      let enteringViewItem = viewStacks.findViewItemByRouteInfo(currentRoute, id, usingDeprecatedRouteSetup);

      if (enteringViewItem === undefined && createViewItem) {
        enteringViewItem = viewStacks.createViewItem(id, matchedRouteRef.value.components.default, matchedRouteRef.value, currentRoute);
        viewStacks.add(enteringViewItem);
      }

      if (createViewItem === false) {
        /**
         * For lower level outlets we still want to handle transitions
         */
        let leavingViewItem = viewStacks.findLeavingViewItemByRouteInfo(currentRoute, id, true, usingDeprecatedRouteSetup);
        await handleTransitions(enteringViewItem, leavingViewItem);
        return;
      }

      if (enteringViewItem === undefined) {
        //outlet doesnt have a entering view item
        return;
      }
      /**
       * Already mounted, directly handle page transition
       */
      if (enteringViewItem.mount) {
        await handlePageTransition();
      } else {
        viewStacks.mountViewItem(enteringViewItem);
        enteringViewItem.registerCallback = async () => {
          await handlePageTransition();
          enteringViewItem.registerCallback = undefined;
        }
      }

      components.value = viewStacks.getChildrenToRender(id);
    }

    let hasMatchedRoute = (matchedRouteRef.value);
    if (hasMatchedRoute) {
      setupViewItem(matchedRouteRef);
    }

    /**
     * Remove stack data for this outlet
     * when outlet is destroyed otherwise
     * we will see cached view data.
     */
    onUnmounted(() => viewStacks.clear(id));

    /**
     * @TODO: types
     * @param viewItem
     * @param ionPageEl
     */
    const registerIonPage = (viewItem: any, ionPageEl: HTMLElement) => {
      const oldIonPageEl = viewItem.ionPageElement;

      viewStacks.registerIonPage(viewItem, ionPageEl);

      if (viewItem.ionPageElement !== undefined && viewItem.ionPageElement.classList.contains('ion-page-invisible')) {
        viewItem.ionPageElement.classList.remove('ion-page-invisible');
      }
      /**
       * If there is a registerCallback,
       * then this component is being registered
       * as a result of a navigation change.
       */
      if (viewItem.registerCallback) {
        viewItem.registerCallback();

        /**
         * If there is no registerCallback, then
         * this component is likely being re-registered
         * as a result of a hot module replacement.
         * We need to see if the oldIonPageEl has
         * .ion-page-invisible. If it does not then we
         * need to remove it from the new ionPageEl otherwise
         * the page will be hidden when it is replaced.
         */
      } else if (oldIonPageEl && !oldIonPageEl.classList.contains('ion-page-invisible')) {
        ionPageEl.classList.remove('ion-page-invisible');
      }
    };

    return {
      id,
      components,
      injectedRoute,
      ionRouterOutlet,
      registerIonPage
    }
  },
  render() {
    const { components, registerIonPage, injectedRoute } = this;

    return h(
      'ion-router-outlet',
      { ref: 'ionRouterOutlet' },
      // TODO types
      components && components.map((c: any) => {
        let props = {
          ref: c.vueComponentRef,
          key: c.pathname,
          isInOutlet: true,
          registerIonPage: (ionPageEl: HTMLElement) => registerIonPage(c, ionPageEl)
        }

        /**
         * IonRouterOutlet does not support named outlets.
         */
        const routePropsOption = c.matchedRoute?.props?.default;

        /**
         * Since IonRouterOutlet renders multiple components,
         * each render will cause all props functions to be
         * called again. As a result, we need to cache the function
         * result and provide it on each render so that the props
         * are not lost when navigating from and back to a page.
         * When a component is destroyed and re-created, the
         * function is called again.
         */
        const getPropsFunctionResult = () => {
          const cachedPropsResult = c.vueComponentData?.propsFunctionResult;
          if (cachedPropsResult) {
            return cachedPropsResult;
          } else {
            const propsFunctionResult = routePropsOption(injectedRoute);
            c.vueComponentData = {
              ...c.vueComponentData,
              propsFunctionResult
            };
            return propsFunctionResult;
          }
        }
        const routeProps = routePropsOption
          ? routePropsOption === true
            ? c.params
            : typeof routePropsOption === 'function'
              ? getPropsFunctionResult()
              : routePropsOption
          : null

        props = {
          ...props,
          ...routeProps
        }

        return h(
          c.vueComponent,
          props
        );
      })
    )
  }
});
