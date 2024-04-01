import type {
  AnimationBuilder,
  ComponentProps,
} from '../../interface';
import type { NavComponent } from '../nav/nav-interface';
import type { RouterDirection } from '../router/utils/interface';

export const navLink = (
  el: HTMLElement,
  routerDirection: RouterDirection,
  component?: NavComponent,
  componentProps?: ComponentProps,
  routerAnimation?: AnimationBuilder
) => {
  const nav = el.closest('ion-nav');
  if (nav) {
    if (routerDirection === 'forward') {
      if (component !== undefined) {
        return nav.push(
          component,
          componentProps,
          {
            skipIfBusy: true,
            animationBuilder:
              routerAnimation,
          }
        );
      }
    } else if (
      routerDirection === 'root'
    ) {
      if (component !== undefined) {
        return nav.setRoot(
          component,
          componentProps,
          {
            skipIfBusy: true,
            animationBuilder:
              routerAnimation,
          }
        );
      }
    } else if (
      routerDirection === 'back'
    ) {
      return nav.pop({
        skipIfBusy: true,
        animationBuilder:
          routerAnimation,
      });
    }
  }
  return Promise.resolve(false);
};
