import { Component, Host, h, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'med-offline',
  styleUrl: 'med-offline.scss',
  shadow: true,
})
export class MedOffline {

  @Event() medClick!: EventEmitter<void>;

  private onClick() {
    this.medClick.emit();
  }

  render() {
    return (
      <Host from-stencil>
        <div class="wrapper">
          <med-header>
            <med-navbar ds-name="transparent" slot="navbar">
              <ion-button slot="left" ds-name="icon-only" onClick={() => this.onClick()}>
                <ion-icon class="med-icon" slot="icon-only" name="med-esquerda"></ion-icon>
              </ion-button>
            </med-navbar>
          </med-header>
          <div class="wrapper__content">
            <ion-icon class="med-icon med-icon--lg" name="med-offline2" ></ion-icon>
            <p class="title">Você está offline</p>
            <p class="text">Conecte-se à internet para visualizar esse conteúdo</p>
          </div>
        </div>
      </Host>
    );
  }

}
