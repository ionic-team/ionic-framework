import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'ion-buttons',
  styleUrls: {
    ios: 'buttons.ios.scss',
    md: 'buttons.md.scss'
  }
})
export class Buttons {

  @Prop() side: 'start' | 'end' | 'primary' | 'secundary' = 'start';

  hostData() {
    return {
      'slot': 'buttons',
      class: {
        [`buttons-${this.side}`]: true
      }
    };
  }
}
