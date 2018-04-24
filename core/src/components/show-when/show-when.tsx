import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { Config, Mode } from '../../interface';

import {
  DisplayWhen, PLATFORM_CONFIGS, PlatformConfig, detectPlatforms, updateTestResults,
} from '../../utils/show-hide-when-utils';

@Component({
  tag: 'ion-show-when',
  styleUrl: './show-when.scss'
})
export class ShowWhen implements DisplayWhen {

  mode!: Mode;

  @Element() element?: HTMLElement;

  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'platforms' }) calculatedPlatforms!: PlatformConfig[];
  @Prop({ context: 'window' }) win!: Window;

  @Prop() orientation?: string;
  @Prop() mediaQuery?: string;
  @Prop() size?: string;
  @Prop() platform?: string;
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
        'show-content': this.passesTest,
        'hide-content': !this.passesTest
      }
    };
  }

}



