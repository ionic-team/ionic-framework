import { Component, Element, Prop, QueueApi } from '@stencil/core';

import { Config } from '../../interface';
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
    setTimeout(() => {
      importTapClick(this.win);
      importInputShims(this.win, this.config);
      importStatusTap(this.win, this.queue);
    }, 32);
  }

  hostData() {
    return {
      class: {
        'ion-page': true,
      }
    };
  }
}

function importStatusTap(win: Window, queue: QueueApi) {
  if (isPlatform(win, 'hybrid')) {
    // tslint:disable-next-line:no-floating-promises
    import('../../utils/status-tap').then(module => module.startStatusTap(win, queue));
  }
}

function importTapClick(win: Window) {
  // tslint:disable-next-line:no-floating-promises
  import('../../utils/tap-click').then(module => module.startTapClick(win.document));
}

function importInputShims(win: Window, config: Config) {
  const inputShims = config.getBoolean('inputShims', needInputShims(win));
  if (inputShims) {
    // tslint:disable-next-line:no-floating-promises
    import('../../utils/input-shims/input-shims').then(module => module.startInputShims(win.document, config));
  }
}

function needInputShims(win: Window) {
  return isPlatform(win, 'ios') && isPlatform(win, 'mobile');
}
