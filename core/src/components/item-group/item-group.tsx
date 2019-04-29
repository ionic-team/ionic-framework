import { Component, ComponentInterface, getMode } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-item-group',
  styleUrls: {
    ios: 'item-group.ios.scss',
    md: 'item-group.md.scss'
  }
})
export class ItemGroup implements ComponentInterface {

  hostData() {
    const mode = getMode<Mode>(this);
    return {
      'role': 'group',
      class: {
        [`${mode}`]: true,

        // Used internally for styling
        [`item-group-${mode}`]: true,

        'item': true
      }
    };
  }
}
