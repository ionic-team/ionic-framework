import type { AnimationBuilder } from "@ionic/core/components";
import {
  LIFECYCLE_DID_ENTER,
  LIFECYCLE_DID_LEAVE,
  LIFECYCLE_WILL_ENTER,
  LIFECYCLE_WILL_LEAVE,
} from "@ionic/core/components";
import { defineCustomElement } from "@ionic/core/components/ion-router-outlet.js";
import {
  h,
  defineComponent,
  ref,
  computed,
  inject,
  provide,
  watch,
  shallowRef,
  onUnmounted,
} from "vue";
import type { InjectionKey, Ref } from "vue";
import { matchedRouteKey, routeLocationKey, useRoute } from "vue-router";

import { fireLifecycle, generateId, getConfig } from "../utils";

// TODO(FW-2969): types

const isViewVisible = (enteringEl: HTMLElement) => {
  return (
    !enteringEl.classList.contains("ion-page-hidden") &&
    !enteringEl.classList.contains("ion-page-invisible")
  );
};

const viewDepthKey: InjectionKey<0> = Symbol(0);
export const IonRouterOutlet = /*@__PURE__*/ defineComponent({
  name: "IonRouterOutlet",
  setup() {
    defineCustomElement();

    const injectedRoute = inject(routeLocationKey)!;
    const route = useRoute();
    const depth = inject(viewDepthKey, 0);
    const matchedRouteRef: any = computed(() => route.matched[depth]);
    let previousMatchedRouteRef: Ref | undefined;
    let previousMatchedPath: string | undefined;

    provide(viewDepthKey, depth + 1);
    provide(matchedRouteKey, matchedRouteRef);

    const ionRouterOutlet = ref();
    const id = generateId("ion-router-outlet");

    const ionRouter: any = inject("navManager");
    const viewStacks: any = inject("viewStacks");

    const components = shallowRef([]);

    let skipTransition = false;

    // The base url for this router outlet
    let parentOutletPath: string;

    /**
     * Note: Do not listen for matchedRouteRef by itself here
     * as the callback will not fire for parameterized routes (i.e. /page/:id).
     * So going from /page/1 to /page/2 would not fire this callback if we
     * only listened for changes to matchedRouteRef.
     */
    watch(
      () => [route, matchedRouteRef.value],
      ([currentRoute, currentMatchedRouteRef]) => {
        /**
         * This callback checks whether or not a router outlet
         * needs to respond to a change in the matched route.
         * It handles a few cases:
         * 1. The matched route is undefined. This means that
         * the matched route is not applicable to this outlet.
         * For example, a /settings route is not applicable
         * to a /tabs/... route.
         *
         * Note: When going back to a tabs outlet from a non-tabs outlet,
         * the tabs outlet should NOT attempt a page transition from the
         * previous tab to the active tab. To do this we compare the current
         * route with the previous route. Unfortunately, we cannot rely on the
         * previous value provided by Vue in the watch callback. This is because
         * when coming back to the tabs context, the previous matched route will
         * be undefined (because nothing in the tabs context matches /settings)
         * but the current matched route will be defined and so a transition
         * will always occur.
         *
         * 2. The matched route is defined and is different than
         * the previously matched route. This is the most
         * common case such as when you go from /page1 to /page2.
         *
         * 3. The matched route is the same but the parameters are different.
         * This is a special case for parameterized routes (i.e. /page/:id).
         * When going from /page/1 to /page/2, the matched route object will
         * be the same, but we still need to perform a page transition. To do this
         * we check if the parameters are different (i.e. 1 vs 2). To avoid enumerating
         * all of the keys in the params object, we check the url path to
         * see if they are different after ensuring we are in a parameterized route.
         */
        if (currentMatchedRouteRef !== undefined) {
          const matchedDifferentRoutes =
            currentMatchedRouteRef !== previousMatchedRouteRef;
          const matchedDifferentParameterRoutes =
            currentRoute.matched[currentRoute.matched.length - 1] ===
              currentMatchedRouteRef &&
            currentRoute.path !== previousMatchedPath;

          if (matchedDifferentRoutes || matchedDifferentParameterRoutes) {
            setupViewItem(matchedRouteRef);
          }
        }

        previousMatchedRouteRef = currentMatchedRouteRef;
        previousMatchedPath = currentRoute.path;
      },
      /**
       * Future versions of Vue may default watching nested
       * reactive objects to "deep: false".
       * We explicitly set this watcher to "deep: true" to
       * account for that.
       * https://github.com/vuejs/core/issues/9965#issuecomment-1875067499
       */
      { deep: true }
    );

    const canStart = () => {
      const config = getConfig();
      const swipeEnabled =
        config &&
        config.get("swipeBackEnabled", ionRouterOutlet.value.mode === "ios");
      if (!swipeEnabled) return false;

      const stack = viewStacks.getViewStack(id);
      if (!stack || stack.length <= 1) return false;

      /**
       * We only want to outlet of the entering view
       * to respond to this gesture, so check
       * to make sure the view is in the outlet we want.
       */
      const routeInfo = ionRouter.getLeavingRouteInfo();
      const enteringViewItem = viewStacks.findViewItemByRouteInfo(
        { pathname: routeInfo.pushedByRoute || "" },
        id
      );

      return !!enteringViewItem;
    };
    const onStart = async () => {
      const routeInfo = ionRouter.getLeavingRouteInfo();
      const { routerAnimation } = routeInfo;
      const enteringViewItem = viewStacks.findViewItemByRouteInfo(
        { pathname: routeInfo.pushedByRoute || "" },
        id
      );
      const leavingViewItem = viewStacks.findViewItemByRouteInfo(routeInfo, id);

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
        if (animationBuilder === undefined && customAnimation !== undefined) {
          animationBuilder = customAnimation;
        }

        leavingViewItem.routerAnimation = animationBuilder;

        await transition(
          enteringEl,
          leavingEl,
          "back",
          ionRouter.canGoBack(2),
          true,
          animationBuilder
        );
      }

      return Promise.resolve();
    };

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
        const enteringViewItem = viewStacks.findViewItemByRouteInfo(
          { pathname: routeInfo.pushedByRoute || "" },
          id
        );
        enteringViewItem.ionPageElement.setAttribute("aria-hidden", "true");
        enteringViewItem.ionPageElement.classList.add("ion-page-hidden");
      }
    };

    watch(ionRouterOutlet, () => {
      ionRouterOutlet.value.swipeHandler = {
        canStart,
        onStart,
        onEnd,
      };
    });

    const transition = async (
      enteringEl: HTMLElement,
      leavingEl: HTMLElement,
      direction: any,
      showGoBack: boolean,
      progressAnimation: boolean,
      animationBuilder?: AnimationBuilder
    ) => {
      if (skipTransition) {
        skipTransition = false;
        return Promise.resolve(false);
      }

      if (enteringEl === leavingEl) {
        return Promise.resolve(false);
      }

      enteringEl.classList.add("ion-page-invisible");

      const hasRootDirection =
        direction === undefined || direction === "root" || direction === "none";
      const result = await ionRouterOutlet.value.commit(enteringEl, leavingEl, {
        /**
         * replace operations result in a direction of none.
         * These typically do not have need animations, so we set
         * the duration to 0. However, if a developer explicitly
         * passes an animationBuilder, we should assume that
         * they want an animation to be played even
         * though it is a replace operation.
         */
        duration:
          hasRootDirection && animationBuilder === undefined ? 0 : undefined,
        direction,
        showGoBack,
        progressAnimation,
        animationBuilder,
      });

      return result;
    };

    const handlePageTransition = async () => {
      const routeInfo = ionRouter.getCurrentRouteInfo();
      const {
        routerDirection,
        routerAction,
        routerAnimation,
        prevRouteLastPathname,
        delta,
      } = routeInfo;

      const enteringViewItem = viewStacks.findViewItemByRouteInfo(
        routeInfo,
        id
      );
      let leavingViewItem = viewStacks.findLeavingViewItemByRouteInfo(
        routeInfo,
        id
      );
      const enteringEl = enteringViewItem.ionPageElement;

      /**
       * All views that can be transitioned to must have
       * an `<ion-page>` element for transitions and lifecycle
       * methods to work properly.
       */
      if (enteringEl === undefined) {
        console.warn(`[@ionic/vue Warning]: The view you are trying to render for path ${routeInfo.pathname} does not have the required <ion-page> component. Transitions and lifecycle methods may not work as expected.

See https://ionicframework.com/docs/vue/navigation#ionpage for more information.`);
      }
      if (enteringViewItem === leavingViewItem) return;

      if (!leavingViewItem && prevRouteLastPathname) {
        leavingViewItem = viewStacks.findViewItemByPathname(
          prevRouteLastPathname,
          id
        );
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
      if (
        isViewVisible(enteringEl) &&
        leavingViewItem?.ionPageElement !== undefined &&
        !isViewVisible(leavingViewItem.ionPageElement)
      ) {
        return;
      }

      fireLifecycle(
        enteringViewItem.vueComponent,
        enteringViewItem.vueComponentRef,
        LIFECYCLE_WILL_ENTER
      );

      if (
        leavingViewItem?.ionPageElement &&
        enteringViewItem !== leavingViewItem
      ) {
        let animationBuilder = routerAnimation;
        const leavingEl = leavingViewItem.ionPageElement;

        fireLifecycle(
          leavingViewItem.vueComponent,
          leavingViewItem.vueComponentRef,
          LIFECYCLE_WILL_LEAVE
        );

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
          routerDirection === "back" &&
          customAnimation !== undefined
        ) {
          animationBuilder = customAnimation;
        }

        leavingViewItem.routerAnimation = animationBuilder;

        await transition(
          enteringEl,
          leavingEl,
          routerDirection,
          !!routeInfo.pushedByRoute,
          false,
          animationBuilder
        );

        leavingEl.classList.add("ion-page-hidden");
        leavingEl.setAttribute("aria-hidden", "true");

        const usingLinearNavigation = viewStacks.size() === 1;

        if (routerAction === "replace") {
          leavingViewItem.mount = false;
          leavingViewItem.ionPageElement = undefined;
          leavingViewItem.ionRoute = false;
        } else if (
          !(routerAction === "push" && routerDirection === "forward")
        ) {
          const shouldLeavingViewBeRemoved =
            routerDirection !== "none" &&
            leavingViewItem &&
            enteringViewItem !== leavingViewItem;
          if (shouldLeavingViewBeRemoved) {
            leavingViewItem.mount = false;
            leavingViewItem.ionPageElement = undefined;
            leavingViewItem.ionRoute = false;

            /**
             * router.go() expects navigation to be
             * linear. If an app is using multiple stacks then
             * it is not using linear navigation. As a result, router.go()
             * will not give the results that developers are expecting.
             */
            if (usingLinearNavigation) {
              viewStacks.unmountLeavingViews(id, enteringViewItem, delta);
            }
          }
        } else if (usingLinearNavigation) {
          viewStacks.mountIntermediaryViews(id, leavingViewItem, delta);
        }

        fireLifecycle(
          leavingViewItem.vueComponent,
          leavingViewItem.vueComponentRef,
          LIFECYCLE_DID_LEAVE
        );
      } else {
        /**
         * If there is no leaving element, just show
         * the entering element. Wrap it in an raf
         * in case ion-content's fullscreen callback
         * is running. Otherwise we'd have a flicker.
         */
        requestAnimationFrame(() =>
          enteringEl.classList.remove("ion-page-invisible")
        );
      }

      fireLifecycle(
        enteringViewItem.vueComponent,
        enteringViewItem.vueComponentRef,
        LIFECYCLE_DID_ENTER
      );

      components.value = viewStacks.getChildrenToRender(id);
    };

    const setupViewItem = (matchedRouteRef: any) => {
      const firstMatchedRoute = route.matched[0];
      if (!parentOutletPath) {
        parentOutletPath = firstMatchedRoute.path;
      }

      /**
       * If no matched route, do not do anything in this outlet.
       * If there is a match, but it the first matched path
       * is not the root path for this outlet, then this view
       * change needs to be rendered in a different outlet.
       * We also add an exception for when the matchedRouteRef is
       * equal to the first matched route (i.e. the base router outlet).
       * This logic is mainly to help nested outlets/multi-tab
       * setups work better.
       */
      if (
        !matchedRouteRef.value ||
        (matchedRouteRef.value !== firstMatchedRoute &&
          firstMatchedRoute.path !== parentOutletPath)
      ) {
        return;
      }

      const currentRoute = ionRouter.getCurrentRouteInfo();
      let enteringViewItem = viewStacks.findViewItemByRouteInfo(
        currentRoute,
        id
      );

      if (!enteringViewItem) {
        enteringViewItem = viewStacks.createViewItem(
          id,
          matchedRouteRef.value.components.default,
          matchedRouteRef.value,
          currentRoute
        );
        viewStacks.add(enteringViewItem);
      }

      if (!enteringViewItem.mount) {
        enteringViewItem.mount = true;
        enteringViewItem.registerCallback = () => {
          handlePageTransition();
          enteringViewItem.registerCallback = undefined;
        };
      } else {
        handlePageTransition();
      }

      components.value = viewStacks.getChildrenToRender(id);
    };

    if (matchedRouteRef.value) {
      setupViewItem(matchedRouteRef);
    }

    /**
     * Remove stack data for this outlet
     * when outlet is destroyed otherwise
     * we will see cached view data.
     */
    onUnmounted(() => viewStacks.clear(id));

    const registerIonPage = (viewItem: any, ionPageEl: HTMLElement) => {
      const oldIonPageEl = viewItem.ionPageElement;

      viewStacks.registerIonPage(viewItem, ionPageEl);

      /**
       * If there is a registerCallback,
       * then this component is being registered
       * as a result of a navigation change.
       */
      if (viewItem.registerCallback) {
        /**
         * Page should be hidden initially
         * to avoid flickering.
         */
        ionPageEl.classList.add("ion-page-invisible");
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
      } else if (
        oldIonPageEl &&
        !oldIonPageEl.classList.contains("ion-page-invisible")
      ) {
        ionPageEl.classList.remove("ion-page-invisible");
      }
    };
    return {
      id,
      components,
      injectedRoute,
      ionRouterOutlet,
      registerIonPage,
    };
  },
  render() {
    const { components, registerIonPage, injectedRoute } = this;

    return h(
      "ion-router-outlet",
      { ref: "ionRouterOutlet" },
      components &&
        components.map((c: any) => {
          let props = {
            ref: c.vueComponentRef,
            key: c.pathname,
            registerIonPage: (ionPageEl: HTMLElement) =>
              registerIonPage(c, ionPageEl),
          };

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
                propsFunctionResult,
              };
              return propsFunctionResult;
            }
          };
          const routeProps = routePropsOption
            ? routePropsOption === true
              ? c.params
              : typeof routePropsOption === "function"
              ? getPropsFunctionResult()
              : routePropsOption
            : null;

          props = {
            ...props,
            ...routeProps,
          };

          return h(c.vueComponent, props);
        })
    );
  },
});
