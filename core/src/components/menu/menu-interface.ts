import type { Animation, AnimationBuilder } from '@utils/animation/animation-interface';

export type Side = 'start' | 'end';

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
  menuCtrl?: MenuControllerI;

  isActive(): Promise<boolean>;
  open(animated?: boolean): Promise<boolean>;
  close(animated?: boolean): Promise<boolean>;
  toggle(animated?: boolean): Promise<boolean>;
  setOpen(shouldOpen: boolean, animated?: boolean): Promise<boolean>;
  _setOpen(shouldOpen: boolean, animated?: boolean): Promise<boolean>;
}

export interface MenuControllerI {
  registerAnimation(name: string, animation: AnimationBuilder): void;
  get(menu?: string | null, logOnMultipleSideMenus?: boolean): Promise<HTMLIonMenuElement | undefined>;
  getMenus(): Promise<HTMLIonMenuElement[]>;
  getOpen(): Promise<HTMLIonMenuElement | undefined>;
  isEnabled(menu?: string | null): Promise<boolean>;
  swipeGesture(shouldEnable: boolean, menu?: string | null): Promise<HTMLIonMenuElement | undefined>;
  isAnimating(): Promise<boolean>;
  isOpen(menu?: string | null): Promise<boolean>;
  enable(shouldEnable: boolean, menu?: string | null): Promise<HTMLIonMenuElement | undefined>;
  toggle(menu?: string | null): Promise<boolean>;
  close(menu?: string | null): Promise<boolean>;
  open(menu?: string | null): Promise<boolean>;
  _getOpenSync(): HTMLIonMenuElement | undefined;
  _createAnimation(type: string, menuCmp: MenuI): Promise<Animation>;
  _register(menu: MenuI): void;
  _unregister(menu: MenuI): void;
  _setOpen(menu: MenuI, shouldOpen: boolean, animated: boolean): Promise<boolean>;
}

export interface MenuChangeEventDetail {
  disabled: boolean;
  open: boolean;
}

export interface MenuCustomEvent<T = any> extends CustomEvent {
  detail: T;
  target: HTMLIonMenuElement;
}
