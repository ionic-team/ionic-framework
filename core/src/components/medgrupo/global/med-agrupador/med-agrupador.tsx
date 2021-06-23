import { Component, Host, Prop, h, State } from '@stencil/core';

@Component({
  tag: 'med-agrupador',
  styleUrl: 'med-agrupador.scss',
  shadow: true,
})
export class MedAgrupador {
  @State() state = false;
  @Prop() textDefault= 'Expandir a lista';
  @Prop() textAlt= 'Ocultar a lista';
  @Prop() icon= 'med-arrow-up';

  private toggle =() =>{
    console.log('teste');
  }

  render() {
    const {textDefault, textAlt, icon} = this;
    return (
      <Host onClick={() => this.toggle()}>

        {textDefault}
        {textAlt}
        {icon}
      </Host>
    );
  }

}
