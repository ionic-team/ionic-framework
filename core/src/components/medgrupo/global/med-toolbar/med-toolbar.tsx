import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'med-toolbar',
  styleUrl: 'med-toolbar.scss',
  shadow: true,
})
export class MedToolbar {

  render() {
    return (
      <Host from-stencil>
        <div class="container">
          <slot name="start"></slot>
          <div class="container__center">
            <slot></slot>
          </div>
          <slot name="end"></slot>
        </div>
      </Host>
    );
  }

}
