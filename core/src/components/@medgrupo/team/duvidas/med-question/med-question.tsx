import { Component, Host, h, Prop, Method } from '@stencil/core';
import { Color, Neutral } from '../../../../../interface';
import { createColorClasses } from '../../../../../utils/theme';

@Component({
  tag: 'med-question',
  styleUrl: 'med-question.scss',
  shadow: true,
})
export class MedQuestion {

  /**
    * Define a cor do componente.
    */
  @Prop() color?: Color;

  /**
    * Define a cor neutra do componente.
    */
  @Prop() neutral?: Neutral;

  /**
    * Define o estado do componente.
    */
  @Prop({ reflect: true, mutable: true }) collapsed = false;

  /**
    * Define o conteúdo de texto do componente.
    */
  @Prop() texto?: string;

  @Method()
  async toggle(event?: Event) {
    event?.stopPropagation();
    this.collapsed = !this.collapsed;
  }

  render() {
    const { color, neutral, collapsed, texto } = this;

    return (
      <Host from-stencil
        class={createColorClasses(color, {
          'med-question': true,
          'med-question--collapsed': collapsed
        }, neutral)}
        onClick={(event: any) => {this.toggle(event)}}>
          <div class="med-question__text" innerHTML={texto}></div>
          <ion-icon class="med-icon med-question__icon" name="med-baixo"></ion-icon>
      </Host>
    );
  }

}
