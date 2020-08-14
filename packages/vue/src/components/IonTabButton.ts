import { h, defineComponent, inject } from 'vue';

export const IonTabButton = defineComponent({
  name: 'IonTabButton',
  setup(_, { attrs, slots }) {
    const ionRouter: any = inject('navManager');
    const onClick = (ev: Event) => {

      if (ev.cancelable) {
        ev.preventDefault();
      }

      const { tab, href } = attrs;
      const currentRoute = ionRouter.getCurrentRouteInfo();

      if (currentRoute.tab === tab) {
        if (href !== currentRoute.pathname) {
          ionRouter.resetTab(tab, href);
        }
      } else {
        // TODO tabs will change/did change
        ionRouter.changeTab(tab, href)
      }
    }
    return () => {
      const children = slots.default && slots.default()
      return h(
        'ion-tab-button',
        {
          onClick,
          ...attrs
        },
        children
      )
    }
  }
});
