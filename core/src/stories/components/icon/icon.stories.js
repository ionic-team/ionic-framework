import { html } from 'lit-html';
import { medColors } from '../../med-colors'

export default {
  title: 'Components/Global/Icon',
  decorators: [],
};

const TemplateIcon = ({ color }) => {
  return html`
    <style>
      .list {
        display: flex;
        list-style: none;
        flex-wrap: wrap;
        justify-content: center;
      }
      .list__item {
        margin: 8px;
      }
      .list__span {
        display: block;
        font-size: 14px;
        font-weight: 500;
      }
      ion-icon {
        font-size: 28px;
      }
    </style>

    <ion-app class="storybook-only">
      <div class="storybook-only__container storybook-only__container--icons">

        <ul class="list">
          <li class="list__item">
            <ion-icon .color=${color} name="med-arrow-left-circle"></ion-icon>
            <span class="list__span">med-arrow-left-circle</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-arrow-right-circle"></ion-icon>
            <span class="list__span">med-arrow-right-circle</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-arrow-up"></ion-icon>
            <span class="list__span">med-arrow-up</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-arrow-down"></ion-icon>
            <span class="list__span">med-arrow-down</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-cartao-resposta"></ion-icon>
            <span class="list__span">med-cartao-resposta</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-check-circle"></ion-icon>
            <span class="list__span">med-check-circle</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-chevron-left"></ion-icon>
            <span class="list__span">med-chevron-left</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-close"></ion-icon>
            <span class="list__span">med-close</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-configuracoes"></ion-icon>
            <span class="list__span">med-configuracoes</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-comentario-questao"></ion-icon>
            <span class="list__span">med-comentario-questao</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-discursiva"></ion-icon>
            <span class="list__span">med-discursiva</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-dislike"></ion-icon>
            <span class="list__span">med-dislike</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-expand"></ion-icon>
            <span class="list__span">med-expand</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-eye-hide-line"></ion-icon>
            <span class="list__span">med-eye-hide-line</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-eye-show-line"></ion-icon>
            <span class="list__span">med-eye-show-line</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-font-decrease"></ion-icon>
            <span class="list__span">med-font-decrease</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-font-increase"></ion-icon>
            <span class="list__span">med-font-increase</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-font-size"></ion-icon>
            <span class="list__span">med-font-size</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-impresso"></ion-icon>
            <span class="list__span">med-impresso</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-information"></ion-icon>
            <span class="list__span">med-information</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-like"></ion-icon>
            <span class="list__span">med-like</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-minus"></ion-icon>
            <span class="list__span">med-minus</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-notes"></ion-icon>
            <span class="list__span">med-notes</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-plus"></ion-icon>
            <span class="list__span">med-plus</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-questao"></ion-icon>
            <span class="list__span">med-questao</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-retomar"></ion-icon>
            <span class="list__span">med-retomar</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-riscar"></ion-icon>
            <span class="list__span">med-riscar</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-search"></ion-icon>
            <span class="list__span">med-search</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-star-filled"></ion-icon>
            <span class="list__span">med-star-filled</span>
          </li>
          <li class="list__item">
            <ion-icon .color=${color} name="med-star-outline"></ion-icon>
            <span class="list__span">med-star-outline</span>
          </li>
        </ul>
      </div>
    </ion-app>
  `
}

export const Icon = TemplateIcon.bind({});
Icon.argTypes = {
  color: {
    options: medColors,
    control: { type: 'select'},
    description: "Define a cor do badge baseado nos tokens.",
    table: {
      type:  { summary: 'Qualquer cor do Design System' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
