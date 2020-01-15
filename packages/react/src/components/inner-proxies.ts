import { JSX } from '@ionic/core';
import { JSX as IoniconsJSX } from 'ionicons';

import { /*@__PURE__*/ createReactComponent } from './createComponent';

export const IonTabBarInner = /*@__PURE__*/createReactComponent<JSX.IonTabBar, HTMLIonTabBarElement>('ion-tab-bar');
export const IonBackButtonInner = /*@__PURE__*/createReactComponent<Omit<JSX.IonBackButton, 'icon'>, HTMLIonBackButtonElement>('ion-back-button');
export const IonRouterOutletInner = /*@__PURE__*/createReactComponent<JSX.IonRouterOutlet, HTMLIonRouterOutletElement>('ion-router-outlet');

// ionicons
export const IonIconInner = /*@__PURE__*/createReactComponent<IoniconsJSX.IonIcon, HTMLIonIconElement>('ion-icon');
