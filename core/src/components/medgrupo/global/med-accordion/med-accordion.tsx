import { Component, Host, h, Prop } from '@stencil/core';
import { Color } from '../../../../interface';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-accordion',
  styleUrl: 'med-accordion.scss',
  shadow: true,
})
export class MedAccordion {

  @Prop() color?: Color;
  @Prop() dsSize?: 'full';

  render() {
    const {color, dsSize} = this;
    return (
      <Host class={createColorClasses(color, {
        null:true,
        'med-accordion--full': dsSize !== undefined,
        })}>
        <slot name="image"></slot>
        <div class="content">
          <slot name="title"></slot>
          <slot name="content"></slot>
        </div>
        <ion-icon name="med-arrow-up"></ion-icon>
      </Host>
    );
  }

}
