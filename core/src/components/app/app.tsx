import { Component, Element, Prop, QueueApi } from '@stencil/core';

import { Config } from '../../interface';
import { isDevice, isHybrid, isStandaloneMode, needInputShims } from '../../utils/platform';

@Component({
  tag: 'ion-app',
  styleUrl: 'app.scss'
})
export class App {

  private isDevice = false;

  @Element() el!: HTMLElement;

  @Prop({ context: 'window' }) win!: Window;
  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'queue' }) queue!: QueueApi;

  componentWillLoad() {
    this.isDevice = this.config.getBoolean('isDevice', isDevice(this.win));
  }

  componentDidLoad() {
    importTapClick(this.win);
    importInputShims(this.win, this.config);
    importStatusTap(this.win, this.isDevice, this.queue);
  }

  hostData() {
    const hybrid = isHybrid(this.win);
    const isStandalone = isStandaloneMode(this.win);
    const statusbarPadding = this.config.get('statusbarPadding', hybrid || isStandalone);

    return {
      class: {
        'is-device': this.isDevice,
        'is-hydrid': hybrid,
        'is-standalone': isStandalone,
        'statusbar-padding': statusbarPadding
      }
    };
  }
}

async function importStatusTap(win: Window, device: boolean, queue: QueueApi) {
  if (device) {
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
