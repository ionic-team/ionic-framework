import { Component, Element, Listen, Prop } from '@stencil/core';
import { Config, PlatformConfig } from '../../index';

import {
  DisplayWhen,
  updateTestResults,
} from '../../utils/show-hide-when-utils';

@Component({
  tag: 'ion-query',
  styleUrl: './query.scss'
})
export class Query implements DisplayWhen {

  or = false;
  @Element() element: HTMLElement;
  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'platforms' }) calculatedPlatforms: PlatformConfig[];

  @Prop() orientation: string;
  @Prop() platform: string;
  @Prop() mode: string;
  @Prop() size: string;
  @Prop() mediaQuery: string;

  @Prop({ mutable: true }) queryMatches = false;

  @Listen('window:resize')
  componentWillLoad() {
    return updateTestResults(this);
  }

  hostData() {
    return {
      class: {
        'show-content': this.queryMatches,
        'hide-content': !this.queryMatches
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}



