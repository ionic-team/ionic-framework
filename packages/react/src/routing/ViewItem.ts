import type { AnimationBuilder } from '@ionic/core';
import type { ReactElement } from 'react';

export interface ViewItem<T = any> {
  id: string;
  reactElement: ReactElement;
  ionPageElement?: HTMLElement | undefined;
  ionRoute?: boolean;
  mount: boolean;
  routeData?: T;
  transitionHtml?: string;
  outletId: string;
  disableIonPageManagement?: boolean;
  routerAnimation?: AnimationBuilder;
  /**
   * Callback function when the view item is registered.
   */
  registerCallback?: () => void;
}
