import { h, inject, defineComponent } from 'vue';
import { Router, useRouter } from 'vue-router';

export const IonBackButton = defineComponent({
  name: 'IonBackButton',
  setup(_, { attrs, slots }) {
    const ionRouter: any = inject('navManager');
    const vueRouter: Router = useRouter();

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

        vueRouter.go(-1);

      } else {
        ionRouter.setIncomingRouteParams({
          routerDirection: 'back',
          routerAction: 'replace',
          routerAnimation
        });
        vueRouter.replace(defaultHref);
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
