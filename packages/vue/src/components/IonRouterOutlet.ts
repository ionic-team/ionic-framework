import {
  h,
  defineComponent,
  inject,
  provide,
  ref,
  computed,
  watch,
  shallowRef,
  InjectionKey
} from 'vue';
import { AnimationBuilder } from '@ionic/core';
import { useRoute, useRouter } from 'vue-router';
import { generateId } from '../utils';

let viewDepthKey: InjectionKey<0> = Symbol(0);

export const IonRouterOutlet = defineComponent({
  name: 'IonRouterOutlet',
  setup() {
    const vueRouter = useRouter();
    const route = useRoute();
    const depth = inject(viewDepthKey, 0)
    // TODO types
    const matchedRouteRef: any = computed(() => route.matched[depth]);
    const ionRouterOutlet = ref();
    const id = generateId('ion-router-outlet');

    // TODO types
    const ionRouter: any = inject('navManager');
    const viewStacks: any = inject('viewStacks');

    const components = shallowRef([]);

    let skipTransition = false;

    provide(viewDepthKey, depth + 1)

    watch(matchedRouteRef, () => {
      setupViewItem(matchedRouteRef);
    });

    const canStart = () => ionRouter.canGoBack(1);
    const onStart = async () => {
      const routeInfo = ionRouter.getCurrentRouteInfo();
      const { routerAnimation } = routeInfo;

      // TODO edge case: swipe back from nested outlet root to previous outlet
      const enteringViewItem = viewStacks.findLeavingViewItemByRouteInfo(routeInfo, id);
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
        duration: direction === undefined || direction === 'root' ? 0 : undefined,
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
          ionRouter.canGoBack(1),
          false,
          animationBuilder
        );

        leavingEl.classList.add('ion-page-hidden');
        leavingEl.setAttribute('aria-hidden', 'true');

        if (routerAction === 'pop') {
          viewStacks.remove(leavingViewItem, id);
          components.value = viewStacks.getChildrenToRender(id);
        }
      }
    }

    // TODO types
    const setupViewItem = (matchedRouteRef: any) => {
      if (!matchedRouteRef.value) {
        return;
      }

      const currentRoute = ionRouter.getCurrentRouteInfo();
      let enteringViewItem = viewStacks.findViewItemByRouteInfo(currentRoute, id);

      if (!enteringViewItem) {
        enteringViewItem = viewStacks.createViewItem(id, matchedRouteRef.value.components.default, matchedRouteRef.value, currentRoute);

        enteringViewItem.vueComponent.components.IonPage.mounted = function() {
          viewStacks.registerIonPage(enteringViewItem, this.$refs.ionPage);
          handlePageTransition();
        }
        viewStacks.add(enteringViewItem);
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
      components && components.map((c: any) => h(c))
    )
  }
});
