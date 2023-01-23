import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

import { getIonStylesheet } from '../../global/ionic-global';

@Component({
  tag: 'ion-item-group',
  styleUrls: {
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
