import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'med-autocomplete',
  styleUrl: 'med-autocomplete.scss',
  shadow: true,
})
export class MedAutocomplete {
  @Prop() list = false;

  render() {
    return (
      <Host from-stencil>
        <ul class="list">
          <li class="item">
            <ion-icon class="med-icon" name="med-alerta">ion-button</ion-icon>
            Nefrologia
          </li>
          <li class="item">
            <ion-icon class="med-icon" name="med-alerta">ion-button</ion-icon>
            Neurocirurgia
          </li>
          <li class="item">
            <ion-icon class="med-icon" name="med-alerta">ion-button</ion-icon>
            Neurologia
          </li>
          <li class="item">
            <ion-icon class="med-icon" name="med-alerta">ion-button</ion-icon>
            Nutrologia
          </li>
        </ul>

        {this.list && <span class="msg">Nenhum item encontrado.</span>}
      </Host>
    );
  }

}
