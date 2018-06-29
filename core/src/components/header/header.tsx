import { Component } from '@stencil/core';
import { Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';

@Component({
  tag: 'ion-header',
  styleUrls: {
    ios: 'header.ios.scss',
    md: 'header.md.scss'
  }
})
export class Header {
  mode!: Mode;

  hostData() {
    return {
      class: createThemedClasses(this.mode, 'header')
    };
  }
}
