import { Component, Element, Prop, QueueApi } from '@stencil/core';

import { Config } from '../../interface';
import { rIC } from '../../utils/helpers';
import { isPlatform } from '../../utils/platform';

@Component({
  tag: 'ion-app',
  styleUrl: 'app.scss'
})
export class App {

  @Element() el!: HTMLElement;

  @Prop({ context: 'window' }) win!: Window;
  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'queue' }) queue!: QueueApi;

  componentDidLoad() {
    rIC(() => {
      importTapClick(this.win);
      importInputShims(this.win, this.config);
      importStatusTap(this.win, this.queue);
      importHardwareBackButton(this.win);
    });
  }

  hostData() {
    return {
      class: {
        'ion-page': true,
      }
    };
  }
}

function importHardwareBackButton(win: Window) {
  if (isPlatform(win, 'hybrid')) {
    import('../../utils/hardware-back-button').then(module => module.startHardwareBackButton(win));
  }
}

function importStatusTap(win: Window, queue: QueueApi) {
  if (isPlatform(win, 'hybrid')) {
    import('../../utils/status-tap').then(module => module.startStatusTap(win, queue));
  }
}

function importTapClick(win: Window) {
  import('../../utils/tap-click').then(module => module.startTapClick(win.document));
}

function importInputShims(win: Window, config: Config) {
  const inputShims = config.getBoolean('inputShims', needInputShims(win));
  if (inputShims) {
    import('../../utils/input-shims/input-shims').then(module => module.startInputShims(win.document, config));
  }
}

function needInputShims(win: Window) {
  return isPlatform(win, 'ios') && isPlatform(win, 'mobile');
}
