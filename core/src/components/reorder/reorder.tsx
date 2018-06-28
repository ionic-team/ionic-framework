import { Component } from '@stencil/core';
import { createThemedClasses } from '../../utils/theme';
import { Mode } from '../../interface';

@Component({
  tag: 'ion-reorder',
  styleUrls: {
    ios: 'reorder.ios.scss',
    md: 'reorder.md.scss',
  }
})
export class Reorder {

  mode!: Mode;

  hostData() {
    return {
      class: createThemedClasses(this.mode, undefined, 'reorder')
    };
  }
  render() {
    return (
      <slot>
        <ion-icon class="reorder-icon" name="reorder"/>
      </slot>
    );
  }

}
