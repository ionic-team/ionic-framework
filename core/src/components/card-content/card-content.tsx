import { Component, ComponentInterface, Prop } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-card-content',
  styleUrls: {
    ios: 'card-content.ios.scss',
    md: 'card-content.md.scss'
  }
})
export class CardContent implements ComponentInterface {

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  hostData() {
    return {
      class: {
        [`${this.mode}`]: true,

        // Used internally for styling
        [`card-content-${this.mode}`]: true
      }
    };
  }
}
