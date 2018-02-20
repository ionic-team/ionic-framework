import { Component, Element, Prop } from '@stencil/core';
import { Config, PlatformConfig } from '../../index';

import {
  DisplayWhen,
  componentWillLoadImpl,
} from '../../utils/show-hide-when-utils';

@Component({
  tag: 'ion-hide-when',
  styleUrl: './hide-when.scss'
})
export class HideWhen implements DisplayWhen {

  @Element() element: HTMLElement;
  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'platforms' }) calculatedPlatforms: PlatformConfig[];

  @Prop() mediaQuery: string = null;
  @Prop() size: string = null;
  @Prop() mode: string = null;
  @Prop() platform: string = null;
  @Prop() or = false;

  passesTest = false;

  componentWillLoad() {
    return componentWillLoadImpl(this);
  }

  hostData() {
    return {
      class: {
        'show-content': !this.passesTest,
        'hide-content': this.passesTest
      }
    };
  }

  render() {
    return <slot></slot>
  }
}



