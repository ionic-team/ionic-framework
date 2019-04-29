import { Component, ComponentInterface, getMode } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-buttons',
  styleUrls: {
    ios: 'buttons.ios.scss',
    md: 'buttons.md.scss'
  },
  scoped: true,
})
export class Buttons implements ComponentInterface {

  hostData() {
    const mode = getMode<Mode>(this);
    return {
      class: {
        [`${mode}`]: true
      }
    };
  }
}
