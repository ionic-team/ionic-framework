import { Animation, AnimationBuilder } from './animations/interfaces';
import { Loading, LoadingEvent, LoadingOptions } from './components/loading/loading';
import { LoadingController } from './components/loading-controller/loading-controller';
import { GestureDetail, GestureCallback } from './components/gesture/gesture';
import { Menu } from './components/menu/menu';
import { MenuType } from './components/menu/menu-types';
import { MenuController } from './components/menu/menu-controller';
import { Modal, ModalOptions, ModalEvent } from './components/modal/modal';
import { ModalController } from './components/modal-controller/modal-controller';
import { Scroll, ScrollCallback, ScrollDetail } from './components/scroll/scroll';
import { Segment } from './components/segment/segment';
import { SegmentButton, SegmentButtonEvent } from './components/segment-button/segment-button';
import * as Stencil from '@stencil/core';


declare global {
  const Ionic: IonicGlobal;
}


export interface IonicGlobal extends Stencil.AppGlobal {
  Animation?: Animation;
  controllers?: {[ctrlName: string]: any};
  controller?: IonicController;
  config: ConfigApi;
  loadController?: (ctrlName: string, ctrl: any) => void;
  mode: string;
}


export interface IonicController {
  <LoadingController>(ctrlName: 'loading', opts: LoadingOptions): Promise<Loading>;
  <MenuController>(ctrlName: 'menu'): Promise<MenuController>;
  <ModalController>(ctrlName: 'modal', opts: ModalOptions): Promise<Modal>;
  (ctrlName: string, opts?: any): Promise<IonicControllerApi>;
}


export interface IonicControllerApi {
  load?: (opts?: any) => Promise<any>;
}


export interface ConfigApi {
  get: (key: string, fallback?: any) => any;
  getBoolean: (key: string, fallback?: boolean) => boolean;
  getNumber: (key: string, fallback?: number) => number;
}


export type CssClassMap = { [className: string]: boolean };


export interface BaseInputComponent {
  disabled: boolean;
  hasFocus: boolean;
  value: string;

  fireFocus: () => void;
  fireBlur: () => void;
}


export interface BooleanInputComponent extends BaseInputComponent {
  checked: boolean;
  toggle: (ev: UIEvent) => void;
}


export {
  Animation,
  AnimationBuilder,
  GestureDetail,
  Loading,
  LoadingOptions,
  LoadingController,
  LoadingEvent,
  Menu,
  MenuController,
  MenuType,
  Modal,
  ModalOptions,
  ModalEvent,
  Scroll,
  ScrollCallback,
  ScrollDetail,
  Segment,
  SegmentButton,
  SegmentButtonEvent
}
