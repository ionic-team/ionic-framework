import { ComponentProps, NavComponent } from '../../interface';
import { RouterDirection } from '../router/utils/interface';

export const navLink = (el: HTMLElement, routerDirection: RouterDirection, component?: NavComponent, componentProps?: ComponentProps) => {
  const nav = el.closest('ion-nav');
  if (nav) {
    if (routerDirection === 'forward') {
      if (component !== undefined) {
        return nav.push(component, componentProps, { skipIfBusy: true });
      }
    } else if (routerDirection === 'root') {
      if (component !== undefined) {
        return nav.setRoot(component, componentProps, { skipIfBusy: true });
      }
    } else if (routerDirection === 'back') {
      return nav.pop({ skipIfBusy: true });
    }
  }
  return Promise.resolve(false);
};
