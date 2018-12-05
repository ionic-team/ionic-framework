// Core Ionic types
// tslint:disable-next-line:no-import-side-effect
import { IonicConfig } from '@ionic/core';

// Webpack import for ionicons
// @ts-ignore
// tslint:disable-next-line:no-import-side-effect
import '@ionic/core/dist/ionic/svg';


// import '@ionic/core/css/ionic.bundle.css';
// import 'ionicons/dist/collection/icon/icon.css';

import { defineCustomElements } from '@ionic/core/loader';
import { IonicWindow } from './interfaces';

export function appInitialize(config?: IonicConfig) {
  const win: IonicWindow = window as any;
  const Ionic = (win.Ionic = win.Ionic || {});

  Ionic.config = config;
  defineCustomElements(window);
}
