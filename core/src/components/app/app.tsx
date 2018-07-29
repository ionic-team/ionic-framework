import { Component, Element, Prop, QueueApi } from '@stencil/core';
import { Config } from '../../interface';
import { isDevice, isHybrid, needInputShims } from '../../utils/platform';

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
    importInputShims(this.win, this.config);
    importStatusTap(this.win, this.config, this.queue);
  }

  hostData() {
    const device = this.config.getBoolean('isDevice', isDevice(this.win));
    const hybrid = isHybrid(this.win);
    const statusBar = this.config.getBoolean('statusbarPadding', hybrid);

    return {
      class: {
        'is-device': device,
        'is-hydrid': hybrid,
        'statusbar-padding': statusBar
      }
    };
  }

  render() {
    return [
      <ion-tap-click></ion-tap-click>,
      <slot></slot>
    ];
  }
}

async function importStatusTap(win: Window, config: Config, queue: QueueApi) {
  const device = config.getBoolean('isDevice', isDevice(win));
  if (device) {
    (await import('../../utils/status-tap')).startStatusTap(win, queue);
  }
}

async function importInputShims(win: Window, config: Config) {
  const inputShims = config.getBoolean('inputShims', needInputShims(win));
  if (inputShims) {
    (await import('../../utils/input-shims/input-shims')).startInputShims(win.document, config);
  }
}
