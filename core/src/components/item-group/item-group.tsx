import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the appearance of components.
 */
@Component({
  tag: 'ion-item-group',
  styleUrls: {
    ios: 'item-group.ios.scss',
    md: 'item-group.md.scss',
    ionic: 'item-group.md.scss',
  },
})
export class ItemGroup implements ComponentInterface {
  render() {
    const theme = getIonTheme(this);
    return (
      <Host
        role="group"
        class={{
          [theme]: true,

          // Used internally for styling
          [`item-group-${theme}`]: true,

          item: true,
        }}
      ></Host>
    );
  }
}
