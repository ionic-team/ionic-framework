import { Component } from '@stencil/core';
import { Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';


@Component({
  tag: 'ion-thumbnail',
  styleUrls: {
    ios: 'thumbnail.ios.scss',
    md: 'thumbnail.md.scss'
  }
})
export class Thumbnail {
  mode!: Mode;

  hostData() {
    return {
      class: createThemedClasses(this.mode, undefined, 'thumbnail')
    };
  }
}
