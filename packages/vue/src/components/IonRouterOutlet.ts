import {
  h,
  defineComponent,
  ref,
  computed,
  inject,
  provide,
  watch,
  shallowRef,
  InjectionKey
} from 'vue';
import { AnimationBuilder } from '@ionic/core';
import { useRoute, useRouter } from 'vue-router';
import { fireLifecycle, generateId, LIFECYCLE_DID_ENTER, LIFECYCLE_DID_LEAVE, LIFECYCLE_WILL_ENTER, LIFECYCLE_WILL_LEAVE } from '../utils';

let viewDepthKey: InjectionKey<0> = Symbol(0);
export const IonRouterOutlet = defineComponent({
  name: 'IonRouterOutlet',
  setup(_, { attrs }) {
    const vueRouter = useRouter();
    const route = useRoute();
    const depth = inject(viewDepthKey, 0);

    // TODO types
    let tabsPrefix: string | undefined;
    const matchedRouteRef: any = computed(() => {
      const matchedRoute = route.matched[depth];

      if (attrs.tabs && !tabsPrefix) {
          tabsPrefix = route.matched[0].path;
          viewStacks.addTabsPrefix(tabsPrefix);
      }

      if (matchedRoute && attrs.tabs && route.matched[depth + 1]) {
        return route.matched[route.matched.length - 1];
      }

      return matchedRoute;
    });

    provide(viewDepthKey, depth + 1)

    const ionRouterOutlet = ref();
    const id = generateId('ion-router-outlet');

    // TODO types
    const ionRouter: any = inject('navManager');
    const viewStacks: any = inject('viewStacks');

    const components = shallowRef([]);

    let skipTransition = false;

    watch(matchedRouteRef, () => {
      setupViewItem(matchedRouteRef);
    });

    const canStart = () => {
      const stack = viewStacks.getViewStack(id);
      return stack && stack.length > 1;
    }
    const onStart = async () => {
      const routeInfo = ionRouter.getCurrentRouteInfo();
      const { routerAnimation } = routeInfo;
      const items = viewStacks.getViewStack(id);
      const enteringViewItem = items[items.length - 2];
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
        vueRouter.back();
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
      if (skipTransition) {
        skipTransition = false;
        return Promise.resolve(false);
      }

      if (enteringEl === leavingEl) {
        return Promise.resolve(false);
      }

      enteringEl.classList.add('ion-page-invisible');

      return ionRouterOutlet.value.commit(enteringEl, leavingEl, {
        deepWait: true,
        duration: direction === undefined || direction === 'root' || direction === 'none' ? 0 : undefined,
        direction,
        showGoBack,
        progressAnimation,
        animationBuilder
      });
    }

    const handlePageTransition = async () => {
      const routeInfo = ionRouter.getCurrentRouteInfo();
      const { routerDirection, routerAction, routerAnimation } = routeInfo;

      const enteringViewItem = viewStacks.findViewItemByRouteInfo(routeInfo, id);
      const leavingViewItem = viewStacks.findLeavingViewItemByRouteInfo(routeInfo, id);

      if (enteringViewItem === leavingViewItem) return;

      fireLifecycle(enteringViewItem.vueComponent, LIFECYCLE_WILL_ENTER);

      if (leavingViewItem) {
        let animationBuilder = routerAnimation;
        const enteringEl = enteringViewItem.ionPageElement;
        const leavingEl = leavingViewItem.ionPageElement;

        fireLifecycle(leavingViewItem.vueComponent, LIFECYCLE_WILL_LEAVE);

        enteringEl.classList.remove('ion-page-hidden');

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
          routerDirection === 'back' &&
          // todo check for tab switch
          customAnimation !== undefined
        ) {
          animationBuilder = customAnimation;
        }

        leavingViewItem.routerAnimation = animationBuilder;

        await transition(
          enteringEl,
          leavingEl,
          routerDirection,
          routerDirection === 'forward',
          false,
          animationBuilder
        );

        leavingEl.classList.add('ion-page-hidden');
        leavingEl.setAttribute('aria-hidden', 'true');

        if (!(routerAction === 'push' && routerDirection === 'forward')) {
          const shouldLeavingViewBeRemoved = routerDirection !== 'none' && leavingViewItem && (enteringViewItem !== leavingViewItem);
          if (shouldLeavingViewBeRemoved) {
            leavingViewItem.mount = false;
            leavingViewItem.ionPageElement = undefined;
            leavingViewItem.ionRoute = false;
          }
        }

        fireLifecycle(leavingViewItem.vueComponent, LIFECYCLE_DID_LEAVE);
      }

      fireLifecycle(enteringViewItem.vueComponent, LIFECYCLE_DID_ENTER);

      components.value = viewStacks.getChildrenToRender(id);
    }

    // TODO types
    const setupViewItem = (matchedRouteRef: any) => {
      if (!matchedRouteRef.value) {
        return;
      }

      const currentRoute = ionRouter.getCurrentRouteInfo();
      const hasTabsPrefix = viewStacks.hasTabsPrefix(currentRoute.pathname)
      const isLastPathTabs = viewStacks.hasTabsPrefix(currentRoute.lastPathname);
      if (hasTabsPrefix && isLastPathTabs && !attrs.tabs) { return; }

      let enteringViewItem = viewStacks.findViewItemByRouteInfo(currentRoute, id);

      if (!enteringViewItem) {
        enteringViewItem = viewStacks.createViewItem(id, matchedRouteRef.value.components.default, matchedRouteRef.value, currentRoute);
        viewStacks.add(enteringViewItem);
      }

      if (!enteringViewItem.mount) {
        enteringViewItem.mount = true;
        enteringViewItem.vueComponent.components.IonPage.mounted = function () {
          viewStacks.registerIonPage(enteringViewItem, this.$refs.ionPage);
          handlePageTransition();
          enteringViewItem.vueComponent.components.IonPage.mounted = undefined;
        };
      } else {
        handlePageTransition();
      }

      components.value = viewStacks.getChildrenToRender(id);
    }

    if (matchedRouteRef.value) {
      setupViewItem(matchedRouteRef);
    }

    return {
      id,
      components,
      ionRouterOutlet
    }
  },
  render() {
    const { components } = this;

    return h(
      'ion-router-outlet',
      { ref: 'ionRouterOutlet' },
      // TODO types
      components && components.map((c: any) => h(c.vueComponent, { key: c.pathname }))
    )
  }
});
