import { Component } from '@stencil/core';
import { Color, Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';


@Component({
  tag: 'ion-item-group',
  styleUrls: {
    ios: 'item-group.ios.scss',
    md: 'item-group.md.scss'
  }
})
export class ItemGroup {

  mode!: Mode;
  color?: Color;

  hostData() {
    return {
      class: createThemedClasses(this.mode, this.color, 'item-group')
    };
  }
}
