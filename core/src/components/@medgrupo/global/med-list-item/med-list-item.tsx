import { Component, Host, h, Prop } from '@stencil/core';
import { MedColor } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';

@Component({
  tag: 'med-list-item',
  styleUrl: 'med-list-item.scss',
  shadow: true,
})
export class MedListItem {

  /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: MedColor;

  /**
   * TODO
   */
  @Prop() titulo?: string;

  /**
   * TODO
   */
  @Prop() label?: string;

  /**
   * TODO
   */
  @Prop({ reflect:true }) selected = false;

  /**
   * TODO
   */
  @Prop() dsSize?: 'xs' | 'sm' | 'md';

  /**
   * TODO
   */
  @Prop({ reflect:true }) border = false;

  render() {
    const { dsColor, titulo, label, selected, dsSize, border } = this;
    return (
      <Host
        from-stencil
        class={generateMedColor(dsColor, {
          'med-list-item': true,
          'med-list-item--selected': selected,
          'med-list-item--border-radius': border,
          [`med-list-item--${dsSize}`]: dsSize !== undefined,
        })}>
        <slot name="start"></slot>
        <div class="med-list-item__content">
          <h3 class="med-list-item__title" innerHTML={titulo}></h3>
          <h4 class="med-list-item__label" innerHTML={label}></h4>
        </div>
        <slot name="end"></slot>
      </Host>
    );
  }

}
