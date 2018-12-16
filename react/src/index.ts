import { addIcons } from 'ionicons';
import { ICON_PATHS } from 'ionicons/icons';
import { IonicConfig } from '@ionic/core';
import { defineCustomElements } from '@ionic/core/loader';

export * from './components';

export interface IonicGlobal {
  config?: any;
  ael?: (elm: any, eventName: string, cb: (ev: Event) => void, opts: any) => void;
  raf?: (ts: number) => void;
  rel?: (elm: any, eventName: string, cb: (ev: Event) => void, opts: any) => void;
}

export interface IonicWindow extends Window {
  Ionic: IonicGlobal;
}

export function registerIonic(config: IonicConfig = {}) {
  const win: IonicWindow = window as any;
  const Ionic = (win.Ionic = win.Ionic || {});
  addIcons(ICON_PATHS);

  Ionic.config = config;
  defineCustomElements(window);
}
