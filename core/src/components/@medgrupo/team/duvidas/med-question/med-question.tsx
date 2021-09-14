import { Component, Host, h, Prop, Method } from '@stencil/core';
import { MedColor } from '../../../../../interface';
import { generateMedColor } from '../../../../../utils/med-theme';

@Component({
  tag: 'med-question',
  styleUrl: 'med-question.scss',
  shadow: true,
})
export class MedQuestion {

  /**
    * Define a cor do componente.
    */
   @Prop({ reflect: true }) dsColor?: MedColor;

  /**
    * Define o estado do componente.
    */
  @Prop({ reflect: true, mutable: true }) collapsed = false;

  /**
    * Define o conteúdo de texto do componente.
    */
  @Prop() texto?: string;

  /**
   * TODO
   */
  @Method()
  async toggle(event?: Event) {
    event?.stopPropagation();
    this.collapsed = !this.collapsed;
  }

  render() {
    const { collapsed, texto, dsColor } = this;

    return (
      <Host from-stencil
        class={generateMedColor(dsColor, {
          'med-question': true,
          'med-question--collapsed': collapsed
        },)}
        onClick={(event: any) => {this.toggle(event)}}>
          <div class="med-question__text" innerHTML={texto}></div>
          <ion-icon class="med-icon med-question__icon" name="med-baixo"></ion-icon>
      </Host>
    );
  }

}
