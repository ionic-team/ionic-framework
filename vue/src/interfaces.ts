import Vue from 'vue';
import VueRouter from 'vue-router';
import { RouterDirection, HTMLStencilElement } from '@ionic/core';
import { RouterOptions } from 'vue-router/types/router';

declare module 'vue-router/types/router' {
  interface VueRouter {
    direction: RouterDirection;
    directionOverride: RouterDirection | null;
    transition: Promise<void>;
    canGoBack(): boolean;
  }
}

export interface HTMLVueElement extends HTMLElement {
  __vue__: Vue;
}

export interface VueWindow extends Window {
  Vue: typeof Vue;
  VueRouter: typeof VueRouter;
  disableIonicTransitions: boolean;
}

export interface WebpackFunction extends Function {
  cid: number;
}

export interface EsModule extends Object {
  __esModule?: boolean;
  [Symbol.toStringTag]: string;
}

export interface IonicGlobal {
  config?: any;
  ael?: (elm: any, eventName: string, cb: (ev: Event) => void, opts: any) => void;
  raf?: (ts: number) => void;
  rel?: (elm: any, eventName: string, cb: (ev: Event) => void, opts: any) => void;
}

export interface IonicWindow extends Window {
  Ionic: IonicGlobal;
}

export interface FrameworkDelegate {
  attachViewToDom(parentElement: HTMLElement, component: HTMLElement | WebpackFunction | object | Vue, opts?: object, classes?: string[]): Promise<HTMLElement>;
  removeViewFromDom(parentElement: HTMLElement, childElement: HTMLVueElement): Promise<void>;
}

export interface IonBackButton extends HTMLStencilElement {
  defaultHref?: string;
}

export interface IonRouterOutlet extends HTMLStencilElement {
  commit(enterinEl: HTMLElement, leavingEl: HTMLElement | undefined, opts?: object | undefined): Promise<boolean>;
}

export interface ApiCache {
  [key: string]: any;
}

export interface RouterArgs extends RouterOptions {
  direction?: RouterDirection;
  viewCount?: number;
}

export interface ProxyControllerInterface {
  create(opts: object): Promise<HTMLElement>;
  dismiss(): Promise<void>;
  getTop(): Promise<HTMLElement>;
}

export interface ProxyDelegateOptions extends Object {
  [key: string]: any;
  delegate?: FrameworkDelegate;
}

export interface ProxyMenuControllerInterface {
  open(menuId?: string): Promise<boolean>;
  close(menuId?: string): Promise<boolean>;
  toggle(menuId?: string): Promise<boolean>;
  enable(shouldEnable: boolean, menuId?: string): Promise<HTMLElement>;
  swipeEnable(shouldEnable: boolean, menuId?: string): Promise<HTMLElement>;
  isOpen(menuId?: string): Promise<boolean>;
  isEnabled(menuId?: string): Promise<boolean>;
  get(menuId?: string): Promise<HTMLElement>;
  getOpen(): Promise<HTMLElement>;
  getMenus(): Promise<HTMLElement>;
}
