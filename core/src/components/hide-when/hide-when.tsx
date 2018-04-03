import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { Config, PlatformConfig } from '../../index';

import {
  DisplayWhen,
  updateTestResults,
} from '../../utils/show-hide-when-utils';

@Component({
  tag: 'ion-hide-when',
  styleUrl: './hide-when.scss'
})
export class HideWhen implements DisplayWhen {

  @Element() element: HTMLElement;
  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'platforms' }) calculatedPlatforms: PlatformConfig[];

  @Prop() orientation: string|undefined;
  @Prop() mediaQuery: string|undefined;
  @Prop() size: string|undefined;
  @Prop() mode: string|undefined;
  @Prop() platform: string|undefined;
  @Prop() or = false;

  @State() passesTest = false;

  @Listen('window:resize')
  componentWillLoad() {
    return updateTestResults(this);
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
