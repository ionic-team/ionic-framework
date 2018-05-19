import { Component } from '@stencil/core';

@Component({
  tag: 'ion-title',
  styleUrl: 'title.scss'
})
export class ToolbarTitle {
  render() {
    return [
      <div class="toolbar-title">
        <slot></slot>
      </div>
    ];
  }
}
