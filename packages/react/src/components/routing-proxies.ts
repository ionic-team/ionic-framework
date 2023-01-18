import type { JSX } from '@ionic/core/components';
import { IonBreadcrumb as IonBreadcrumbCmp } from '@ionic/core/components/ion-breadcrumb.js';
import { IonButton as IonButtonCmp } from '@ionic/core/components/ion-button.js';
import { IonCard as IonCardCmp } from '@ionic/core/components/ion-card.js';
import { IonFabButton as IonFabButtonCmp } from '@ionic/core/components/ion-fab-button.js';
import { IonItemOption as IonItemOptionCmp } from '@ionic/core/components/ion-item-option.js';
import { IonItem as IonItemCmp } from '@ionic/core/components/ion-item.js';
import { IonRouterLink as IonRouterLinkCmp } from '@ionic/core/components/ion-router-link.js';

import { createRoutingComponent } from './createRoutingComponent';
import type { HrefProps } from './hrefprops';

export const IonRouterLink = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonRouterLink>,
  HTMLIonRouterLinkElement
>('ion-router-link', IonRouterLinkCmp);

export const IonButton = /*@__PURE__*/ createRoutingComponent<HrefProps<JSX.IonButton>, HTMLIonButtonElement>(
  'ion-button',
  IonButtonCmp
);

export const IonCard = /*@__PURE__*/ createRoutingComponent<HrefProps<JSX.IonCard>, HTMLIonCardElement>(
  'ion-card',
  IonCardCmp
);

export const IonFabButton = /*@__PURE__*/ createRoutingComponent<HrefProps<JSX.IonFabButton>, HTMLIonFabButtonElement>(
  'ion-fab-button',
  IonFabButtonCmp
);

export const IonItem = /*@__PURE__*/ createRoutingComponent<HrefProps<JSX.IonItem>, HTMLIonItemElement>(
  'ion-item',
  IonItemCmp
);

export const IonItemOption = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonItemOption>,
  HTMLIonItemOptionElement
>('ion-item-option', IonItemOptionCmp);

export const IonBreadcrumb = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonBreadcrumb>,
  HTMLIonBreadcrumbElement
>('ion-breadcrumb', IonBreadcrumbCmp);
