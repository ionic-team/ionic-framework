import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-card-content',
  styleUrls: {
    ios: 'card-content.ios.scss',
    md: 'card-content.md.scss',
    ionic: 'card-content.md.scss',
  },
})
export class CardContent implements ComponentInterface {
  render() {
    const theme = getIonTheme(this);
    return (
      <Host
        class={{
          [theme]: true,

          // Used internally for styling
          [`card-content-${theme}`]: true,
        }}
      ></Host>
    );
  }
}
