import { html } from 'lit-html';
import { MedColor, MedIcons } from '../../../constants';

export default {
  title: 'Components/Core/Icon',
  decorators: [],
};

const TemplateIcon = ({ dsColor }) => {
  let colorClass;

  if (dsColor) {
    const colorIdentifier = dsColor.split('-');

    console.log(dsColor);

    if (colorIdentifier[0] === 'neutral') {
      colorClass = `med-icon med-color-neutral med-color-${dsColor} md hydrated`;
    } else if (colorIdentifier[0] === 'fb') {
      colorClass = `med-icon med-color-feedback med-color-fb-${colorIdentifier[1]} md hydrated`;
    } else {
      colorClass = `med-icon med-color med-color-${dsColor} md hydrated`;
    }
  } else {
    colorClass = 'med-icon med-color med-color-brand md hydrated'
  }

  const itemTemplates = [];
  for (const item of MedIcons) {
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
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .list__span {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: hsl(var(--med-color-neutral-10));
      }

      ion-icon {
        font-size: 28px;
        stroke: hsl(var(--med-color-neutral-10));
      }
    </style>

    <ion-app>
      <ion-content>
        <div>

          <ul class="list">
            ${itemTemplates}
          </ul>

        <div>
      </ion-content>
    </ion-app>
  `
}

export const Icon = TemplateIcon.bind({});
Icon.argTypes = {
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
