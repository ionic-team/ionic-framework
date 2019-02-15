import { Component, ComponentInterface, Element, Prop, QueueApi } from '@stencil/core';

import { config } from '../../global/ionic-global';
import { rIC } from '../../utils/helpers';
import { isPlatform } from '../../utils/platform';

@Component({
  tag: 'ion-app',
  styleUrl: 'app.scss'
})
export class App implements ComponentInterface {

  @Element() el!: HTMLElement;

  @Prop({ context: 'window' }) win!: Window;
  @Prop({ context: 'queue' }) queue!: QueueApi;

  componentDidLoad() {
    rIC(() => {
      const { win, queue } = this;

      if (!config.getBoolean('_testing')) {
        importTapClick(win);
      }

      importInputShims(win);
      importStatusTap(win, queue);
      importHardwareBackButton(win);
      importFocusVisible(win);
    });
  }

  hostData() {
    return {
      class: {
        'ion-page': true,
        'force-statusbar-padding': config.getBoolean('_forceStatusbarPadding')
      }
    };
  }
}

function importHardwareBackButton(win: Window) {
  const hardwareBackConfig = config.getBoolean('hardwareBackButton', isPlatform(win, 'hybrid'));
  if (hardwareBackConfig) {
    import('../../utils/hardware-back-button').then(module => module.startHardwareBackButton(win));
  }
}

function importStatusTap(win: Window, queue: QueueApi) {
  const statusTap = config.getBoolean('statusTap', isPlatform(win, 'hybrid'));
  if (statusTap) {
    import('../../utils/status-tap').then(module => module.startStatusTap(win, queue));
  }
}

function importFocusVisible(win: Window) {
  import('../../utils/focus-visible').then(module => module.startFocusVisible(win.document));
}

function importTapClick(win: Window) {
  import('../../utils/tap-click').then(module => module.startTapClick(win.document));
}

function importInputShims(win: Window) {
  const inputShims = config.getBoolean('inputShims', needInputShims(win));
  if (inputShims) {
    import('../../utils/input-shims/input-shims').then(module => module.startInputShims(win.document));
  }
}

function needInputShims(win: Window) {
  return isPlatform(win, 'ios') && isPlatform(win, 'mobile');
}
