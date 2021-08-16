import { Component, Host, h, Prop, Method, Listen } from '@stencil/core';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-tooltip',
  styleUrl: 'med-tooltip.scss',
  shadow: true,
})
export class MedTooltip {
  /**
   * Define a variação do componente.
   */
  @Prop() dsName?: 'definition';

  @Prop({ reflect: true }) placement?: 'top' | 'bottom' | 'left' | 'right';

  @Prop({ reflect: true }) position?: 'start' | 'center' | 'end';

  @Prop({ reflect: true }) titulo?: string;
  @Prop({ reflect: true }) content?: string;

  /**
   * Define o estado do componente.
   */
   @Prop({ reflect: true, mutable: true }) collapsed = true;

  @Method()
  async toggle(event?: Event) {
    event?.stopPropagation();
    this.collapsed = !this.collapsed;
  }

  @Listen('click', { target: 'window' })
  handleClick(event?: Event) {
    if (!this.collapsed) {
      this.toggle(event);
    }
  }

  render() {
    const { dsName, placement, position, collapsed, titulo, content } = this;

    return (
      <Host
        from-stencil
        class={createColorClasses(null, {
          'med-tooltip': true,
          [`med-tooltip--${dsName}`]: dsName !== undefined,
          [`med-tooltip--${placement}`]: placement !== undefined,
          [`med-tooltip--${position}`]: position !== undefined,
          'med-tooltip--collapsed': collapsed
        }, null)}
      >
        <div class="med-tooltip__icon-container">
          <ion-button onClick={(event) => {this.toggle(event)}} class="med-tooltip__button" ds-name="icon-only">
            <slot name="icon"></slot>
          </ion-button>
        </div>

        <div class="med-tooltip__content">
          {titulo && <h3 class="med-tooltip__titulo">{titulo}</h3>}
          {content && <p class="med-tooltip__text">{content}</p>}
          <slot name="content"></slot>
        </div>
      </Host>
    );
  }

}
