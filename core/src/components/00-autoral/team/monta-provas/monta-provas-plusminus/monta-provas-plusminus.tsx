import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { createColorClasses } from '../../../../../utils/theme';
import { PlusMinusStatus } from './monta-provas-plusminus.enum';

@Component({
  tag: 'monta-provas-plusminus',
  styleUrl: 'monta-provas-plusminus.scss',
  shadow: true,
})
export class MontaProvasPlusminus {

  @Prop() dsSize?: 'xl';
  @Event() medChange!: EventEmitter<PlusMinusStatus>;

  private onClick = (status: PlusMinusStatus) => {
    this.medChange.emit(status);
  }

  render() {
    const { dsSize } = this;

    return (
      <Host
        from-stencil
        class={createColorClasses(null, {
          'monta-provas-plusminus': true,
          [`monta-provas-plusminus--${dsSize}`]: dsSize !== undefined,
        }, null)}
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
