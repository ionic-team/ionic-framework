import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Bottom Navbar',
  decorators: [withDesign],
};

const TemplateDefault = ({dsColor}) => {
  return html`
    <ion-app>

      <ion-tabs>
        <ion-tab tab="questao"></ion-tab>
        <ion-tab tab="gabarito-comentado"></ion-tab>
        <ion-tab tab="med-cartao-resposta"></ion-tab>
        <ion-tab tab="questao-sec"></ion-tab>
        <ion-tab tab="gabarito-comentado"></ion-tab>

        <!-- component -->
          <ion-tab-bar .dsColor=${dsColor} slot="bottom">
            <ion-tab-button tab="questao">
              <ion-icon class="med-icon" name="med-questao"></ion-icon>
              <ion-label>Questão</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="gabarito-comentado">
              <ion-icon class="med-icon" name="med-gabarito"></ion-icon>
              <ion-label>Gabarito Comentado</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="med-cartao-resposta">
              <ion-icon class="med-icon" name="med-cartao"></ion-icon>
              <ion-label>Cartão Resposta</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="questao-sec">
              <ion-icon class="med-icon" name="med-duvidas"></ion-icon>
              <ion-label>Dúvidas</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="gabarito-comentado" disabled>
              <ion-icon class="med-icon" name="med-recursos"></ion-icon>
              <ion-label>Recursos</ion-label>
            </ion-tab-button>
          </ion-tab-bar>
        <!-- component -->
      </ion-tabs>

    </ion-app>
    `
}

export const TabBar = TemplateDefault.bind({});
TabBar.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1466%3A13',
  },
}
TabBar.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
