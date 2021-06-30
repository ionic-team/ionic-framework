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

  render() {
    const {color} = this;
    return (
      <Host class={createColorClasses(color, {null:true})}>
        <slot name="avatar"></slot>
        <div class="content">
          <slot name="title"></slot>
          <slot name="paragraph"></slot>
        </div>
        <slot name="arrow"></slot>
      </Host>
    );
  }

}
