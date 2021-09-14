import { Component, Host, h, Prop, Method, Listen } from '@stencil/core';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-context-menu',
  styleUrl: 'med-context-menu.scss',
  shadow: true,
})
export class MedContextMenu {
  /**
   * Define o estado do componente.
   */
  @Prop({ reflect: true, mutable: true }) collapsed = true;

  /**
   * TODO
   */
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
    return (
      <Host
        from-stencil
        class={createColorClasses(null, {
          'med-context-menu': true,
          'med-context-menu--collapsed': this.collapsed
        }, null)}
      >
        <ion-button onClick={(event) => {this.toggle(event)}} class="med-context-menu__button" ds-name="tertiary" ds-size="xs">
          <ion-icon slot="icon-only" class="med-icon med-context-menu__icon" name="med-context-menu"></ion-icon>
        </ion-button>

        <div class="med-context-menu__content">
          <ion-button onClick={(event) => {this.toggle(event)}} class="med-context-menu__inner-button" ds-name="tertiary" ds-size="xs">
            <ion-icon slot="icon-only" class="med-icon med-context-menu__inner-icon" name="med-context-menu"></ion-icon>
          </ion-button>

          <slot></slot>
        </div>
      </Host>
    );
  }

}
