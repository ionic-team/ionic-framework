import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'med-cartao-resposta-lista',
  styleUrl: 'med-cartao-resposta-lista.scss',
  shadow: true,
})
export class MedCartaoRespostaLista {

  render() {
    return (
      <Host from-stencil>
        <div class="wrapper">
          <slot></slot>
        </div>
      </Host>
    );
  }

}
