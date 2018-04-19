import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { Config } from '../../index';

import {
  DisplayWhen, PLATFORM_CONFIGS, PlatformConfig, detectPlatforms, updateTestResults,
} from '../../utils/show-hide-when-utils';

@Component({
  tag: 'ion-hide-when',
  styleUrl: './hide-when.scss'
})
export class HideWhen implements DisplayWhen {

  calculatedPlatforms: PlatformConfig[];

  @Element() element: HTMLElement;
  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'window' }) win: Window;

  @Prop() orientation: string;
  @Prop() mediaQuery: string;
  @Prop() size: string;
  @Prop() mode: string;
  @Prop() platform: string;
  @Prop() or = false;

  @State() passesTest = false;

  componentWillLoad() {
    this.calculatedPlatforms = detectPlatforms(this.win, PLATFORM_CONFIGS);
    this.onResize();
  }

  @Listen('window:resize')
  onResize() {
    updateTestResults(this);
  }

  hostData() {
    return {
      class: {
        'show-content': !this.passesTest,
        'hide-content': this.passesTest
      }
    };
  }
}
