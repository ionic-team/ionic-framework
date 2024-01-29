import type { JSX } from '@ionic/core/components';
import { defineCustomElement as defineIonApp } from '@ionic/core/components/ion-app.js';
import { defineCustomElement as defineIonBackButton } from '@ionic/core/components/ion-back-button.js';
import { defineCustomElement as defineIonRouterOutlet } from '@ionic/core/components/ion-router-outlet.js';
import { defineCustomElement as defineIonTabBar } from '@ionic/core/components/ion-tab-bar.js';
import { defineCustomElement as defineIonTabButton } from '@ionic/core/components/ion-tab-button.js';
import type { JSX as IoniconsJSX } from 'ionicons';
import { defineCustomElement as defineIonIcon } from 'ionicons/components/ion-icon.js';

import { createReactComponent } from './react-component-lib';

export const IonTabButtonInner = /*@__PURE__*/ createReactComponent<
  JSX.IonTabButton & { onIonTabButtonClick?: (e: CustomEvent) => void },
  HTMLIonTabButtonElement
>('ion-tab-button', undefined, undefined, defineIonTabButton);
export const IonTabBarInner = /*@__PURE__*/ createReactComponent<JSX.IonTabBar, HTMLIonTabBarElement>(
  'ion-tab-bar',
  undefined,
  undefined,
  defineIonTabBar
);
export const IonBackButtonInner = /*@__PURE__*/ createReactComponent<
  Omit<JSX.IonBackButton, 'icon'>,
  HTMLIonBackButtonElement
>('ion-back-button', undefined, undefined, defineIonBackButton);
export const IonRouterOutletInner = /*@__PURE__*/ createReactComponent<
  JSX.IonRouterOutlet & {
    setRef?: (val: HTMLIonRouterOutletElement) => void;
    forwardedRef?: React.ForwardedRef<HTMLIonRouterOutletElement>;
  },
  HTMLIonRouterOutletElement
>('ion-router-outlet', undefined, undefined, defineIonRouterOutlet);

export const IonAppInner = /*@__PURE__*/ createReactComponent<JSX.IonApp, HTMLIonAppElement>(
  'ion-app',
  undefined,
  undefined,
  defineIonApp
);

// ionicons
export const IonIconInner = /*@__PURE__*/ createReactComponent<IoniconsJSX.IonIcon, HTMLIonIconElement>(
  'ion-icon',
  undefined,
  undefined,
  defineIonIcon
);
