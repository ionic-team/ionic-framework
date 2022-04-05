import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-card-content',
  styleUrls: {
    ios: 'card-content.ios.scss',
    md: 'card-content.md.scss',
  },
})
export class CardContent implements ComponentInterface {
  render() {
    const mode = getIonMode(this);
    return (
      <Host
        class={{
          [mode]: true,

          // Used internally for styling
          [`card-content-${mode}`]: true,
        }}
      ></Host>
    );
  }
}
