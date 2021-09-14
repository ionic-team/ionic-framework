import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Questões/Cartão Resposta Lista',
  decorators: [withDesign],
};

const TemplateDefault = () => {

  const generateCartaoResposta = () => {
    let cartaoResposta = [];

    cartaoResposta = [
      { index: '01'},
      { index: '02', ativa: true },
      { index: '03', color: 'fb-success' },
      { index: '04', color: 'fb-caution' },
      { index: '05', color: 'fb-warning', anulada: true },
      { index: '06', impressa: true },
    ];

    for (let index = 6; index < 100; index++) {
      if(index < 10) {
        cartaoResposta.push({
          index: '0' + index
        })
      } else {
        cartaoResposta.push({
          index: index
        })
      }
    }
    return cartaoResposta;
  };

  const items = generateCartaoResposta();

  const itemTemplates = [];
  for (const item of items) {
    itemTemplates.push(html`<med-cartao-resposta-item ?ativa=${item.ativa} .dsColor=${item.color} ?impressa=${item.impressa} ?anulada=${item.anulada}>${item.index}</med-cartao-resposta-item>`);
  }

  return html`
    <ion-app>
      <ion-content>
        <div class="flex-center">

          <!-- component -->
          <med-cartao-resposta-lista>
            ${itemTemplates}
          </med-cartao-resposta-lista>
          <!-- component -->

        </div>
      </ion-content>
    </ion-app>
    `
}

export const CartaoRespostaLista = TemplateDefault.bind({});
CartaoRespostaLista.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=802%3A477',
  },
}
