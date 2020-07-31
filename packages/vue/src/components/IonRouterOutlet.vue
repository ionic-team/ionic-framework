<script>
  import { h, computed, shallowRef, watch, inject } from 'vue'
  import { useRoute } from 'vue-router';
  import { generateId } from '../utils';

  export default {
    name: 'IonRouterOutlet',
    props: {
      route: Object
    },
    mounted() {
      let skipTransition = false;
      const ionRouter = inject('navManager');
      const viewStacks = inject('viewStacks');
      const ionRouterOutlet = this.$refs.ionRouterOutlet;

      const canStart = () => ionRouter.canGoBack(1);
      const onStart = () => {
        const routeInfo = ionRouter.getCurrentRouteInfo();
        const leavingViewItem = viewStacks.findViewItemByRouteInfo(routeInfo);

        if (leavingViewItem) {
          const enteringViewItem = viewStacks.findLeavingViewItemByRouteInfo(routeInfo, this.id);

          return transition(
            enteringViewItem.ionPageElement,
            leavingViewItem.ionPageElement,
            'back',
            ionRouter.canGoBack(2),
            true,
            undefined // todo custom animation;
          )
        }
        return Promise.resolve();
      }

      const onEnd = (shouldContinue) => {
        if (shouldContinue) {
          skipTransition = true;
          this.$router.back();
        }
      }

      ionRouterOutlet.swipeHandler = {
        canStart,
        onStart,
        onEnd
      }

      const transition = (
        enteringEl,
        leavingEl,
        direction,
        showGoBack,
        progressAnimation,
        animationBuilder
      ) => {
        if (skipTransition) {
          skipTransition = false;
          return Promise.resolve(false);
        }

        if (enteringEl === leavingEl) {
          return Promise.resolve(false);
        }

        enteringEl.classList.add('ion-page-invisible');

        return ionRouterOutlet.commit(enteringEl, leavingEl, {
          deepWait: true,
          duration: direction === undefined ? 0 : undefined,
          direction,
          showGoBack,
          progressAnimation,
          animationBuilder
        });
      }

      const handlePageTransition = async (routeInfo) => {
        const { routeDirection, routeAction, routeAnimation } = routeInfo;

        if (routeInfo.pathname !== routeInfo.lastPathname) {

          const enteringViewItem = viewStacks.findViewItemByRouteInfo(routeInfo);
          const leavingViewItem = viewStacks.findLeavingViewItemByRouteInfo(routeInfo, this.id);

          if (!leavingViewItem) {
            return;
          }

          const enteringEl = enteringViewItem.ionPageElement;
          const leavingEl = leavingViewItem.ionPageElement;

          await transition(
            enteringEl,
            leavingEl,
            routeDirection,
            ionRouter.canGoBack(1),
            false,
            routeAnimation
          );

          leavingEl.classList.add('ion-page-hidden');
          leavingEl.setAttribute('aria-hidden', 'true');

          if (routeAction === 'pop') {
            viewStacks.remove(leavingViewItem, this.id);
          }
        }
        this.components = viewStacks.getChildrenToRender(this.id);
      }

      ionRouter.handleRegisterListener(handlePageTransition);
    },
    setup(props) {
      const ionRouter = inject('navManager');
      const viewStacks = inject('viewStacks');
      const realRoute = useRoute();
      const components = shallowRef([]);
      const route = computed(() => props.route || realRoute);
      const id = generateId('ion-router-outlet');
      const depth = 0;
      const matchedRoute = computed(() => route.value.matched[depth]);

      ionRouter.setInitialRoute(realRoute);

      watch(matchedRoute, () => {
        const currentRoute = ionRouter.getCurrentRouteInfo();
        let enteringViewItem = viewStacks.findViewItemByRouteInfo(currentRoute);

        if (!enteringViewItem) {
          enteringViewItem = viewStacks.createViewItem(id, matchedRoute.value.components.default, matchedRoute.value, currentRoute);
          viewStacks.add(enteringViewItem);

          // TODO is it always in `default`?
          const ionPage = matchedRoute.value.components.default.components.IonPage;
          ionPage.mounted = function() {
            viewStacks.registerIonPage(enteringViewItem, this.$refs.ionPage);
            ionRouter.handleTransition();
          }
        } else {
          ionRouter.handleTransition();
        }

        components.value = viewStacks.getChildrenToRender(id);
      });

      return {
        id,
        components
      }
    },
    render() {
      const { components } = this;

      return h(
        "ion-router-outlet",
        { ref: "ionRouterOutlet" },
        components && components.map((c) => h(c))
      );
    }
  }
</script>
