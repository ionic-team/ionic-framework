import { Side } from '../../interface';

export interface MenuI {

  el: HTMLIonMenuElement;
  side: Side;
  menuId?: string;
  disabled: boolean;
  isAnimating: boolean;
  width: number;
  isEndSide: boolean;
  _isOpen: boolean;

  backdropEl?: HTMLElement;
  menuInnerEl?: HTMLElement;
  contentEl?: HTMLElement;
  menuCtrl?: HTMLIonMenuControllerElement;

  isActive(): Promise<boolean>;
  open(animated?: boolean): Promise<boolean>;
  close(animated?: boolean): Promise<boolean>;
  toggle(animated?: boolean): Promise<boolean>;
  setOpen(shouldOpen: boolean, animated?: boolean): Promise<boolean>;
  _setOpen(shouldOpen: boolean, animated?: boolean): Promise<boolean>;
}

export interface MenuChangeEvent {
  target: HTMLIonMenuElement;
  detail: MenuChangeEventDetail;
}

export interface MenuChangeEventDetail {
  disabled: boolean;
  open: boolean;
}
