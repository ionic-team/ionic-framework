import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

import { getIonStylesheet } from '../../global/ionic-global';

/**
 * @virtualProp {true | false} useBase - useBase determines if base components is enabled.
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-item-group',
  styleUrls: {
    base: 'item-group.scss',
    ios: 'item-group.ios.scss',
    md: 'item-group.md.scss',
  },
})
export class ItemGroup implements ComponentInterface {
  render() {
    const mode = getIonStylesheet(this);
    return (
      <Host
        role="group"
        class={{
          [mode]: true,

          // Used internally for styling
          [`item-group-${mode}`]: true,

          item: true,
        }}
      ></Host>
    );
  }
}
