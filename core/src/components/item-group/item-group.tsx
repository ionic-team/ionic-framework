import { Component, ComponentInterface } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-item-group',
  styleUrls: {
    ios: 'item-group.ios.scss',
    md: 'item-group.md.scss'
  }
})
export class ItemGroup implements ComponentInterface {

  mode!: Mode;

  hostData() {
    return {
      'role': 'group',
      class: {
        [`${this.mode}`]: true,

        // Used internally for styling
        [`item-group-${this.mode}`]: true,

        'item': true
      }
    };
  }
}
