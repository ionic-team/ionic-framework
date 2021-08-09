import { html } from 'lit-html';
import { medIcons } from '../../../med-icons';

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

  const itemTemplates = [];
  for (const item of medIcons) {
    itemTemplates.push(html`
      <li class="list__item">
        <ion-icon class="med-icon" class=${colorClass} name=${item}></ion-icon>
        <span class="list__span">${item}</span>
      </li>
    `);
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

          ${itemTemplates}

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
