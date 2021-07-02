import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medIcons } from '../../med-icons';
import { medsoftColors } from '../../med-colors';

export default {
  title: 'Components/Global/Chip',
  decorators: [withDesign],
};

const TemplateDual = ({ slot, iconName, color, outline }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-chip .outline=${outline} .color=${color}>
          <ion-icon name=${iconName}></ion-icon>
          <ion-label>${slot}</ion-label>
          <ion-icon name=${iconName}></ion-icon>
        </ion-chip>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const ChipDualIcon = TemplateDual.bind({});
ChipDualIcon.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1981%3A4566',
  },
}
ChipDualIcon.argTypes = {
  outline: {
    disabled: false,
    control: { type: 'boolean' },
    description: 'Define o estilo transparente com borda.',
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'undefined' },
    },
  },
  color: {
    options: medsoftColors,
    control: { type: 'select'},
    description: "Define a cor do botão.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  },
  iconName: {
    options: medIcons,
    control: { type: 'select'},
    defaultValue: 'med-arrow-left-circle',
    description: '**Atributo utilizado apenas no storybook para visualização.**',
    table: {
      type:  { summary: ['string'] },
      defaultValue: { summary: 'med-arrow-left-circle' },
    },
  },
  slot: {
    control: { type: 'text' },
    defaultValue: 'chip',
    description: '**Atributo utilizado apenas no storybook para visualização.**',
    table: {
      type:  { summary: ['string'] },
      defaultValue: { summary: 'button' },
    },
  },
};
