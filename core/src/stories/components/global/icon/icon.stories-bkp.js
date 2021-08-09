import { html } from 'lit-html';
import {classMap} from 'lit-html/directives/class-map.js';

export default {
  title: 'Components/Core/Icon',
  decorators: [],
};

const TemplateIcon = ({ color, neutral }) => {
  let colorClass;

  if (color) {
    colorClass = color + ' med-icon ion-color md hydrated'
  } else if (neutral) {
    colorClass = neutral + ' med-icon med-neutral md hydrated'
  } else {
    colorClass = 'med-icon md hydrated'
  }

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
            <ion-icon class=${colorClass} name="med-arrow-left-circle"></ion-icon>
            <span class="list__span">med-arrow-left-circle</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-arrow-right-circle"></ion-icon>
            <span class="list__span">med-arrow-right-circle</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-arrow-up"></ion-icon>
            <span class="list__span">med-arrow-up</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-arrow-down"></ion-icon>
            <span class="list__span">med-arrow-down</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-add-circle"></ion-icon>
            <span class="list__span">med-add-circle</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-cartao-resposta"></ion-icon>
            <span class="list__span">med-cartao-resposta</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-check-circle"></ion-icon>
            <span class="list__span">med-check-circle</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-chevron-left"></ion-icon>
            <span class="list__span">med-chevron-left</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-close"></ion-icon>
            <span class="list__span">med-close</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-configuracoes"></ion-icon>
            <span class="list__span">med-configuracoes</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-context-menu"></ion-icon>
            <span class="list__span">med-context-menu</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-comentario-questao"></ion-icon>
            <span class="list__span">med-comentario-questao</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-discursiva"></ion-icon>
            <span class="list__span">med-discursiva</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-dislike"></ion-icon>
            <span class="list__span">med-dislike</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-expand"></ion-icon>
            <span class="list__span">med-expand</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-eye-hide-line"></ion-icon>
            <span class="list__span">med-eye-hide-line</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-eye-show-line"></ion-icon>
            <span class="list__span">med-eye-show-line</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-font-decrease"></ion-icon>
            <span class="list__span">med-font-decrease</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-font-increase"></ion-icon>
            <span class="list__span">med-font-increase</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-font-size"></ion-icon>
            <span class="list__span">med-font-size</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-impresso"></ion-icon>
            <span class="list__span">med-impresso</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-information"></ion-icon>
            <span class="list__span">med-information</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-like"></ion-icon>
            <span class="list__span">med-like</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-minus"></ion-icon>
            <span class="list__span">med-minus</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-notes"></ion-icon>
            <span class="list__span">med-notes</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-offline"></ion-icon>
            <span class="list__span">med-offline</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-plus"></ion-icon>
            <span class="list__span">med-plus</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-questao"></ion-icon>
            <span class="list__span">med-questao</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-retomar"></ion-icon>
            <span class="list__span">med-retomar</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-riscar"></ion-icon>
            <span class="list__span">med-riscar</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-search"></ion-icon>
            <span class="list__span">med-search</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-star-filled"></ion-icon>
            <span class="list__span">med-star-filled</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-star-outline"></ion-icon>
            <span class="list__span">med-star-outline</span>
          </li>
          <li class="list__item">
            <ion-icon class=${colorClass} name="med-filtro"></ion-icon>
            <span class="list__span">med-filtro</span>
          </li>
        </ul>
      </div>
    </ion-app>
  `
}

export const Icon = TemplateIcon.bind({});
Icon.argTypes = {
  color: {
    options: [undefined, 'ion-color-brand', 'ion-color-aulas', 'ion-color-material', 'ion-color-questoes', 'ion-color-revalida',
    'ion-color-provas', 'ion-color-success', 'ion-color-warning', 'ion-color-caution'],
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  },
  neutral: {
    options: [undefined, 'med-neutral-1', 'med-neutral-2', 'med-neutral-3', 'med-neutral-4', 'med-neutral-5',
    'med-neutral-6', 'med-neutral-7', 'med-neutral-8', 'med-neutral-9', 'med-neutral-10'],
    control: { type: 'select'},
    description: "Define a cor neutra do componente.",
    table: {
      type:  { summary: 'Neutrals' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
