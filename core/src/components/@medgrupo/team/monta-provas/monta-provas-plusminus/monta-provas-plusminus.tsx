import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { PlusMinusStatus } from './monta-provas-plusminus.enum';
import { MedColor } from '../../../../../interface';
import { generateMedColor } from '../../../../../utils/med-theme';

@Component({
  tag: 'monta-provas-plusminus',
  styleUrl: 'monta-provas-plusminus.scss',
  shadow: true,
})
export class MontaProvasPlusminus {

  /**
  * Define a cor do componente.
  */
  @Prop({ reflect: true }) dsColor?: MedColor;

  /**
   * TODO
   */
  @Prop() dsSize?: 'xl';

  /**
   * TODO
   */
  @Event() medChange!: EventEmitter<PlusMinusStatus>;

  private onClick = (status: PlusMinusStatus) => {
    this.medChange.emit(status);
  }

  render() {
    const { dsSize, dsColor } = this;

    return (
      <Host
        from-stencil
        class={generateMedColor(dsColor, {
          'monta-provas-plusminus': true,
          [`monta-provas-plusminus--${dsSize}`]: dsSize !== undefined,
        },)}
      >
        <ion-icon
          class="med-icon med-icon--lg monta-provas-plusminus__icon-minus"
          name="med-menos-circulo"
          onClick={() => this.onClick(PlusMinusStatus.MINUS)}
        ></ion-icon>
        <slot></slot>
        <ion-icon
          class="med-icon med-icon--lg monta-provas-plusminus__icon-plus"
          name="med-mais-circulo"
          onClick={() => this.onClick(PlusMinusStatus.PLUS)}
        ></ion-icon>
      </Host>
    );
  }

}
