import { Component, Host, h, Prop } from '@stencil/core';
import { Color, Neutral } from '../../../../interface';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-toolbar',
  styleUrl: 'med-toolbar.scss',
  shadow: true,
})
export class MedToolbar {
  @Prop() color?: Color;
  @Prop() neutral?: Neutral;

  render() {
    return (
      <Host from-stencil class={createColorClasses(this.color, {
        'med-toolbar': true
      }, this.neutral)}>
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
