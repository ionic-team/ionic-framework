import { AnimationController } from './components/animation/animation';
import { Animation, AnimationBuilder } from './components/animation/animation-interface';
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


export interface Config {
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
  AnimationController,
  GestureCallback,
  GestureDetail,
  Loading,
  LoadingOptions,
  LoadingController,
  LoadingEvent,
  Menu,
  MenuController,
  MenuType,
  Modal,
  ModalController,
  ModalOptions,
  ModalEvent,
  Scroll,
  ScrollCallback,
  ScrollDetail,
  Segment,
  SegmentButton,
  SegmentButtonEvent
}
