import { ReactElement } from 'react';

export interface ViewItem<T = any> {
  id: string;
  reactElement: ReactElement;
  ionPageElement?: HTMLElement | undefined;
  ionRoute?: boolean;
  mount: boolean;
  routeData?: T;
}
