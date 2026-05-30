import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-item-group',
  styleUrls: {
    ios: 'item-group.ios.scss',
    md: 'item-group.md.scss',
  },
})
export class ItemGroup implements ComponentInterface {
  render() {
    const mode = getIonMode(this);
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
