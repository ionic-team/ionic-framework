import { Component } from '@stencil/core';
import { Mode } from '../../interface';

@Component({
  tag: 'ion-reorder',
  styleUrls: {
    ios: 'reorder.ios.scss',
    md: 'reorder.md.scss',
  },
  shadow: true
})
export class Reorder {

  mode!: Mode;

  render() {
    return (
      <slot>
        <ion-icon class="reorder-icon" name="reorder"/>
      </slot>
    );
  }

}
