import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Bottom Navbar',
  decorators: [withDesign],
};

const TemplateDefault = () => {
  return html`
    <ion-app>
      <ion-content></ion-content>

      <!-- component -->
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="questao">
            <ion-icon name="med-questao"></ion-icon>
            <ion-label>Questão</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="gabarito-comentado">
            <ion-icon name="med-comentario-questao"></ion-icon>
            <ion-label>Gabarito Comentado</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="med-cartao-resposta">
            <ion-icon name="med-cartao-resposta"></ion-icon>
            <ion-label>Cartão Resposta</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="questao-sec">
            <ion-icon name="med-questao"></ion-icon>
            <ion-label>Questão</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="gabarito-comentado" disabled>
            <ion-icon name="med-comentario-questao"></ion-icon>
            <ion-label>Gabarito Comentado</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      <!-- component -->

    </ion-app>
    `
}

export const Default = TemplateDefault.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1466%3A13',
  },
}
