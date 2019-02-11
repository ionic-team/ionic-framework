import { Component, ComponentInterface, Prop } from '@stencil/core';

import { Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';

@Component({
  tag: 'ion-card-content',
  styleUrls: {
    ios: 'card-content.ios.scss',
    md: 'card-content.md.scss'
  }
})
export class CardContent implements ComponentInterface {

  /**
   * Indicates the direction of the component.
   * Defaults to the value of the `dir` attribute on the html element.
   */
  @Prop({ reflectToAttr: true }) dir: string = document.dir;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  hostData() {
    return {
      class: createThemedClasses(this.mode, 'card-content')
    };
  }
}
