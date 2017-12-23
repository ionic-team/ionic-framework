
import { InjectionToken } from '@angular/core';
import { NavController } from '../providers/nav-controller';
import { NavParams } from '../providers/nav-params';

export const NavControllerToken = new InjectionToken<any>('NavControllerToken');
export const NavParamsToken = new InjectionToken<any>('NavParamsToken');

export function getProviders(element: HTMLElement, data: any) {
  if (element.tagName !== 'ion-nav') {
    element.closest('ion-nav');
  }

  const nearestNavElement = (element.tagName.toLowerCase() === 'ion-nav' ? element : element.closest('ion-nav')) as HTMLIonNavElement;

  return [
    {
      provide: NavControllerToken, useValue: nearestNavElement
    },

    {
      provide: NavController, useFactory: provideNavControllerInjectable, deps: [NavControllerToken]
    },

    {
      provide: NavControllerToken, useValue: data
    },

    {
      provide: NavParams, useFactory: provideNavParamsInjectable, deps: [NavControllerToken]
    },
  ]
}

export function provideNavControllerInjectable(element: HTMLIonNavElement) {
  return new NavController(element);
}

export function provideNavParamsInjectable(data: any) {
  return new NavParams(data);
}
