import { addIcons } from 'ionicons';
import { ICON_PATHS } from 'ionicons/icons';
import { IonicConfig } from '@ionic/core';
import { defineCustomElements } from '@ionic/core/loader';
import { IonicWindow } from './types';

export function registerIonic(config: IonicConfig = {}) {
  const win: IonicWindow = window as any;
  const Ionic = (win.Ionic = win.Ionic || {});
  addIcons(ICON_PATHS);

  Ionic.config = config;
  defineCustomElements(window);
}
