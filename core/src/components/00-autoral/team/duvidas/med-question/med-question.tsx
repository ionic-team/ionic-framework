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

    @Method()
    async toggle(event?: Event) {
      event?.stopPropagation();
      this.collapsed = !this.collapsed;
    }

   render() {
     const { color, neutral, collapsed } = this;

     return (
       <Host from-stencil
         class={createColorClasses(color, {
           'med-question': true,
           'med-question--collapsed': collapsed
         }, neutral)}
         onClick={(event: any) => {this.toggle(event)}}>
         <div class="med-question__text">Lorem ipsum dolor sit amet, consectetur
         adipiscing elit. Morbi urna neque, elementum sed porta sit amet, auctor
         tincidunt ligula. Sed id congue odio. Nullam elit libero, tristique et
         augue in, sollicitudin tempus mauris. Sed vehicula ut metus non ornare.
         Curabitur convallis turpis arcu, id volutpat est viverra id. Vestibulum
         ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia
         curae; Mauris et placerat dui. Aenean dolor fermentum ut porta et,
         volutpat a nibh. Sed posuere aliquet ultrices. Donec et mauris finibus,
         consequat metus a, interdum neque. Suspendisse egestas tincidunt mauris,
         non vehicula ipsum dictum sit amet. Etiam id augue ex. Nullam tincidunt
         erat non justo auctor accumsan. Sed neque purus, imperdiet id turpis
         id, dictum interdum nisi.</div>
         <ion-icon class="med-icon med-question__icon" name="med-baixo"></ion-icon>
       </Host>
     );
   }

}
