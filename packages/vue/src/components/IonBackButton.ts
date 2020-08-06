import { h, inject, defineComponent } from 'vue';

export const IonBackButton = defineComponent({
  name: 'IonBackButton',
  setup(_, { attrs, slots }) {
    const ionRouter: any = inject('navManager');

    const onClick = (ev: Event) => {
      const defaultHref = attrs['default-href'] || attrs['defaultHref'];
      const routerAnimation = attrs['router-animation'] || attrs['routerAnimation'];

      if (ionRouter.canGoBack()) {
        ev.stopPropagation();
        ionRouter.setIncomingRouteParams({
          routerDirection: 'back',
          routerAction: 'pop',
          routerAnimation
        });

        ionRouter.getRouter().go(-1);

      } else {
        ionRouter.setIncomingRouteParams({
          routerDirection: 'back',
          routerAction: 'replace',
          routerAnimation
        });
        ionRouter.getRouter().replace(defaultHref);
      }
    }

    return () => {
      return h(
        'ion-back-button',
        {
          onClick,
          ...attrs
        },
        slots.default && slots.default()
      )
    }
  }
});
