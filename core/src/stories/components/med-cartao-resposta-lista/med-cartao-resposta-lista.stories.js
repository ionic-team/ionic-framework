import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Cartão Resposta Lista',
  decorators: [withDesign],
};

const TemplateDefault = () => {

  const generateCartaoResposta = () => {
    let cartaoResposta = [];

    cartaoResposta = [
      { index: '01'},
      { index: '02', active: true },
      { index: '03', color: 'feedback-success' },
      { index: '04', color: 'feedback-error' },
      { index: '05', color: 'feedback-warning', anulada: true },
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

    console.log(cartaoResposta);

    return cartaoResposta;
  };

  const items = generateCartaoResposta();

  const itemTemplates = [];
  for (const item of items) {
    console.log(item.active);
    itemTemplates.push(html`<med-cartao-resposta-item ?active=${item.active} .color=${item.color} ?impressa=${item.impressa} ?anulada=${item.anulada}>${item.index}</med-cartao-resposta-item>`);
  }

  return html`
    <ion-app>
      <ion-content style="--background: var(--med-color-neutral-dark-prime);">

        <!-- component -->
        <med-cartao-resposta-lista>
          ${itemTemplates}
        </med-cartao-resposta-lista>
        <!-- component -->

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
