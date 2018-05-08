import { Component, Element, Prop } from '@stencil/core';
import { Config, Mode } from '../../interface';
import { isDevice, isHybrid, needInputShims } from '../../utils/platform';

@Component({
  tag: 'ion-app',
  styleUrls: {
    ios: 'app.ios.scss',
    md: 'app.md.scss'
  },
  host: {
    theme: 'app'
  }
})
export class App {

  mode!: Mode;

  @Element() el!: HTMLElement;

  @Prop({ context: 'window' }) win!: Window;
  @Prop({ context: 'config' }) config!: Config;

  componentDidLoad() {
    loadInputShims(this.win, this.config);
  }

  hostData() {
    const hybrid = isHybrid(this.win);
    const statusBar = this.config.getBoolean('statusbarPadding', hybrid);

    return {
      class: {
        [this.mode]: true,
        'statusbar-padding': statusBar
      }
    };
  }

  render() {
    const device = this.config.getBoolean('isDevice', isDevice(this.win));
    return [
      <ion-tap-click></ion-tap-click>,
      device && <ion-status-tap></ion-status-tap>,
      <slot></slot>
    ];
  }
}

async function loadInputShims(win: Window, config: Config) {
  const inputShims = config.getBoolean('inputShims', needInputShims(win));
  if (inputShims) {
    (await import('../../utils/input-shims/input-shims')).startInputShims(win.document, config);
  }
}
