import { Component, Host, h, Prop } from '@stencil/core';
import { Color } from '../../../../interface';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-cartao-resposta-item',
  styleUrl: 'med-cartao-resposta-item.scss',
  shadow: true,
})
export class MedCartaoRespostaItem {
  @Prop() color?: Color;

  render() {
    const { color } = this;
    return (
      <Host from-stencil class={createColorClasses(color, { })}>
        <div class="container">
          {/* <slot name="icon-left-top"></slot>
          <slot  name="icon-right-top"></slot> */}
          <button class="item-button">
            <slot></slot>
          </button>
          {/* <slot  name="icon-left-bottom"></slot>
          <slot  name="icon-right-bottom"></slot> */}
        </div>
      </Host>
    );
  }

}
