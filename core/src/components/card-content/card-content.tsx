import { Component, ComponentInterface, getMode } from '@stencil/core';

import { Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-card-content',
  styleUrls: {
    ios: 'card-content.ios.scss',
    md: 'card-content.md.scss'
  }
})
export class CardContent implements ComponentInterface {

  hostData() {
    return {
      class: createThemedClasses(getMode<Mode>(this), 'card-content')
    };
  }
}
