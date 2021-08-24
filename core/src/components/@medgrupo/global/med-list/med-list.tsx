import { Component, Host, h, Prop } from '@stencil/core';
import { createColorClasses } from '../../../../utils/theme';
import { Color, Neutral } from '../../../../interface';

@Component({
  tag: 'med-list',
  styleUrl: 'med-list.scss',
  shadow: true,
})
export class MedList {

  @Prop() neutral?: Neutral;
  @Prop() color?: Color;
  @Prop() margin?: 'xs' | 'sm' | 'md' | 'lg';

  render() {
    const { color, neutral, margin } = this;
    return (
      <Host
      from-stencil
      class={createColorClasses(color, {
        'med-list': true,
        [`med-list--${margin}`]: margin !== undefined
      }, neutral)}
      >
        <slot></slot>
      </Host>
    );
  }

}
