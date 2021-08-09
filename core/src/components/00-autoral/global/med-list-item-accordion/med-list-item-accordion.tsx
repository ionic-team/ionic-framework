import { Component, Host, h, Prop, Method } from '@stencil/core';
import { createColorClasses } from '../../../../utils/theme';
import { Color, Neutral } from '../../../../interface';

@Component({
  tag: 'med-list-item-accordion',
  styleUrl: 'med-list-item-accordion.scss',
  shadow: true,
})
export class MedListItemAccordion {

  @Prop() titulo?: string;
  @Prop() label?: string;
  @Prop() neutral?: Neutral;
  @Prop() color?: Color;
  @Prop({ reflect: true }) selected = false;
  @Prop() dsSize?: 'xs' | 'sm' | 'md';
  @Prop() margin?: 'xs' | 'sm' | 'md' | 'lg';
  @Prop({ reflect: true }) border = false;
  @Prop({ reflect: true, mutable: true }) collapsed = true;

  @Method()
  async toggle(event?: Event) {
    event?.stopPropagation();
    this.collapsed = !this.collapsed;
  }

  render() {
    const { color, neutral, titulo, label, selected, dsSize, border, margin, collapsed } = this;

    return (
      <Host
        from-stencil
        class={createColorClasses(color, {
          'med-list-item-accordion': true,
          'med-list-item-accordion--selected': selected,
          'med-list-item-accordion--border-radius': border,
          [`med-list-item-accordion--${dsSize}`]: dsSize !== undefined,
          [`med-list-item-accordion--${margin}`]: margin !== undefined,
          'med-list-item-accordion--collapsed': collapsed
        }, neutral)}>
        <div class="med-list-item-accordion__item">
          <slot name="start"></slot>

          <div class="med-list-item-accordion__content">
            <h3 class="med-list-item-accordion__title">{titulo}</h3>
            <h4 class="med-list-item-accordion__label">{label}</h4>
          </div>

          <ion-button ds-name="icon-only" slot="left" onClick={(event: any) => {this.toggle(event)}}>
            <ion-icon class="med-icon" name="med-baixo"></ion-icon>
          </ion-button>
        </div>

        <div class="med-list-item-accordion__sub-item">
          <slot name="end"></slot>
        </div>
      </Host>
    );
  }
}
