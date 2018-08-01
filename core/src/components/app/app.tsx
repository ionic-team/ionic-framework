import { Component, Element, Prop, QueueApi } from '@stencil/core';

import { Config, Mode } from '../../interface';
import { isDevice, isHybrid, needInputShims } from '../../utils/platform';
import { createThemedClasses } from '../../utils/theme';

@Component({
  tag: 'ion-app',
  styleUrls: {
    ios: 'app.ios.scss',
    md: 'app.md.scss'
  }
})
export class App {

  private isDevice = false;

  mode!: Mode;

  @Element() el!: HTMLElement;

  @Prop({ context: 'window' }) win!: Window;
  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'queue' }) queue!: QueueApi;

  componentWillLoad() {
    this.isDevice = this.config.getBoolean('isDevice', isDevice(this.win));
  }

  componentDidLoad() {
    importTapClick(this.win, this.isDevice);
    importInputShims(this.win, this.config);
    importStatusTap(this.win, this.isDevice, this.queue);
  }

  hostData() {
    const hybrid = isHybrid(this.win);
    const statusbarPadding = this.config.get('statusbarPadding', hybrid);

    return {
      class: {
        ...createThemedClasses(this.mode, 'app'),

        'is-device': this.isDevice,
        'is-hydrid': hybrid,
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

async function importTapClick(win: Window, device: boolean) {
  if (device) {
    (await import('../../utils/tap-click')).startTapClick(win.document);
  }
}

async function importInputShims(win: Window, config: Config) {
  const inputShims = config.getBoolean('inputShims', needInputShims(win));
  if (inputShims) {
    (await import('../../utils/input-shims/input-shims')).startInputShims(win.document, config);
  }
}
