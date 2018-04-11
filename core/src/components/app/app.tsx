import { Component, Element, Prop } from '@stencil/core';
import { Config } from '../../index';

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
  mode: string;

  private isDevice = false;
  private deviceHacks = false;

  @Element() el: HTMLElement;

  @Prop({ context: 'config' }) config: Config;

  componentWillLoad() {
    this.isDevice = this.config.getBoolean('isDevice', false);
    this.deviceHacks = this.config.getBoolean('deviceHacks', false);
  }

  hostData() {
    const hoverCSS = this.config.getBoolean('hoverCSS', false);

    return {
      class: {
        [this.mode]: true,
        'enable-hover': hoverCSS
      }
    };
  }

  render() {
    return [
      this.deviceHacks && <ion-input-shims></ion-input-shims>,
      <ion-tap-click></ion-tap-click>,
      this.isDevice && <ion-status-tap></ion-status-tap>,
      <slot></slot>
    ];
  }
}
