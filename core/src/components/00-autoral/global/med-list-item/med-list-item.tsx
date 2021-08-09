import { Component, Host, h, Prop } from '@stencil/core';
import { createColorClasses } from '../../../../utils/theme';
import { Color, Neutral } from '../../../../interface';

@Component({
  tag: 'med-list-item',
  styleUrl: 'med-list-item.scss',
  shadow: true,
})
export class MedListItem {

  @Prop() titulo?: string;
  @Prop() label?: string;
  @Prop() neutral?: Neutral;
  @Prop() color?: Color;
  @Prop({ reflect:true }) selected = false;
  @Prop() dsSize?: 'xs' | 'sm' | 'md';
  @Prop({ reflect:true }) border = false;

  render() {
    const { color, neutral, titulo, label, selected, dsSize, border } = this;
    return (
      <Host
      from-stencil
      class={createColorClasses(color, {
        'med-list-item': true,
        'med-list-item--selected': selected,
        'med-list-item--border-radius': border,
        [`med-list-item--${dsSize}`]: dsSize !== undefined,
      }, neutral)}
      >
        <slot name="start"></slot>
        <div class="med-list-item__content">
          <h3 class="med-list-item__title">{titulo}</h3>
          <h4 class="med-list-item__label">{label}</h4>
        </div>
        <slot name="end"></slot>
      </Host>
    );
  }

}
