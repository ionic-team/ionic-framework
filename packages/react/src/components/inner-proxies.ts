import { JSX } from '@ionic/core/components';
import { IonBackButton as IonBackButtonCmp } from '@ionic/core/components/ion-back-button.js';
import { IonRouterOutlet as IonRouterOutletCmp } from '@ionic/core/components/ion-router-outlet.js';
import { IonTabBar as IonTabBarCmp } from '@ionic/core/components/ion-tab-bar.js';
import { IonTabButton as IonTabButtonCmp } from '@ionic/core/components/ion-tab-button.js';
import { JSX as IoniconsJSX } from 'ionicons';
import { IonIcon as IonIconCmp } from 'ionicons/components/ion-icon.js';
import { IonApp as IonAppCmp } from '@ionic/core/components/ion-app.js';

import { /*@__PURE__*/ createReactComponent } from './react-component-lib';

export const IonTabButtonInner = /*@__PURE__*/ createReactComponent<
  JSX.IonTabButton & { onIonTabButtonClick?: (e: CustomEvent) => void },
  HTMLIonTabButtonElement
>('ion-tab-button', undefined, undefined, IonTabButtonCmp);
export const IonTabBarInner = /*@__PURE__*/ createReactComponent<
  JSX.IonTabBar,
  HTMLIonTabBarElement
>('ion-tab-bar', undefined, undefined, IonTabBarCmp);
export const IonBackButtonInner = /*@__PURE__*/ createReactComponent<
  Omit<JSX.IonBackButton, 'icon'>,
  HTMLIonBackButtonElement
>('ion-back-button', undefined, undefined, IonBackButtonCmp);
export const IonRouterOutletInner = /*@__PURE__*/ createReactComponent<
  JSX.IonRouterOutlet & {
    setRef?: (val: HTMLIonRouterOutletElement) => void;
    forwardedRef?: React.ForwardedRef<HTMLIonRouterOutletElement>;
  },
  HTMLIonRouterOutletElement
>('ion-router-outlet', undefined, undefined, IonRouterOutletCmp);

export const IonAppInner = /*@__PURE__*/ createReactComponent<JSX.IonApp, HTMLIonAppElement>(
  'ion-app',
  undefined,
  undefined,
  IonAppCmp
);

// ionicons
export const IonIconInner = /*@__PURE__*/ createReactComponent<
  IoniconsJSX.IonIcon,
  HTMLIonIconElement
>('ion-icon', undefined, undefined, IonIconCmp);
