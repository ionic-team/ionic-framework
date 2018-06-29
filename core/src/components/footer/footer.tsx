import { Component } from '@stencil/core';
import { Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';

@Component({
  tag: 'ion-footer',
  styleUrls: {
    ios: 'footer.ios.scss',
    md: 'footer.md.scss'
  }
})
export class Footer {
  mode!: Mode;

  hostData() {
    return {
      class: createThemedClasses(this.mode, 'footer')
    };
  }
}
