import { Component, Host, h, Prop } from '@stencil/core';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-rate-result',
  styleUrl: 'med-rate-result.scss',
  shadow: true,
})
export class MedRateResult {

  /**
    * Define o valor do item excelente.
    */
  @Prop() excelente?: string;

  /**
    * Define o valor do item bom.
    */
  @Prop() bom?: string;

  /**
    * Define o valor do item regular.
    */
  @Prop() regular?: string;

  /**
    * Define o valor do item ruim.
    */
  @Prop() ruim?: string;

  render() {

    const { excelente, bom, regular, ruim } = this;

    return (
      <Host from-stencil
        class={createColorClasses(null, {
          'med-rate-result': true,
        }, null)}>
        <div class="med-rate-result__wrapper med-rate-result__wrapper--excelente">
          <ion-icon class="med-icon" name="med-excelente"></ion-icon>
          <span>{excelente}</span>
        </div>
        <div class="med-rate-result__wrapper med-rate-result__wrapper--bom">
          <ion-icon class="med-icon" name="med-bom"></ion-icon>
          <span>{bom}</span>
        </div>
        <div class="med-rate-result__wrapper med-rate-result__wrapper--regular">
          <ion-icon class="med-icon" name="med-regular"></ion-icon>
          <span>{regular}</span>
        </div>
        <div class="med-rate-result__wrapper med-rate-result__wrapper--ruim">
          <ion-icon class="med-icon" name="med-ruim"></ion-icon>
          <span>{ruim}</span>
        </div>
      </Host>
    );
  }

}
