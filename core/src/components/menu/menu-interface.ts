export { Menu } from './menu';

export interface MenuChangeEvent {
  target: HTMLIonMenuElement;
  detail: MenuChangeEventDetail;
}

export interface MenuChangeEventDetail {
  disabled: boolean;
  open: boolean;
}
