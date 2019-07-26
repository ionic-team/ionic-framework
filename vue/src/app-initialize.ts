// Core Ionic types
// tslint:disable-next-line:no-import-side-effect
import { IonicConfig } from '@ionic/core';

// Webpack import for ionicons
import { addIcons } from 'ionicons';
import { close, reorder, menu, arrowDown, arrowForward, arrowBack, search, closeCircle } from 'ionicons/icons';

// import '@ionic/core/css/ionic.bundle.css';
// import 'ionicons/dist/collection/icon/icon.css';

import { defineCustomElements } from '@ionic/core/loader';
import { IonicWindow } from './interfaces';

export function appInitialize(config?: IonicConfig) {
  const win: IonicWindow = window as any;
  const Ionic = (win.Ionic = win.Ionic || {});

  Ionic.config = config;
  defineCustomElements(window);
  // Icons that are used by internal components
  addIcons({
    'ios-close': close.ios,
    'md-close': close.md,
    'ios-reorder': reorder.ios,
    'md-reorder': reorder.md,
    'ios-menu': menu.ios,
    'md-menu': menu.md,
    'ios-arrow-forward': arrowForward.ios,
    'md-arrow-forward': arrowForward.md,
    'ios-arrow-back': arrowBack.ios,
    'md-arrow-back': arrowBack.md,
    'ios-arrow-down': arrowDown.ios,
    'md-arrow-down': arrowDown.md,
    'ios-search': search.ios,
    'md-search': search.md,
    'ios-close-circle': closeCircle.ios,
    'md-close-circle': closeCircle.md,
  });
}
