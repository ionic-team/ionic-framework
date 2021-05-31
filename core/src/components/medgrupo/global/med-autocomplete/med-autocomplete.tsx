import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'med-autocomplete',
  styleUrl: 'med-autocomplete.scss',
  shadow: true,
})
export class MedAutocomplete {
@Prop() disable = false;
  render() {
    return (
      <Host>
        <ul class="list">
          <li class="item">
            <ion-icon name="med-medical-bag">ion-button</ion-icon>
            Nefrologia
          </li>
          <li class="item">
            <ion-icon name="med-medical-bag">ion-button</ion-icon>
            Neurocirurgia
          </li>
          <li class="item">
            <ion-icon name="med-medical-bag">ion-button</ion-icon>
            Neurologia
          </li>
          <li class="item">
            <ion-icon name="med-medical-bag">ion-button</ion-icon>
            Nutrologia
          </li>
        </ul>

        {this.disable && <span class="msg">Nenhum item encontrado.</span>}
      </Host>
    );
  }

}
