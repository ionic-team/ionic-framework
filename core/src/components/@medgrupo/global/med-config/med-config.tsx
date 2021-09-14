import { Component, Host, h, Prop } from '@stencil/core';
import { modalController } from '../../../../utils/overlays';
import { MedConfigInterface } from './med-config-interface';

@Component({
  tag: 'med-config',
  styleUrl: 'med-config.scss',
  scoped: true
})

export class MedConfig {

  /**
   * TODO
   */
  @Prop() emitter!: {
    scheme: ( value: string ) => void;
    theme: ( value: string ) => void;
  };

  /**
   * TODO
   */
  @Prop() opcoes!:MedConfigInterface

  dismiss() {
    modalController.dismiss();
  }

  emitTheme(theme:string){
    this.emitter.theme(theme)
  }

  emitScheme(scheme:any){
    this.emitter.scheme(scheme.detail.value)
  }

  render() {
    return (
      <Host from-stencil>
        <med-header class="config-header">
          <med-navbar slot="navbar" ds-theme="light">
            <span slot="title">Configurações</span>

            <ion-button ds-name="icon-only" slot="left" onClick={() => this.dismiss()}>
              <ion-icon class="med-icon" slot="icon-only" name="med-fechar"></ion-icon>
            </ion-button>
          </med-navbar>
        </med-header>

        <ion-content class="config-content">
        <ion-segment onIonChange={(ev) => this.emitScheme(ev)}>
        <ion-segment-button value="scheme-dark">
          <ion-label>Dark</ion-label>
        </ion-segment-button>
        <ion-segment-button value="scheme-light">
          <ion-label>Light</ion-label>
        </ion-segment-button>
      </ion-segment>
          <ion-list>
            <ion-radio-group>
              <ion-item>
                <ion-label>Padrão</ion-label>
                <ion-radio slot="start" value="theme-default" onClick={()=>this.emitTheme('theme-default')}></ion-radio>
              </ion-item>

              <ion-item>
                <ion-label>Gold</ion-label>
                <ion-radio slot="start" value="theme-gold"  onClick={()=>this.emitTheme('theme-gold')}></ion-radio>
              </ion-item>

              <ion-item>
                <ion-label>Recurso</ion-label>
                <ion-radio slot="start" value="theme-recursos" onClick={()=>this.emitTheme('theme-recursos')}></ion-radio>
              </ion-item>
            </ion-radio-group>
          </ion-list>
        </ion-content>
      </Host>
    );
  }




}
