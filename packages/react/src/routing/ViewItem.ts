import { ReactElement } from 'react';

export interface ViewItem<T = any> {
  id: string;
  reactElement: ReactElement;
  ionPageElement?: HTMLElement | undefined;
  ionRoute?: boolean;
  mount: boolean;
  routeData?: T;
  destroy?: () => void; // Todo: needed?
  transitionHtml?: string;
  outletId: string;
  disableIonPageManagement?: boolean;
}
