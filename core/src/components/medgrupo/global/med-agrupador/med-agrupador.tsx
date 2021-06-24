import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'med-agrupador',
  styleUrl: 'med-agrupador.scss',
  shadow: true,
})
export class MedAgrupador {

  render() {
    return (
      <Host class="">
          <div class="toggle__expandir">Expandir a lista</div>
          <div class="toggle__ocultar">Ocultar a lista</div>
          <ion-icon class="toggle__img" name="med-arrow-down"></ion-icon>
      </Host>
    );
  }

}
