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

  hostData() {
    const hybrid = isHybrid(this.win);
    const hoverCSS = this.config.getBoolean('hoverCSS', !hybrid);
    const statusBar = this.config.getBoolean('statusbarPadding', hybrid);

    return {
      class: {
        [this.mode]: true,
        'statusbar-padding': statusBar,
        'enable-hover': hoverCSS
      }
    };
  }

  render() {
    const device = this.config.getBoolean('isDevice', isDevice(this.win));
    const inputShims = this.config.getBoolean('inputShims', needInputShims(this.win));

    return [
      inputShims && <ion-input-shims></ion-input-shims>,
      <ion-tap-click></ion-tap-click>,
      device && <ion-status-tap></ion-status-tap>,
      <slot></slot>
    ];
  }
}
