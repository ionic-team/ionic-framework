// Core Ionic types
// tslint:disable-next-line:no-import-side-effect
import { IonicConfig } from '@ionic/core';

// Webpack import for ionicons
import { addIcons } from 'ionicons';
import { arrowBackSharp, chevronBack, chevronForward, closeCircle, closeSharp, menuOutline, menuSharp, reorderThreeOutline, reorderTwoSharp, searchOutline, searchSharp } from 'ionicons/icons';

// import '@ionic/core/css/ionic.bundle.css';
// import 'ionicons/dist/collection/icon/icon.css';

import { applyPolyfills, defineCustomElements } from '@ionic/core/loader';
import { IonicWindow } from './interfaces';

export function appInitialize(config?: IonicConfig) {
  const win: IonicWindow = window as any;
  const Ionic = (win.Ionic = win.Ionic || {});

  Ionic.config = config;
  applyPolyfills().then(() => defineCustomElements(win));

  // Icons that are used by internal components
  addIcons({
    'arrow-back-sharp': arrowBackSharp,
    'chevron-back': chevronBack,
    'chevron-forward': chevronForward,
    'close-circle': closeCircle,
    'close-sharp': closeSharp,
    'menu-outline': menuOutline,
    'menu-sharp': menuSharp,
    'reorder-two-sharp': reorderTwoSharp,
    'reorder-three-outline': reorderThreeOutline,
    'search-outline': searchOutline,
    'search-sharp': searchSharp,
  });
}
