import { Component, ComponentInterface } from '@stencil/core';

import { Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';

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
        ...createThemedClasses(this.mode, 'item-group'),
        'item': true,
      }
    };
  }
}
