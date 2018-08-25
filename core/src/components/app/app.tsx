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

async function importStatusTap(win: Window, queue: QueueApi) {
  if (isPlatform(win, 'hybrid')) {
    (await import('../../utils/status-tap')).startStatusTap(win, queue);
  }
}

async function importTapClick(win: Window) {
  (await import('../../utils/tap-click')).startTapClick(win.document);
}

async function importInputShims(win: Window, config: Config) {
  const inputShims = config.getBoolean('inputShims', needInputShims(win));
  if (inputShims) {
    (await import('../../utils/input-shims/input-shims')).startInputShims(win.document, config);
  }
}

function needInputShims(win: Window) {
  return isPlatform(win, 'ios') && isPlatform(win, 'mobile');
}
