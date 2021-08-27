import type { JSX } from '@ionic/core';

import { createRoutingComponent } from './createRoutingComponent';
import { HrefProps } from './hrefprops';

export const IonRouterLink = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonRouterLink>,
  HTMLIonRouterLinkElement
>('ion-router-link');

export const IonButton = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonButton>,
  HTMLIonButtonElement
>('ion-button');

export const IonCard = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonCard>,
  HTMLIonCardElement
>('ion-card');

export const IonFabButton = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonFabButton>,
  HTMLIonFabButtonElement
>('ion-fab-button');

export const IonItem = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonItem>,
  HTMLIonItemElement
>('ion-item');

export const IonItemOption = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonItemOption>,
  HTMLIonItemOptionElement
>('ion-item-option');
